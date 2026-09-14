-- Ti Kanè m — Supabase database schema
-- Run this file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('progressive','fixed')),
  data_g integer not null check (data_g > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  plan_id uuid references public.plans(id) on delete set null,
  full_name text not null,
  phone text not null,
  start_date date not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles(id) on delete set null,
  name text not null,
  price numeric(12,2) not null default 0 check (price >= 0),
  description text,
  photo_url text,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

insert into public.plans (name, category, data_g)
select * from (values
  ('Plan 1','progressive',5),
  ('Plan 2','progressive',10),
  ('Plan 3','progressive',25),
  ('Plan 4','progressive',50),
  ('Plan 5','progressive',100),
  ('Plan250G','fixed',250),
  ('Plan500G','fixed',500),
  ('Plan1000G','fixed',1000)
) as seed(name, category, data_g)
where not exists (select 1 from public.plans limit 1);

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.orders enable row level security;
alter table public.products enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

-- Profiles
create policy "profiles_select_authenticated" on public.profiles
for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles
for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Plans are public to signed-in users
create policy "plans_select_authenticated" on public.plans
for select to authenticated using (active = true);

-- Orders belong to the logged-in user
create policy "orders_select_own" on public.orders
for select to authenticated using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders
for insert to authenticated with check (auth.uid() = user_id);
create policy "orders_update_own" on public.orders
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Marketplace products are readable by signed-in users; sellers manage their own.
create policy "products_select_authenticated" on public.products
for select to authenticated using (true);
create policy "products_insert_own" on public.products
for insert to authenticated with check (auth.uid() = seller_id);
create policy "products_update_own" on public.products
for update to authenticated using (auth.uid() = seller_id) with check (auth.uid() = seller_id);
create policy "products_delete_own" on public.products
for delete to authenticated using (auth.uid() = seller_id);

-- Conversations
create policy "members_select_own" on public.conversation_members
for select to authenticated using (auth.uid() = user_id);
create policy "members_insert_own" on public.conversation_members
for insert to authenticated with check (auth.uid() = user_id);

create policy "messages_select_member" on public.messages
for select to authenticated using (
  exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()
  )
);
create policy "messages_insert_member" on public.messages
for insert to authenticated with check (
  auth.uid() = sender_id and exists (
    select 1 from public.conversation_members cm
    where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()
  )
);

-- Realtime chat
alter publication supabase_realtime add table public.messages;
