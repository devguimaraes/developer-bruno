import type { VercelRequest, VercelResponse } from "@vercel/node";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "";
const ALLOWED_USER = process.env.ALLOWED_GITHUB_USER ?? "";
const CSRF_STATE_PREFIX = "oauth_state:";

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
    res.setHeader("Set-Cookie", `${CSRF_STATE_PREFIX}${state}=1; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
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
    // Validate CSRF state
    const state = url.searchParams.get("state");
    const cookieHeader = req.headers.cookie ?? "";
    if (!state || !cookieHeader.includes(`${CSRF_STATE_PREFIX}${state}=`)) {
      res.status(403).send("Invalid state parameter");
      return;
    }

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
