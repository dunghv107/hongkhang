create table public.email_rate_limits (
  id bigint generated always as identity primary key,
  email_hash text not null,
  session_hash text not null,
  created_at timestamptz not null default now()
);

create index email_rate_limits_email_created_idx
  on public.email_rate_limits (email_hash, created_at desc);

create index email_rate_limits_session_created_idx
  on public.email_rate_limits (session_hash, created_at desc);

alter table public.email_rate_limits enable row level security;

create or replace function public.claim_password_recovery_attempt(
  p_email_hash text,
  p_session_hash text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  email_lock bigint := hashtextextended(p_email_hash, 0);
  session_lock bigint := hashtextextended(p_session_hash, 0);
begin
  perform pg_advisory_xact_lock(least(email_lock, session_lock));
  if email_lock <> session_lock then
    perform pg_advisory_xact_lock(greatest(email_lock, session_lock));
  end if;

  delete from public.email_rate_limits
  where created_at < now() - interval '10 minutes';

  if (select count(*) from public.email_rate_limits where email_hash = p_email_hash) >= 3
    or (select count(*) from public.email_rate_limits where session_hash = p_session_hash) >= 3 then
    return false;
  end if;

  insert into public.email_rate_limits (email_hash, session_hash)
  values (p_email_hash, p_session_hash);

  return true;
end;
$$;

revoke all on table public.email_rate_limits from anon, authenticated;
revoke all on function public.claim_password_recovery_attempt(text, text) from public, anon, authenticated;
grant execute on function public.claim_password_recovery_attempt(text, text) to service_role;
