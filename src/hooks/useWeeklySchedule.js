import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const HEBREW_DAYS = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת",
];

/**
 * Gets the Date object for Sunday of the week containing `date`.
 */
export function getSundayOfDate(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday
  const diff = d.getDate() - day;
  const sunday = new Date(d.setDate(diff));
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateKey(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object to DD/MM
 */
export function formatDateShort(d) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}/${month}`;
}

/**
 * Generates array of 7 days starting from a Sunday date.
 */
export function getWeekDaysList(sundayDate) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(sundayDate);
    dayDate.setDate(sundayDate.getDate() + i);
    days.push({
      dayIndex: i,
      dayName: HEBREW_DAYS[i],
      dateKey: formatDateKey(dayDate),
      shortDate: formatDateShort(dayDate),
      isToday: formatDateKey(dayDate) === formatDateKey(new Date()),
    });
  }
  return days;
}

export function useWeeklySchedule() {
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);

  const currentSunday = getSundayOfDate(new Date());
  
  const nextSunday = new Date(currentSunday);
  nextSunday.setDate(currentSunday.getDate() + 7);

  const currentWeekKey = formatDateKey(currentSunday);
  const nextWeekKey = formatDateKey(nextSunday);

  const currentWeekDays = getWeekDaysList(currentSunday);
  const nextWeekDays = getWeekDaysList(nextSunday);

  // Subscribe to real-time weekly schedule updates
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "weekly_schedule"),
      (snapshot) => {
        const data = {};
        snapshot.docs.forEach((docSnap) => {
          data[docSnap.id] = docSnap.data();
        });
        setSchedules(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching weekly schedule:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  /**
   * Updates note for a specific day in a week document.
   */
  const updateDayNote = async (weekKey, dayIndex, note) => {
    const docRef = doc(db, "weekly_schedule", weekKey);
    await setDoc(docRef, { [dayIndex]: note }, { merge: true });
  };

  return {
    schedules,
    loading,
    currentWeekKey,
    nextWeekKey,
    currentWeekDays,
    nextWeekDays,
    updateDayNote,
  };
}
