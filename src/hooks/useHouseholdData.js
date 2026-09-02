import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../services/firebase";

export function useHouseholdData(currentMonth) {
  const [transactions, setTransactions] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [approvingIds, setApprovingIds] = useState(new Set());

  // Listen to Firestore real-time changes
  useEffect(() => {
    const unsubTrans = onSnapshot(
      collection(db, "transactions"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(
          data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      }
    );

    const unsubRec = onSnapshot(collection(db, "recurring"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecurring(data.filter((r) => r.status !== "completed"));
    });

    const unsubBudgets = onSnapshot(
      doc(db, "settings", "budgets"),
      (docSnap) => {
        if (docSnap.exists()) {
          setBudgets(docSnap.data());
        }
      }
    );

    return () => {
      unsubTrans();
      unsubRec();
      unsubBudgets();
    };
  }, []);

  const addTransaction = async ({ amount, type, category, note, date }) => {
    if (!amount || !category) return;
    await addDoc(collection(db, "transactions"), {
      amount: Number(amount),
      type,
      category,
      note,
      date,
      month: date.slice(0, 7),
    });
  };

  const deleteTrans = async (id) => {
    await deleteDoc(doc(db, "transactions", id));
  };

  const addRecurring = async ({ amount, type, category, note, installments }) => {
    if (!amount || !category) return;

    await addDoc(collection(db, "recurring"), {
      amount: Number(amount),
      type,
      category,
      note,
      installmentsTotal: installments ? Number(installments) : null,
      installmentsPaid: 0,
      status: "active",
    });
  };

  const deleteRecurring = async (id) => {
    await deleteDoc(doc(db, "recurring", id));
  };

  const approveRecurring = async (recItem) => {
    if (approvingIds.has(recItem.id)) return;
    setApprovingIds((prev) => new Set(prev).add(recItem.id));

    const today = new Date();
    const todayMonthStr = today.toISOString().slice(0, 7);

    let targetDate = `${currentMonth}-01`;
    if (currentMonth === todayMonthStr) {
      targetDate = today.toISOString().split("T")[0];
    }

    const dedupeDocId = `${recItem.id}_${currentMonth}`;
    const dedupeRef = doc(db, "recurring_approvals", dedupeDocId);
    const recDocRef = doc(db, "recurring", recItem.id);

    try {
      await runTransaction(db, async (transaction) => {
        const dedupeSnap = await transaction.get(dedupeRef);
        if (dedupeSnap.exists()) return;

        const recSnap = await transaction.get(recDocRef);
        if (!recSnap.exists()) return;
        const recData = recSnap.data();

        transaction.set(dedupeRef, {
          approvedAt: new Date().toISOString(),
          month: currentMonth,
          recurringId: recItem.id,
        });

        const paymentText = recData.installmentsTotal
          ? `(תשלום ${(recData.installmentsPaid || 0) + 1} מתוך ${recData.installmentsTotal})`
          : "(הוראת קבע)";

        const newTransRef = doc(collection(db, "transactions"));
        transaction.set(newTransRef, {
          amount: recData.amount,
          type: recData.type,
          category: recData.category,
          note: recData.note ? `${recData.note} ${paymentText}` : paymentText,
          date: targetDate,
          month: currentMonth,
          recurringId: recItem.id,
        });

        if (recData.installmentsTotal) {
          const newPaid = (recData.installmentsPaid || 0) + 1;
          transaction.update(recDocRef, {
            installmentsPaid: newPaid,
            status:
              newPaid >= recData.installmentsTotal ? "completed" : "active",
          });
        }
      });
    } finally {
      setApprovingIds((prev) => {
        const next = new Set(prev);
        next.delete(recItem.id);
        return next;
      });
    }
  };

  const updateBudget = async (cat, value) => {
    await setDoc(
      doc(db, "settings", "budgets"),
      {
        [cat]: value === "" ? 0 : Number(value),
      },
      { merge: true }
    );
  };

  return {
    transactions,
    recurring,
    budgets,
    approvingIds,
    addTransaction,
    deleteTrans,
    addRecurring,
    deleteRecurring,
    approveRecurring,
    updateBudget,
  };
}
