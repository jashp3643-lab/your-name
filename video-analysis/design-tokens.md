# Design tokens (estimated)

All values are **estimates** from a hand-filmed 480p video. Colors were median-sampled in boxes on clean frames and normalized against the white UI background of the same frame (to cancel camera exposure). Where a sample missed or was shadowed, the value was set by eye from the frames and is marked *eye*. Dimensions use the scale in `video-metadata.md` (about 1.1 CSS px per video px, ±8%).

## Colors

| Token | Value | Basis |
| --- | --- | --- |
| `--color-bg` | `#ffffff` | frame white reference |
| `--color-bg-soft` | `#f4f5f9` | promo strip sample `#f5f8fc` |
| `--color-band` | `#ececf1` | list group bands, eye |
| `--color-surface-tile` | `#e6e4ee` | FD stat tile sample (normalized `#e0dde7`) |
| `--color-banner` | `#dcdce6` | FD info banner (normalized `#d6d5dc`) |
| `--color-text` | `#1d1b2b` | eye |
| `--color-text-muted` | `#6b6a78` | eye |
| `--color-divider` | `#d9d8e0` | eye |
| `--color-brand-magenta` | `#98195a` (gradient to `#6c0f47`) | tile 1 sample `#8e1c4d` mid, `#77113e` top-left, `#45011c` shadowed bottom-right |
| `--color-brand-indigo` | `#3a2c96` (gradient to `#2a1a78`) | Deposits panel, tile 2 (samples `#2a125f`, `#140546` are shadowed) *eye* |
| `--color-brand-blue` | `#2d44d9` (gradient from `#3f5be8`) | Duration sheet *eye* (raw samples `#625f9a` top and `#141f7b` bottom, exposure-affected) |
| `--color-cta` | `#2a1c7e` | "View Loan details" button (sample `#140949` is shadowed) *eye* |
| `--color-fab` | `#2a2471` | QR button *eye* |
| `--color-link` | `#2b3fcf` | "View Nominee Details" *eye* |
| `--color-debit` | `#d4352f` | debit arrow *eye* |
| `--color-credit` | `#1f9d57` | credit arrow *eye* (small, could be dark grey) |
| `--color-danger-dot` | `#e0312b` | UPI strip dot |
| Login gradient | `#a3205c` to `#5a1a8f` to `#2a1263` | boards |
| Teal bank icon | `#12a8c7` | account selector icon *eye* |

## Typography

System UI stack (San Francisco on iOS). The video uses a clean geometric sans with semibold headings; exact family unknown.

| Token | Value |
| --- | --- |
| `--font-sans` | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| Greeting name | 16 / 20, 600 |
| Greeting subtext | 12 / 16, 400, muted |
| Screen title (top bar) | 17 / 22, 600 |
| Section title ("Payments & Transfers") | 16 / 22, 600 |
| Tab label | 14 / 20, 500 (selected 600, dark; unselected muted) |
| Tile eyebrow ("TRANSACTION ACCOUNTS (XX)") | 11 / 14, 600, uppercase, letter-spacing .04em |
| Tile value | 22 / 28, 700 |
| Body / row title | 13 / 18, 600 (uppercase description) |
| Caption | 11 / 14, 400 |
| Field label | 11 / 14, 400, muted; value 14 / 20, 500 |
| Button | 15 / 20, 600 |

## Spacing (4 px base)

`--space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px; --space-8: 32px`
Screen side padding 16 px. Tile gap 16 px. List row height about 72 px. Group band height about 32 px.

## Dimensions (estimated)

| Token | Value |
| --- | --- |
| Viewport (reference) | 393 × 852 |
| Status bar | 54 px |
| Greeting row | 56 px (avatar 40 px) |
| Story chip | 64 px diameter, label 11 px |
| Tab row | 44 px |
| Account tile | 245 × 178 px, radius 16 |
| Promo strip | 52 px high, radius 12 |
| Bottom tab bar | 64 px + safe area (34 px) |
| QR button | 56 px diameter, overlaps bar by 26 px |
| Top bar (inner screens) | 56 px |
| Primary button | 48 px high, fully rounded |
| Pill button (Requests, Request Statement) | 36–40 px high, fully rounded |
| Search input | 44 px high, radius 8, 1 px border |
| Stat tile | 160 × 64 px, radius 8 |
| Spinner | 24 px, stroke 2.5 px |

## Radii, borders, shadows

`--radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 24px; --radius-pill: 999px`
Borders: 1 px `--color-divider`; dotted underline (1 px) under FD key-value fields.
Shadows: bottom bar `0 -2px 12px rgba(20,16,60,.08)`; tiles `0 6px 16px rgba(60,20,90,.18)`; sheet `0 -8px 30px rgba(10,20,90,.35)`; FAB `0 6px 14px rgba(42,36,113,.45)`.

## Motion tokens (see `animation-specifications.md`)

`--ease-standard: cubic-bezier(.2,.0,.0,1)` (ease-out for sheets), `--dur-fast: 150ms`, `--dur-sheet: 220ms`, `--dur-fade: 150ms`.

## Z-index

`--z-header: 20; --z-tabs: 15; --z-nav: 30; --z-fab: 31; --z-overlay: 60; --z-sheet: 61; --z-dialog: 70; --z-toast: 80`

## Breakpoints

`--bp-phone: 430px` (below this the app fills the viewport; above, it renders in a centered 393 px device column). Reference viewport: 393 × 852.
