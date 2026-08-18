create or replace function public.save_room_image_order(
  p_room_type_id uuid,
  p_image_ids uuid[]
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  room_image_count integer;
begin
  perform 1
  from public.room_images
  where room_type_id = p_room_type_id
  for update;

  select count(*) into room_image_count
  from public.room_images
  where room_type_id = p_room_type_id;

  if coalesce(array_length(p_image_ids, 1), 0) <> room_image_count
    or (select count(distinct supplied.image_id) from unnest(p_image_ids) as supplied(image_id)) <> room_image_count
    or exists (
      select 1
      from unnest(p_image_ids) as supplied(image_id)
      where not exists (
        select 1 from public.room_images as candidate
        where candidate.id = supplied.image_id and candidate.room_type_id = p_room_type_id
      )
    ) then
    raise exception 'Invalid room image order';
  end if;

  update public.room_images as room_image
  set sort_order = ordered.position::integer
  from unnest(p_image_ids) with ordinality as ordered(image_id, position)
  where room_image.id = ordered.image_id
    and room_image.room_type_id = p_room_type_id;
end;
$$;

revoke all on function public.save_room_image_order(uuid, uuid[]) from public, anon;
grant execute on function public.save_room_image_order(uuid, uuid[]) to authenticated;
