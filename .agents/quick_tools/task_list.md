# Household Task List Tool Context

Context and logic design for the Categorized Household Task List.

---

## 1. Files & Hooks
- **Component:** `src/components/features/TaskList.jsx`
- **Custom Hook:** `src/hooks/useHouseholdTasks.js`
- **Firebase Collection:** `tasks`, Document: `main`

---

## 2. Core Logic & States

- **Sections (Categories):** Divided by owner/scope:
  - `general` (כללי)
  - `gilad` (גלעד)
  - `liat` (ליאת)
- **Checked items dictionary:** Key format is `${sectionId}_${itemText.trim()}`, mapping to a boolean indicating if it is completed.
- **Dual Mode (Smart Toggling):**
  - **Tasks View Mode (משימות):** Renders tasks as checkable items. Completed tasks are struck through or dimmed.
  - **Edit Mode (עריכה):** Renders a text area per section allowing quick typing (one task per line).
  - **Toggling Logic:** Same as the shopping list:
    - Checked items gain a `✓` prefix in Edit Mode textareas.
    - Custom prefix characters (`✓`, `✔`, `v `) are parsed back into the boolean completion dictionary when exiting Edit Mode.
- **Storage:** Synced to Firestore under `tasks/main` with values for each section's raw text and the completed task dictionary.

