import type { VercelRequest, VercelResponse } from '@vercel/node';

const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<VercelResponse> {
  const url = new URL(req.url);
  const origin = req.headers.get('origin') || 'https://devguimaraes.com.br';
  const redirectUri = `${origin}/api/auth/callback`;

  // Step 1: Start OAuth flow — redirect to GitHub
  if (url.pathname === '/' && url.searchParams.get('provider') === 'github') {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      scope: 'repo user:email',
      state: crypto.randomUUID(),
    });
    return res.redirect(
      `https://github.com/login/oauth/authorize?${params}`,
    );
  }

  // Step 2: Handle callback — exchange code for token
  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    const tokenRes = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      },
    );

    const data = await tokenRes.json();
    if (data.error) {
      return res.status(400).send(data.error_description);
    }

    // Return token for Decap CMS to read
    return res.status(200).json({
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
    });
  }

  return res.status(404).send('Not found');
}

export const config = {
  runtime: 'nodejs',
};
