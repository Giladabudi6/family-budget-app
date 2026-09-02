import React, { useState } from "react";
import { CATEGORIES } from "../../utils/categories";
import TransactionItem from "./TransactionItem";

export default function TransactionList({ transactions, onDeleteTransaction }) {
  const [filterCategory, setFilterCategory] = useState("הכל");

  const filteredTransactions = transactions.filter(
    (t) => filterCategory === "הכל" || t.category === filterCategory
  );

  // יצירת מערך ייחודי המאחד את כל הקטגוריות ומסיר כפילויות (כמו "שונות")
  const uniqueCategories = [
    ...new Set([
      ...(CATEGORIES.expense || []),
      ...(CATEGORIES.income || []),
      ...(CATEGORIES.savings || []),
    ]),
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs print:border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-800">תנועות חודשיות</h2>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="print:hidden p-1 px-2 border border-slate-200 rounded-lg text-[11px] font-medium bg-slate-50/50 text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
        >
          <option value="הכל">כל הקטגוריות</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {filterCategory !== "הכל" && (
          <span className="hidden print:inline-block text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
            סינון: {filterCategory}
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 print:max-h-none print:overflow-visible">
        {filteredTransactions.length === 0 ? (
          <p className="text-slate-400 text-center text-xs py-4">
            {filterCategory === "הכל"
              ? "אין פעילות מתועדת בחודש זה"
              : `אין תנועות בקטגוריית "${filterCategory}"`}
          </p>
        ) : (
          filteredTransactions.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </div>
    </div>
  );
}