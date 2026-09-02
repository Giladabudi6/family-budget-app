# Quick Tools Overview

Overview of the helper features grouped as "Quick Tools" in the user interface.

---

## 1. Module Scope

The Quick Tools provide household management utilities that exist alongside the financial dashboard to make daily planning easier. They are found in:

```text
src/components/features/
├── QuickTools.jsx                 # Sidebar or collapsible wrapper containing the tools
├── WeeklySchedule.jsx             # Family schedule planner
├── TaskList.jsx                   # Categorized task board
└── ShoppingList.jsx               # Sync-based shopping notes with checkboxes
```

---

## 2. Shared Characteristics

- **Accessibility:** Designed as rapid-access items in the app's UI.
- **State management:** Integrated with custom hooks located in `src/hooks/` (except Vouchers, which uses localStorage directly inside the component).
- **Hebrew Support:** The text and UI are completely localized in Hebrew.

