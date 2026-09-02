# Firebase Firestore Guidelines

Rules and guidelines for interacting with Firebase Firestore in this workspace.

---

## 1. Firebase Service Initialization
- Firebase database instance (`db`) must be imported from `src/services/firebase.js` or correct relative path.
- Connection settings, API keys, and configurations are handled via `.env.local` environment variables.

---

## 2. Firestore Sync & Subscriptions (Rules)

- **Subscription Cleanup:** Every real-time subscription (`onSnapshot`) must be established within a `useEffect` hook and the unsubscribe callback must be returned.
  ```javascript
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "collection", "docId"), (snapshot) => {
      // Handle data
    });
    return () => unsub();
  }, []);
  ```
- **Optimistic UI Updates:** Do not update local component state manually if there is a real-time Firestore subscription active. The subscription callback will automatically fire and update the React state with the database data.
- **Transactions & Concurrency:** Use Firestore transactions (`runTransaction`) when performing operations that require deduplication or read-then-write safety (e.g., approving recurring payments to prevent double charging).

---

## 3. Database Collections Map

- **`transactions`**:
  - Purpose: Tracks all individual expenses and incomes.
  - Fields: `amount` (Number), `type` ('expense' | 'income'), `category` (String), `note` (String), `date` (YYYY-MM-DD), `month` (YYYY-MM).
- **`recurring`**:
  - Purpose: Track fixed monthly/periodic payments.
  - Fields: `amount` (Number), `type` (String), `category` (String), `note` (String), `installmentsTotal` (Number | null), `installmentsPaid` (Number), `status` ('active' | 'completed').
- **`recurring_approvals`**:
  - Purpose: Prevent double approving recurring transactions in the same month.
  - Doc ID format: `${recurringId}_${month}`.
- **`settings`**:
  - Doc `budgets`: Budget limit per category.
- **`shopping`**:
  - Doc `main`: Global shopping list. Stores `notes` (by store ID: `supermarket`, `general`) and `checked` status dictionary.
- **`tasks`**:
  - Doc `main`: Shared task lists. Stores `general`, `gilad`, and `liat` texts, and a `checkedItems` dictionary.
- **`weekly_schedule`**:
  - Docs: Keyed by Sunday of that week (`YYYY-MM-DD`). Holds a map of `dayIndex` (0 to 6) to schedule text.

