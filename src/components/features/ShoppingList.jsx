import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Edit3, CheckCircle2, Circle, ShoppingBag } from "lucide-react";
import { useHouseholdShopping } from "../../hooks/useHouseholdShopping"; // הוק פיירבייס לרשימת קניות

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
        className="col-start-1 row-start-1 w-full h-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs text-slate-700 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all resize-none overflow-hidden block whitespace-pre-wrap break-words leading-relaxed"
      />
    </div>
  );
}

const STORES = [
  { id: "supermarket", label: "סופר" },
  { id: "general", label: "כללי" },
];

export default function ShoppingList() {
  // שימוש בהוק שמסנכרן את מצב העריכה, הטקסטים והוויז עם פיירבייס
  const {
    editMode,
    setEditMode,
    shoppingNotes,
    updateStoreNote,
    checkedItems,
    toggleCheckItem,
    toggleMode,
  } = useHouseholdShopping();

  return (
    <div className="space-y-4">
      {/* כפתור החלפת מצבים */}
      <button
        type="button"
        onClick={toggleMode}
        className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border outline-none focus:outline-none ${
          editMode
            ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-md"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs"
        }`}
      >
        {editMode ? (
          <>
            <ShoppingBag size={16} />
            <span>עבור למצב קניות</span>
          </>
        ) : (
          <>
            <Edit3 size={16} />
            <span>ערוך רשימה</span>
          </>
        )}
      </button>

      {/* קטגוריות */}
      <div className="space-y-4">
        {STORES.map((store) => {
          const rawText = shoppingNotes[store.id] || "";
          const lines = rawText
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

          return (
            <div
              key={store.id}
              className="p-3.5 rounded-xl border bg-slate-50/50 border-slate-100 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">
                  {store.label}:
                </span>
                {lines.length > 0 && !editMode && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {
                      lines.filter((l) => !checkedItems[`${store.id}_${l}`])
                        .length
                    }{" "}
                    נותרו
                  </span>
                )}
              </div>

              {editMode ? (
                <AutoResizeTextarea
                  value={rawText}
                  onChange={(val) => updateStoreNote(store.id, val)}
                  placeholder={`רשום פריטים ל${store.label} (שורה חדשה לכל פריט)...`}
                />
              ) : (
                <div className="space-y-1.5 pt-1">
                  {lines.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-1 text-center">
                      אין פריטים ברשימה (לחץ על "ערוך רשימה" להוספה)
                    </div>
                  ) : (
                    lines.map((itemText, idx) => {
                      const itemKey = `${store.id}_${itemText}`;
                      const isChecked = !!checkedItems[itemKey];

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleCheckItem(store.id, itemText)}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-right transition-all cursor-pointer border outline-none focus:outline-none ${
                            isChecked
                              ? "bg-slate-100/70 border-slate-200/60 text-slate-400"
                              : "bg-white border-slate-200/80 text-slate-700 hover:border-amber-300 shadow-2xs"
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
