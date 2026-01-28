import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function serializeJSONForScript(data: unknown): string {
  return JSON.stringify(data).replace(
    /[<>\u2028\u2029]/g,
    (char) =>
      ({
        "<": "\\u003c",
        ">": "\\u003e",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029",
      }[char] || char)
  );
}
