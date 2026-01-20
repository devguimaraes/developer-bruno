import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Serializes a JSON object for safe embedding in a <script> tag.
 * Escapes the '<' character to prevent XSS via script tag termination.
 * @param data The data to serialize
 * @returns The serialized JSON string with escaped '<'
 */
export function serializeJSONForScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Sanitizes a string for use in CSS values to prevent CSS injection.
 * Removes characters that could allow breaking out of the value context
 * or starting a new rule/property.
 * @param value The value to sanitize
 * @returns The sanitized value
 */
export function sanitizeCSSValue(value: string): string {
  if (!value) return "";
  return value.replace(/[;{}<>]/g, "");
}
