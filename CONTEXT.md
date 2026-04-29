# Context

## Glossary

### Position Fix
A concrete reading of "where the user is right now" with three numbers — `lat`, `lon`, `accuracy` (radius in meters) — plus its **Position Source**. It is the unit of data the rest of the UI consumes: marker, precision circle, and adaptive zoom are all derived from it. A Position Fix is a snapshot, not a stream; this app reads it once per page load.

### Position Source
Tells *how* the current Position Fix was obtained. Two values today: `gps` (from `navigator.geolocation.getCurrentPosition`) and `ip` (from a server-side IP lookup via ipapi.co). The source carries fidelity information the UI uses directly: GPS implies meter-scale accuracy and street-level zoom; IP implies city-scale accuracy and a wider zoom plus an "approximate" badge.

## Layered libraries

The codebase splits into three Nx libraries with enforced module boundaries (see ADR 0002):

- **`feature-*`** — orchestrates a use case. May import `ui-*` and `data-*`. Today: `feature-map`.
- **`ui-*`** — presentational components. May only import other `ui-*`. Today: `ui-map`.
- **`data-*`** — services and stores. May only import other `data-*`. Today: `data-geolocation`.

Apps live under `apps/` and may import any lib type. Boundaries are enforced by `@nx/eslint-plugin`'s `enforce-module-boundaries` rule keyed off the `type:*` tag in each project's `project.json`.
