create table if not exists public.room_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_vnd integer check (price_vnd is null or price_vnd >= 0),
  amenities text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.room_images (
  id uuid primary key default gen_random_uuid(),
  room_type_id uuid not null references public.room_types(id) on delete cascade,
  secure_url text not null,
  public_id text,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.room_types enable row level security;
alter table public.room_images enable row level security;

create policy "Public can read published room types" on public.room_types for select using (published);
create policy "Public can read published room images" on public.room_images for select using (
  exists (select 1 from public.room_types where room_types.id = room_images.room_type_id and room_types.published)
);
create policy "Admins manage room types" on public.room_types for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins manage room images" on public.room_images for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into public.room_types (id, name, price_vnd, amenities, sort_order)
values
  ('00000000-0000-4000-8000-000000000001', 'Loại 1', 3500000, array['Tủ lạnh', 'Máy lạnh', 'Phòng tắm riêng'], 1),
  ('00000000-0000-4000-8000-000000000002', 'Loại 2', 3500000, array['Tủ lạnh', 'Máy lạnh', 'Phòng tắm riêng'], 2),
  ('00000000-0000-4000-8000-000000000003', 'Loại 3', 3500000, array['Tủ lạnh', 'Máy lạnh', 'Phòng tắm riêng'], 3)
on conflict (id) do nothing;

insert into public.room_images (room_type_id, secure_url, alt_text, sort_order)
select * from (values
  ('00000000-0000-4000-8000-000000000001'::uuid, '/images/phong-ngu-hong-khang.jpg', 'Không gian phòng Loại 1', 1),
  ('00000000-0000-4000-8000-000000000001'::uuid, '/images/loi-di-hong-khang.jpg', 'Lối đi khu phòng Loại 1', 2),
  ('00000000-0000-4000-8000-000000000001'::uuid, '/images/phong-tam-hong-khang.jpg', 'Phòng tắm Loại 1', 3),
  ('00000000-0000-4000-8000-000000000002'::uuid, '/images/loi-di-hong-khang.jpg', 'Hình ảnh phòng Loại 2', 1),
  ('00000000-0000-4000-8000-000000000003'::uuid, '/images/phong-tam-hong-khang.jpg', 'Hình ảnh phòng Loại 3', 1)
) as seed(room_type_id, secure_url, alt_text, sort_order)
where not exists (select 1 from public.room_images);
