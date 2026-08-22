create table if not exists public.contact_submissions (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;
