import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const SECTIONS = [
  { id: "general", label: "כללי" },
  { id: "gilad", label: "גלעד" },
  { id: "liat", label: "ליאת" },
];

export function useHouseholdTasks() {
  const [taskNotes, setTaskNotes] = useState({ general: "", gilad: "", liat: "" });
  const [checkedItems, setCheckedItems] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // האזנה בזמן אמת לפיירבייס
  useEffect(() => {
    const docRef = doc(db, "tasks", "main");
    const unsub = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTaskNotes({
            general: data.general || "",
            gilad: data.gilad || "",
            liat: data.liat || "",
          });
          setCheckedItems(data.checkedItems || {});
        } else {
          setTaskNotes({ general: "", gilad: "", liat: "" });
          setCheckedItems({});
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // שמירה לפיירבייס
  const saveToFirebase = async (notesToSave, checkedToSave) => {
    try {
      const docRef = doc(db, "tasks", "main");
      await setDoc(docRef, { ...notesToSave, checkedItems: checkedToSave }, { merge: true });
    } catch (error) {
      console.error("Error saving tasks to Firebase:", error);
    }
  };

  const updateSectionNote = (sectionId, val) => {
    const updated = { ...taskNotes, [sectionId]: val };
    setTaskNotes(updated);
    saveToFirebase(updated, checkedItems);
  };

  const toggleCheckItem = (sectionId, itemText) => {
    const itemKey = `${sectionId}_${itemText.trim()}`;
    const newChecked = { ...checkedItems, [itemKey]: !checkedItems[itemKey] };
    setCheckedItems(newChecked);
    saveToFirebase(taskNotes, newChecked);
  };

  const toggleMode = () => {
    let newNotes = { ...taskNotes };
    let newChecked = { ...checkedItems };

    if (!editMode) {
      // משימות -> עריכה: הזרקת '✓'
      SECTIONS.forEach((sec) => {
        const lines = (newNotes[sec.id] || "").split("\n");
        const updatedLines = lines.map((line) => {
          const raw = line.trim();
          if (!raw) return line;
          if (newChecked[`${sec.id}_${raw}`]) {
            return `✓ ${raw}`;
          }
          return raw;
        });
        newNotes[sec.id] = updatedLines.join("\n");
      });
    } else {
      // עריכה -> משימות: הסרת '✓' והמרתו לסימון
      SECTIONS.forEach((sec) => {
        const lines = (newNotes[sec.id] || "").split("\n");
        const updatedLines = lines.map((line) => {
          const raw = line.trim();
          if (!raw) return line;
          const match = raw.match(/^(?:[✓✔]\s*|[vV]\s+)(.+)$/);
          if (match) {
            const cleanText = match[1].trim();
            newChecked[`${sec.id}_${cleanText}`] = true;
            return cleanText;
          } else {
            newChecked[`${sec.id}_${raw}`] = false;
            return raw;
          }
        });
        newNotes[sec.id] = updatedLines.join("\n");
      });
    }

    setTaskNotes(newNotes);
    setCheckedItems(newChecked);
    setEditMode((prev) => !prev);
    saveToFirebase(newNotes, newChecked);
  };

  return { 
    taskNotes, 
    checkedItems, 
    editMode, 
    setEditMode, 
    loading, 
    updateSectionNote, 
    toggleCheckItem, 
    toggleMode 
  };
}