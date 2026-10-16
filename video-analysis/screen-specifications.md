# Screen specifications

Tags: **[V]** directly observed in the video, **[B]** observed in the design boards, **[A]** assumption or implementation decision. All measurements are estimates in CSS px at a 393 × 852 viewport (see `video-metadata.md` for the scale).

Global layout [V]: portrait phone, light theme, status bar (time, signal, Wi-Fi, battery) at the top, Dynamic Island cut-out, home-indicator safe area at the bottom. Every pushed screen has a back chevron at the top left, a title and 0–2 icons on the right. Screen changes are short cross-fades (about 150 ms), not slides.

## S01 Login: MPIN [B]
Gradient background from magenta at the top to deep violet at the bottom. Centered wordmark (original), line "Welcome, <first name>". White rounded card containing: key icon and label "Login with MPIN", six underlined digit boxes, "Forgot MPIN?" link aligned right, "or" divider, outlined button "Login with Username". Below the card, a collapsed "View balance" card with an eye icon. A circular floating "Quick Pay" button sits at the bottom right.
States [A]: empty, partially filled, verifying (box row disabled and spinner), wrong MPIN (shake animation and red helper text with attempts left), locked (30 s countdown), success (navigate to Home).
Default MPIN: `250219` (user-specified).

## S02 Login: username [B]
Same background and card. Fields: username, password (with show/hide). Primary "Login" button, link "Login using MPIN". Default password `250219`. Default username `demo.user` [A]. Validation: required fields, wrong credentials message, lockout shared with S01.

## S05 Home [V]
Fixed top area: status bar, then a greeting row: circular avatar with initials (about 40 px), "Hello <name>," in semibold, "Let's get started!" in secondary grey, and on the right three 22 px icons: search, bell, logout.
Scrolling body below:
1. **Story chips** [V]: a horizontal row of circular images (about 64 px) with a thin ring, labels below (Fraud Awareness, e-Secure Lock, Sustainability, Be Covered, and a fifth cut off at the edge). Scrolls horizontally. Scrolls out of view when the page scrolls.
2. **Tab row** [V]: Banking (selected, dark text with a short underline), Lifestyle, Rewards. **Sticky** under the greeting row once the stories scroll away.
3. **Tile carousel** [V]: horizontally scrolling tiles with snap, each about 245 × 180 px with 16 px gap and the next tile peeking.
   - Tile 1 (magenta gradient): "TRANSACTION ACCOUNTS (XX)" in small caps with an eye icon at the right of the title; "Combined Balance"; value "₹XXXX.XX"; a circular refresh icon at the right; underlined links "View Accounts" and "Transactions".
   - Tile 2 (indigo): "DEPOSITS (XX)", "Combined Deposit Amount", value, links "View Details", "Invest More".
   - Tile 3 (deep blue): "LOANS (XX)", "Total Outstanding Amount", value, links "View Details", "Manage" [text truncated in the video; assumed].
   - **Reveal behavior** [V]: each tile has its own eye toggle. Masked shows count "XX" and value "₹XXXX.XX". Revealed shows the real count ("01") and the value in whole rupees with thousands separators (e.g. "₹2,334", "₹60,000"), and the icon changes to a crossed eye. Reveal is per tile and not persisted visibly (it was masked again at 10.5 s).
4. **Promo strip** [V]: light grey rounded row, bell icon, text "You are just a few taps away from your CREDIT CARD. Apply Now!", chevron at the right. A small pager bar below it.
5. **Payments & Transfers** [V]: section title, then a tab row UPI (selected, short underline), Fund Transfer, Bills, Cash. Below the tabs, for the UPI tab, a strip with a red dot and "You haven't created a UPI ID" and a link "Activate UPI ID". [A] content of the other three tabs.
6. **UPI Payments** [V]: title with "View All" link at the right and four icon shortcuts with two-line labels: Pay to mobile or contact, Pay UPI ID or Number, Pay to Bank A/C, View Transaction.
7. **Investments** [V]: title and "View All"; four shortcuts: Mutual Fund, Demat & Securities, NPS, PPF. Then a dark purple banner "Personal Finance Manager >" with a small illustration on the right.
8. **Loans** [V]: section title and "View All" link; content below not shown [A: one OD-against-deposit loan row].
Fixed bottom: tab bar with Home, Favorites, Scan QR (circular dark-indigo button about 54 px that overlaps the bar by about 24 px), Insurance, Investments. Icons 22 px, labels 10–11 px. Selected item is darker/bolder.
Lifestyle and Rewards tabs [A]: simple card lists of original sample offers.
Loading [A]: tiles show skeleton shimmer for 400 ms on first load.

## S12 Transactions [V]
Fixed block (does not scroll):
- Title bar: back chevron, "Transactions", bell icon with a small dot, headset icon.
- Two tabs: "Transaction Details" (selected, underline) and "Spend Analysis".
- "Select Account" label, then a card selector: round bank icon (about 28 px, teal), masked account number "XXXXXXX7561" with an eye icon, "Savings Account", "Available Balance: ₹2,334.94", chevron at the right.
- Search input (magnifier, placeholder "Search here..."), funnel icon (filter), up-down arrows icon (sort).
- A row with the dropdown "Recent Transfers ⌄" at the left and an outlined pill "Request Statement" at the right.
Scrolling list below:
- Group header bands on light grey: "October 2026", "September 2026" (month groups) [V].
- Row [V]: left column: small grey channel tag ("UPI", "IMPS"), description in uppercase semibold ("UPI- TRANSFER TO 4897691..." truncated with ellipsis), date "13/10/2026" in grey. Right column: amount "₹250.00" with a small diagonal arrow (↗ for debit, red; ↙ for credit), below it "Balance: ₹2,334.94" in small grey.
- The default window is "Recent Transfers (Last 20 transactions)" [V].
States: loading (ring spinner centered in the list area, about 0.5 s) [V]; loaded [V]; refreshing after option change (list cleared and faded in) [V]; empty, no search results, error [A].

## S13 Duration sheet [V]
Bottom sheet with vivid blue gradient background and a rounded top. Title "Duration" (white, bold), a close "×" at the top right. Five options separated by thin lighter lines: "Recent Transfers (Last 20 transactions)" (selected: white circled check at the right), "Current Month", "Last Month", "Last 3 Months", "Custom Date Range". The page behind is dimmed. Tapping an option closes the sheet and refreshes the list.
[A] Custom Date Range opens a second step with two date fields and Apply.

## S15 Filter, S16 Sort, S18 Request Statement [A]
Not shown in the video; implemented as bottom sheets in the same blue style for consistency.
- Filter: transaction type (All, Debit, Credit), channel (All, UPI, IMPS, NEFT), amount range, Apply and Reset.
- Sort: Date newest first, Date oldest first, Amount high to low, Amount low to high.
- Request Statement: period select, delivery "Registered email", Submit, with a clear "Demo mode: nothing is sent" message.

## S17 Spend Analysis [A]
Total debits and credits for the selected window and a bar list by channel.

## S24 Deposits [V]
Top bar over a light header: back chevron, "Deposits", kebab icon at the right. A **purple summary panel** (indigo) spans the full width: "COMBINED CURRENT VALUE" in small caps, "₹60,000.00" large bold with an info icon, and two pill buttons side by side: "Requests" (translucent) and "Open New Deposit" (translucent, slightly brighter). Below, a white rounded-top sheet-like area: heading "Fixed Deposits (01)" with an underline rule; an FD card: "Regular FD" (small semibold), masked number "XXXXXXX9048" with an eye icon, value "₹ 60,000.00" with a chevron at the right, and a footer line "Maturity Date: 24/10/2027" at the left and "ROI: 6.45%" at the right. Then a promo banner (purple gradient, rounded) "View your linked … Account" with an illustration on the right.
States: loading (white page, title bar only, ring spinner centered, about 1.4 s) [V]; content fades in over about 0.13 s [V]; empty (no FDs) [A].

## S25 Fixed Deposit Details [V]
Top bar: back, "Fixed Deposit Details". Scrolling body under a fixed bar; a **pinned bottom button** "View Loan details" (full width, deep indigo, fully rounded) stays above the home indicator.
Body, top to bottom:
1. Info banner (grey-lavender, ⓘ icon): "This FD has lien/hold marked. You cannot modify/close this FD".
2. 2 × 2 stat tiles (light grey-lavender, rounded 8): Current Value, Rate of Interest, Maturity Amount, Maturity Date.
3. "Overview" heading with four small icons at the right: info, statement, mail, download.
4. Field grid (label small grey above, value in dark, dotted underline): FD Account No. (masked with eye) / FD Variant; Principal Amount / Interest Amount; Duration (full width: "1 Year 2 Months 18 Days"); FD Start Date / Currency; Lien Amount; Branch / Branch Code; Ownership.
5. Section "Interest & Maturity Details" on a lighter band: Interest Payout (At Maturity), Maturity Instruction (Auto Renewal).
6. Section "Nominee Details" with a link "View Nominee Details" (underlined, blue).
7. Section "OD against deposit" [content below it not shown; assumed: limit/availed].
States: loading (spinner about 0.5 s) [V]; lien banner shown only when lien exists [A].

## S26 Manage Nominee [V]
Top bar: back, "Manage Nominee", headset/refresh icon at the right. "Selected Account" label and a dropdown card (bank icon, "XXXXXXX9048", "Fixed Deposit", chevron). Two columns with dotted underlines: "Mode of operation: Single", "Type of nomination: Simultaneous". Heading "Nominee details". Row: "Nominee 1" with the name, and "Share (%)" "100%". Full-width outlined pill button "Edit Nominee".
[A] Edit Nominee opens a form (name, relationship, share %, date of birth) with validation that shares total 100%, then Save and Cancel.
Loading: spinner about 0.5 s [V].

## S19–S23 Fund transfer [B] (not in the video)
- S19 method list: "Bank Transfer" with list cards: Quick Transfer (to any account up to the limit), Bank Account (to another account), My account (own accounts), Mobile Money Identifier.
- S20 Quick transfer: segmented "To within bank / To other bank"; fields Beneficiary Name, Account Number, Confirm Account Number, IFSC Code (other bank only, with "Search IFSC"), Nickname; primary "Proceed to pay".
- S21 Amount: payee chip, amount, "Max limit" line, source account selector with balance, purpose select, optional checkbox "Send ₹1 as a test amount", "Proceed to pay".
- S22 Authorize: 6-digit transaction PIN boxes, summary (from, mode, charges), amount in words.
- S23 Success: "Successful", amount and amount in words, From, Mode of transfer, Charges, reference, buttons "Share Screenshot" and "Back to Transfer". A failure variant with "Try again" [A].
Styling uses the video's inner-screen look (light top bar with back chevron) rather than the boards' gradient header, for consistency with S12/S24 [A].

## Secondary screens (stubs, original content) [A]
S08 Services (recharge & bills grid), S10 Cards, S14 Custom date range, S27 Open New Deposit (simple form), S28 Deposit requests, S29 Loans, S30 Favorites (saved payees), S31 Insurance, S32 Investments, S33 Scan QR (no camera, demo viewfinder), S34 Notifications, S35 Search, S36 Settings (hide balances default, reset demo data, logout).
