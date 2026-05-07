# Cross-Host OAuth State Cookie Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Re-add dynamic `Domain` attribute to OAuth state cookie so login works across apex and www hosts.

**Architecture:** The `getStateCookie` function in `api/auth.ts` currently sets a host-only cookie (no `Domain` attribute). We'll modify it to accept the `Host` header and derive the root domain dynamically, then update tests accordingly.

**Tech Stack:** TypeScript, Vitest, Vercel Serverless Functions

---

### Task 1: Update tests — remove "no Domain" assertion, add Domain assertions

**Files:**
- Modify: `api/auth.test.ts`

- [ ] **Step 1: Update the existing redirect test to expect `Domain` attribute**

  Change lines 87-90 in `api/auth.test.ts` — instead of asserting `Domain` is absent, assert it is present with the correct value extracted from the host.

  ```typescript
  // Replace:
  expect(res.setHeader).toHaveBeenCalledWith(
    "Set-Cookie",
    expect.not.stringContaining("Domain=devguimaraes.com.br"),
  );

  // With:
  expect(res.setHeader).toHaveBeenCalledWith(
    "Set-Cookie",
    expect.stringContaining("Domain=.devguimaraes.com.br"),
  );
  ```

- [ ] **Step 2: Add test for `www` subdomain → root domain cookie**

  ```typescript
  it("sets Domain for www subdomain host", async () => {
    const req = mockReq({
      query: { provider: "github" },
      headers: { host: "www.devguimaraes.com.br", origin: "https://www.devguimaraes.com.br" },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringContaining("Domain=.devguimaraes.com.br"),
    );
  });
  ```

- [ ] **Step 3: Add test for staging subdomain → root domain cookie**

  ```typescript
  it("sets Domain for staging subdomain host", async () => {
    const req = mockReq({
      query: { provider: "github" },
      headers: { host: "staging.devguimaraes.com.br", origin: "https://staging.devguimaraes.com.br" },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringContaining("Domain=.devguimaraes.com.br"),
    );
  });
  ```

- [ ] **Step 4: Add test for bare domain apex**

  ```typescript
  it("sets Domain for apex host", async () => {
    const req = mockReq({
      query: { provider: "github" },
      headers: { host: "devguimaraes.com.br", origin: "https://devguimaraes.com.br" },
    });
    const res = mockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Set-Cookie",
      expect.stringContaining("Domain=.devguimaraes.com.br"),
    );
  });
  ```

### Task 2: Run tests — verify they fail

**Files:** `api/auth.ts`, `api/auth.test.ts`

- [ ] **Step 1: Run the tests**

  ```bash
  npx vitest run api/auth.test.ts 2>&1 | tail -30
  ```

  Expected: Tests fail because `getStateCookie` doesn't accept a `host` parameter and doesn't include `Domain` attribute.

### Task 3: Implement `getDomain` helper and update `getStateCookie`

**Files:**
- Modify: `api/auth.ts`

- [ ] **Step 1: Add `getDomain` helper function**

  ```typescript
  function getDomain(host: string): string {
    const parts = host.split(".");
    if (parts.length >= 3) {
      return `.${parts.slice(-2).join(".")}`;
    }
    return `.${host}`;
  }
  ```

- [ ] **Step 2: Update `getStateCookie` to accept host and include `Domain`**

  ```typescript
  function getStateCookie(oauthState: string, host: string): string {
    const cookieParts = [
      `${CSRF_STATE_PREFIX}${oauthState}=1`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      "Max-Age=600",
      `Domain=${getDomain(host)}`,
    ];
    return cookieParts.join("; ");
  }
  ```

- [ ] **Step 3: Update the call site on line 46**

  Change:
  ```typescript
  res.setHeader("Set-Cookie", getStateCookie(oauthState));
  ```
  To:
  ```typescript
  res.setHeader("Set-Cookie", getStateCookie(oauthState, req.headers.host ?? ""));
  ```

### Task 4: Run tests — verify they pass

- [ ] **Step 1: Run the tests**

  ```bash
  npx vitest run api/auth.test.ts 2>&1 | tail -30
  ```

  Expected: All tests pass.

- [ ] **Step 2: Run full lint + build**

  ```bash
  bun run lint && bun run build
  ```

  Expected: Both pass cleanly.

### Task 5: Commit

- [ ] **Step 1: Commit changes**

  ```bash
  git add api/auth.ts api/auth.test.ts
  git commit -m "fix: add dynamic Domain attribute to OAuth state cookie

  The previous commit scoped the OAuth state cookie to the current host by
  removing the Domain attribute, but this broke OAuth when login starts on
  apex (devguimaraes.com.br) and callback is on www (www.devguimaraes.com.br).

  This adds a getDomain() helper that extracts the root domain from the Host
  header and sets Domain accordingly, supporting apex, www, and staging hosts."
  ```
