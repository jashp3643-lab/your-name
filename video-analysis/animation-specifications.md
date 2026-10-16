# Animation specifications

Timing comes from counting frames at about 30 fps (1 frame ≈ 33 ms). Phone-camera motion blur and 30 fps sampling make each value accurate to about ±1–2 frames (±50 ms). Easing curves cannot be measured from this footage, so they are **chosen** and labelled as such.

| Motion | Observed | Evidence | Implementation (chosen) |
| --- | --- | --- | --- |
| Screen change (Home to Transactions) | Cross-fade with both screens visible for about 4–5 frames | dense burst 11.70–11.83 s (#351–#355) | route change fades the new screen in over **150 ms**, linear-ish ease-out; no slide, no push offset |
| Loading dim scrim | A grey scrim with a thin ring appears for about 6 frames right after the cross-fade, then clears | #355–#359 | **Not reproduced** as a scrim; uncertain whether it is an app overlay or camera exposure (see `uncertainties.md`) |
| Page spinner | Thin dark-indigo ring about 24 px. The arc starts as a dot, grows to about 3/4 of a ring and rotates. | #1077–#1093 | CSS `@keyframes` indeterminate arc, 1.4 s loop |
| Spinner duration (mock latency) | Transactions about 0.5 s (12.0–12.4 s); Deposits about 1.4 s (35.0–36.4 s); FD Details under 0.5 s; Nominee under 0.5 s | inventory | mock delays 500 / 1,200 / 450 / 450 ms |
| Content fade-in after spinner | about 4 frames from 0 to full opacity | #1094–#1098 | opacity 0 → 1 over **130 ms** |
| Bottom sheet open | Sheet moves from fully off-screen to rest in about 6 frames; page behind dims during the same frames | #476–#482 | translateY(100%) → 0 over **220 ms**, `cubic-bezier(.2,0,0,1)`; overlay opacity 0 → .45 over the same time |
| Bottom sheet close | about 5–6 frames | #522–#527 | translateY(0) → 100% over **200 ms**, `cubic-bezier(.4,0,1,1)` |
| List refresh after choosing an option | Sheet closes; list area blank for about 6 frames; rows fade in over about 10 frames | #527–#541 | clear list, 250 ms wait, fade-in 300 ms |
| Balance reveal toggle | Value and count change between two 0.5 s samples; no intermediate frame seen | sampled only | instant swap with a 100 ms cross-fade on the text |
| Tile carousel swipe | Smooth horizontal movement with snap to tile edges | 28.0–29.5 s samples | native `scroll-snap-type: x mandatory`, `scroll-behavior: smooth` |
| Home vertical scroll | Native momentum scroll; header and tab row fixed | 1.5–3.0 s | `position: sticky` for tabs, fixed header |
| Home scroll back to top | Ghost/blend frame at 3.5 s | sample #105 | none (instant) |
| Button press | Not observable | – | 80 ms scale .98 and darken [A] |
| Wrong PIN shake | Not in the video | boards imply PIN boxes | 6-step shake over 350 ms [A] |
| Toast | Not in the video | – | slide-up 200 ms, auto-dismiss 2.8 s [A] |
| Reduced motion | – | – | `prefers-reduced-motion: reduce` disables transitions and the spinner rotation is replaced by a pulsing ring [A] |

CSS variables: `--dur-fade: 150ms`, `--dur-fade-content: 130ms`, `--dur-sheet-in: 220ms`, `--dur-sheet-out: 200ms`, `--ease-sheet-in: cubic-bezier(.2,0,0,1)`, `--ease-sheet-out: cubic-bezier(.4,0,1,1)`.
