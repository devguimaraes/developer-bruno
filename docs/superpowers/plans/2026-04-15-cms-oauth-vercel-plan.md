# CMS OAuth via Vercel Serverless — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace broken Netlify auth proxy with a custom Vercel serverless function that handles GitHub OAuth directly, restricting CMS access to the allowed GitHub user only.

**Architecture:** A single Vercel serverless function at `api/auth.ts` handles two routes: `/api/auth` (redirects to GitHub OAuth) and `/api/auth/callback` (exchanges code for token, verifies username, returns token). The Decap CMS config is updated to point to this local endpoint instead of Netlify's proxy.

**Tech Stack:** Vercel Serverless Functions (Node.js), GitHub OAuth, TypeScript, Vitest

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `api/auth.ts` | Create | Serverless function: OAuth redirect + callback with username verification |
| `api/auth.test.ts` | Create | Unit tests for the serverless function |
| `public/admin/config.yml` | Modify | Point auth_endpoint to `/api/auth`, remove `app_id` |
| `vercel.json` | Modify | Add `https://github.com` to CSP `connect-src` |

---

### Task 1: Create the serverless function `api/auth.ts`

**Files:**
- Create: `api/auth.ts`

- [ ] **Step 1: Create the serverless function**

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "";
const ALLOWED_USER = process.env.ALLOWED_GITHUB_USER ?? "";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const url = new URL(req.url ?? "", `https://${req.headers.host}`);
  const origin = req.headers.origin ?? "https://devguimaraes.com.br";
  const redirectUri = `${origin}/api/auth/callback`;

  // Route 1: Start OAuth flow — redirect to GitHub
  if (url.pathname === "/api/auth" || url.pathname === "/api/auth/") {
    const provider = url.searchParams.get("provider");
    if (provider !== "github") {
      res.status(400).send("Unsupported provider");
      return;
    }

    const state = crypto.randomUUID();
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      scope: "repo,user:email",
      state,
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
    return;
  }

  // Route 2: Handle callback — exchange code for token
  if (url.pathname === "/api/auth/callback") {
    const code = url.searchParams.get("code");
    if (!code) {
      res.status(400).send("Missing authorization code");
      return;
    }

    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      token_type?: string;
      scope?: string;
      error?: string;
      error_description?: string;
    };

    if (tokenData.error || !tokenData.access_token) {
      res.status(400).send(tokenData.error_description ?? "Token exchange failed");
      return;
    }

    // Verify the authenticated user is allowed
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    const userData = (await userRes.json()) as { login?: string };
    if (!userData.login || userData.login !== ALLOWED_USER) {
      res.status(403).send("Access denied");
      return;
    }

    // Return token in the format Decap CMS expects
    res.status(200).json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
    });
    return;
  }

  res.status(404).send("Not found");
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit --skipLibCheck api/auth.ts`
Expected: No errors (may show warnings about `@vercel/node` types — that's OK since it's available at runtime on Vercel)

- [ ] **Step 3: Commit**

```bash
git add api/auth.ts
git commit -m "feat(cms): add Vercel serverless OAuth function for Decap CMS auth"
```

---

### Task 2: Write unit tests for `api/auth.ts`

**Files:**
- Create: `api/auth.test.ts`

- [ ] **Step 1: Create the test file**

The function uses `fetch` and `crypto.randomUUID` which need mocking. We test the four cases: valid OAuth start, invalid provider, successful callback with allowed user, and callback with denied user.

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock env vars before importing the handler
vi.stubEnv("GITHUB_CLIENT_ID", "test-client-id");
vi.stubEnv("GITHUB_CLIENT_SECRET", "test-client-secret");
vi.stubEnv("ALLOWED_GITHUB_USER", "devguimaraes");

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock crypto.randomUUID
vi.stubGlobal("crypto", {
  ...crypto,
  randomUUID: () => "test-state-uuid",
});

import handler from "../api/auth";

function mockRes() {
  const res: Record<string, unknown> = {
    statusCode: 200,
    body: "",
    headers: {} as Record<string, string>,
  };
  return {
    ...res,
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
    setHeader: vi.fn(),
    getHeader: vi.fn(),
  } as unknown as Parameters<typeof handler>[1];
}

function mockReq(overrides: Partial<Parameters<typeof handler>[0]> = {}) {
  return {
    url: "/api/auth",
    method: "GET",
    headers: { host: "devguimaraes.com.br", origin: "https://devguimaraes.com.br" },
    query: {},
    body: {},
    ...overrides,
  } as Parameters<typeof handler>[0];
}

describe("api/auth handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to GitHub OAuth when provider=github", async () => {
    const req = mockReq({ url: "/api/auth?provider=github" });
    const res = mockRes();

    await handler(req, res);

    expect(res.redirect).toHaveBeenCalledOnce();
    const redirectUrl = (res.redirect as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(redirectUrl).toContain("https://github.com/login/oauth/authorize");
    expect(redirectUrl).toContain("client_id=test-client-id");
    expect(redirectUrl).toContain("state=test-state-uuid");
    expect(redirectUrl).toContain("scope=repo%2Cuser%3Aemail");
  });

  it("returns 400 for unsupported provider", async () => {
    const req = mockReq({ url: "/api/auth?provider=google" });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Unsupported provider");
  });

  it("returns 400 when code is missing on callback", async () => {
    const req = mockReq({ url: "/api/auth/callback" });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Missing authorization code");
  });

  it("returns 403 when authenticated user is not allowed", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ access_token: "tok123", token_type: "bearer", scope: "repo" }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ login: "other-user" }),
      });

    const req = mockReq({ url: "/api/auth/callback?code=abc123" });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Access denied");
  });

  it("returns token when authenticated user is allowed", async () => {
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

    const req = mockReq({ url: "/api/auth/callback?code=valid-code" });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      access_token: "tok456",
      token_type: "bearer",
      scope: "repo,user:email",
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify they pass**

Run: `npx vitest run api/auth.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 3: Commit**

```bash
git add api/auth.test.ts
git commit -m "test(cms): add unit tests for OAuth serverless function"
```

---

### Task 3: Update Decap CMS config to use local auth endpoint

**Files:**
- Modify: `public/admin/config.yml`

- [ ] **Step 1: Update config.yml**

Replace the current content of `public/admin/config.yml` with:

```yaml
backend:
  name: github
  repo: devguimaraes/developer-bruno
  branch: main
  auth_endpoint: /api/auth

media_folder: public/uploads
public_folder: /uploads

locale: pt-BR

collections:
  - name: blog
    label: Blog
    folder: src/content/blog
    create: true
    slug: "{{slug}}"
    preview_path: blog/{{slug}}
    fields:
      - { label: Título, name: title, widget: string }
      - { label: Data, name: date, widget: datetime, format: "YYYY-MM-DD" }
      - { label: Tags, name: tags, widget: list, allow_add: true }
      - { label: Resumo, name: excerpt, widget: text }
      - { label: Destacado, name: featured, widget: boolean, default: false }
      - { label: Imagem, name: image, widget: image, required: false }
      - { label: Autor, name: author, widget: string, default: "Bruno Guimarães" }
      - { label: Conteúdo, name: body, widget: markdown }
```

Key changes:
- Removed `auth_endpoint: https://api.netlify.com/auth/github` → replaced with `/api/auth`
- Removed `app_id: Ov23li1qdPhwOLKOleXS` (not needed with custom endpoint)

- [ ] **Step 2: Commit**

```bash
git add public/admin/config.yml
git commit -m "fix(cms): point auth_endpoint to local Vercel serverless function"
```

---

### Task 4: Update CSP in `vercel.json` to allow GitHub OAuth

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add `https://github.com` to CSP `connect-src`**

In the `Content-Security-Policy` header value in `vercel.json`, add `https://github.com` to the `connect-src` directive.

Current `connect-src`:
```
connect-src 'self' https://plausible.io https://*.supabase.co https://api.github.com https://unpkg.com;
```

Updated `connect-src`:
```
connect-src 'self' https://plausible.io https://*.supabase.co https://api.github.com https://github.com https://unpkg.com;
```

- [ ] **Step 2: Validate JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('valid')"`
Expected: `valid`

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "fix(cms): add github.com to CSP connect-src for OAuth flow"
```

---

### Task 5: Verify build and test suite

- [ ] **Step 1: Run unit tests**

Run: `npm run test:unit`
Expected: All tests pass (existing + new `api/auth.test.ts`)

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No new errors

---

## Post-Implementation: Manual Configuration Required

The following steps must be done manually by the user **before** the auth will work in production:

### 1. GitHub OAuth App Settings

Go to https://github.com/settings/developers → OAuth Apps → app `Ov23li1qdPhwOLKOleXS`:

- Set **Authorization callback URL** to: `https://devguimaraes.com.br/api/auth/callback`
- Note the **Client ID** (starts with `Ov23li...`)
- Generate a new **Client Secret** and copy it

### 2. Vercel Environment Variables

Go to Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|-------------|
| `GITHUB_CLIENT_ID` | Client ID from step 1 | Production, Preview, Development |
| `GITHUB_CLIENT_SECRET` | Client Secret from step 1 | Production, Preview, Development |
| `ALLOWED_GITHUB_USER` | `devguimaraes` | Production, Preview, Development |

### 3. Deploy & Test

1. Push the branch and create a PR (or merge to main)
2. Wait for Vercel deployment to complete
3. Visit `https://devguimaraes.com.br/admin`
4. Click "Login with GitHub"
5. Authorize on GitHub (username must be `devguimaraes`)
6. Verify CMS loads with blog collection
