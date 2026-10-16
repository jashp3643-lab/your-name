# Visual comparison report

Method: the replica was rendered in Chromium at 393×852 (DPR 2) and placed beside the matching reference video frame (`comparisons/*.png`, left = video, right = replica). The video is a phone filmed by a second camera (perspective, glare, exposure), so **pixel diffing is meaningless and no "pixel-perfect" claim is made**. Comparison is by eye on layout, spacing, hierarchy, colour family and motion.

| Screen | Reference frame | Result | Main remaining differences |
|---|---|---|---|
| Home | f_000 | Close: header, story row, tabs, magenta/indigo tiles, promo strip, payments tabs, tab bar with raised Scan QR | Story images are generic gradient icons (reference uses photos, not reproduced on purpose). Reference shows 3rd tab "Yono Cash"; replica says "Cash". Font is a system sans, not the original. |
| Transactions | f_028 | Close: account selector, search + filter/sort, "Recent Transfers" drop-down, Request Statement pill, month band, rows with arrows and balances | Row icon/typography estimated; spacing within ~2–4 px by eye. |
| Duration sheet | f_032 | Close: blue sheet, five options, tick on selected, close button | Gradient shade of the blue differs slightly. |
| Deposits | f_074 | Structure matches: hero with value, Requests/Open New Deposit, FD card, linked-account banner | Reference lower card has a grey backdrop and rounded container; replica uses a plain white sheet. Banner artwork is original, not the reference illustration. |
| FD details | f_080 | Close: lien banner, 4 stat tiles, Overview with icons, dashed key/value grid, sticky CTA | Values differ because data is synthetic and derived from dates (labelled demo). |
| Manage Nominee | f_108 | Close: account select, mode/type, nominee row, Edit Nominee | Reference has dimmer scrim at capture moment (U-03). |

Correction cycle done: z-order bug found by tests (tab bar/FAB sat above sheets) fixed by mounting sheets/dialogs on the device root.

Not compared: Login and Fund Transfer (no video frames; built from the design boards), motion curves (timings taken from 30 fps bursts, not overlaid).
