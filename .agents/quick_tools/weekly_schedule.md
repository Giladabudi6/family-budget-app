# Weekly Schedule Tool Context

Context and design details for the Weekly Family Schedule Planner.

---

## 1. Files & Hooks
- **Component:** `src/components/features/WeeklySchedule.jsx`
- **Custom Hook:** `src/hooks/useWeeklySchedule.js`
- **Firebase Collection:** `weekly_schedule` (Documents keyed by Sunday of that week in format `YYYY-MM-DD`).

---

## 2. Core Logic & Display

- **Days of the Week:** Renders 7 days in Hebrew (Sunday to Saturday: ראשון, שני, שלישי, רביעי, חמישי, שישי, שבת).
- **Dual View:** Allows toggling between the "Current Week" (השבוע הנוכחי) and the "Next Week" (השבוע הבא).
- **Date Matching:** The hook resolves dates relative to current Sunday using utility helpers:
  - `getSundayOfDate`
  - `formatDateKey` (to generate YYYY-MM-DD keys)
  - `getWeekDaysList` (creates array of day objects containing `dayName`, `dateKey`, `shortDate`, `isToday` boolean)
- **Inline Editing:** Each day is a card containing a textarea. Editing a note immediately updates Firestore via `updateDayNote(weekKey, dayIndex, noteText)`.
- **Today Highlight:** If `day.isToday` is true, the UI applies a distinct highlight (different border or background) to indicate the current day of the week.

