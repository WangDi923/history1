-- 003_seed_timeline_demo.sql
-- Optional demo data for timeline map feature.
-- Run this after 001_init_schema.sql and 002_rls_policies.sql.

insert into public.timeline_layers (name, start_year, end_year, layer_type, geojson, source_note)
values
  (
    'Roman Empire Approximation',
    -27,
    476,
    'boundary',
    '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"label":"Roman Empire"},"geometry":{"type":"Polygon","coordinates":[[[10,30],[35,30],[35,50],[10,50],[10,30]]]}}]}'::jsonb,
    'Demo polygon for UI testing only; replace with real historical GIS data.'
  ),
  (
    'Silk Road (Simplified)',
    -130,
    1453,
    'route',
    '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"label":"Silk Road"},"geometry":{"type":"LineString","coordinates":[[116.4,39.9],[87.6,43.8],[69.2,41.3],[44.4,33.3],[12.5,41.9]]}}]}'::jsonb,
    'Demo line for UI testing only; replace with validated route data.'
  );

insert into public.timeline_events (title, event_year, region, description, point)
values
  (
    'Fall of Western Roman Empire',
    476,
    'Europe',
    'Conventionally used date for the end of the Western Roman Empire.',
    '{"lng":12.5,"lat":41.9}'::jsonb
  ),
  (
    'Battle of Talas',
    751,
    'Central Asia',
    'A major Tang-Abbasid battle with long-term geopolitical impact.',
    '{"lng":72.8,"lat":42.9}'::jsonb
  );
