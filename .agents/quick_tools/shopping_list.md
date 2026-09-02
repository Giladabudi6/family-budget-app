# Smart Shopping List Tool Context

Context and logic design for the Smart Household Shopping List.

---

## 1. Files & Hooks
- **Component:** `src/components/features/ShoppingList.jsx`
- **Custom Hook:** `src/hooks/useHouseholdShopping.js`
- **Firebase Collection:** `shopping`, Document: `main`

---

## 2. Core Logic & States

- **Stores:** Divided into two main categories:
  - `supermarket` (סופר)
  - `general` (כללי)
- **Checked items dictionary:** Key format is `${storeId}_${itemName.trim()}`, mapping to a boolean indicating if it is purchased.
- **Dual Mode (Smart Toggling):**
  - **Shopping Mode (קניות):** Displays items as a list of checkbox items. Checking/unchecking updates `checkedItems` state in real-time.
  - **Edit Mode (עריכה):** Converts the list back to a raw text area where the user can type lines.
  - **Toggling Logic (State conversion):**
    - Moving from *Shopping* to *Edit*: Checked items have a `✓` character prepended to their line text.
    - Moving from *Edit* to *Shopping*: Lines starting with `✓` or similar check indicators (like `✔`, `v `) are parsed as checked (`true`), and the prefix is stripped from the text.
- **Storage:** Synced to Firestore under `shopping/main` with `notes` (object containing raw text per store) and `checked` (boolean map).

