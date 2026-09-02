# Dashboard Module Context

Context and architecture details for the Financial Dashboard.

---

## 1. Directory Structure

```text
src/components/dashboard/
├── MonthlySummary.jsx   # Top-level cards showing Income, Expenses, Savings, Cashflow
├── CategorySummary.jsx  # Expense analysis by category (percentages, absolute values)
└── BudgetGoals.jsx      # Progress bars tracking current spending vs. budget limits
```

---

## 2. Components Detail

### `MonthlySummary.jsx`
- **Purpose:** Displays large overview cards summing up the current month's totals (Total Income, Total Expense, Net Cashflow, Total Savings).
- **Data Source:** Receives monthly metrics calculated from transaction lists.

### `CategorySummary.jsx`
- **Purpose:** Analyzes how money is spent across various categories (e.g. food, bills, shopping). Renders a breakdown showing total spent per category and its percentage of the overall month's expenses.

### `BudgetGoals.jsx`
- **Purpose:** Shows progress bars indicating how close the household is to their defined budget limits.
- **Controls:** Allows adding new goals via category selection and setting goals inline.
- **Alert States:**
  - **Exceeded:** Red progress bar and a "חריגה!" (Over-budget!) badge.
  - **Warning:** Amber progress bar if current expenses reach 80% or more of the budget.
  - **Normal:** Indigo progress bar.
- **Functions:** Calls `updateBudget(category, amount)` to persist settings.

---

## 3. Data Integration

- The dashboard relies on `monthData` structure calculated in `src/utils/calculations.js`.
- It uses the category helper list from `src/utils/categories.jsx`.
- Budget settings are fetched from Firestore (`settings/budgets` doc) via the `useHouseholdData` custom hook.

