## 2025-05-20 - Information Leakage in Edge Functions
**Vulnerability:** Supabase Edge Functions were catching exceptions and returning `error.message` directly to the client in the HTTP response.
**Learning:** This pattern was consistent across all Deno functions (`download`, `create-pix-payment`, etc.), suggesting a copy-paste implementation without security review. It exposes internal logic, stack traces, or database schema details to potential attackers.
**Prevention:** Always catch errors at the top level of the handler, log the full error details to the server console (for debugging), and return a generic "Internal Server Error" message with a 500 status code to the client.
