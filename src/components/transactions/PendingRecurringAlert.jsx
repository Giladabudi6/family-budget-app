import React from "react";
import { Clock, Check } from "lucide-react";
import { getCategoryIcon } from "../../utils/categories";

export default function PendingRecurringAlert({
  pendingRecurring,
  approveRecurring,
  approvingIds,
}) {
  if (!pendingRecurring || pendingRecurring.length === 0) return null;

  return (
    <div className="bg-amber-50/60 border border-amber-100 p-5 rounded-2xl space-y-3 shadow-xs print:hidden">
      <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
        <Clock size={18} className="text-amber-500" />
        <span>תשלומים קבועים הממתינים לאישור:</span>
      </div>
      <div className="grid gap-2">
        {pendingRecurring.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg">
                {getCategoryIcon(r.category, 16)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 text-xs md:text-sm">
                    {r.category}
                  </span>
                  {r.installmentsTotal && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                      תשלום {(r.installmentsPaid || 0) + 1} מתוך{" "}
                      {r.installmentsTotal}
                    </span>
                  )}
                </div>
                {r.note && (
                  <span className="text-[11px] text-slate-400">
                    {r.note}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800 text-sm">
                ₪{r.amount}
              </span>
              <button
                onClick={() => approveRecurring(r)}
                disabled={approvingIds.has(r.id)}
                className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Check size={14} />{" "}
                {approvingIds.has(r.id) ? "שומר..." : "אישור"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
