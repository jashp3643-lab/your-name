# Uncertainties

Things the footage does not settle, and what the implementation did instead. IDs are stable.

| ID | Uncertainty | Impact | Decision / status |
| --- | --- | --- | --- |
| U-01 | **Next.js could not be installed or built** in this workspace: the npm registry returns a 403 policy denial. | the requested stack is unverified at the Next-specific layer | source is written as a Next.js App Router project. It was verified by bundling the same source with esbuild plus small stand-ins for `next/link` and `next/navigation`. Root layout, `next.config.mjs` and `package.json` are unverified. **Open.** |
| U-02 | Which control opened the Duration sheet (the dropdown label is the likely trigger, but a finger covers it) | interaction | "Recent Transfers ⌄" dropdown opens it |
| U-03 | Dim scrim with ring right after the Home to Transactions cross-fade (about 6 frames) | motion fidelity | not reproduced (may be camera exposure) |
| U-04 | Ghost frame at 3.5 s on Home (scroll to top? tab re-select?) | minor | not reproduced |
| U-05 | Credit arrow color, and whether credits use a different amount color | row styling | debit arrow red, credit arrow green; amounts stay dark |
| U-06 | Second link on the Loans tile is truncated ("Mana…") | copy | "Manage" |
| U-07 | Content of Lifestyle, Rewards, Fund Transfer, Bills and Cash tabs; Spend Analysis; Filter; Sort; Request Statement; Custom Date Range; Edit Nominee; Open New Deposit; Loans; Favorites; Insurance; Investments; Notifications | many screens | implemented as plausible original screens, labelled assumptions in `screen-specifications.md` |
| U-08 | Exact font family and weights | typography | system font stack |
| U-09 | Exact colors (video is exposure- and glare-affected) | color fidelity | estimated and normalized; tuned by eye in the comparison phase |
| U-10 | Exact dimensions (hand tilt ±8%) | layout fidelity | estimated; tuned in comparison |
| U-11 | Easing curves | motion | chosen, not measured |
| U-12 | Whether the greeting row also hides on scroll | layout | kept fixed (it stayed visible in 1.5–3.0 s frames) |
| U-13 | Number formatting: tiles show whole rupees when revealed ("₹2,334", "₹60,000"), other screens show two decimals | formatting | implemented as seen |
| U-14 | Login and fund-transfer screens are **not in the video**; they come from the design boards, whose visual language differs from the video | consistency | login follows the boards; transfer content follows the boards but uses the video's inner-screen chrome |
| U-15 | The user's earlier text mentions "improve my existing application", but no project files were provided | scope | built a new project |
| U-16 | iPhone status bar: real devices draw their own; the video includes one | fidelity | simulated only inside the wide-screen device frame |
| U-17 | Transfer limits, charges and IFSC rules | validation | configurable constants (₹25,000 limit; ₹2.65 charge to other banks); demo IFSC directory |
| U-18 | Real authentication and security | security | none. The default MPIN and transfer PIN `250219` are plain constants in client code (demo only, as requested). |
