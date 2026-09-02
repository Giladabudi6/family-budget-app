# Vouchers and Gift Cards Manager Context

Context and design details for the browser-based Voucher and Gift Card Tracker.

---

## 1. Files & Hooks
- **Component:** `src/components/features/VouchersManager.jsx`
- **Data Store:** **`localStorage` (`family_vouchers`)**
  > [!NOTE]
  > Unlike other quick tools, Vouchers are stored entirely on the client side in the browser's local storage and do not sync to Firestore.

---

## 2. Core Logic & Fields

- **Voucher Model:**
  - `id` (String - timestamp based)
  - `title` (String)
  - `balance` (Number)
  - `link` (String - URL or textual code)
  - `expiry` (Date string YYYY-MM-DD)
  - `stores` (String describing supporting retailers)

- **Sorting Rule:** Sorted by expiry date:
  - Items with an expiry date are sorted earliest first (expiring soonest).
  - Items without an expiry date are pushed to the end.

- **Voucher Rendering Details:**
  - **Inline Balance Editing:** Clicking the balance displays an inline input to save new values immediately.
  - **Smart Link/Code Handler:**
    - Checks if `link` looks like a web URL. If yes, displays a "Digital Voucher" external link button.
    - If not a URL, displays a monospace selectable box labeled "Code:" (קוד) for copy-pasting.
  - **Expiry Alert:** If the voucher's expiry date is older than today, the background tints red and an "(Expired)" badge is shown.

