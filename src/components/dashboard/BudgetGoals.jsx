// ==========================================
// 1. ייבוא ספריות, רכיבים ואייקונים
// ==========================================
import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CATEGORIES, getCategoryIcon } from "../../utils/categories";

// ==========================================
// 2. רכיב קלט עבור סכום היעד
// ==========================================
function BudgetInput({ cat, savedValue, isOver, onSave }) {
  const [localValue, setLocalValue] = useState(savedValue || "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(savedValue || "");
    }
  }, [savedValue, isFocused]);

  return (
    <input
      type="number"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        setIsFocused(false);
        const numVal = Number(e.target.value);
        // אם הזינו 0, ערך ריק או לא תקין - היעד יתאפס ויסור מהסרגלים
        onSave(cat, isNaN(numVal) || numVal <= 0 ? 0 : numVal);
      }}
      placeholder="0"
      className={`w-16 p-0.5 text-center font-semibold border rounded-lg outline-none transition-all print:border-none print:bg-transparent print:w-auto print:text-left ${
        isOver
          ? "border-rose-200 bg-rose-50/50 text-rose-600 focus:ring-2 focus:ring-rose-200"
          : "border-slate-200 bg-slate-50/50 text-slate-700 focus:ring-2 focus:ring-indigo-100"
      }`}
    />
  );
}

// ==========================================
// 3. הרכיב הראשי - יעדי תקציב
// ==========================================
export default function BudgetGoals({ monthData, budgets, updateBudget }) {
  const [selectedCatToAdd, setSelectedCatToAdd] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // סינון קטגוריות שמוגדר להן יעד גדול מ-0
  const activeCategories = CATEGORIES.expense.filter(
    (cat) => Number(budgets[cat]) > 0
  );

  // קטגוריות שעדיין אין להן יעד תקציבי
  const availableCategories = CATEGORIES.expense.filter(
    (cat) => !budgets[cat] || Number(budgets[cat]) <= 0
  );

  // טיפול בהוספת יעד חדש
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!selectedCatToAdd || !newGoalAmount || Number(newGoalAmount) <= 0) return;

    updateBudget(selectedCatToAdd, Number(newGoalAmount));
    setSelectedCatToAdd("");
    setNewGoalAmount("");
    setShowAddForm(false);
  };

  // מחיקת יעד (איפוס ל-0)
  const handleRemoveGoal = (cat) => {
    updateBudget(cat, 0);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs print:border-slate-200 space-y-5">
      
      {/* ==========================================
          4. כותרת הרכיב וכפתור הוספה
          ========================================== */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-800">
          יעדי תקציב לחודש זה
        </h2>
        {availableCategories.length > 0 && !showAddForm && (
          <button
            type="button"
            onClick={() => {
              setSelectedCatToAdd(availableCategories[0]);
              setShowAddForm(true);
            }}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer print:hidden"
          >
            <Plus size={14} />
            <span>הוסף יעד</span>
          </button>
        )}
      </div>

      {/* ==========================================
          5. טופס הוספת יעד לקטגוריה חדשה
          ========================================== */}
      {showAddForm && (
        <form
          onSubmit={handleAddGoal}
          className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3 print:hidden"
        >
          <div className="text-xs font-semibold text-slate-700">הגדרת יעד תקציב חדש:</div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCatToAdd}
              onChange={(e) => setSelectedCatToAdd(e.target.value)}
              className="flex-1 min-w-[130px] p-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="relative flex items-center">
              <span className="absolute right-2.5 text-xs text-slate-400 font-bold">₪</span>
              <input
                type="number"
                value={newGoalAmount}
                onChange={(e) => setNewGoalAmount(e.target.value)}
                placeholder="סכום יעד"
                className="w-24 p-2 pr-6 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 font-medium"
              />
            </div>

            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
            >
              שמור
            </button>
            
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-2 text-slate-400 hover:text-slate-600 text-xs font-medium transition-all cursor-pointer"
            >
              ביטול
            </button>
          </div>
        </form>
      )}

      {/* ==========================================
          6. תצוגת סרגלי היעדים הפעילים בלבד
          ========================================== */}
      {activeCategories.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          טרם הוגדרו יעדי תקציב. לחץ על "הוסף יעד" כדי להתחיל.
        </div>
      ) : (
        <div className="space-y-4">
          {activeCategories.map((cat) => {
            const val = monthData.catBreakdown[cat] || 0;
            const limit = Number(budgets[cat]) || 0;
            const percent = limit > 0 ? (val / limit) * 100 : 0;
            const isOver = limit > 0 && val >= limit;
            const isClose = limit > 0 && !isOver && percent >= 80;

            return (
              <div key={cat} className="space-y-1.5 group">
                <div className="flex justify-between items-center text-xs">
                  {/* שם הקטגוריה ואייקון */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded-lg ${
                        isOver
                          ? "bg-rose-50 text-rose-500"
                          : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      {getCategoryIcon(cat, 15)}
                    </div>
                    <span
                      className={`font-medium ${
                        isOver ? "text-rose-600 font-bold" : "text-slate-600"
                      }`}
                    >
                      {cat}
                    </span>
                    {isOver && (
                      <span className="text-[10px] bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded-md font-bold border border-rose-100 print:animate-none">
                        חריגה!
                      </span>
                    )}
                  </div>

                  {/* סכום, קלט יעד וכפתור מחיקה */}
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <span>₪{val} / </span>
                    <BudgetInput
                      cat={cat}
                      savedValue={budgets[cat] || 0}
                      isOver={isOver}
                      onSave={updateBudget}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(cat)}
                      title="הסר יעד"
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1 cursor-pointer print:hidden"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* סרגל התקדמות (Progress Bar) */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      isOver
                        ? "bg-rose-400"
                        : isClose
                        ? "bg-amber-400"
                        : percent > 0
                        ? "bg-indigo-400"
                        : "bg-transparent"
                    }`}
                    style={{
                      width: `${limit > 0 ? Math.min(percent, 100) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}