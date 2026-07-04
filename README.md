# napista

Dashboard financeiro pessoal para controle de orcamento mensal e meta de compra de carro.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Recharts (graficos)
- Lucide React (icones)
- Supabase (backend opcional)

## Setup

```bash
cd napista
npm install
npm run dev
```

Acesse `http://localhost:3000`.

O app funciona com dados mockados por padrao. Nao precisa de Supabase para rodar localmente.

## Supabase (opcional)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie `.env.local.example` para `.env.local` e preencha as credenciais
3. Execute `supabase/schema.sql` no SQL Editor
4. Execute `supabase/policies.sql` para RLS
5. Crie um usuario via Auth, substitua `YOUR_USER_ID` em `supabase/seed.sql` e execute

## Estrutura

```
src/
  app/                    # Paginas (App Router)
    page.tsx              # Dashboard principal
    planejamento/         # Tabela mensal
    meta-carro/           # Meta + cenarios + plano de aportes
    contas/               # C6, Inter, C6 Invest
    lancamentos/          # Formulario + lista de transacoes
    configuracoes/        # Editar valores e regras
  components/
    ui/                   # Componentes base (Card, Button, Input...)
    layout/               # Sidebar, Header, AppShell
    dashboard/            # KPIs, graficos, alertas
    planning/             # Tabela mensal
    goal/                 # Cenarios, plano de aportes
    accounts/             # Cards de contas
    transactions/         # Form e lista
    settings/             # Formulario de config
  hooks/                  # useTheme, useFinancialData
  lib/                    # Utils, tipos, calculos, constantes, mock
supabase/
  schema.sql              # Tabelas
  policies.sql            # RLS
  seed.sql                # Dados iniciais
```

## Dados financeiros

- Receita util: R$ 5.661,20/mes
- Despesas fixas: R$ 1.690 (aluguel + agua/luz + mercado + CNPJ)
- Parcela celular: R$ 300 (ate out/2026)
- Besteiras: R$ 300/mes (Banco Inter)
- Meta: R$ 20.000 (Chevrolet Classic)
- Ja investido: R$ 800

## Dark mode

Toggle no header. O modo padrao e claro.
