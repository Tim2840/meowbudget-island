-- ============================================================
-- 喵帳島 / MeowBudget Island — Initial Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── profiles ──────────────────────────────────────────────
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  level           integer not null default 1,
  exp             integer not null default 0,
  current_streak  integer not null default 0,
  longest_streak  integer not null default 0,
  last_record_date date,
  language        text not null default 'zh-TW',
  onboarding_completed boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Users can manage their own profile"
  on profiles for all using (auth.uid() = id);

-- ── transactions ──────────────────────────────────────────
create table if not exists transactions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  type                    text not null check (type in ('income', 'expense')),
  amount                  numeric(12,2) not null,
  category_id             text not null,
  category_snapshot       jsonb,
  date                    date not null,
  note                    text,
  reward_coins            integer not null default 0,
  reward_resource_type    text,
  reward_resource_amount  integer not null default 0,
  created_at              timestamptz not null default now()
);

create index if not exists transactions_user_date_idx on transactions(user_id, date desc);

alter table transactions enable row level security;
create policy "Users can manage their own transactions"
  on transactions for all using (auth.uid() = user_id);

-- ── resource_wallets ──────────────────────────────────────
create table if not exists resource_wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  coins   integer not null default 0,
  wood    integer not null default 0,
  fabric  integer not null default 0,
  fish    integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table resource_wallets enable row level security;
create policy "Users can manage their own wallet"
  on resource_wallets for all using (auth.uid() = user_id);

-- ── budgets ───────────────────────────────────────────────
create table if not exists budgets (
  id          text primary key,           -- "{year_month}__{category_id}"
  user_id     uuid not null references auth.users(id) on delete cascade,
  category_id text not null,
  amount      numeric(12,2) not null,
  year_month  text not null,              -- "YYYY-MM"
  created_at  timestamptz not null default now()
);

create index if not exists budgets_user_month_idx on budgets(user_id, year_month);

alter table budgets enable row level security;
create policy "Users can manage their own budgets"
  on budgets for all using (auth.uid() = user_id);

-- ── user_settings ─────────────────────────────────────────
create table if not exists user_settings (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  sound_enabled          boolean not null default true,
  animations_enabled     boolean not null default true,
  notifications_enabled  boolean not null default false,
  updated_at             timestamptz not null default now()
);

alter table user_settings enable row level security;
create policy "Users can manage their own settings"
  on user_settings for all using (auth.uid() = user_id);

-- ── Trigger: auto-update updated_at ───────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger resource_wallets_updated_at
  before update on resource_wallets
  for each row execute function update_updated_at();

create trigger user_settings_updated_at
  before update on user_settings
  for each row execute function update_updated_at();

-- ── Auto-provision profile + wallet on signup ──────────────
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id) on conflict do nothing;
  insert into resource_wallets (user_id) values (new.id) on conflict do nothing;
  insert into user_settings (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
