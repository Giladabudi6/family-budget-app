# Transactions Module Context

Context and architecture details for adding, listing, and managing financial transactions and recurring payments.

---

## 1. Directory Structure

```text
src/components/transactions/
├── TransactionForm.jsx       # Inputs for adding expenses, incomes, savings
├── TransactionItem.jsx       # Single transaction display, with categorization icon and delete controls
├── TransactionList.jsx       # Scrollable/paginated list of transactions
└── PendingRecurringAlert.jsx  # Notification bar prompting approval of active recurring payments
```

---

## 2. Components Detail

### `TransactionForm.jsx`
- **Purpose:** Form to submit new financial movements.
- **Fields:**
  - Type toggle: `expense` (red theme), `income` (green theme), `savings` (blue theme).
  - `amount` (Number)
  - `date` (Date picker, defaults to today)
  - `category` (Dropdown filled dynamically based on type)
  - `note` (Text)
- **Data Action:** Calls `onAddTransaction` with parameters.

### `TransactionList.jsx`
- **Purpose:** Renders the list of transactions for the selected month, grouped by date or sorted chronologically.

### `TransactionItem.jsx`
- **Purpose:** Displays category icon, notes, amount (formatted as negative/positive depending on type), and a trash button to delete.

### `PendingRecurringAlert.jsx` & `RecurringPaymentsManager.jsx`
- **Purpose:** Manage and approve recurring expenses.
  1. Register the approval.
  2. Create a normal transaction entry.
  3. Increment paid installments.

