import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const STORES = [
  { id: "supermarket", label: "סופר" },
  { id: "general", label: "כללי" },
];

export function useHouseholdShopping() {
  const [editMode, setEditMode] = useState(false);
  const [shoppingNotes, setShoppingNotes] = useState({ supermarket: "", general: "" });
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);

  // האזנה בזמן אמת לפיירבייס
  useEffect(() => {
    const docRef = doc(db, "shopping", "main");
    const unsub = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.notes) setShoppingNotes(data.notes);
          if (data.checked) setCheckedItems(data.checked);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching shopping list:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // פונקציית עזר לשמירה בפיירבייס
  const saveToFirebase = async (notesToSave, checkedToSave) => {
    try {
      const docRef = doc(db, "shopping", "main");
      await setDoc(docRef, { notes: notesToSave, checked: checkedToSave }, { merge: true });
    } catch (error) {
      console.error("Error saving shopping list to Firebase:", error);
    }
  };

  const updateStoreNote = (storeId, val) => {
    const newNotes = { ...shoppingNotes, [storeId]: val };
    setShoppingNotes(newNotes);
    saveToFirebase(newNotes, checkedItems);
  };

  const toggleCheckItem = (storeId, itemText) => {
    const key = `${storeId}_${itemText.trim()}`;
    const newChecked = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newChecked);
    saveToFirebase(shoppingNotes, newChecked);
  };

  const toggleMode = () => {
    let newNotes = { ...shoppingNotes };
    let newChecked = { ...checkedItems };

    if (!editMode) {
      // מעבר מ-קניות ל-עריכה: הזרקת '✓'
      STORES.forEach((store) => {
        const lines = (newNotes[store.id] || "").split("\n");
        const updatedLines = lines.map((line) => {
          const raw = line.trim();
          if (!raw) return line;
          if (newChecked[`${store.id}_${raw}`]) {
            return `✓ ${raw}`;
          }
          return raw;
        });
        newNotes[store.id] = updatedLines.join("\n");
      });
    } else {
      // מעבר מ-עריכה ל-קניות: הסרת '✓' והמרתו לסימון אמיתי
      STORES.forEach((store) => {
        const lines = (newNotes[store.id] || "").split("\n");
        const updatedLines = lines.map((line) => {
          const raw = line.trim();
          if (!raw) return line;
          const match = raw.match(/^(?:[✓✔]\s*|[vV]\s+)(.+)$/);
          if (match) {
            const cleanText = match[1].trim();
            newChecked[`${store.id}_${cleanText}`] = true;
            return cleanText;
          } else {
            newChecked[`${store.id}_${raw}`] = false;
            return raw;
          }
        });
        newNotes[store.id] = updatedLines.join("\n");
      });
    }

    setShoppingNotes(newNotes);
    setCheckedItems(newChecked);
    setEditMode((prev) => !prev);
    saveToFirebase(newNotes, newChecked);
  };

  return {
    editMode,
    setEditMode,
    shoppingNotes,
    updateStoreNote,
    checkedItems,
    toggleCheckItem,
    toggleMode,
    loading,
  };
}