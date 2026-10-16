# Component inventory

Source tags: **[V]** video, **[B]** boards, **[A]** assumed. "Screens" use the IDs in `screen-specifications.md`.

| Component | Variants and states | Screens | Source |
| --- | --- | --- | --- |
| DeviceFrame | phone-width column; on wide viewports a centered 393 px device with simulated status bar | all | [A] |
| StatusBar (simulated) | time, signal, Wi-Fi, battery | all (wide viewports only) | [V] |
| ScreenTransition | 150 ms cross-fade on route change | all | [V] |
| TopBar | home variant (avatar + greeting + 3 icons); inner variant (back, title, 0–2 icons); with unread dot on bell | S05, S12, S24, S25, S26 | [V] |
| Avatar | initials circle | S05 | [V] |
| StoryChip / StoryRow | circular image with ring and label; horizontal scroll | S05 | [V] |
| TabStrip | underline tabs; selected = dark + short underline; used for Banking/Lifestyle/Rewards, UPI/Fund Transfer/Bills/Cash, Transaction Details/Spend Analysis; sticky variant | S05, S12 | [V] |
| AccountTile | magenta / indigo / blue gradients; eyebrow with count; eye toggle; value masked or revealed; refresh button (Accounts); two underlined links | S05 | [V] |
| TileCarousel | scroll-snap, peeking next tile | S05 | [V] |
| MaskedValue + EyeToggle | masked "XXXX.XX" vs real value; open/crossed eye | S05, S12, S24, S25, S26 | [V] |
| PromoStrip | icon, text, chevron, pager bar | S05 | [V] |
| ShortcutGrid | 4 icon items with two-line labels; section title with "View All" link | S05 (UPI Payments, Investments) | [V] |
| ShortcutGrid (4-up quick actions) | Quick actions / Bills | S05, S08 | [B] |
| UpiStrip | red dot, text, link | S05 | [V] |
| PromoBanner | gradient with illustration | S05 (Personal Finance Manager), S24 | [V] |
| BottomNav | 5 items, selected state, raised center QR button | S05, S30–S32 | [V] |
| AccountSelector | card: icon, masked number + eye, type, available balance, chevron; opens a list sheet | S12, S26 | [V] |
| SearchField + IconButtons | magnifier input, funnel, sort | S12 | [V] |
| FilterRow | dropdown label with chevron and outlined pill | S12 | [V] |
| TransactionList / GroupBand / TransactionRow | channel tag, description, date, amount with direction arrow, running balance; credit and debit variants; truncation | S12 | [V] |
| Spinner | thin ring, 24 px, indeterminate arc | S12, S24, S25, S26 | [V] |
| BottomSheet | blue "Duration" style with title and close; generic list inside; overlay dim; focus trap, Esc, drag-free | S13, S15, S16, S18, account list | [V] / [A] |
| OptionList | single-select rows with divider and check circle | S13, S16 | [V] |
| SummaryPanel | indigo panel with eyebrow, large value, info icon, 2 pill buttons | S24 | [V] |
| PillButton | translucent on dark; outlined on light | S24, S12 | [V] |
| FdRowCard | title, masked number, value, chevron, footer pair | S24 | [V] |
| InfoBanner | ⓘ icon + message | S25 | [V] |
| StatTile | label above value, 2×2 | S25 | [V] |
| KeyValueGrid / KeyValue | label above value, dotted underline, 1 or 2 columns, masked variant | S25, S26 | [V] |
| IconActionRow | 4 small icons (info, statement, mail, download) | S25 | [V] |
| SectionHeader | heading on light band, optional link | S25, S26 | [V] |
| StickyCta | pinned primary button above safe area | S25 | [V] |
| TextLink | underlined | S25, S05 | [V] |
| OutlineButton | full-width outlined pill | S26 | [V] |
| PrimaryButton | filled indigo or gradient, 48 px, loading and disabled states | S01, S02, S20–S22 | [V]/[B] |
| TextField | label, placeholder, helper, error, focused, disabled, mandatory mark | S02, S20, S21, S26 edit | [B] |
| PinBoxes | 6 boxes, masked dots, shake on error | S01, S22 | [B] |
| SegmentedToggle | within bank / other bank | S20 | [B] |
| Select (sheet-backed) | purpose, account, relationship | S21, S26 edit | [B] |
| Checkbox | test amount | S21 | [B] |
| ConfirmDialog | logout confirmation, discard changes | S36, S20 | [A] |
| Toast | success / error / info, auto-dismiss | all | [A] |
| Skeleton | shimmer blocks for tiles and rows | S05, S12 | [A] |
| EmptyState | illustration glyph, title, hint | S12, S24, S30, S34 | [A] |
| SuccessSummary | status, amount, words, key-values, two buttons | S23 | [B] |
| ErrorBoundary / NotFound | fallback pages | all | [A] |
