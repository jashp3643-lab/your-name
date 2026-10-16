#!/usr/bin/env python3
"""Generate frame-inventory.csv from the manual review of the reference video.

Sampling method (see video-metadata.md):
  * 110 frames at 2 fps (every 0.5 s, t = 0.0 .. 54.5 s)  -> source = "sampled"
  * 4 dense bursts at 30 fps around transitions            -> source = "dense" (key frames only listed)
Frame numbers are approximate (round(t * 29.99)); the video is ~29.99 fps, 1,651 frames.

The screen / state text below is the result of reviewing those frames on labelled contact sheets.
"""
import csv, os, sys

FPS = 29.99

# (t_start, t_end, screen, nav_state, visible_interactive, change_vs_previous, animation_state, uncertainty)
SEGMENTS = [
 (0.0, 1.0, "S05 Home / Banking tab (scroll top)", "Bottom nav: Home; tab Banking; payments tab UPI",
  "greeting header, search/bell/logout icons, 4+ story chips, tabs, account tiles (masked), promo strip, Payments & Transfers tabs, UPI strip, raised QR button",
  "Initial state: all balances masked (count 'XX', value 'XXXX.XX'); a finger rests lower-left", "static", "Phone is hand-held; slight tilt and exposure change between frames"),
 (1.5, 2.0, "S05 Home (scrolling down)", "same", "header and tab row stay fixed; content scrolls beneath; stories scroll out of view by 2.0 s",
  "Vertical scroll begins; sections below tiles come into view: UPI Payments (View All) with 4 icons", "scroll", "Whether the Banking tab row is sticky by design or only appears so is inferred from 3 frames"),
 (2.5, 3.0, "S05 Home (scrolled to lower sections)", "same", "Investments row (Mutual Fund, Demat & Securities, NPS, PPF), Personal Finance Manager banner, Loans section header with View All",
  "Scrolled further; lower sections visible", "scroll", "Content below Loans not shown"),
 (3.5, 3.5, "S05 Home (ghosted frame)", "same", "tiles shown as double image", "Content is cross-blended with a different scroll position",
  "fast scroll back to top or a quick re-render (blend of two states)", "[?] cause unknown: scroll-to-top, tab re-select, or video compression artefact"),
 (4.0, 4.5, "S05 Home (scroll top)", "same", "stories + tiles visible again", "Back at the top", "static", ""),
 (5.0, 7.0, "S05 Home (scroll top)", "same", "eye icon on Transaction Accounts tile is the active target (finger over tile)", "No visible change; tile still masked", "static", "Finger often covers the tapped element"),
 (7.5, 9.5, "S05 Home - Transaction Accounts tile REVEALED", "same",
  "tile title now 'TRANSACTION ACCOUNTS (01)', value 'Rs 2,334', eye icon becomes crossed-eye", "Tile flips from masked to revealed (count XX -> 01, value shown, whole rupees, no decimals)", "instant swap (no animation seen at 0.5 s sampling)",
  "Deposits tile stays masked: reveal is per tile"),
 (10.0, 10.0, "S05 Home - tile re-masking", "same", "value partly hidden by finger ('..334')", "Reveal toggles back off", "instant", ""),
 (10.5, 11.0, "S05 Home (masked again)", "same", "tile masked; finger moves toward 'Transactions' link", "Masked state restored (XX / XXXX.XX)", "static", ""),
 (11.5, 11.5, "S05 Home -> S12 Transactions (cross-fade)", "same -> Transactions", "Transactions header ghosted over home content", "Transition frame", "cross-fade (see dense burst 11.20-12.23 s)", ""),
 (12.0, 12.0, "S12 Transactions (loading)", "Back arrow, tabs: Transaction Details active", "account selector, search, filter, sort, Recent Transfers dropdown, Request Statement; list area shows ring spinner",
  "New screen; list area empty with spinner", "spinner", "A dim grey scrim with ring appears for ~0.15 s just before this frame (dense burst); may be a loading overlay or camera exposure"),
 (12.5, 15.5, "S12 Transactions (loaded)", "Transaction Details tab", "'October 2026' group; rows UPI TRANSFER TO 4897691... Rs250.00 etc.; top block fixed",
  "List loaded (about 5 rows visible)", "static", "Spinner duration about 0.5 s from first frame"),
 (16.0, 16.0, "S13 Duration sheet (opening)", "Transactions + bottom sheet", "blue sheet 'Duration' with X, 5 options; page behind dimmed",
  "Sheet slides up from bottom (opens 15.88-16.08 s)", "slide-up about 0.2 s", "Which control opened the sheet is hidden by finger (assumed: 'Recent Transfers' dropdown)"),
 (16.5, 17.0, "S13 Duration sheet (open)", "same", "options: Recent Transfers (Last 20 transactions) [checked], Current Month, Last Month, Last 3 Months, Custom Date Range; a thin vertical scroll line at right",
  "Sheet at rest", "static", "Option tapped at ~17.3 s not visible"),
 (17.5, 17.5, "S12 Transactions (sheet closing, list cleared)", "same", "page behind turns near-white; only the account icon visible", "Sheet slides down (17.40-17.57 s); list area cleared", "slide-down about 0.2 s", "Very bright frame: camera overexposure vs real fade, unclear"),
 (18.0, 18.0, "S12 Transactions (list fading in)", "same", "list rows semi-transparent", "List re-renders after choosing an option", "fade-in about 0.3-0.5 s", ""),
 (18.5, 19.5, "S12 Transactions (loaded)", "same", "same rows as before", "Stable", "static", ""),
 (20.0, 23.5, "S12 Transactions (list scrolling)", "same", "search, selector, tabs remain fixed; list scrolls; rows incl. 'IMPS- TRANSFER FROM 4698..' with down-left arrow (credit) and red up-right arrows (debits)",
  "List scrolled; more rows appear", "scroll", "Credit/debit arrow colours are small: debit looks red, credit looks dark"),
 (24.0, 24.5, "S12 Transactions (fast scroll, motion blur)", "same", "rows blurred", "Fast scroll; phone also tilts", "scroll", ""),
 (25.0, 26.0, "S12 Transactions (end of list)", "same", "'September 2026' group header and last rows (about 20 rows total)", "Reached the end of the 'Last 20' list", "static", "No end-of-list message visible"),
 (26.5, 26.5, "S12 -> S05 Home (cross-fade back)", "Transactions -> Home", "home content with ghost layers", "Back navigation", "cross-fade", "Back control not visible in sampled frames"),
 (27.0, 27.5, "S05 Home (scroll top, masked)", "Home / Banking", "finger on tile 1; tiles about to be swiped", "Home restored", "static", ""),
 (28.0, 28.5, "S05 Home - tile carousel swipe", "same", "Deposits tile centred, Loans tile entering from right", "Horizontal swipe of the tile carousel; snapping toward tile 2", "horizontal scroll with snap", "Motion blur; tile widths estimated from frame 0.0 s"),
 (29.0, 29.5, "S05 Home - Loans tile in view", "same", "'LOANS (XX) Total Outstanding Amount XXXX.XX'; links 'View Details', 'Manage'(truncated)", "Carousel at tile 3 then returning", "horizontal scroll with snap", "Second link on Loans tile truncated: assumed 'Manage'"),
 (30.0, 31.5, "S05 Home - Deposits tile focused", "same", "'DEPOSITS (XX)' 'Combined Deposit Amount' 'View Details' 'Invest More'; eye icon", "Stable at tile 2", "static", ""),
 (32.0, 33.5, "S05 Home - Deposits tile REVEALED", "same", "'DEPOSITS (01)' value 'Rs 60,000' (no decimals), crossed-eye icon", "Tile 2 flips to revealed", "instant", ""),
 (34.0, 34.5, "S05 Home - Deposits tile masked again", "same", "masked 'XXXX.XX'; finger over 'Invest More'/'View Details'", "Toggled back off; finger heads to View Details", "static", ""),
 (35.0, 36.0, "S24 Deposits (loading)", "Back arrow; kebab menu", "white screen with title bar only; ring spinner in centre (arc grows from a dot)", "Home -> Deposits after 'View Details' tap (scene cut 34.91 s)", "spinner about 1.4 s", ""),
 (36.5, 38.5, "S24 Deposits (loaded)", "Deposits", "purple summary panel: COMBINED CURRENT VALUE, Requests, Open New Deposit; 'Fixed Deposits (01)' card with Regular FD row; promo banner",
  "Content appears (fade-in about 0.13 s at 36.47 s)", "fade-in", "Finger approaches the FD row at 37.5-38.5 s"),
 (39.0, 39.0, "S25 Fixed Deposit Details (loading)", "Back arrow; title 'Fixed Deposit Details'", "white screen with ring spinner", "FD row tapped", "spinner about 0.5 s", ""),
 (39.5, 42.0, "S25 Fixed Deposit Details (top)", "same", "lien/hold banner, 4 stat tiles, Overview with 4 icons, field grid, pinned 'View Loan details' button", "Content loaded", "static", ""),
 (42.5, 49.0, "S25 Fixed Deposit Details (scrolling)", "same", "body scrolls under fixed header; CTA stays pinned; fields: Duration, Start Date, Currency, Lien Amount, Branch, Branch Code, Ownership", "Scrolling down", "scroll", ""),
 (49.5, 52.5, "S25 Fixed Deposit Details (bottom)", "same", "'Interest & Maturity Details' (Interest Payout At Maturity, Maturity Instruction Auto Renewal), 'Nominee Details' > 'View Nominee Details' link, 'OD against deposit'",
  "Reached the bottom sections; tap on 'View Nominee Details' at ~52.5 s", "scroll", "Content below 'OD against deposit' not shown"),
 (53.0, 53.0, "S26 Manage Nominee (loading)", "Back arrow; title; headset/refresh icon top right", "ring spinner", "Nominee link tapped", "spinner <0.5 s", ""),
 (53.5, 54.5, "S26 Manage Nominee (loaded)", "same", "Selected Account dropdown (FD no.), Mode of operation: Single, Type of nomination: Simultaneous, 'Nominee details', 'Nominee 1', 'Share (%) 100%', 'Edit Nominee' outline button",
  "Content loaded; recording ends", "static", "Edit Nominee not tapped; edit form unknown"),
]

# key frames from the four 30 fps bursts
DENSE = [
 (11.70, 351, "S05 Home", "cross-fade begins: header of Transactions bleeds in", "cross-fade t0"),
 (11.77, 353, "S05/S12", "two screens blended 50/50", "cross-fade mid"),
 (11.83, 355, "S12 (dim)", "grey scrim with thin ring spinner centred; layout of Transactions faintly visible", "[?] scrim vs exposure"),
 (11.93, 358, "S12 (dim)", "same, brightening", "scrim fading"),
 (12.00, 360, "S12", "scrim gone; page visible, ring spinner small in list area", "spinner starts"),
 (12.10, 363, "S12", "spinner arc growing", "spinner"),
 (12.23, 367, "S12", "spinner ~full arc rotating", "spinner"),
 (15.75, 472, "S12", "no sheet", "pre-open"),
 (15.88, 476, "S12 + sheet", "sheet top edge enters at ~80% of height (blurred)", "slide-up t0"),
 (15.95, 478, "S12 + sheet", "sheet at ~60% height, content smeared by motion", "slide-up"),
 (16.02, 480, "S12 + sheet", "sheet at ~45% height", "slide-up"),
 (16.08, 482, "S12 + sheet", "sheet at rest, contents sharp", "slide-up done (about 6 frames = 0.2 s)"),
 (16.35, 490, "S12 + sheet", "stable", "rest"),
 (17.10, 513, "S12 + sheet", "stable", "rest"),
 (17.40, 522, "S12 + sheet", "sheet starts moving down", "slide-down t0"),
 (17.47, 524, "S12 + sheet", "sheet at ~60% height, content smeared", "slide-down"),
 (17.57, 527, "S12", "sheet gone; page almost white with only account icon visible", "slide-down done (about 5-6 frames = 0.2 s)"),
 (17.70, 531, "S12", "list area empty (white)", "list cleared"),
 (17.83, 535, "S12", "rows beginning to show (very faint)", "fade-in"),
 (17.97, 539, "S12", "rows visible at about 60% opacity", "fade-in"),
 (18.03, 541, "S12", "rows near full opacity", "fade-in done (about 0.4-0.5 s)"),
 (35.90, 1077, "S24", "tiny arc/dot centred", "spinner (dot)"),
 (36.20, 1086, "S24", "dot", "spinner (dot)"),
 (36.33, 1090, "S24", "short arc appears", "spinner (grow)"),
 (36.43, 1093, "S24", "arc about 60% rotating", "spinner (grow)"),
 (36.47, 1094, "S24", "content fading in at ~40% opacity over blank page", "content fade-in t0"),
 (36.50, 1095, "S24", "content at ~90% opacity", "content fade-in"),
 (36.60, 1098, "S24", "content fully opaque", "content fade-in done (about 4 frames = 0.13 s)"),
]

def main(out):
    rows = []
    for k in range(110):
        t = k * 0.5
        seg = None
        for s in SEGMENTS:
            if s[0] - 1e-6 <= t <= s[1] + 1e-6:
                seg = s
                break
        if seg is None:
            # frames that fall between segments: inherit nearest earlier segment
            seg = [s for s in SEGMENTS if s[0] <= t][-1]
            first = False
        else:
            first = abs(t - seg[0]) < 1e-6
        rows.append({
            "frame_no": round(t * FPS), "timestamp_s": f"{t:.2f}", "source": "sampled",
            "screen_state": seg[2], "navigation_state": seg[3], "visible_interactive_elements": seg[4],
            "change_vs_previous": seg[5] if first else "no significant change",
            "animation_state": seg[6], "uncertainty": seg[7] if first else "",
        })
    for t, n, screen, what, anim in DENSE:
        rows.append({
            "frame_no": n, "timestamp_s": f"{t:.2f}", "source": "dense", "screen_state": screen, "navigation_state": "",
            "visible_interactive_elements": "", "change_vs_previous": what, "animation_state": anim, "uncertainty": "",
        })
    rows.sort(key=lambda r: (float(r["timestamp_s"]), r["source"]))
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)
    print(len(rows), "rows ->", out)

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "frame-inventory.csv")
