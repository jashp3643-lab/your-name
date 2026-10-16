# Test results

Command: `npx playwright test` against the static preview (`E2E_TARGET=preview`), Chromium, 393×852. Run date 2026-10-16.

**Result: 25 passed, 0 failed (≈60 s), re-run after the login/home/deposits redesign.**

Covered: MPIN 250219 login; wrong MPIN; 5-attempt lockout; auth guard; logout; tile mask/reveal; story sheet + Esc; UPI activation; transactions loading/list/month bands; search + empty state; duration, filter, sort, statement sheets; spend analysis; deposits spinner → FD row; FD details + .txt download; nominee view/edit validation/save; transfer methods, amount validation, wrong PIN, successful transfer with balance/ledger change, new-beneficiary validation; settings reset; 12 secondary screens with zero console errors.

Fixed during testing: sheets rendered under the tab bar; favicon 404 console error; statement test needed a period selected (test bug, not app bug).

## Not verified
- **`next build` / `next dev` were never run**: the npm registry was blocked (policy 403, not bypassed), so Next is not installed here. The same source is compiled by an esbuild harness with stand-ins for `next/link` and `next/navigation`. Expect possible small Next-specific fixes.
- Tests were run only on the preview target, only in Chromium (no real iOS Safari).
- No automated accessibility audit; keyboard/Esc/focus handling tested only where listed.
- Only ~212 of 1651 video frames (~13 %) were inspected.
