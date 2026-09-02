import React, { useMemo, useState } from "react";
import { X, BarChart3 } from "lucide-react";
import { CATEGORIES, getCategoryIcon } from "../../utils/categories";
import { formatCurrency } from "../../utils/formatters";

export default function CategorySummary({ transactions }) {
  const [isOpen, setIsOpen] = useState(false);

    const categoryData = useMemo(() => {
    const breakdown = {
      expense: {},
      income: {},
      savings: {},
    };

    // צבירת נתונים לפי הקטגוריות הקיימות בעסקאות בפועל
    transactions.forEach((transaction) => {
      const { type, category, amount } = transaction;
      if (breakdown[type]) {
        if (!breakdown[type][category]) {
          breakdown[type][category] = 0;
        }
        breakdown[type][category] += Number(amount || 0);
      }
    });

    // המרה למערך ומיון מהגבוה לנמוך
    const formatBreakdown = (typeObj) => {
      return Object.entries(typeObj)
        .map(([category, total]) => ({
          category,
          total,
        }))
        .sort((a, b) => b.total - a.total);
    };

    return {
      expense: formatBreakdown(breakdown.expense),
      income: formatBreakdown(breakdown.income),
      savings: formatBreakdown(breakdown.savings),
    };
  }, [transactions]);

  return (
    <>
      {/* כפתור פתיחת החלון */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white border border-slate-100 rounded-2xl p-4 shadow-xs hover:shadow-sm hover:border-slate-200 transition-all flex items-center justify-center gap-2 text-sm font-medium text-slate-600"
      >
        <BarChart3 size={18} />
        פירוט לפי קטגוריות
      </button>

      {/* חלון */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-3xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  פירוט לפי קטגוריות
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  הפעילות בחודש הנוכחי
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6 overflow-y-auto max-h-[70vh]">
              
              {/* הוצאות */}
              <CategorySection
                title="הוצאות"
                categories={categoryData.expense}
                iconColor="text-rose-500"
                bgColor="bg-rose-50"
              />

              {/* הכנסות */}
              <CategorySection
                title="הכנסות"
                categories={categoryData.income}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-50"
              />

              {/* חסכונות */}
              <CategorySection
                title="חסכונות"
                categories={categoryData.savings}
                iconColor="text-sky-500"
                bgColor="bg-sky-50"
              />

              {categoryData.expense.length === 0 &&
                categoryData.income.length === 0 &&
                categoryData.savings.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-8">
                    אין פעילות בחודש זה
                  </p>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
              >
                סגירה
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


/* ==========================================
   Section
   ========================================== */

function CategorySection({
  title,
  categories,
  iconColor,
  bgColor,
}) {
  if (categories.length === 0) {
    return null;
  }

  const total = categories.reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-700">
          {title}
        </h3>

        <span className="text-xs font-medium text-slate-400">
          {formatCurrency(total)}
        </span>
      </div>

      <div className="space-y-2">
        {categories.map(({ category, total }) => (
          <div
            key={category}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl ${bgColor} ${iconColor} flex items-center justify-center`}
              >
                {getCategoryIcon(category, 17)}
              </div>

              <span className="text-sm text-slate-600">
                {category}
              </span>
            </div>

            <span className="text-sm font-bold text-slate-700">
              {formatCurrency(total)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}