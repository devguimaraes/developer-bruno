import type { VercelRequest, VercelResponse } from "@vercel/node";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "";
const ALLOWED_USER = process.env.ALLOWED_GITHUB_USER ?? "";
const CSRF_STATE_PREFIX = "oauth_state:";
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI ?? "https://devguimaraes.com.br/api/auth/callback";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const code = req.query?.code as string | undefined;
  const state = req.query?.state as string | undefined;
  const provider = req.query?.provider as string | undefined;

  // Route 1: Start OAuth flow — redirect to GitHub
  if (!code && provider) {
    if (provider !== "github") {
      res.status(400).send("Unsupported provider");
      return;
    }

    const oauthState = crypto.randomUUID();
    res.setHeader("Set-Cookie", `${CSRF_STATE_PREFIX}${oauthState}=1; Path=/; Domain=devguimaraes.com.br; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "repo,user:email",
      state: oauthState,
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params}`);
    return;
  }

  // Route 2: Handle callback — exchange code for token
  if (code) {
    // Validate CSRF state
    const cookieHeader = req.headers.cookie ?? "";
    if (!state || !cookieHeader.includes(`${CSRF_STATE_PREFIX}${state}=`)) {
      res.status(403).send("Invalid state parameter");
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
        redirect_uri: REDIRECT_URI,
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

    // Return HTML that sends token back to parent via postMessage and closes popup
    const tokenPayload = JSON.stringify({
      token_type: tokenData.token_type,
      access_token: tokenData.access_token,
      scope: tokenData.scope,
    });
    res.status(200).setHeader("Content-Type", "text/html; charset=utf-8").send(`<!DOCTYPE html>
<html><body><script>
  window.opener.postMessage(
    JSON.stringify({ type: "authorization", authorization: ${tokenPayload} }),
    "*"
  );
  window.close();
</script></body></html>`);
    return;
  }

  res.status(404).send("Not found");
}
