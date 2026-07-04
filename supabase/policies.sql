-- Row Level Security policies
-- Each user can only access their own data

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.recurring_expenses enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.monthly_contributions enable row level security;
alter table public.monthly_budget enable row level security;
alter table public.user_settings enable row level security;
alter table public.projections enable row level security;

-- Profiles
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Accounts
create policy "Users can view own accounts"
  on public.accounts for select using (auth.uid() = user_id);
create policy "Users can manage own accounts"
  on public.accounts for all using (auth.uid() = user_id);

-- Recurring expenses
create policy "Users can view own recurring expenses"
  on public.recurring_expenses for select using (auth.uid() = user_id);
create policy "Users can manage own recurring expenses"
  on public.recurring_expenses for all using (auth.uid() = user_id);

-- Transactions
create policy "Users can view own transactions"
  on public.transactions for select using (auth.uid() = user_id);
create policy "Users can manage own transactions"
  on public.transactions for all using (auth.uid() = user_id);

-- Goals
create policy "Users can view own goals"
  on public.goals for select using (auth.uid() = user_id);
create policy "Users can manage own goals"
  on public.goals for all using (auth.uid() = user_id);

-- Monthly contributions
create policy "Users can view own contributions"
  on public.monthly_contributions for select using (auth.uid() = user_id);
create policy "Users can manage own contributions"
  on public.monthly_contributions for all using (auth.uid() = user_id);

-- Monthly budget
create policy "Users can view own budget"
  on public.monthly_budget for select using (auth.uid() = user_id);
create policy "Users can manage own budget"
  on public.monthly_budget for all using (auth.uid() = user_id);

-- User settings
create policy "Users can view own settings"
  on public.user_settings for select using (auth.uid() = user_id);
create policy "Users can manage own settings"
  on public.user_settings for all using (auth.uid() = user_id);

-- Projections
create policy "Users can view own projections"
  on public.projections for select using (auth.uid() = user_id);
create policy "Users can manage own projections"
  on public.projections for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
