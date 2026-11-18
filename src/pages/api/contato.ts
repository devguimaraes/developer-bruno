import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import {
  CONTACT_MAX_BODY_BYTES,
  createResendMailSender,
  handleContactSubmission,
  isSameOriginRequest,
  readLimitedText,
} from "@/lib/contact-server";

/** Função sob demanda na Vercel. O resto do site continua pré-gerado. */
export const prerender = false;

function jsonResponse(body: { ok: boolean }, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!isSameOriginRequest(request.headers.get("origin"), request.url)) {
    return jsonResponse({ ok: false }, 403);
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return jsonResponse({ ok: false }, 415);
  }

  const text = await readLimitedText(request, CONTACT_MAX_BODY_BYTES);
  if (text === null) {
    return jsonResponse({ ok: false }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return jsonResponse({ ok: false }, 400);
  }

  const result = await handleContactSubmission({
    body,
    ip: clientAddress,
    // getSecret lê a chave em tempo de execução (process.env na Vercel, .env no dev). Desde o
    // Astro 6, import.meta.env é embutido no bundle no build, e a chave iria junto.
    send: createResendMailSender(getSecret("RESEND_API_KEY")),
  });
  return jsonResponse(result.body, result.status);
};
