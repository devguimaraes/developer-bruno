## 2025-05-20 - Information Leakage in Edge Functions
**Vulnerability:** Supabase Edge Functions were catching exceptions and returning `error.message` directly to the client in the HTTP response.
**Learning:** This pattern was consistent across all Deno functions (`download`, `create-pix-payment`, etc.), suggesting a copy-paste implementation without security review. It exposes internal logic, stack traces, or database schema details to potential attackers.
**Prevention:** Always catch errors at the top level of the handler, log the full error details to the server console (for debugging), and return a generic "Internal Server Error" message with a 500 status code to the client.

## 2025-05-21 - CSS Injection in Chart Component
**Vulnerability:** The chart component injected configuration values directly into a `dangerouslySetInnerHTML` style block. This could allow CSS injection if the configuration data was controlled by a malicious actor.
**Learning:** Even internal configuration objects passed as props should be treated with suspicion when rendered into raw HTML or CSS. Attack surfaces can evolve if "trusted" data sources become user-controlled in the future.
**Prevention:** Sanitize all values interpolated into style blocks. For simple values like colors, stripping control characters like `;`, `{`, and `}` is an effective defense.

## 2025-05-22 - XSS in Chart and Structured Data
**Vulnerability:** `dangerouslySetInnerHTML` was used with unsanitized user/config input in `ChartStyle` (CSS injection) and `StructuredData` (Script tag injection).
**Learning:** Helper functions for specific sanitization contexts (CSS values vs Script JSON) are critical to prevent injection when `dangerouslySetInnerHTML` is unavoidable.
**Prevention:** Use `sanitizeCSSValue` for style props and `serializeJSONForScript` for JSON-LD script tags.
