import React, { useState, useEffect } from "react";
import { CalendarClock, ReceiptText, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORIES, getCategoryIcon } from "../../utils/categories";

export default function RecurringPaymentsManager({
  recurring,
  onAddRecurring,
  onDeleteRecurring,
}) {
  const [isAddRecOpen, setIsAddRecOpen] = useState(false);
  const [isListRecOpen, setIsListRecOpen] = useState(false);

  const [recAmount, setRecAmount] = useState("");
  const [recType, setRecType] = useState("expense");
  const [recCategory, setRecCategory] = useState(CATEGORIES.expense[0]);
  const [recNote, setRecNote] = useState("");
  const [recInstallments, setRecInstallments] = useState("");

  useEffect(() => {
    setRecCategory(CATEGORIES[recType][0]);
  }, [recType]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!recAmount || !recCategory) return;
    onAddRecurring({
      amount: recAmount,
      type: recType,
      category: recCategory,
      note: recNote,
      installments: recInstallments,
    });
    setRecAmount("");
    setRecNote("");
    setRecInstallments("");
  };

  return (
    <div className="w-full space-y-3 mt-6">
      {/* 1. סרגל נפתח: הגדרת תשלום חודשי קבוע */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setIsAddRecOpen(!isAddRecOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50 transition-colors text-right outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-indigo-500" />
            <span className="text-xs font-bold text-slate-700">
               הוראת קבע חדשה
            </span>
          </div>
          <div className="text-slate-400">
            {isAddRecOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {isAddRecOpen && (
          <div className="p-5 border-t border-slate-100/60 bg-white space-y-4">
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="flex gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
                {[
                  {
                    id: "expense",
                    label: "הוצאה קבועה",
                    active:
                      "bg-white text-rose-600 border border-slate-100 shadow-xs font-bold",
                  },
                  {
                    id: "income",
                    label: "הכנסה קבועה",
                    active:
                      "bg-white text-emerald-600 border border-slate-100 shadow-xs font-bold",
                  },
                  {
                    id: "savings",
                    label: "חיסכון קבוע",
                    active:
                      "bg-white text-sky-600 border border-slate-100 shadow-xs font-bold",
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRecType(t.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      recType === t.id
                        ? t.active
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    סכום חודשי (₪)
                  </label>
                  <input
                    type="number"
                    required
                    value={recAmount}
                    onChange={(e) => setRecAmount(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50/50 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    קטגוריה
                  </label>
                  <select
                    value={recCategory}
                    onChange={(e) => setRecCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-600 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none"
                  >
                    {CATEGORIES[recType].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    מספר תשלומים
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={recInstallments}
                    onChange={(e) => setRecInstallments(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50/50 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    שם הספק / הערה
                  </label>
                  <input
                    type="text"
                    value={recNote}
                    onChange={(e) => setRecNote(e.target.value)}
                    placeholder="למשל: נטפליקס"
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50/50 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 py-2 rounded-xl text-xs font-semibold transition-colors mt-1 cursor-pointer"
              >
                שמירת הוראת קבע
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsAddRecOpen(false)}
              className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
            >
              סגור
            </button>
          </div>
        )}
      </div>

      {/* 2. סרגל נפתח: הוראות קבע פעילות */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden transition-all print:border-slate-200">
        <button
          type="button"
          onClick={() => setIsListRecOpen(!isListRecOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50 transition-colors text-right outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ReceiptText size={16} className="text-indigo-500" />
            <span className="text-xs font-bold text-slate-700">
              הוראות קבע קיימות
            </span>
            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {recurring.length}
            </span>
          </div>
          <div className="text-slate-400">
            {isListRecOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>
        </button>

        {isListRecOpen && (
          <div className="p-5 border-t border-slate-100/60 bg-white space-y-3">
            {recurring.length === 0 ? (
              <p className="text-slate-400 text-center text-xs py-2">
                אין עדיין הוראות קבע רשומות
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pl-1 print:max-h-none print:overflow-visible">
                {recurring.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50/60 rounded-xl border border-slate-100/80 text-xs"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {getCategoryIcon(r.category, 14)}
                        </span>
                        <span className="font-medium text-slate-600">
                          {r.category}
                        </span>
                        {r.installmentsTotal && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                            {r.installmentsPaid || 0} מתוך{" "}
                            {r.installmentsTotal} שולמו
                          </span>
                        )}
                      </div>
                      {r.note && (
                        <span className="text-slate-400 text-[11px] pr-6">
                          {r.note}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-700">
                        ₪{r.amount}
                      </span>
                      <button
                        onClick={() => onDeleteRecurring(r.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors print:hidden cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsListRecOpen(false)}
              className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
            >
              סגור
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
