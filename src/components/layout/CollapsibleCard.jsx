import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CollapsibleCard({
  icon: Icon,
  iconColor = "text-indigo-500",
  badgeBg = "bg-slate-100",
  badgeColor = "text-slate-500",
  title,
  badgeCount,
  defaultOpen = false,
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  children,
  className = "",
  printBorder = "print:border-slate-200",
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const toggle = () => {
    if (externalOnToggle) {
      externalOnToggle(!isOpen);
    } else {
      setInternalIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden transition-all ${printBorder} ${className}`}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50 transition-colors text-right outline-none cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className={iconColor} />}
          <span className="text-xs font-bold text-slate-700">{title}</span>
          {badgeCount !== undefined && (
            <span
              className={`${badgeBg} ${badgeColor} px-2 py-0.5 rounded-full text-[10px] font-bold`}
            >
              {badgeCount}
            </span>
          )}
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-100/60 bg-white space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
