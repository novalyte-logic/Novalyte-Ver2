create extension if not exists pgcrypto;

create table if not exists public.documents (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (collection, id)
);

create index if not exists documents_collection_idx on public.documents (collection);
create index if not exists documents_data_gin_idx on public.documents using gin (data jsonb_path_ops);

create or replace function public.touch_documents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists documents_updated_at on public.documents;

create trigger documents_updated_at
before update on public.documents
for each row
execute function public.touch_documents_updated_at();

alter table public.documents enable row level security;
alter table public.documents replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.documents;
exception
  when duplicate_object then null;
end
$$;

drop policy if exists "documents_public_select" on public.documents;
create policy "documents_public_select"
on public.documents
for select
using (
  collection in ('clinics', 'products')
  or (collection = 'marketplaceServices' and coalesce(data->>'status', 'active') = 'active')
);

drop policy if exists "documents_users_self_manage" on public.documents;
create policy "documents_users_self_manage"
on public.documents
for all
to authenticated
using (
  collection = 'users'
  and id = auth.uid()::text
)
with check (
  collection = 'users'
  and id = auth.uid()::text
);

drop policy if exists "documents_clinics_self_manage" on public.documents;
create policy "documents_clinics_self_manage"
on public.documents
for all
to authenticated
using (
  collection = 'clinics'
  and id = auth.uid()::text
)
with check (
  collection = 'clinics'
  and id = auth.uid()::text
);

drop policy if exists "documents_public_intake_insert" on public.documents;
create policy "documents_public_intake_insert"
on public.documents
for insert
with check (
  collection in ('patients', 'assessments', 'leads', 'bookings', 'symptom_checks', 'ai_interactions', 'clinics')
);

drop policy if exists "documents_clinic_scoped_select" on public.documents;
create policy "documents_clinic_scoped_select"
on public.documents
for select
to authenticated
using (
  collection in (
    'leads',
    'bookings',
    'auditEvents',
    'intelligenceInsights',
    'invoices',
    'supportTickets',
    'marketplaceOrders'
  )
  and coalesce(data->>'clinicId', '') = auth.uid()::text
);

drop policy if exists "documents_clinic_scoped_insert" on public.documents;
create policy "documents_clinic_scoped_insert"
on public.documents
for insert
to authenticated
with check (
  collection in ('auditEvents', 'supportTickets', 'marketplaceOrders')
  and coalesce(data->>'clinicId', '') = auth.uid()::text
);

drop policy if exists "documents_clinic_scoped_update" on public.documents;
create policy "documents_clinic_scoped_update"
on public.documents
for update
to authenticated
using (
  collection in (
    'leads',
    'auditEvents',
    'supportTickets',
    'marketplaceOrders'
  )
  and coalesce(data->>'clinicId', '') = auth.uid()::text
)
with check (
  collection in (
    'leads',
    'auditEvents',
    'supportTickets',
    'marketplaceOrders'
  )
  and coalesce(data->>'clinicId', '') = auth.uid()::text
);
