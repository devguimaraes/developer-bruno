## 2025-05-20 - Information Leakage in Edge Functions
**Vulnerability:** Supabase Edge Functions were catching exceptions and returning `error.message` directly to the client in the HTTP response.
**Learning:** This pattern was consistent across all Deno functions (`download`, `create-pix-payment`, etc.), suggesting a copy-paste implementation without security review. It exposes internal logic, stack traces, or database schema details to potential attackers.
**Prevention:** Always catch errors at the top level of the handler, log the full error details to the server console (for debugging), and return a generic "Internal Server Error" message with a 500 status code to the client.

## 2025-05-21 - CSS Injection in Chart Component
**Vulnerability:** The chart component injected configuration values directly into a `dangerouslySetInnerHTML` style block. This could allow CSS injection if the configuration data was controlled by a malicious actor.
**Learning:** Even internal configuration objects passed as props should be treated with suspicion when rendered into raw HTML or CSS. Attack surfaces can evolve if "trusted" data sources become user-controlled in the future.
**Prevention:** Sanitize all values interpolated into style blocks. For simple values like colors, stripping control characters like `;`, `{`, and `}` is an effective defense.

## 2025-05-22 - XSS Risk in Structured Data Script Tags
**Vulnerability:** `StructuredData` component injected JSON directly into `<script>` tags using `JSON.stringify`. While the data source is currently static, future changes could introduce user-controlled data, allowing XSS via script tag termination (`</script>`).
**Learning:** React's `dangerouslySetInnerHTML` combined with `JSON.stringify` inside `<script>` tags is a common pitfall. Standard `JSON.stringify` does not escape `<` characters.
**Prevention:** Use a helper function `serializeJSONForScript` that escapes `<` to `\u003c`, preventing the browser from interpreting `</script>` as a tag closer.
