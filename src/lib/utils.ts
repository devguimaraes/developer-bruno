import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Serializes a value to JSON and escapes < characters to prevent XSS
 * when embedding JSON in <script> tags.
 */
export function serializeJSONForScript(value: unknown): string {
  const json = JSON.stringify(value);
  if (typeof json !== 'string') {
    return 'null';
  }
  return json.replace(/</g, "\\u003c");
}
