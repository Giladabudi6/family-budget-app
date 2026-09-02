import React, { useState, useMemo } from "react";
import { useHouseholdData } from "./hooks/useHouseholdData";
import { calculateMonthData, getPendingRecurring } from "./utils/calculations";

import Header from "./components/layout/Header";
import CategorySummary from "./components/dashboard/CategorySummary";
import MonthlySummary from "./components/dashboard/MonthlySummary";
import BudgetGoals from "./components/dashboard/BudgetGoals";
import PendingRecurringAlert from "./components/transactions/PendingRecurringAlert";
import TransactionForm from "./components/transactions/TransactionForm";
import TransactionList from "./components/transactions/TransactionList";
import RecurringPaymentsManager from "./components/features/RecurringPaymentsManager";
import VouchersManager from "./components/features/VouchersManager";

// ייבוא הרכיב המאוחד
import QuickTools from "./components/features/QuickTools";

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const {
    transactions,
    recurring,
    budgets,
    approvingIds,
    addTransaction,
    deleteTrans,
    addRecurring,
    deleteRecurring,
    approveRecurring,
    updateBudget,
  } = useHouseholdData(currentMonth);

  const monthData = useMemo(
    () => calculateMonthData(transactions, currentMonth),
    [transactions, currentMonth],
  );

  const pendingRecurring = useMemo(
    () => getPendingRecurring(transactions, recurring, currentMonth),
    [transactions, recurring, currentMonth],
  );

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-700 p-4 md:p-8 font-sans pb-20 print:bg-white print:p-0 print:[print-color-adjust:exact]"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto space-y-6 print:max-w-full print:space-y-4">
        {/* Header */}
        <Header currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />

        {/* ==========================================
            סרגל כלים מהירים (לו"ז | משימות | קניות)
            ========================================== */}
        <QuickTools />

        {/* Summaries Dashboard */}
        <MonthlySummary monthData={monthData} />

        {/* Pending Recurring Approvals Alert */}
        <PendingRecurringAlert
          pendingRecurring={pendingRecurring}
          approveRecurring={approveRecurring}
          approvingIds={approvingIds}
        />

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
          {/* Column 1: Forms */}
          <div className="space-y-6 print:hidden">
            <TransactionForm onAddTransaction={addTransaction} />
          </div>

          {/* Column 2: Data & Features */}
          <div className="space-y-6 print:space-y-6">
            <BudgetGoals
              monthData={monthData}
              budgets={budgets}
              updateBudget={updateBudget}
            />

            <CategorySummary transactions={monthData.filtered} />

            <TransactionList
              transactions={monthData.filtered}
              onDeleteTransaction={deleteTrans}
            />

            {/* Feature Managers */}
            <div className="w-full space-y-3 mt-6">
              <RecurringPaymentsManager
                recurring={recurring}
                onAddRecurring={addRecurring}
                onDeleteRecurring={deleteRecurring}
              />
              <VouchersManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
