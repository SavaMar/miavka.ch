-- Digital Leak Audit requests: one row per quiz submission (app/api/audit).
-- Only the server (service role key) can read or write; RLS has no public policies.

create table if not exists public.audit_requests (
  id bigserial primary key,
  created_at timestamptz not null default now(),

  -- Your workflow. Edit these in the Supabase table editor.
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'audit_sent', 'call_booked', 'closed')),
  notes text,

  first_name text not null check (char_length(first_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  wants_call boolean not null default false,

  -- Quiz version 2 answers.
  quiz_version smallint not null check (quiz_version in (1, 2)),
  leak_suspects text[] check (
    leak_suspects <@ array[
      'found-on-google', 'website-message', 'mobile-and-speed',
      'lead-capture', 'follow-up-and-booking', 'cant-tell'
    ]::text[]
  ),
  intent text check (intent in ('fix-30-days', 'understand-first', 'just-curious')),
  what_they_sell text check (char_length(what_they_sell) between 10 and 140),
  website_url text check (char_length(website_url) <= 300),
  profile_url text check (char_length(profile_url) <= 300),

  -- Quiz version 1 answers, from a visitor who still had the old page open.
  legacy_answers jsonb,

  -- False if the Loops event (the audit email) could not be sent.
  loops_synced boolean not null default false,

  constraint audit_requests_answers_present check (
    (
      quiz_version = 2
      and leak_suspects is not null
      and cardinality(leak_suspects) > 0
      and intent is not null
      and what_they_sell is not null
      and website_url is not null
    )
    or (quiz_version = 1 and legacy_answers is not null)
  )
);

create index if not exists audit_requests_created_at_idx
  on public.audit_requests (created_at desc);

create index if not exists audit_requests_status_idx
  on public.audit_requests (status);

alter table public.audit_requests enable row level security;
