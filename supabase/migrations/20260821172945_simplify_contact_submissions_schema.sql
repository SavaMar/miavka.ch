alter table if exists public.contact_submissions
  add column if not exists message text;

-- main_pain only exists in the original schema; a fresh database never has it.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'contact_submissions'
      and column_name = 'main_pain'
  ) then
    update public.contact_submissions
    set message = coalesce(message, main_pain)
    where message is null;
  end if;
end $$;

alter table public.contact_submissions
  alter column message set not null;

alter table public.contact_submissions
  drop column if exists business,
  drop column if exists main_pain,
  drop column if exists current_goal,
  drop column if exists source;
