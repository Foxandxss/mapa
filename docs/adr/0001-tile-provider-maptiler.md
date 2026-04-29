# ADR 0001: Tile provider — MapTiler vector tiles over OSM raster

## Status

Accepted — 2026-04-29.

## Context

The map is the entire product surface: a user opens the page, sees the map, and reads their position from it. The choice of tile provider therefore directly shapes what users see and how the app behaves at different zoom levels.

Two realistic options:

1. **OSM raster tiles** served from `tile.openstreetmap.org`. No API key, no payment, no signup. The OSMF tile usage policy explicitly forbids high-traffic apps and discourages production use; CDN routing is best-effort and the visual quality is fixed (256×256 raster, no per-style customization, jagged at high DPI).
2. **MapTiler vector tiles** (style `streets-v2`) backed by OSM data. Requires an API key and is rate-limited on the free tier (currently 100k tile requests/month), but renders crisp at any zoom and DPI, supports runtime style changes, and is what `maplibre-gl` is designed around.

This is a hobby/portfolio app, not high-traffic — the free MapTiler tier is comfortably sufficient.

## Decision

Use **MapTiler vector tiles** (`streets-v2` style) via `maplibre-gl`. The map style URL is built at runtime from an API key that lives in `apps/web/src/environments/environment.ts`.

## Consequences

- We must show attribution `© OpenStreetMap contributors © MapTiler` on the map. `maplibre-gl` reads this from the style JSON and renders it via the attribution control; we keep `attributionControl: true`.
- The MapTiler API key is treated as a public client-side credential (it gets shipped to the browser anyway). The placeholder lives in `environment.ts`; real values live in untracked `environment.local.ts` — see ADR 0002 / `.gitignore`.
- We're now on the hook for HTTPS in production (already a hard requirement for `navigator.geolocation`).
- If the free tier is exceeded, the app degrades to a blank map background. We accept this for now.

## Alternatives considered

- **OSM raster tiles** — rejected. Cannot use in production per usage policy; visual quality at high zoom is poor; no styling control.
- **Stadia / Stamen / Carto** — comparable to MapTiler but not materially better for this use case. MapTiler's free tier and ngx-maplibre-gl alignment tipped the choice.
- **Self-hosted vector tiles** — out of scope for a client-only SPA.
