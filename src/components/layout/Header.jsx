import React from "react";
import { Wallet, Printer } from "lucide-react";
import { formatMonthDisplay } from "../../utils/formatters";

export default function Header({ currentMonth, setCurrentMonth }) {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs print:border-none print:p-0 print:mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl print:bg-slate-100 print:text-slate-800">
          <Wallet size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            התקציב שלנו
          </h1>
          <p className="text-xs text-slate-400">ניהול ומעקב הוצאות</p>
        </div>
      </div>

      <div className="flex items-center gap-2 print:w-auto">
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="print:hidden p-2 px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-center cursor-pointer"
        />
        <span className="hidden print:block text-sm font-bold text-slate-700 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
          דו"ח לחודש: {formatMonthDisplay(currentMonth)}
        </span>

        <button
          type="button"
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Printer size={15} />
          <span>הדפסת PDF</span>
        </button>
      </div>
    </header>
  );
}
