# Interaction map

Chronological trace of the video, then the behaviors added from the boards or assumed. **[V]** = seen in the video (time in seconds), **[B]** = boards, **[A]** = assumption.

## Trace of the video (55 s)

| t (s) | Start screen | Action | Result | Tag |
| --- | --- | --- | --- | --- |
| 0.0–1.0 | S05 Home | idle | all tiles masked | [V] |
| 1.5–3.0 | S05 | vertical drag-scroll | stories scroll away; greeting row and tab row stay fixed; sections UPI Payments, Investments, PFM banner, Loans come into view | [V] |
| 3.5–4.0 | S05 | (scroll back to top, ghost frame) | page returns to top | [V]/[?] |
| 5.0–7.0 | S05 | tap eye on Transaction Accounts tile | at 7.5 s the tile shows "(01)" and "₹2,334", icon becomes crossed eye | [V] |
| 10.0–10.5 | S05 | tap eye again | tile masked again | [V] |
| 11.5 | S05 | tap "Transactions" link on tile 1 | cross-fade to S12; spinner in list area for about 0.5 s; list appears | [V] |
| 12.5–15.5 | S12 | idle | October 2026 group with 5+ rows | [V] |
| 15.9 | S12 | tap "Recent Transfers" dropdown (assumed trigger) | S13 sheet slides up in about 0.2 s, page dims | [V]/[A] |
| 17.3–17.6 | S13 | tap an option (Recent Transfers stays checked) | sheet slides down in about 0.2 s; list clears and refreshes; rows fade in by 18.0 s | [V] |
| 20–25 | S12 | vertical scroll | only the list scrolls; top block fixed; credit row (↙) and debit rows (↗); "September 2026" band appears near the end | [V] |
| 26.5 | S12 | back (control not visible) | cross-fade to S05 | [V] |
| 28.0–29.5 | S05 | horizontal swipe on tile carousel | snaps to Deposits tile, then Loans tile, then back | [V] |
| 32.0–33.5 | S05 | tap eye on Deposits tile | "(01)", "₹60,000", crossed eye | [V] |
| 34.0–34.5 | S05 | tap eye again, then tap "View Details" | masked, then cross-fade to S24 | [V] |
| 35.0–36.5 | S24 | wait | spinner about 1.4 s, then content fades in (about 0.13 s) | [V] |
| 38.5–39.0 | S24 | tap Fixed Deposit row | S25 with spinner about 0.5 s | [V] |
| 40–52 | S25 | vertical scroll | body scrolls under fixed bar; "View Loan details" button stays pinned | [V] |
| 52.5 | S25 | tap "View Nominee Details" | S26 with spinner, then content | [V] |
| 54.5 | S26 | end | recording ends | [V] |

## Behaviors implemented from observation

| Trigger | Result |
| --- | --- |
| Tile eye icon | toggles masked and revealed for that tile only, no persistence across navigation [V] |
| Tile "View Accounts" | opens accounts list (stub) [A] |
| Tile "Transactions" | opens S12 with the first account selected [V] |
| Tile "View Details" (Deposits) | opens S24 [V] |
| Tile "Invest More" | opens Open New Deposit (S27) [A] |
| Tile "View Details" / "Manage" (Loans) | opens Loans (S29) [A] |
| Refresh icon on Accounts tile | spins and refreshes balances (simulated 600 ms) [A] |
| Payments tab strip | switches content under it; UPI selected by default [V]/[A] |
| "View All" links | open the matching stub list [A] |
| Story chip | opens a simple story viewer sheet with original text [A] |
| Bottom nav items | Home, Favorites, Scan QR, Insurance, Investments navigate to stubs [V]/[A] |
| Logout icon | confirm dialog, then S01 [A] |
| Account selector (S12) | opens a list sheet of accounts; picking one reloads the list [V]/[A] |
| Search field | filters rows by description, channel, date or amount as the user types [A] |
| Filter / Sort icons | open sheets; Apply closes the sheet and reloads [A] |
| Duration option | closes sheet, reloads list with that window [V] |
| Request Statement | opens sheet; Submit shows a toast saying the request is recorded locally and no email is sent [A] |
| Back chevron | history back; Android/browser back behaves the same [V] |
| FD row | opens S25 [V] |
| "View Nominee Details" | opens S26 [V] |
| "Edit Nominee" | opens the edit form; Save updates local state and shows a toast [A] |
| "View Loan details" | opens Loans screen with the OD against this deposit [A] |
| FD eye icon | masks and reveals the account number [V] |

## Behaviors from the boards [B]/[A]

| Trigger | Result |
| --- | --- |
| Six MPIN digits entered | auto-verify against `250219`; wrong code shakes and shows attempts left; 5 failures lock for 30 s |
| "Login with Username" | switches to S02 |
| Username + password submit | verifies (`demo.user` / `250219`) |
| Fund Transfer (home tab or shortcut) | S19 > S20 > S21 > S22 > S23 |
| Confirm Account Number differs | inline error, Proceed disabled |
| Amount above limit or balance | inline error |
| Correct PIN | creates the debit transaction, reduces the balance, saves the beneficiary, shows S23 |
| Wrong PIN | error and shake; 3 failures abort the transfer |

## Persistence

- Session: `sessionStorage` flag (cleared when the tab closes).
- Data (balances, transactions, beneficiaries, nominee edits, preferences): `localStorage`, versioned key. Settings has "Reset demo data".
- Tile reveal state and scroll positions are not persisted [V: tile was masked again after toggling].
