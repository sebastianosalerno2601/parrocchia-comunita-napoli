create table if not exists public.eventi (
  id text primary key,
  titolo text not null,
  descrizione text not null,
  data_iso timestamptz not null,
  luogo text,
  is_upcoming boolean not null default true,
  is_past boolean not null default false,
  image_url text not null,
  image_public_id text,
  image_urls jsonb,
  image_public_ids jsonb,
  created_at timestamptz not null default now()
);

create index if not exists eventi_data_iso_idx on public.eventi (data_iso asc);

