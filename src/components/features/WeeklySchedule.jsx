// ==========================================
// 1. ייבוא ספריות והוקים
// ==========================================
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useWeeklySchedule } from "../../hooks/useWeeklySchedule";

// ==========================================
// 2. רכיב עזר: תיבת טקסט המתרחבת מעצמה עם נעילת סמן הרמטית
// דגש חשוב: רכיב זה מוגדר מחוץ לרכיב הראשי!
// ==========================================
function AutoResizeTextarea({ value, onChange, placeholder }) {
  // State מקומי למניעת דיליי מול ה-Hook/Firebase
  const [localValue, setLocalValue] = useState(value || "");
  const textareaRef = useRef(null);
  const cursorRef = useRef(null);

  // סנכרון ה-State המקומי כשמתחלף שבוע או כשיש עדכון חיצוני
  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  // נעילה והחזרה של הסמן בדיוק למיקום ההקלדה לפני שהמסך מרונדר
  useLayoutEffect(() => {
    if (cursorRef.current !== null && textareaRef.current) {
      textareaRef.current.setSelectionRange(
        cursorRef.current,
        cursorRef.current,
      );
    }
  }, [localValue]);

  const handleChange = (e) => {
    const val = e.target.value;
    const selectionStart = e.target.selectionStart;

    // 1. שמירת מיקום הסמן
    cursorRef.current = selectionStart;

    // 2. עדכון מקומי מיידי ששומר על הסמן
    setLocalValue(val);

    // 3. עדכון ה-Hook / בסיס הנתונים
    onChange(val);
  };

  return (
    <div className="grid grid-cols-1 w-full relative">
      <div
        className="col-start-1 row-start-1 p-2.5 text-xs border border-transparent whitespace-pre-wrap break-words invisible pointer-events-none leading-relaxed"
        aria-hidden="true"
      >
        {localValue ? `${localValue}\n\u00A0` : placeholder || "\u00A0"}
      </div>

      <textarea
        ref={textareaRef}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        rows={2}
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
        className="col-start-1 row-start-1 w-full h-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all resize-none overflow-hidden block whitespace-pre-wrap break-words leading-relaxed"
      />
    </div>
  );
}

// ==========================================
// 3. הרכיב הראשי - לו"ז שבועי
// ==========================================
export default function WeeklySchedule() {
  const [activeTab, setActiveTab] = useState("current"); // "current" | "next"

  const {
    schedules,
    currentWeekKey,
    nextWeekKey,
    currentWeekDays,
    nextWeekDays,
    updateDayNote,
  } = useWeeklySchedule();

  const selectedWeekKey =
    activeTab === "current" ? currentWeekKey : nextWeekKey;
  const selectedDays = activeTab === "current" ? currentWeekDays : nextWeekDays;
  const currentSchedule = schedules[selectedWeekKey] || {};

  return (
    <div className="space-y-4">
      {/* בורר שבועות */}
      <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab("current")}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === "current"
              ? "bg-white text-indigo-600 border border-slate-100 shadow-xs font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          השבוע הנוכחי ({currentWeekDays[0]?.shortDate} -{" "}
          {currentWeekDays[6]?.shortDate})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("next")}
          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            activeTab === "next"
              ? "bg-white text-indigo-600 border border-slate-100 shadow-xs font-bold"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          השבוע הבא ({nextWeekDays[0]?.shortDate} - {nextWeekDays[6]?.shortDate}
          )
        </button>
      </div>

      {/* ימי השבוע */}
      <div className="space-y-2.5">
        {selectedDays.map((day) => {
          const noteValue = currentSchedule[day.dayIndex] || "";

          return (
            <div
              key={day.dayIndex}
              className={`p-3 rounded-xl border transition-all ${
                day.isToday
                  ? "bg-indigo-50/40 border-indigo-200/80 shadow-2xs"
                  : "bg-slate-50/50 border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-xs">
                    יום {day.dayName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {day.shortDate}
                  </span>
                  {day.isToday && (
                    <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold">
                      היום!
                    </span>
                  )}
                </div>
              </div>

              {/* תיבת טקסט עם ניהול סמן מקומי */}
              <AutoResizeTextarea
                value={noteValue}
                onChange={(val) =>
                  updateDayNote(selectedWeekKey, day.dayIndex, val)
                }
                placeholder={`תכניות ליום ${day.dayName}...`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
