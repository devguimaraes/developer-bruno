import type { APIRoute } from "astro";
import { createResendMailSender, handleContactSubmission } from "@/lib/contact-server";

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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false }, 400);
  }

  try {
    const result = await handleContactSubmission({
      body,
      ip: clientAddress,
      send: createResendMailSender(process.env.RESEND_API_KEY),
    });
    return jsonResponse(result.body, result.status);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(
      "Failed to send contact email:",
      message.replace(/re_[A-Za-z0-9_-]+/g, "[redacted]")
    );
    return jsonResponse({ ok: false }, 500);
  }
};
