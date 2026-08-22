-- Supabase schema for Gerador UGC TikTok Shop (org: emailone3244)
-- Rode no SQL Editor do seu projeto Supabase "bora"

-- 1. Buckets de storage para imagens
insert into storage.buckets (id, name, public) values ('cap-images', 'cap-images', true) on conflict (id) do nothing;

-- 2. Tabelas
create table if not exists public.projects (
  id text primary key,
  folder text unique not null,
  name text not null,
  description text,
  images jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists public.generated_ideas (
  id uuid primary key default gen_random_uuid(),
  project_id text references public.projects(id) on delete cascade,
  idx int not null,
  title text,
  hook text,
  pov_action text,
  google_flow_prompt text,
  recommended_images jsonb,
  created_at timestamp with time zone default now()
);

-- 3. RLS (libera leitura/escrita anônima - ajuste para produção)
alter table public.projects enable row level security;
alter table public.generated_ideas enable row level security;

drop policy if exists "allow all projects" on public.projects;
create policy "allow all projects" on public.projects for all using (true) with check (true);

drop policy if exists "allow all ideas" on public.generated_ideas;
create policy "allow all ideas" on public.generated_ideas for all using (true) with check (true);

-- 4. Storage policies (público)
drop policy if exists "public read cap-images" on storage.objects;
create policy "public read cap-images" on storage.objects for select using (bucket_id = 'cap-images');
drop policy if exists "allow upload cap-images" on storage.objects;
create policy "allow upload cap-images" on storage.objects for insert with check (bucket_id = 'cap-images');
drop policy if exists "allow update cap-images" on storage.objects;
create policy "allow update cap-images" on storage.objects for update using (bucket_id = 'cap-images');
drop policy if exists "allow delete cap-images" on storage.objects;
create policy "allow delete cap-images" on storage.objects for delete using (bucket_id = 'cap-images');

-- 5. Seed inicial (saobento + abacurvapatch)
insert into public.projects (id, folder, name, description, images) values
('saobento','saobento','Boné Trucker Medalha de São Bento','Suede aveludado premium, tela trucker respirável, fecho snapback, patch circular em alto-relevo 3D da Medalha de São Bento e bordado cursivo dourado na aba ''A Cruz Sagrada seja a minha luz''.', '["exec-0d9c9a19-a56b-43f2-8182-e936b42e033e.png"]'::jsonb),
('abacurvapatch','abacurvapatch','Boné Rancho Forte Country Aba Curva Patch','Copa fechada, aba curva em couro sintético texturizado e patch frontal em couro com logo RF. Fechamento em velcro.', '["img1black.jfif","img1white.jfif","img2black.jfif"]'::jsonb)
on conflict (id) do nothing;
