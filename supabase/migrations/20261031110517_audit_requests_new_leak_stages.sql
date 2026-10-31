-- The audit stages changed: "mobile-and-speed" is retired (kept so old rows stay valid),
-- "ai-recommendation" and "social-media" are new.
alter table public.audit_requests
  drop constraint audit_requests_leak_suspects_check;

alter table public.audit_requests
  add constraint audit_requests_leak_suspects_check check (
    leak_suspects <@ array[
      'found-on-google', 'ai-recommendation', 'social-media', 'website-message',
      'lead-capture', 'follow-up-and-booking', 'cant-tell',
      'mobile-and-speed'
    ]::text[]
  );
