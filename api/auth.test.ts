import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.stubGlobal("crypto", {
  randomUUID: () => "test-state-uuid",
});

function mockRes() {
  const state: Record<string, unknown> = {
    statusCode: 200,
    body: "",
    headers: {} as Record<string, string>,
  };
  return {
    ...state,
    status: vi.fn(function (this: Record<string, unknown>, code: number) {
      this.statusCode = code;
      return this;
    }),
    send: vi.fn(function (this: Record<string, unknown>, body: string) {
      this.body = body;
      return this;
    }),
    json: vi.fn(function (this: Record<string, unknown>, data: unknown) {
      this.body = JSON.stringify(data);
      return this;
    }),
    redirect: vi.fn(function (this: Record<string, unknown>, url: string) {
      this.statusCode = 302;
      this.headers = { Location: url };
      return this;
    }),
    setHeader: vi.fn(function (this: Record<string, unknown>) {
      return this;
    }),
  };
}

function mockReq(overrides: Record<string, unknown> = {}) {
  return {
    url: "/api/auth",
    method: "GET",
    headers: { host: "devguimaraes.com.br", origin: "https://devguimaraes.com.br" },
    query: {},
    body: {},
    ...overrides,
  };
}

async function importHandler() {
  vi.stubEnv("GITHUB_CLIENT_ID", "test-client-id");
  vi.stubEnv("GITHUB_CLIENT_SECRET", "test-client-secret");
  vi.stubEnv("ALLOWED_GITHUB_USER", "devguimaraes");
  const mod = await import("./auth");
  return mod.default;
}

describe("api/auth handler", () => {
  let handler: (req: unknown, res: unknown) => Promise<void>;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    handler = await importHandler();
  });

  it("redirects to GitHub OAuth when provider=github", async () => {
    const req = mockReq({ query: { provider: "github" } });
    const res = mockRes();

    await handler(req, res);

    expect(res.redirect).toHaveBeenCalledOnce();
    const redirectUrl = (res.redirect as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(redirectUrl).toContain("https://github.com/login/oauth/authorize");
    expect(redirectUrl).toContain("client_id=test-client-id");
    expect(redirectUrl).toContain("state=test-state-uuid");
    expect(redirectUrl).toContain("scope=repo%2Cuser%3Aemail");
    expect(res.setHeader).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringContaining("oauth_state:test-state-uuid="),
    );
  });

  it("returns 400 for unsupported provider", async () => {
    const req = mockReq({ query: { provider: "google" } });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Unsupported provider");
  });

  it("returns 403 when CSRF state is missing in callback", async () => {
    const req = mockReq({ query: { code: "abc", state: "some-state" } });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Invalid state parameter");
  });

  it("returns 403 when CSRF state cookie is absent", async () => {
    const req = mockReq({ query: { code: "abc", state: "test-state-uuid" } });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Invalid state parameter");
  });

  it("returns 403 when authenticated user is not allowed", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ access_token: "tok123", token_type: "bearer", scope: "repo" }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ login: "other-user" }),
      });

    const req = mockReq({
      query: { code: "abc123", state: "test-state-uuid" },
      headers: {
        host: "devguimaraes.com.br",
        origin: "https://devguimaraes.com.br",
        cookie: "oauth_state:test-state-uuid=1",
      },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Access denied");
  });

  it("returns HTML with postMessage when authenticated user is allowed", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            access_token: "tok456",
            token_type: "bearer",
            scope: "repo,user:email",
          }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ login: "devguimaraes" }),
      });

    const req = mockReq({
      query: { code: "valid-code", state: "test-state-uuid" },
      headers: {
        host: "devguimaraes.com.br",
        origin: "https://devguimaraes.com.br",
        cookie: "oauth_state:test-state-uuid=1",
      },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/html; charset=utf-8");
    const html = (res.send as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(html).toContain('"access_token":"tok456"');
    expect(html).toContain("window.opener.postMessage");
    expect(html).toContain("window.close");
  });

  it("returns 404 for unknown routes", async () => {
    const req = mockReq({ query: {} });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Not found");
  });
});
