import React from "react";
import { Trash2 } from "lucide-react";
import { getCategoryIcon } from "../../utils/categories";
import { formatDateDisplay } from "../../utils/formatters";

export default function TransactionItem({ transaction, onDelete }) {
  const { id, type, category, note, date, amount } = transaction;

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200/80 transition-colors shadow-xs print:border-slate-100">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl ${
            type === "expense"
              ? "bg-rose-50/70 text-rose-500"
              : type === "income"
              ? "bg-emerald-50/70 text-emerald-500"
              : "bg-sky-50/70 text-sky-500"
          }`}
        >
          {getCategoryIcon(category, 16)}
        </div>
        <div>
          <p className="font-semibold text-slate-700 text-xs">{category}</p>
          <p className="text-[10px] text-slate-400">
            {note ? `${note} • ` : ""}
            {formatDateDisplay(date)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`font-bold text-xs ${
            type === "expense"
              ? "text-slate-700"
              : type === "income"
              ? "text-emerald-600/90"
              : "text-sky-600/90"
          }`}
        >
          {type === "expense" ? "-" : "+"}₪{amount.toLocaleString()}
        </span>
        <button
          onClick={() => onDelete(id)}
          className="text-slate-300 hover:text-rose-500 transition-colors print:hidden cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
