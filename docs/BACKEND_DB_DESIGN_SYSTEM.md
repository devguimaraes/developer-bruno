# 🗄️ **Developer Bruno – Backend & Database Guidelines**

> **Stack:** Supabase (PostgreSQL) + Deno (Edge Functions)
> **Princípio:** "Thin Database, Smart Functions"

## 💾 **1. DATABASE SCHEMA (Supabase)**

O banco de dados é a fonte da verdade para **transações e pedidos**.
Não armazenamos sessão de usuário (stateless auth) nem logs de visualização (analytics externo).

### **1.1 Tabela: `payments`**
Registra tentativas de compra e status final.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | Primary Key (auto-gerada) |
| `external_reference` | UUID | Idempotency Key (gerado pelo backend) |
| `mercadopago_payment_id` | String | ID retornado pelo Gateway (atualizado via webhook) |
| `email` | String | Email do comprador (Sanitized) |
| `amount` | Numeric | Valor da transação |
| `status` | Enum | `pending`, `approved`, `rejected` |
| `created_at` | Timestamptz | Data da criação |

**Índices Recomendados:**
- `external_reference` (Busca rápida em Webhooks).
- `email` (Suporte ao cliente).

***

## ⚡ **2. EDGE FUNCTIONS (Backend)**

Localização: `supabase/functions/`
Padrão: Arquitetura hexagonal simplificada (Input → Domain → Output).

### **2.1 Padrão de Função (`index.ts`)**
Todas as funções devem seguir este esqueleto para consistência e tratamento de erros:

```typescript
// 1. Setup & CORS
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 2. Security Gate (Rate Limit)
    const clientIP = getClientIP(req)
    checkRateLimit(clientIP)

    // 3. Validation
    const payload = await req.json()
    if (!payload.email) throw new Error('Invalid Input')

    // 4. Domain Logic (Database + External API)
    const result = await processBusinessLogic(payload)

    // 5. Success Response
    return new Response(JSON.stringify(result), { status: 200 })

  } catch (error) {
    // 6. Error Handling
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
```

### **2.2 Catálogo de Funções**

#### `create-pix-payment`
- **Trigger:** Frontend Checkout.
- **Ação:** Cria registro `pending` no DB → Chama API Mercado Pago → Retorna QR Code.
- **Segurança:** Rate Limit 5/min.

#### `mercadopago-webhook`
- **Trigger:** Mercado Pago (POST).
- **Ação:** Recebe notificação → Consulta MP para status atual → Atualiza DB → (Opcional) Dispara email.
- **Idempotência:** Crítica. Deve lidar com múltiplos eventos iguais.

#### `download`
- **Trigger:** Frontend (Pós-pagamento).
- **Ação:** Valida se email pagou (`status: approved`) → Gera Signed URL temporária do Storage.

***

## 🔌 **3. INTEGRAÇÕES EXTERNAS**

### **Mercado Pago API**
- **Auth:** Bearer Token (Environment Variable).
- **Idempotency:** Header `X-Idempotency-Key` obrigatório em transações.
- **Flow:** Preferência por Pix (confirmação instantânea).

***

## 🔒 **4. SEGURANÇA DE DADOS**

1.  **Row Level Security (RLS):**
    - Tabela `payments`: Apenas `service_role` (Backend) pode escrever/ler tudo.
    - Public (Anon): Sem acesso direto.

2.  **Variáveis de Ambiente:**
    - `SUPABASE_SERVICE_ROLE_KEY`: Apenas no servidor.
    - `MERCADOPAGO_ACCESS_TOKEN`: Apenas no servidor.
    - Nunca expor chaves privadas no cliente.
