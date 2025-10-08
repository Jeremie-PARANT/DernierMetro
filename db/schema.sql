-- Minimal schema for Dernier Metro API
-- One simple table: config(key text primary key, value jsonb)

CREATE TABLE IF NOT EXISTS public.config (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

-- Table des stations
CREATE TABLE IF NOT EXISTS public.stations (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- Table du dernier métro
CREATE TABLE IF NOT EXISTS public.last_metro (
  id SERIAL PRIMARY KEY,
  station_id INT NOT NULL REFERENCES public.stations(id),
  departed_at TIMESTAMP NOT NULL
);

 -- Insert data
INSERT INTO public.stations (name)
VALUES ('M1'), ('M2'), ('M3')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.last_metro (station_id, departed_at)
VALUES 
  ((SELECT id FROM public.stations WHERE name='M1'), '2025-10-08 01:05:00'),
  ((SELECT id FROM public.stations WHERE name='M2'), '2025-10-08 01:10:00')
ON CONFLICT DO NOTHING;
