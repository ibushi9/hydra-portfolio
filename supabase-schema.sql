-- ══════════════════════════════════════════════════════════
-- Cabaret AI — Supabase 本番スキーマ（認証・DB・アクセス制御）
--
-- 設計方針:
--   ・profiles        … 名前・役割だけ（全員が読める＝共有カレンダーに必要）
--   ・cast_profiles    … 住所などの個人情報（本人と店長だけが読める）
--   ・schedules        … 出勤予定（全員が読める＝リアルタイム予定共有／
--                        書き込みは本人か店長のみ）
--   ・cast_transport_all() … 送迎グルーピングに必要な「エリア/距離」だけを
--                        住所を晒さずに全員へ返す関数（住所そのものは
--                        本人と店長にしか返さない）
--
-- Supabase の SQL Editor でこのファイルをそのまま実行してください。
-- ══════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── プロフィール（公開情報のみ）────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('boy','cast')),
  name text not null,
  line_name text,
  created_at timestamptz not null default now()
);

-- ── キャスト個人情報（PII）────────────────────────────────
create table if not exists public.cast_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  address text,
  area text,
  dist_min int,
  profile_done boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ── 出勤予定（共有カレンダー）────────────────────────────
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  cast_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  status text not null check (status in ('on','late','early','off','tbd')),
  start_time text,
  end_time text,
  note text,
  updated_at timestamptz not null default now(),
  unique(cast_id, date)
);

-- ── ヘルパー: 今ログイン中のユーザーは店長(boy)か？────────────
create or replace function public.is_boy()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.profiles where id = auth.uid() and role = 'boy'
  );
$$;

-- ── 送迎グルーピング用: 住所を晒さず「エリア/距離/登録済みか」だけ返す ──
create or replace function public.cast_transport_all()
returns table(profile_id uuid, area text, dist_min int, profile_done boolean)
language sql stable security definer set search_path = public as $$
  select profile_id, area, dist_min, profile_done from public.cast_profiles;
$$;
revoke all on function public.cast_transport_all() from public;
grant execute on function public.cast_transport_all() to authenticated;

-- ── RLS 有効化 ──────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.cast_profiles enable row level security;
alter table public.schedules enable row level security;

-- profiles: 名前は全員が読める（共有カレンダーに名前を出すため）
create policy "profiles_select_all" on public.profiles
  for select using (auth.uid() is not null);
create policy "profiles_insert_self_or_boy" on public.profiles
  for insert with check (id = auth.uid() or public.is_boy());
create policy "profiles_update_self_or_boy" on public.profiles
  for update using (id = auth.uid() or public.is_boy());

-- cast_profiles: 住所などのPIIは「本人」か「店長」だけ
create policy "castp_select_self_or_boy" on public.cast_profiles
  for select using (profile_id = auth.uid() or public.is_boy());
create policy "castp_insert_self_or_boy" on public.cast_profiles
  for insert with check (profile_id = auth.uid() or public.is_boy());
create policy "castp_update_self_or_boy" on public.cast_profiles
  for update using (profile_id = auth.uid() or public.is_boy());

-- schedules: 予定は全員が読める／書き込みは本人か店長だけ
create policy "sched_select_all" on public.schedules
  for select using (auth.uid() is not null);
create policy "sched_insert_self_or_boy" on public.schedules
  for insert with check (cast_id = auth.uid() or public.is_boy());
create policy "sched_update_self_or_boy" on public.schedules
  for update using (cast_id = auth.uid() or public.is_boy());
create policy "sched_delete_self_or_boy" on public.schedules
  for delete using (cast_id = auth.uid() or public.is_boy());

-- ── リアルタイム同期を有効化（複数端末での即時反映用）────────
-- Supabaseダッシュボードの Database > Replication でも同じことができます。
alter publication supabase_realtime add table public.schedules;
alter publication supabase_realtime add table public.cast_profiles;

-- ══════════════════════════════════════════════════════════
-- ここまで実行したら、次は「Authentication」タブで
-- 店長・キャストそれぞれのログインユーザーを作成し、
-- 対応する profiles 行を1件ずつ INSERT してください。
-- 具体的な手順は SETUP-PRODUCTION.md を参照してください。
--
-- 例（UUIDは実際に作成したユーザーのものに置き換える）:
--
-- insert into public.profiles (id, role, name, line_name) values
--   ('11111111-1111-1111-1111-111111111111', 'boy',  '店長', null),
--   ('22222222-2222-2222-2222-222222222222', 'cast', 'あや', 'あや★');
-- ══════════════════════════════════════════════════════════
