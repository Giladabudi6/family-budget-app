import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES } from "../../utils/categories";

export default function TransactionForm({ onAddTransaction }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    setCategory(CATEGORIES[type][0]);
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    onAddTransaction({ amount, type, category, note, date });
    setAmount("");
    setNote("");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-fit">
      <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus size={18} className="text-indigo-500" /> הוספת תנועה 
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
          {[
            {
              id: "expense",
              label: "הוצאה",
              active:
                "bg-white text-rose-600 border border-slate-100 shadow-xs font-bold",
            },
            {
              id: "income",
              label: "הכנסה",
              active:
                "bg-white text-emerald-600 border border-slate-100 shadow-xs font-bold",
            },
            {
              id: "savings",
              label: "חיסכון",
              active:
                "bg-white text-sky-600 border border-slate-100 shadow-xs font-bold",
            },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                type === t.id ? t.active : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              סכום (₪)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50/50 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              תאריך
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50/50 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none text-slate-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            קטגוריה
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50/50 text-xs text-slate-600 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none"
          >
            {CATEGORIES[type].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            הערה (לא חובה)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="למשל: סופר פארם, חולצה..."
            className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50/50 text-xs focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors shadow-xs mt-2 cursor-pointer"
        >
          רשום תנועה
        </button>
      </form>
    </div>
  );
}
