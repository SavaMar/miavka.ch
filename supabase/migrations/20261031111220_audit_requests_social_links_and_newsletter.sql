-- One optional link per network instead of a single "Google Business or Instagram" field,
-- plus the newsletter opt-in from the last quiz step.
alter table public.audit_requests
  drop column if exists profile_url;

alter table public.audit_requests
  add column linkedin_url text check (char_length(linkedin_url) <= 300),
  add column instagram_url text check (char_length(instagram_url) <= 300),
  add column subscribed_newsletter boolean not null default false;
