import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Trash2, TrendingUp, TrendingDown, Wallet, Building2 } from 'lucide-react';

const CATEGORIES = {
  expense: ['סופר וקניות', 'דלק ורכב', 'חשבונות (חשמל, ארנונה)', 'אוכל בחוץ', 'ביגוד', 'פנאי וחופשות', 'שונות'],
  income: ['משכורת', 'עצמאי / צדדי', 'מתנות / החזרים'],
  savings: ['חיסכון לטווח ארוך', 'השקעות']
};

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [bankBalance, setBankBalance] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  // States for forms
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBankBalance, setNewBankBalance] = useState('');

  // Fetch data in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    });

    const fetchBank = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'bank'));
      if (docSnap.exists()) setBankBalance(docSnap.data().balance);
    };
    fetchBank();

    return () => unsub();
  }, []);

  // Update categories dynamically when type changes
  useEffect(() => {
    setCategory(CATEGORIES[type][0]);
  }, [type]);

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    await addDoc(collection(db, 'transactions'), {
      amount: Number(amount), type, category, note, date, month: date.slice(0, 7)
    });
    
    setAmount(''); setNote('');
  };

  const updateBankBalance = async () => {
    if (!newBankBalance) return;
    await setDoc(doc(db, 'settings', 'bank'), { balance: Number(newBankBalance) });
    setBankBalance(Number(newBankBalance));
    setNewBankBalance('');
  };

  const deleteTrans = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  // Calculations for current month
  const monthData = useMemo(() => {
    const filtered = transactions.filter(t => t.month === currentMonth);
    const income = filtered.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = filtered.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const savings = filtered.filter(t => t.type === 'savings').reduce((acc, curr) => acc + curr.amount, 0);
    
    // Category Breakdown
    const catBreakdown = {};
    filtered.filter(t => t.type === 'expense').forEach(t => {
      catBreakdown[t.category] = (catBreakdown[t.category] || 0) + t.amount;
    });

    return { filtered, income, expense, savings, balance: income - expense - savings, catBreakdown };
  }, [transactions, currentMonth]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans pb-20">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">התקציב המשפחתי</h1>
          <input 
            type="month" 
            value={currentMonth} 
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="p-2 rounded-lg border shadow-sm text-lg font-semibold text-center"
          />
        </header>

        {/* Summaries */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <h3 className="text-gray-500 text-sm mb-1">הכנסות</h3>
            <p className="text-xl font-bold text-emerald-600">₪{monthData.income}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <h3 className="text-gray-500 text-sm mb-1">הוצאות</h3>
            <p className="text-xl font-bold text-red-500">₪{monthData.expense}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <h3 className="text-gray-500 text-sm mb-1">חסכונות</h3>
            <p className="text-xl font-bold text-blue-600">₪{monthData.savings}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center border-b-4 border-indigo-500">
            <h3 className="text-gray-500 text-sm mb-1">נותר להוציא</h3>
            <p className={`text-xl font-bold ${monthData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₪{monthData.balance}
            </p>
          </div>
        </div>

        {/* Bank Balance Update */}
        <div className="bg-indigo-50 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-100">
          <div className="flex items-center gap-2">
            <Building2 className="text-indigo-600" />
            <span className="font-semibold text-gray-700">יתרה בבנק (מעודכן ידנית):</span>
            <span className="text-xl font-bold text-indigo-700">₪{bankBalance}</span>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="number" 
              placeholder="עדכן יתרה..." 
              value={newBankBalance}
              onChange={(e) => setNewBankBalance(e.target.value)}
              className="p-2 border rounded-lg flex-1 md:w-32"
            />
            <button onClick={updateBankBalance} className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700">עדכן</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Wallet className="w-5 h-5"/> הוסף תנועה</h2>
            <form onSubmit={addTransaction} className="space-y-4">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                {[
                  { id: 'expense', label: 'הוצאה', color: 'bg-red-500 text-white' },
                  { id: 'income', label: 'הכנסה', color: 'bg-emerald-500 text-white' },
                  { id: 'savings', label: 'חיסכון', color: 'bg-blue-500 text-white' }
                ].map(t => (
                  <button 
                    key={t.id} type="button" 
                    onClick={() => setType(t.id)}
                    className={`flex-1 py-2 rounded-md font-medium transition-all ${type === t.id ? t.color + ' shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">סכום (₪)</label>
                  <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">תאריך</label>
                  <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">קטגוריה</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50">
                  {CATEGORIES[type].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">הערה (לא חובה)</label>
                <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="למשל: סופר פארם, משכורת בוקר..." className="w-full p-2 border rounded-lg bg-gray-50" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                הוסף {type === 'expense' ? 'הוצאה' : type === 'income' ? 'הכנסה' : 'חיסכון'}
              </button>
            </form>
          </div>

          {/* Breakdown & List */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold mb-4">הוצאות לפי קטגוריה ({currentMonth})</h2>
              {Object.keys(monthData.catBreakdown).length === 0 ? <p className="text-gray-400 text-center">אין הוצאות החודש</p> : (
                <div className="space-y-3">
                  {Object.entries(monthData.catBreakdown).sort((a,b) => b[1] - a[1]).map(([cat, val]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat}</span>
                        <span className="text-gray-900">₪{val}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${Math.min((val/monthData.expense)*100, 100)}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold mb-4">פירוט תנועות</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {monthData.filtered.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${t.type === 'expense' ? 'bg-red-100 text-red-600' : t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                        {t.type === 'expense' ? <TrendingDown size={18}/> : <TrendingUp size={18}/>}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{t.category}</p>
                        <p className="text-xs text-gray-500">{t.note} • {t.date.split('-').reverse().join('-')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${t.type === 'expense' ? 'text-gray-800' : t.type === 'income' ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {t.type === 'expense' ? '-' : '+'}₪{t.amount}
                      </span>
                      <button onClick={() => deleteTrans(t.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}