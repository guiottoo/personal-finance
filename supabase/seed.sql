-- Seed data for napista
-- Run after creating a user via Supabase Auth
-- Replace 'YOUR_USER_ID' with the actual user UUID

-- Accounts
insert into public.accounts (user_id, name, bank, type, description, balance) values
  ('YOUR_USER_ID', 'C6 Bank', 'C6', 'operational', 'Conta operacional para receber e pagar contas', 800),
  ('YOUR_USER_ID', 'Banco Inter', 'Inter', 'spending', 'Conta de debito para besteiras (limite R$ 300/mes)', 300),
  ('YOUR_USER_ID', 'C6 Invest', 'C6', 'investment', 'Aportes mensais rumo a meta de R$ 20.000', 800);

-- Recurring expenses
insert into public.recurring_expenses (user_id, name, amount, category, active, ends_at) values
  ('YOUR_USER_ID', 'Aluguel', 950, 'fixed', true, null),
  ('YOUR_USER_ID', 'Agua e Luz', 150, 'fixed', true, null),
  ('YOUR_USER_ID', 'Mercado / Comida', 500, 'fixed', true, null),
  ('YOUR_USER_ID', 'Imposto CNPJ', 90, 'fixed', true, null),
  ('YOUR_USER_ID', 'Parcela Celular', 300, 'temporary', true, '2026-10'),
  ('YOUR_USER_ID', 'Banco Inter (Besteiras)', 300, 'variable', true, null);

-- Goal
insert into public.goals (user_id, name, target_amount, current_amount, description) values
  ('YOUR_USER_ID', 'Chevrolet Classic', 20000, 800, 'Meta de compra a vista');

-- July transactions
insert into public.transactions (user_id, date, description, amount, type, category) values
  ('YOUR_USER_ID', '2026-07-01', 'Salario', 5661.20, 'income', 'Salario'),
  ('YOUR_USER_ID', '2026-07-02', 'Aluguel', 950, 'expense', 'Moradia'),
  ('YOUR_USER_ID', '2026-07-03', 'Agua e Luz', 150, 'expense', 'Moradia'),
  ('YOUR_USER_ID', '2026-07-04', 'Mercado', 500, 'expense', 'Alimentacao'),
  ('YOUR_USER_ID', '2026-07-05', 'Imposto CNPJ', 90, 'expense', 'Impostos'),
  ('YOUR_USER_ID', '2026-07-06', 'Parcela Celular', 300, 'expense', 'Parcelas'),
  ('YOUR_USER_ID', '2026-07-07', 'Transferencia besteiras', 300, 'expense', 'Besteiras'),
  ('YOUR_USER_ID', '2026-07-10', 'Aporte C6 Invest', 800, 'contribution', 'Investimento');

-- July contribution
insert into public.monthly_contributions (user_id, month, amount) values
  ('YOUR_USER_ID', '2026-07', 800);

-- Settings
insert into public.user_settings (user_id, monthly_income, auto_deduction, goal_amount, fun_money_limit, phone_installment_active, phone_installment_amount, phone_installment_ends_at, one_time_expenses)
values (
  'YOUR_USER_ID',
  5661.20,
  338.20,
  20000,
  300,
  true,
  300,
  '2026-10',
  '[{"name": "Aquila", "amount": 300, "month": "2026-08"}]'
)
on conflict (user_id) do update set
  monthly_income = excluded.monthly_income,
  auto_deduction = excluded.auto_deduction;
