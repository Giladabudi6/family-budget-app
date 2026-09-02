import React, { useState } from "react";
import { Calendar, CheckSquare, ShoppingCart, ChevronUp } from "lucide-react";

import WeeklySchedule from "./WeeklySchedule";
import TaskList from "./TaskList";
import ShoppingList from "./ShoppingList";

export default function QuickTools() {
  // null = הכל סגור, 'schedule' / 'tasks' / 'shopping'
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (tabName) => {
    setActiveTab((prev) => (prev === tabName ? null : tabName));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden transition-all print:hidden">
      {/* ==========================================
          שורת כפתורים
          ========================================== */}
      <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100">
        
        {/* טאב 1: לו"ז שבועי */}
        <button
          type="button"
          onClick={() => toggleTab("schedule")}
          /* ההבדל כאן: הוספתי border-0 כדי לדרוס כל מסגרת דיפולטיבית, ואז border-b-2 לקו התחתון בלבד */
          className={`flex items-center justify-center gap-1.5 p-3 text-xs font-bold transition-all cursor-pointer select-none outline-none focus:outline-none border-0 border-b-2 ${
            activeTab === "schedule"
              ? "text-indigo-600 border-indigo-500"
              : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100/50"
          }`}
        >
          <Calendar size={15} className={activeTab === "schedule" ? "text-indigo-600" : "text-indigo-500/80"} />
          <span className="truncate">לו"ז שבועי</span>
        </button>

        {/* טאב 2: משימות */}
        <button
          type="button"
          onClick={() => toggleTab("tasks")}
          className={`flex items-center justify-center gap-1.5 p-3 text-xs font-bold transition-all cursor-pointer select-none outline-none focus:outline-none border-0 border-b-2 ${
            activeTab === "tasks"
              ? "text-emerald-600 border-emerald-500"
              : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100/50"
          }`}
        >
          <CheckSquare size={15} className={activeTab === "tasks" ? "text-emerald-600" : "text-emerald-500/80"} />
          <span className="truncate">משימות</span>
        </button>

        {/* טאב 3: רשימת קניות */}
        <button
          type="button"
          onClick={() => toggleTab("shopping")}
          className={`flex items-center justify-center gap-1.5 p-3 text-xs font-bold transition-all cursor-pointer select-none outline-none focus:outline-none border-0 border-b-2 ${
            activeTab === "shopping"
              ? "text-amber-600 border-amber-500"
              : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100/50"
          }`}
        >
          <ShoppingCart size={15} className={activeTab === "shopping" ? "text-amber-600" : "text-amber-500/80"} />
          <span className="truncate">קניות</span>
        </button>

      </div>

      {/* ==========================================
          תוכן הרכיב הפעיל
          ========================================== */}
      {activeTab && (
        <div className="p-4 bg-white animate-fadeIn">
          {activeTab === "schedule" && <WeeklySchedule />}
          {activeTab === "tasks" && <TaskList embedded={true} />}
          {activeTab === "shopping" && <ShoppingList embedded={true} />}

          {/* כפתור סגירה מהירה למטה */}
          <button
            type="button"
            onClick={() => setActiveTab(null)}
            className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 pt-3 mt-3 border-t border-slate-100 cursor-pointer outline-none focus:outline-none"
          >
            <ChevronUp size={13} />
            <span>סגור</span>
          </button>
        </div>
      )}
    </div>
  );
}