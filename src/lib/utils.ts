import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes a CSS value to prevent injection attacks.
 * Strips characters that could allow breaking out of the style attribute or block.
 * Specifically removes: ; { } < >
 */
export function sanitizeCSSValue(value: string | undefined | null): string {
  if (!value) return "";
  return String(value).replace(/[;{}<>]/g, "");
}

/**
 * Serializes a JSON object for safe use inside a <script> tag.
 * Escapes < characters to \u003c to prevent script tag injection (XSS).
 */
export function serializeJSONForScript(data: unknown): string {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}
