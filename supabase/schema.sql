-- napista: Schema do banco de dados
-- Execute este SQL no Supabase SQL Editor

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  created_at timestamptz default now()
);

-- Accounts (C6 Bank, Inter, C6 Invest)
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  bank text not null,
  type text not null check (type in ('operational', 'spending', 'investment')),
  description text,
  balance numeric(12,2) default 0,
  created_at timestamptz default now()
);

-- Recurring expenses
create table public.recurring_expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  amount numeric(12,2) not null,
  category text not null check (category in ('fixed', 'variable', 'temporary')),
  active boolean default true,
  ends_at text, -- "2026-10" format
  created_at timestamptz default now()
);

-- Transactions (manual entries)
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  account_id uuid references public.accounts(id),
  date date not null,
  description text not null,
  amount numeric(12,2) not null,
  type text not null check (type in ('income', 'expense', 'contribution')),
  category text not null,
  notes text,
  created_at timestamptz default now()
);

-- Goals
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) default 0,
  deadline text,
  description text,
  created_at timestamptz default now()
);

-- Monthly contributions (track actual deposits toward goal)
create table public.monthly_contributions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  goal_id uuid references public.goals(id),
  month text not null, -- "2026-07"
  amount numeric(12,2) not null,
  created_at timestamptz default now(),
  unique(user_id, goal_id, month)
);

-- Monthly budget snapshots
create table public.monthly_budget (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null,
  income numeric(12,2),
  fixed_expenses numeric(12,2),
  variable_expenses numeric(12,2),
  fun_money numeric(12,2),
  contribution numeric(12,2),
  final_balance numeric(12,2),
  accumulated numeric(12,2),
  created_at timestamptz default now(),
  unique(user_id, month)
);

-- User settings
create table public.user_settings (
  user_id uuid references auth.users on delete cascade primary key,
  monthly_income numeric(12,2) default 5661.20,
  auto_deduction numeric(12,2) default 338.20,
  goal_amount numeric(12,2) default 20000,
  fun_money_limit numeric(12,2) default 300,
  phone_installment_active boolean default true,
  phone_installment_amount numeric(12,2) default 300,
  phone_installment_ends_at text default '2026-10',
  one_time_expenses jsonb default '[]',
  updated_at timestamptz default now()
);

-- Projections (cached scenario calculations)
create table public.projections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  scenario text not null check (scenario in ('conservative', 'realistic', 'strong')),
  monthly_savings_phase1 numeric(12,2),
  monthly_savings_phase2 numeric(12,2),
  months_to_goal integer,
  completion_date text,
  calculated_at timestamptz default now()
);

-- Indexes
create index idx_transactions_user_date on public.transactions(user_id, date);
create index idx_monthly_budget_user on public.monthly_budget(user_id, month);
create index idx_contributions_user on public.monthly_contributions(user_id, month);
