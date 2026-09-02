import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Edit3, CheckCircle2, Circle, ClipboardList } from "lucide-react";
import { useHouseholdTasks } from "../../hooks/useHouseholdTasks";

function AutoResizeTextarea({ value, onChange, placeholder }) {
  const [localValue, setLocalValue] = useState(value || "");
  const textareaRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

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
    cursorRef.current = e.target.selectionStart;
    setLocalValue(val);
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
        className="col-start-1 row-start-1 w-full h-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 transition-all resize-none overflow-hidden block whitespace-pre-wrap break-words leading-relaxed"
      />
    </div>
  );
}

const SECTIONS = [
  { id: "general", label: "כללי" },
  { id: "gilad", label: "גלעד" },
  { id: "liat", label: "ליאת" },
];

export default function TaskList() {
  const {
    taskNotes,
    updateSectionNote,
    checkedItems,
    toggleCheckItem,
    editMode,
    toggleMode,
  } = useHouseholdTasks();

  return (
    <div className="space-y-4">
      {/* כפתור החלפת מצבים */}
      <button
        type="button"
        onClick={toggleMode}
        className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border outline-none focus:outline-none ${
          editMode
            ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-md"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs"
        }`}
      >
        {editMode ? (
          <>
            <ClipboardList size={16} />
            <span>עבור למצב משימות</span>
          </>
        ) : (
          <>
            <Edit3 size={16} />
            <span>ערוך משימות</span>
          </>
        )}
      </button>

      <div className="space-y-3">
        {SECTIONS.map((sec) => {
          const rawText = taskNotes[sec.id] || "";
          const lines = rawText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

          return (
            <div
              key={sec.id}
              className="p-3.5 rounded-xl border bg-slate-50/50 border-slate-100 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">
                  {sec.label}:
                </span>
                {lines.length > 0 && !editMode && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {
                      lines.filter((l) => !checkedItems[`${sec.id}_${l}`])
                        .length
                    }{" "}
                    נותרו
                  </span>
                )}
              </div>

              {editMode ? (
                <AutoResizeTextarea
                  value={rawText}
                  onChange={(val) => updateSectionNote(sec.id, val)}
                  placeholder={`רשום משימות עבור ${sec.label} (שורה חדשה לכל משימה)...`}
                />
              ) : (
                <div className="space-y-1.5 pt-1">
                  {lines.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-1 text-center">
                      אין משימות (לחץ על "ערוך משימות" להוספה)
                    </div>
                  ) : (
                    lines.map((itemText, idx) => {
                      const itemKey = `${sec.id}_${itemText}`;
                      const isChecked = !!checkedItems[itemKey];

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleCheckItem(sec.id, itemText)}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-right transition-all cursor-pointer border outline-none focus:outline-none ${
                            isChecked
                              ? "bg-slate-100/70 border-slate-200/60 text-slate-400"
                              : "bg-white border-slate-200/80 text-slate-700 hover:border-emerald-300 shadow-2xs"
                          }`}
                        >
                          <div className="shrink-0">
                            {isChecked ? (
                              <CheckCircle2
                                size={18}
                                className="text-emerald-500 fill-emerald-50"
                              />
                            ) : (
                              <Circle size={18} className="text-slate-300" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium break-words leading-tight ${
                              isChecked ? "line-through text-slate-400" : ""
                            }`}
                          >
                            {itemText}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
