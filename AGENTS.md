# Example Custom Catalyst Project

This project is a form of BigCommerce Catalyst with custom additions for Contentful, product FAQs, custom Makeswift components, subcategory listing, and web pages in nav. See `README.md` for the customization summary and `README-Catalyst.md` for upstream context.

## Toolchain

- Node (`.nvmrc`), `pnpm` via Corepack (`corepack enable pnpm`).
- Monorepo managed by Turborepo + pnpm workspaces (`pnpm-workspace.yaml`): `core/` is the Next.js app, `packages/*` contains the BigCommerce GraphQL client, `create-catalyst` CLI, and shared ESLint config.
- Root scripts wrap Turbo with `dotenv-cli` so commands automatically load `.env.local` from the repo root before delegating to `core/`.

## Common commands

Run from the repo root unless noted:

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Lint | `pnpm lint` |
| Typecheck | `pnpm typecheck` |
| Tests (Turbo) | `pnpm test` |
| Regenerate GraphQL schemas + types | `pnpm --filter=@bigcommerce/catalyst-makeswift generate` |

The `core` `dev` and `build` scripts call `npm run generate` first, which runs `core/scripts/generate.cjs` to introspect both the BigCommerce Storefront API and the Contentful Content API and write `core/bigcommerce.graphql` + `core/contentful.graphql` plus the matching `.d.ts` outputs used by `gql.tada`. If types look stale or schemas drift, run `generate`.

### Playwright tests

Playwright lives in `core/tests/` (config: `core/playwright.config.ts`). Run from `core/`:

```bash
pnpm playwright test                                  # all tests
pnpm playwright test auth/logout.spec.ts              # single file
pnpm playwright test auth/logout.spec.ts -g "Logout"  # single test by name
```

Tests need a build (`pnpm build`) or running dev server, plus `core/.env.test.local` (copy `core/.env.test.example`). `.env.local` is merged in first, then overridden by `.env.test.local`. See `core/tests/README.md`.

## Required environment

All env vars live in `.env.local` at the repo root (Turbo loads it via `dotenv-cli`; `turbo.json` lists `.env.local` as a global dependency). See `.env.example` for upstream Catalyst vars. **Additional vars required by this fork:**

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN`

Without these, `pnpm generate` will produce an empty Contentful schema and Contentful-backed components will fail at runtime.

## File Removal - Protected Paths

When creating a clean orphan branch, the following additional file paths should be protected from removal:

* `.env.local`

## Framework Install Command

The base framework is Catalyst. Clone Catalyst from GitHub:

```
git clone git@github.com:bigcommerce/catalyst.git --branch @bigcommerce/catalyst-makeswift@<version>
```

After re-installing the framework, make sure an appropriate version of Node.js is installed according to `.nvmrc` and use `pnpm install` to install dependencies.

## Architecture

### Two GraphQL clients, two schemas

The codebase talks to **two** GraphQL APIs and treats them symmetrically:

- BigCommerce Storefront API — client at `core/client/`, schema `core/bigcommerce.graphql`, `gql.tada` types in `core/bigcommerce-graphql.d.ts`.
- Contentful Content API — client at `core/lib/contentful/client/` (`contentfulFetch`, `contentfulGraphql`), schema `core/contentful.graphql`, types in `core/contentful-graphql.d.ts`. Queries colocated under `core/lib/contentful/client/queries/`.

Both are configured in `core/tsconfig.json` under `@0no-co/graphqlsp` so editor tooling validates queries against the right schema. When adding queries, place them next to existing ones so `graphql.config.json` and the generate script can find them.

### Next.js App Router structure

`core/app/[locale]/` — every route is locale-prefixed; locales come from `core/i18n/`. The `(default)` route group holds the storefront pages (home, product, category, cart, checkout, account, blog, webpages, etc.). The `[...rest]` catch-all is what resolves arbitrary BigCommerce URL paths (categories, brands, products) via the `withRoutes` proxy.

`core/proxy.ts` composes a pipeline: `withAuth → withMakeswift → withIntl → withAnalyticsCookies → withChannelId → withRoutes`. Each proxy lives under `core/proxies/`; if you add one, register it in `proxy.ts` and consider its order — auth and Makeswift must run before locale/route resolution.

### Path aliases

- `~/*` → `core/*` (project root inside the app)
- `@/vibes/*` → `core/vibes/*` (Catalyst's "Vibes" UI primitives — Streamable/Stream, skeletons, primitives. Prefer composing with these when adding UI.)

### Makeswift integration

Visual editor wiring lives in `core/lib/makeswift/`. Built-in Makeswift components register via `core/lib/makeswift/components.ts`, which also imports the **fork-specific** registrations:

- `~/components/custom/image-compare-slider/register`
- `~/components/custom/product-faqs/register`
- `~/components/custom/team-members/register`

Any new Makeswift-editable component must add its `register.tsx` import to `components.ts` or it won't appear in the builder.

### Contentful content surfaces

Banner/CMS content is fetched per page type, keyed by content type + slug:

- Home: type `home`, slug `home`
- Category: type `category`, slug = category path
- Product: type `product`, slug = product SKU

The renderer is `core/components/custom/contenful/` (note: directory is misspelled `contenful`). `cms-content.tsx` streams blocks via Vibes' `Streamable`/`Stream`; individual block renderers (banner, image, rich-text, simple-text) live alongside.

### Product FAQs

Loaded from BigCommerce product metafields, not Contentful:

- `namespace`: `FAQ|<locale>` (e.g. `FAQ|en`)
- `permission`: `read_and_sf_access`
- `value`: JSON `{ "question": "...", "answer": "..." }`

Code at `core/components/custom/product-faqs/`.

## Conventions

- TypeScript everywhere; `strict` and `noUncheckedIndexedAccess` are enabled — keep nullish/array-index access defensive.
- ESLint config comes from `@bigcommerce/eslint-config-catalyst` (workspace package). Lint depends on `^build` in `turbo.json`, so the workspace must be built before lint runs cleanly.
- Pre-existing files use 2-space indent, double quotes, semicolons, trailing commas — match the surrounding file.
- Prefer existing Vibes primitives (`@/vibes/soul/...`) over hand-rolled UI.
