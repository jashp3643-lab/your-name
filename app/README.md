# DemoBank: web replica of a mobile banking app video

Next.js (App Router) + React, plain CSS. **All data is synthetic and stored in the browser; there is no backend.** Original name/branding; not affiliated with any bank.

## Run
```
npm install
npm run dev          # http://localhost:3000  (Next.js, NOT verified in the build sandbox)
```
No-install static preview (already built in `preview/`):
```
npm run preview:serve   # http://localhost:4173/#/login
```
Rebuild preview: `npm run preview:build` (needs esbuild).

## Demo credentials
MPIN **250219** (user-requested demo default, visible in client code; override with `NEXT_PUBLIC_DEMO_PIN`). Username mode: `demo.user` with password = same demo value. Transaction PIN for transfers is the same MPIN.

## Tests
`npm run test:e2e` (preview target) or `E2E_TARGET=next npm run test:e2e`. 25 tests pass on the preview.

## Notes
Layout targets iPhone 14 Pro (393×852); on wider screens it shows a simulated device. Reset data from Settings. Docs: `../video-analysis/`.
