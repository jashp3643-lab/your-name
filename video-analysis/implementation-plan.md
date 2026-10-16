# Implementation plan

Status legend: ☐ not started, ◐ in progress, ☑ done and checked. This file is updated as work proceeds (see the bottom).

## Decisions

| Topic | Decision | Reason |
| --- | --- | --- |
| Framework | **Next.js App Router, JavaScript**, project in `app/` | requested stack. No existing project was provided. JavaScript because `@types/*` could not be installed to type-check TypeScript. |
| Dependencies | `next`, `react`, `react-dom` only (runtime). `@playwright/test` (dev). | none added beyond the stack |
| Styling | plain CSS files with CSS variables (`tokens.css`, `base.css`, `components.css`, `screens.css`) | brief asks for CSS variables and no extra libraries |
| State | one React context store with a reducer, persisted to `localStorage`; auth in `sessionStorage` | the video shows no backend; local persistence is real, not faked |
| Routing | one route per screen (`src/app/...`), shared `(app)` layout with bottom nav | persistent tab bar, real back navigation |
| Verification path | `next build` **cannot run here** (registry blocked). The same source is bundled with esbuild using small stand-ins for `next/link`, `next/navigation` (`tools/harness`) and tested with Playwright. | see `uncertainties.md` U-01 |
| Brand | original name "DemoBank", original logo mark, original copy, illustrations drawn as simple SVG | no proprietary assets |
| Data | synthetic customer "Aarav Mehta"; numbers differ from the video | the video appears to show a real person's data |
| Default credentials | MPIN, username password and transfer PIN default to `250219` (user request), in `src/lib/config.js` | demo only; the code is visible in the browser |

## File structure

```
app/
  package.json  next.config.mjs  jsconfig.json  README.md  playwright.config.js
  src/
    app/
      layout.jsx                   root layout (html/body, providers, device frame)
      globals.css                  imports the style files
      page.jsx                     redirect to /home or /login
      login/page.jsx               S01 + S02
      (app)/layout.jsx             auth guard, bottom nav, screen transition
      (app)/home/page.jsx          S05
      (app)/transactions/page.jsx  S12-S18
      (app)/deposits/page.jsx      S24
      (app)/deposits/[id]/page.jsx S25
      (app)/deposits/[id]/nominee/page.jsx  S26
      (app)/transfer/...           S19-S23
      (app)/loans, favorites, insurance, investments, scan, notifications, search, services, settings, accounts  stubs
    components/                    UI components (see component-inventory.md)
    lib/                           config, format, seed data, store, selectors, validation
    styles/                        tokens.css base.css components.css screens.css
  tests/e2e/                       Playwright tests
  tools/harness/                   esbuild-based verification build (not used by Next)
```

## Build order

1. ☐ Foundation: tokens, base CSS, device frame, store, seed data, formatters.
2. ☐ Shared components: icons, buttons, fields, tabs, sheet, toast, spinner, skeleton, bars.
3. ☐ Login (S01, S02) with lockout.
4. ☐ Home (S05) with sticky tabs, tiles, reveal toggles, sections.
5. ☐ Transactions (S12, S13, S15–S18).
6. ☐ Deposits, FD Details, Nominee (S24–S26) with edit.
7. ☐ Fund transfer (S19–S23) updating the ledger.
8. ☐ Stubs and secondary screens.
9. ☐ Motion polish: transitions, spinner, sheet.
10. ☐ Screenshot comparison cycles, fixes.
11. ☐ Playwright tests, console-error check.
12. ☐ Documentation, zip.

## Progress log

- Styles, components, 30+ routes written.
- esbuild harness builds 24 routes; fixed unescaped route regex.
- Playwright: 24/24 pass; fixed sheet stacking (portal to device root) and favicon 404.
- Side-by-side comparisons done for 6 screens (visual-comparison-report.md).
- Not done: real `next build` (registry blocked), Safari/iOS testing.
