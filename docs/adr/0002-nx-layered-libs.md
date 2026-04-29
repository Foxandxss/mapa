# ADR 0002: Layered Nx libraries — feature / ui / data

## Status

Accepted — 2026-04-29.

## Context

The product today is one screen — a map that auto-locates the user. A reasonable reader could ask "isn't a single Angular app overkill for this? Why three libraries?". We're making the choice anyway because the boundaries we set now shape every later slice (#3 GPS, #4 IP fallback, #5 error toast), and because the planned testing strategy depends on isolating the data layer from the DOM.

Concretely, three concerns want to be testable separately:

1. **Position resolution logic** — the state machine that calls `navigator.geolocation`, falls back to `ipapi.co`, and ends in `ready` or `error`. We want Jest tests for this with mocked browser APIs, no DOM. → `data-geolocation`.
2. **Presentational widgets** — map, marker, precision circle, source badge, loading overlay. These should be testable with `@testing-library/angular` against rendered output, with no knowledge of where Position Fixes come from. → `ui-map`.
3. **Composition** — the page that wires the store to the widgets. This is the only layer that knows about both. → `feature-map`.

If we kept all three in `apps/web`, the temptation to import a service from a presentational component would always be one autocomplete away.

## Decision

Three Nx libraries with enforced module boundaries:

| Library             | Tag             | May import                          |
| ------------------- | --------------- | ----------------------------------- |
| `feature-map`       | `type:feature`  | `type:feature`, `type:ui`, `type:data` |
| `ui-map`            | `type:ui`       | `type:ui` only                      |
| `data-geolocation`  | `type:data`     | `type:data` only                    |

The `apps/web` app (`type:app`) may import any lib. Boundaries are enforced by `@nx/eslint-plugin`'s `@nx/enforce-module-boundaries` rule in `eslint.config.mjs` at the workspace root, keyed off the `tags` array in each project's `project.json`.

## Consequences

- Adding a new lib means picking a layer first. New presentational components go to `ui-*`; new services/stores to `data-*`; new orchestrators to `feature-*`.
- A `ui-*` component needing data has only one option: receive it as an input from a `feature-*` parent. No service injection from `data-*` — ESLint will block it.
- `data-*` libraries are framework-agnostic enough to test without the Angular TestBed when the logic permits.
- The single `apps/web` is the only consumer for now; we accept the small overhead of additional `project.json`/`tsconfig` files in exchange for the boundary guarantee.

## Alternatives considered

- **Single `apps/web` with folder convention only** — rejected. Convention is unenforced; the first PR with a hurry will violate it.
- **`shared/` umbrella lib** — rejected. Defeats the layering by giving everything an escape hatch.
- **Feature-per-screen libs without ui/data split** — too coarse; we'd lose the ability to test data logic without the DOM.
