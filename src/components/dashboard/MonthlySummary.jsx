import React from "react";
import { formatCurrency } from "../../utils/formatters";

export default function MonthlySummary({ monthData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-3">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs print:border-slate-200">
        <h3 className="text-slate-400 text-xs font-medium mb-1">הכנסות</h3>
        <p className="text-xl font-bold text-emerald-600/90">
          {formatCurrency(monthData.income)}
        </p>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs print:border-slate-200">
        <h3 className="text-slate-400 text-xs font-medium mb-1">הוצאות</h3>
        <p className="text-xl font-bold text-rose-500/90">
          {formatCurrency(monthData.expense)}
        </p>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs print:border-slate-200">
        <h3 className="text-slate-400 text-xs font-medium mb-1">חסכונות</h3>
        <p className="text-xl font-bold text-sky-500/90">
          {formatCurrency(monthData.savings)}
        </p>
      </div>
      <div
        className={`p-5 rounded-2xl border shadow-xs transition-colors print:border-slate-200 ${
          monthData.balance >= 0
            ? "bg-emerald-50/40 border-emerald-100/60"
            : "bg-rose-50/40 border-rose-100/60"
        }`}
      >
        <h3 className="text-slate-500 text-xs font-medium mb-1">
          מאזן חודשי
        </h3>
        <p
          className={`text-xl font-bold ${
            monthData.balance >= 0 ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {formatCurrency(monthData.balance)}
        </p>
      </div>
    </div>
  );
}
