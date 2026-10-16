# Recon map: mobile banking app (Yono-style demo)

Tags used throughout: **[O-B]** observed in the design boards, **[O-V]** observed in the screen recording, **[A]** assumption or inference, **[?]** unknown and needs a decision or more evidence.

## 0. Rules for this clone

- This is a clean-room rebuild of functionality and UX patterns. No logos, bank name, wordmarks, illustrations, promo copy or source code are reused. The clone needs its own name, palette, icon set and copy. Placeholder: **"DemoBank"** [A].
- It is a **dummy app**. There is no real money movement, no real authentication and no real bank integration. Every "bank" interaction is a local simulation, and the UI should say so (a "Demo mode" label).
- The recording shows what appears to be a real person's name, masked account tails, a nominee name and FD figures. Do not reuse any of it. All seed data must be synthetic.
- Screenshots in `replica/screens/` are reference only and never ship.

## 1. Scope (proposed, since no answer was given)

| Question | Proposed answer |
| --- | --- |
| App / platform | Mobile banking app, iOS look, built as a mobile web app (HTML/CSS/JS). Target viewport iPhone 14 Pro, 393×852 pt, and it must stay responsive on narrower and wider screens. |
| Slice | Core loop: **log in, see balance, check transactions, send money**. Second slice: **deposits (FD details, nominee)**. Everything else is a navigable stub. |
| Who it is for | A portfolio or demo project, not a commercial product [A]. |

## 2. Sources

No web research was done. Everything below comes from the user's attachments. There are no URLs because none were consulted.

| Source | What it gives | Reliability |
| --- | --- | --- |
| `replica/screens/board-1-before-after.webp` | Before/after of 4 flows (Login, Home, Passbook, Fund Transfer) with the designer's rationale notes | High for layout and intent. It is a **redesign concept**, not the shipping app. |
| `replica/screens/board-2-wireframes-final.webp` | 9 grayscale wireframes and about 12 final frames, including Services, UPI, Cards, Transfer steps and success | High for screens and component layout. Frames are small and some text is illegible. |
| Screen recording, 55 s, 480×854, filmed off a phone | A live walkthrough of Home, Transactions, the Duration sheet, Deposits, FD Details and Manage Nominee | High for flow and content. Low resolution, glare, a finger often covers the screen, and no taps are visible on forms. |
| Not consulted: help center, app store listing, changelog, public API docs | Would fill in validation rules, limits, error copy and the full feature list | Recommended before implementation (see §10). |

**Important:** the boards and the video show **two different visual designs** (see §10, U1). The boards use a magenta-to-purple gradient header with a card-style balance panel. The video shows a lighter home screen with story chips, tabs and a horizontal carousel of account tiles.

## 3. Screen inventory

Columns: ID, screen, how you get there, purpose, key components, states seen. Source tags are in the last column.

| ID | Screen | Route / entry | Purpose | Key components | States seen / source |
| --- | --- | --- | --- | --- | --- |
| S01 | Login: MPIN | App launch | Fast sign-in with a 6-digit MPIN | Welcome-name line, 6 digit boxes (dashes), "Forgot MPIN?", "or" divider, "Login with Username" button, View Balance card, floating Quick Pay button | Default [O-B]. Error, locked and loading not seen. |
| S02 | Login: username and password | S01 > "Login with Username" | Credential sign-in | Username field, password field, Forgot username/password link, Login button, MPIN alternative | Seen only in the *before* frame [O-B]. |
| S03 | Pre-login balance peek | S01 > View Balance card | See balance without signing in | Collapsed card, "View balance, recent transactions" caption | Collapsed only [O-B]. Expanded state [?]. |
| S04 | Quick Pay (pre-login) | Floating button on S01 | Quick payment without full login | Floating circular button with QR glyph | Button only [O-B]. Screen [?]. |
| S05 | Home: Banking tab | After login. Bottom nav "Home" in the video, "Banking" in the boards | Account overview and shortcuts | See S05 details below | Default [O-B, O-V], loading [?] |
| S06 | Home: Lifestyle tab | S05 tab | Lifestyle offers | Tab label only | [O-V] label only. Content [?]. |
| S07 | Home: Rewards tab | S05 tab | Rewards | Tab label only | [O-V] label only. Content [?]. |
| S08 | Services | Bottom nav "Services" [O-B] | Recharge & Bills, Travel & Bookings | Home header, grouped icon grid (Prepaid, Postpaid, DTH, Landline, Gas, Electricity, Water, FASTag, Credit Card), section "Travel & Bookings" | Default [O-B] |
| S09 | Scan & Pay / UPI hub | Bottom nav "Scan & Pay" [O-B] | UPI actions | Section "UPI" with Register, Scan QR, Pay Mobile Contact, Approve Requests, Request Money | Default [O-B] |
| S10 | Cards | Bottom nav "Cards" [O-B] | Card display and card services | Debit card visual (masked number, expiry), icon grid: Manage Debit Card, Debit Card Request, Block Debit Card, Set Card PIN, Apply for Credit Card, Virtual Debit Card, Link Card, Do-nots, promo banner | Default [O-B] |
| S11 | Settings | Bottom nav "Settings" [O-B] | App settings | Nav label only | Content [?] |
| S12 | Transactions / Passbook: Transaction Details | Home "Transactions" link [O-V], bottom nav [O-B] | List and search transactions | Back arrow, title, bell and headset icons, 2 tabs, account selector with eye toggle, search box, filter icon, sort icon, "Recent Transfers" dropdown, "Request Statement" pill, month-grouped list (board: day-grouped), row = channel tag, description, date, amount with direction arrow, running balance | Filled [O-B, O-V]. Empty, loading, error, end of list [?]. |
| S13 | Duration sheet | S12 > "Recent Transfers" dropdown | Pick a time window | Bottom sheet with title, close X, 5 single-select options, check on selected | [O-V] options: Recent Transfers (Last 20 transactions) (selected), Current Month, Last Month, Last 3 Months, Custom Date Range |
| S14 | Custom date range | S13 > Custom Date Range | Free date window | Date pickers [A] | [?] not seen |
| S15 | Transaction filter | S12 > filter icon | Filter by type, amount [A] | [?] | Icon only [O-V] |
| S16 | Sort | S12 > sort icon (board: "Sort By" chip) | Order list | [?] | Icon and chip only [O-B, O-V] |
| S17 | Spend Analysis | S12 second tab | Spending breakdown | Tab label only | [O-V]. Content [?]. |
| S18 | Request Statement | S12 pill | Request account statement | Pill only | [O-V]. Flow [?]. |
| S19 | Transfer: method list | Home Payments & Transfers "Fund Transfer" [O-V] / Banking Services "Bank Transfer" [O-B] | Pick transfer type | Header "Bank Transfer", rows: Quick Transfer (to ₹50,000 [A, text small]), Bank Account (other account), My account (own, linked), Mobile Money Identifier transfer | Default [O-B] |
| S20 | Transfer: beneficiary form | S19 > row | Collect payee details | Sub-tabs "To within bank / To other bank", Beneficiary Name, Account Number, Confirm Account Number, IFSC Code (with search), Nickname, "Proceed to pay", mandatory marker | Default [O-B]. Validation messages [?]. |
| S21 | Transfer: amount and purpose | S20 > Proceed | Amount, source account, purpose | Payee chip (name, "Bank account number"), amount field, limit line "Max ₹25,000", Select Account dropdown (with balance), Select a purpose, "Send ₹1 as a test amount" checkbox, "Proceed to pay" | Default [O-B]. Text small, exact copy [?]. |
| S22 | Transfer: authorize | S21 > Proceed | Enter 6-digit transaction PIN, confirm amount | Payee chip, 6 PIN boxes, From account, Mode of transfer (IMPS), Transaction charges (₹2.65 shown), Amount and "Amount in words", "Proceed to pay" | Default [O-B] |
| S23 | Transfer: success | S22 > confirm | Show outcome | "Successful" label, amount, amount in words, From, Mode, Charges, "Share Screenshot", "Back to Transfer" | Success [O-B]. Failure [?]. |
| S24 | Deposits overview | Home Deposits tile > "View Details" [O-V] | See all deposits | Back, overflow menu, purple summary panel ("Combined current value" + info icon), "Requests" and "Open New Deposit" buttons, "Fixed Deposits (01)" list card, FD row (type, masked acc no with eye, amount, maturity date, ROI), linked-savings promo banner | Filled [O-V]. Empty (0 FDs) [?]. A blank white loading frame was seen first [O-V]. |
| S25 | Fixed Deposit Details | S24 > FD row | Full FD record | Back, lien/hold info banner, 4 summary tiles (Current Value, Rate of Interest, Maturity Amount, Maturity Date), "Overview" with 4 action icons (info, statement, mail, download), field grid, "Interest & Maturity Details", "Nominee Details" > "View Nominee Details" link, "OD against deposit", pinned "View Loan details" button | Filled [O-V]. Lien-banner shown (conditional [A]). |
| S26 | Manage Nominee | S25 > View Nominee Details | View and edit nominee | Selected Account dropdown (FD no., product), Mode of operation, Type of nomination, "Nominee details" list (name, share %), outline "Edit Nominee" button | View [O-V]. Edit form [?]. |
| S27 | Open New Deposit | S24 button | Create FD | [?] | Button only [O-V] |
| S28 | Deposit Requests | S24 button | Pending requests | [?] | Button only [O-V] |
| S29 | Loans / Loan details | Home Loans tile, S25 CTA | Loan summary | Loans tile "Total outstanding" | Tile [O-V]. Screen [?]. |
| S30 | Favorites | Bottom nav (video) | Saved payees and actions [A] | [?] | Nav label only [O-V] |
| S31 | Insurance | Bottom nav (video) | Insurance products [A] | [?] | Nav label only [O-V] |
| S32 | Investments | Bottom nav (video) | Investment products [A] | [?] | Nav label only [O-V] |
| S33 | Scan QR | Center floating nav button (video) | UPI QR scan | Camera [A] | Button only [O-V] |
| S34 | Notifications | Bell icon | Alerts | [?] | Icon only [O-V] |
| S35 | Search | Magnifier in home header | Search features [A] | [?] | Icon only [O-V] |
| S36 | Logout | Exit icon in home header | Sign out | [?] | Icon only [O-V] |

**S05 Home details**
- Redesign, boards [O-B]: gradient header with logo, avatar and menu icon. Balance card with "Welcome, <name>", masked account number, a hide/show eye, and balance. Below: "Quick Actions" (Scan & Pay, Yono Cash, Pay Contact, Request), then "Banking Services" (Bank Transfer, Passbook, Investment, Loans, Insurance, Cheques, Cardless, ATM Locator). Bottom nav: Banking, Services, Scan & Pay, Cards, Settings.
- Video layout [O-V]: avatar with initials and greeting ("Hello <name>, Let's get started!"), search, bell and logout icons. A horizontal row of circular story chips (labels such as Fraud Awareness, e-Secure Lock, Sustainability, Be Covered). Tabs Banking, Lifestyle, Rewards. A horizontal carousel of tiles: Transaction Accounts (combined balance masked as ₹XXXX.XX, refresh icon, "View Accounts", "Transactions"), Deposits (combined deposit amount, "View Details", "Invest More"), Loans (total outstanding, "View Details"). Dismissible promo strip (credit card). "Payments & Transfers" with tabs UPI, Fund Transfer, Bills, Yono Cash and a UPI activation strip with "Activate UPI ID". Bottom nav: Home, Favorites, Scan QR (raised center button), Insurance, Investments. Balance is masked until a tap, after which a real figure appeared (₹2,334) [O-V].

## 4. Navigation structure

```
Launch
 └ S01 Login MPIN ⇄ S02 Login username/password
     ├ S03 View balance (pre-login) [A]
     └ S04 Quick Pay (pre-login) [?]
Authenticated shell (two nav variants, see U1)
 Variant B (boards): Banking | Services | Scan & Pay | Cards | Settings
 Variant V (video):  Home | Favorites | Scan QR (center) | Insurance | Investments
 Home (S05) ─ header: search, bell, logout
   ├ tabs: Banking | Lifestyle | Rewards
   ├ tiles: Transaction Accounts → S12 | Deposits → S24 | Loans → S29
   └ Payments & Transfers: UPI → S09 | Fund Transfer → S19 | Bills → S08 | Cash → [?]
 S12 Transactions ─ S13 duration, S15 filter, S16 sort, S17 spend analysis, S18 statement
 S19 Transfer ─ S20 → S21 → S22 → S23
 S24 Deposits ─ S25 FD details ─ S26 nominee, S29 loan
```

Back navigation is a top-left chevron on every pushed screen [O-V, O-B]. Tab bars sit at the bottom and stay visible on the transfer screens [O-B].

## 5. User flows

```
F01 Sign in with MPIN
    S01 -> enter 6 digits -> S05
    Clicks/taps: 6 digit entries (auto-submit [A]). Edge: wrong MPIN, lockout, forgot MPIN [?]

F02 Sign in with username
    S01 -> "Login with Username" -> S02 -> Login -> S05
    Edge: invalid credentials, empty fields [A]

F03 Check recent transactions
    S05 -> tile "Transactions" -> S12 (account preselected, Recent Transfers)
    Happy path: 1 tap from Home. [O-V]
    Edge: no transactions in the window, search with no match [A]

F04 Change the time window
    S12 -> "Recent Transfers" dropdown -> S13 -> pick option -> S12 refreshed
    Custom Date Range -> S14 -> apply [A]

F05 Find a transaction
    S12 -> search box (type) / filter icon / sort icon [O-V icons]

F06 Send money to a new beneficiary (quick transfer)
    S05 -> Fund Transfer -> S19 -> Quick Transfer -> S20 (name, account, confirm account, IFSC, nickname)
    -> S21 (amount, account, purpose, optional ₹1 test) -> S22 (6-digit PIN) -> S23 success
    Happy path: about 5 screens, 4 forms plus 1 PIN [O-B]
    Edge: account mismatch, invalid IFSC, over limit, insufficient balance, wrong PIN, timeout [A]

F07 Review a fixed deposit
    S05 -> Deposits tile "View Details" -> S24 -> FD row -> S25
    Happy path: 3 taps [O-V]. Scroll for Interest & Maturity, Nominee, OD.

F08 View or edit a nominee
    S25 -> "View Nominee Details" -> S26 -> "Edit Nominee" -> edit form [?]

F09 Hide or show balance
    Eye icon on home card, account selector, FD row [O-B, O-V]

F10 Open services (recharge, UPI, cards)
    Bottom nav -> S08 / S09 / S10 -> tap icon -> [?] destination
```

## 6. Components

| Component | Variants / states | Used on |
| --- | --- | --- |
| Top app bar | Large gradient header with logo [O-B]. Light header with back arrow, title, right icons [O-V]. | All |
| Bottom tab bar | 5 items, selected highlight. Center raised button in the video variant. | All authenticated screens |
| Balance card | Masked / revealed, refresh icon [O-V], eye toggle | S05, S12, S24, S25 |
| Story chip | Circular image with label, horizontal scroll | S05 |
| Tab strip | Underline style: Banking/Lifestyle/Rewards, Transaction Details/Spend Analysis, UPI/Fund Transfer/Bills/Cash | S05, S12 |
| Account tile carousel | Horizontal scroll with partial next tile, 3 color variants | S05 |
| Icon grid tile | Icon above label, 4 columns | S05, S08, S09, S10 |
| Segmented toggle | To within bank / To other bank | S20–S22 |
| Text field | Label, placeholder, mandatory marker, helper text, focused, error [A] | S02, S20, S21 |
| PIN / MPIN boxes | 6 boxes, filled dots [A] | S01, S22 |
| Dropdown / select | Account selector with avatar, name, balance, chevron | S12, S21, S26 |
| Bottom sheet | Title, close, single-select list with check | S13 |
| Search box with filter and sort icons | | S12 |
| Pill button | "Request Statement", "Requests", "Open New Deposit" | S12, S24 |
| Primary button | Full width, pill or rounded rectangle, filled dark, pinned bottom on S25 | Many |
| Secondary / outline button | "Edit Nominee" | S26 |
| Transaction row | Channel tag, description, date, amount + arrow, balance | S12 |
| List section header | Date group (month in video, day in boards) | S12 |
| Info banner | Icon + text, dismissible chevron variant on the promo strip | S25, S05 |
| Stat tile | Label above value, 2×2 grid | S25 |
| Key-value grid | Label above value, dotted underline | S25, S26 |
| Icon action row | Info, statement, mail, download | S25 |
| Checkbox | "Send ₹1 as a test amount" | S21 |
| Success summary | Status label, amount, amount in words, key-value rows, 2 buttons | S23 |
| Promo banner | Illustration + text | S24, S10 |
| Floating action button | Circular, QR glyph | S01, S05 |
| Toast / inline error | [?] none observed | – |

Interaction and animation observed in the video [O-V]: bottom-sheet slides up with a blue tinted overlay and the page behind dims. Screen pushes slide horizontally with a short cross-fade. Lists scroll vertically with the header fixed. Tiles scroll horizontally. A blank white screen showed briefly before the Deposits data appeared, which implies a loading state [A]. Exact durations and easing curves cannot be read from a 480p phone recording, so choose them in the design system.

## 7. Inferred data model

Confidence: H high, M medium, L low. Entities marked [A] are not directly shown but are required.

```
User (H)            id, display_name, initials, mobile, mpin_hash, username, password_hash, last_login_at
                    evidence: S01, S02, greeting on S05
Session (M) [A]     id, user_id, created_at, expires_at, method (mpin|password)
Account (H)         id, user_id, type (savings|current), masked_number, number, branch_id, balance, currency,
                    status, visible_balance_default
                    evidence: S12 selector, S05 tile
Transaction (H)     id, account_id, posted_at, channel (UPI|IMPS|NEFT|…), description, counterparty_ref,
                    amount, direction (debit|credit), balance_after
                    evidence: S12 rows (tag, description with truncated ref, date, amount, balance)
Beneficiary (H)     id, user_id, name, account_number, ifsc, bank_name, nickname, scope (within|other), created_at
                    evidence: S20 fields
Transfer (H)        id, from_account_id, beneficiary_id, amount, mode (IMPS…), charge, purpose, is_test,
                    status (pending|success|failed), created_at, reference
                    evidence: S21–S23
TransactionPin (M)  user_id, pin_hash, failed_count        evidence: S22 (6 boxes) [A on storage]
Branch / IFSC (M)   ifsc (pk), bank_name, branch_name, branch_code
                    evidence: IFSC search on S20, Branch + Branch Code on S25
Deposit (H)         id, user_id, linked_account_id, variant (Regular FD…), masked_number, principal, interest_amount,
                    current_value, maturity_amount, rate, start_date, maturity_date, duration (y/m/d), currency,
                    lien_amount, lien_marked, branch_id, ownership, payout (At Maturity|…),
                    maturity_instruction (Auto Renewal|…), od_available
                    evidence: S24, S25
Nominee (H)         id, deposit_id, name, share_pct, mode_of_operation, nomination_type (Simultaneous|…)
                    evidence: S26
Loan (L)            id, user_id, linked_deposit_id?, outstanding, …      evidence: tile + CTA only
Card (M)            id, account_id, masked_number, network, expiry, status (active|blocked), type (physical|virtual)
                    evidence: S10 visual
UpiProfile (L)      user_id, vpa, status                evidence: "Activate UPI ID" strip
Notification (L)    id, user_id, title, read          evidence: bell icon only
StatementRequest(L) id, account_id, from, to, format      evidence: pill only
Offer / Story (M)   id, title, image_ref, target         evidence: story chips, promo banners
```

Relationships: User 1–N Account, Account 1–N Transaction, User 1–N Beneficiary, Transfer N–1 Account and N–1 Beneficiary and 1–1 Transaction (debit row), User 1–N Deposit, Deposit 1–N Nominee, Deposit N–1 Account (link), Branch 1–N Account/Deposit, Account 1–N Card.

## 8. Loading, empty, success, validation, error states

| State | Observed | Needed for the clone [A] |
| --- | --- | --- |
| Loading | A blank white Deposits screen before data appeared [O-V] | Skeleton rows for lists, spinner on buttons, refresh icon on the balance tile (it is shown [O-V]) |
| Empty | None seen | No transactions in the window, no deposits, no beneficiaries, no search results |
| Success | Transfer success screen [O-B], masked-to-revealed balance | Toast for copy/share, confirmation after nominee edit |
| Validation | Mandatory marker on the form [O-B], "Confirm Account Number" field implies a match check, limit line "Max ₹25,000" | Inline errors: required, account mismatch, IFSC format (4 letters, 0, 6 alphanumerics), amount > limit, amount > balance, 6-digit PIN only |
| Error | None seen | Wrong MPIN or password, lockout after N tries, network failure with retry, transfer failed screen |
| Conditional notice | "This FD has lien/hold marked. You cannot modify/close this FD" [O-V] | Banner when `lien_marked` |
| Privacy | Eye toggles for balance and account numbers [O-B, O-V] | Default masked, remember per session |

## 9. Responsive behavior

- Observed: only a single phone size. The boards and video are portrait iPhone 14 Pro frames with Dynamic Island, so the status bar needs a safe-area inset at the top [O-B, O-V].
- Header stays fixed, content scrolls, and the primary CTA on S25 is pinned above the tab bar [O-V]. The carousel clips the next tile on the right to hint at scroll [O-V].
- Assumed: at widths under 360 px the icon grid drops from 4 to 3 columns. At tablet or desktop widths, render the app in a centered phone-width column (max-width about 430 px) with no layout reflow [A]. Respect `env(safe-area-inset-*)` and prefers-reduced-motion [A].

## 10. Uncertainties to resolve

| # | Question | Why it matters | How to resolve |
| --- | --- | --- | --- |
| U1 | **Which home design is the target: the boards' gradient card layout or the video's story-chip and tile-carousel layout?** The two cover overlapping screens (Home, Transactions) with different layouts and different bottom navs. | It decides the nav, home layout and Transactions list grouping (day vs month). | User decision. Proposed: boards = visual language for Login, Home, Passbook, Transfer. Video = content depth for Transactions, Deposits, FD, Nominee. Bottom nav follows the boards. |
| U2 | Exact copy, limits and charges on transfer screens (₹25,000 vs ₹50,000, ₹2.65 charge) | Validation rules | Board text is too small. Use configurable constants in the clone. |
| U3 | Behavior of filter, sort, spend analysis, request statement, custom date range | Core of the Transactions slice | Ask the user for a second recording or screens. |
| U4 | MPIN rules: auto-submit, lockout count, forgot flow | Login | Define our own rules. |
| U5 | Edit Nominee form fields and validation | F08 | Not visible. Design from nominee fields: name, share, relationship [A]. |
| U6 | Lifestyle and Rewards tab content | Home completeness | Stub with sample offers. |
| U7 | Open New Deposit, Requests, Loans, Cards actions | Scope | Stub screens, "coming soon" or simple forms. |
| U8 | Motion timings and easing | The user asked for "the same animation and ease" | Needs a higher-quality recording at 60 fps, or choose standard iOS-like curves. |
| U9 | The project to be improved | The earlier message said "improve my existing application", but this skill call says build a clone. No project files were attached. | Confirm whether an existing codebase exists. |
| U10 | Persistence and backend | Dummy data lives in localStorage or in an in-memory mock. | Decide at architecture time. |

## 11. What cannot be cloned

- The bank itself: real accounts, balances, UPI, IMPS/NEFT rails, IFSC directory and regulated KYC. This clone uses seed data and local simulation only.
- Branding, logo, illustrations, story and promo imagery, and the marketing copy.
- Real authentication, device binding, OTP and fraud checks. The clone has a demo PIN only.
- Regulated functions: real money movement, real statements, real FD creation and closure.

## 12. Size

| Item | Count |
| --- | --- |
| Screens fully designable from evidence | 14 (S01, S02, S05, S08, S09, S10, S12, S13, S19–S26) |
| Screens that are stubs or need decisions | about 22 |
| Flows | 10 (F01–F10), 6 detailed |
| Entities | 16 (12 high or medium confidence) |
| Hard parts | 1. Pixel-faithful gradient and card styling with iOS-like transitions. 2. Transfer flow with validation, PIN, success and failure states and a ledger that updates balance and transaction list consistently. 3. Bottom sheets, carousels and sticky headers behaving smoothly on a phone. |

**Size: M** (a few weeks) for core loop plus deposits at full polish. **S** (a weekend) for a clickable front end with hard-coded data on the Login, Home, Transactions and Transfer screens only.
