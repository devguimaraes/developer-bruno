import type { APIRoute } from "astro";
import {
  CONTACT_MAX_BODY_BYTES,
  createResendMailSender,
  handleContactSubmission,
  isSameOriginRequest,
  resolveResendApiKey,
} from "@/lib/contact-server";

/** Função sob demanda na Vercel. O resto do site continua pré-gerado. */
export const prerender = false;

declare const process: {
  env: {
    RESEND_API_KEY?: string;
  };
};

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

  const text = await request.text();
  if (new TextEncoder().encode(text).length > CONTACT_MAX_BODY_BYTES) {
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
    send: createResendMailSender(
      // No `astro dev` o .env entra em import.meta.env. Na Vercel a chave chega em process.env.
      resolveResendApiKey(process.env.RESEND_API_KEY, import.meta.env.RESEND_API_KEY)
    ),
  });
  return jsonResponse(result.body, result.status);
};
