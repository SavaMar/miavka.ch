alter table if exists public.contact_submissions
  add column if not exists message text;

update public.contact_submissions
set message = coalesce(message, main_pain)
where message is null;

alter table public.contact_submissions
  alter column message set not null;

alter table public.contact_submissions
  drop column if exists business,
  drop column if exists main_pain,
  drop column if exists current_goal,
  drop column if exists source;
