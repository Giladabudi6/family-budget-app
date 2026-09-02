import React, { useState, useEffect } from "react";
import { 
  Ticket, Plus, Trash2, Edit2, ExternalLink, 
  ChevronDown, ChevronUp, X, Check, Calendar, Store, Wallet 
} from "lucide-react";

export default function VouchersManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [vouchers, setVouchers] = useState(() => {
    const saved = localStorage.getItem("family_vouchers");
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState("");
  const [balance, setBalance] = useState("");
  const [link, setLink] = useState("");
  const [expiry, setExpiry] = useState("");
  const [stores, setStores] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editBalanceValue, setEditBalanceValue] = useState("");

  useEffect(() => {
    localStorage.setItem("family_vouchers", JSON.stringify(vouchers));
  }, [vouchers]);

  // פונקציית הוספה חכמה שמבדילה בין קישור לקוד
  const handleAddVoucher = (e) => {
    e.preventDefault();
    if (!title || !balance) return;

    const trimmedLink = link.trim();
    let finalLink = trimmedLink;
    
    // מוסיף https רק אם זה באמת נראה כמו כתובת אתר (מכיל נקודה ובלי רווחים) ולא מתחיל כבר ב-http
    if (trimmedLink && !trimmedLink.startsWith("http") && trimmedLink.includes(".") && !trimmedLink.includes(" ")) {
      finalLink = `https://${trimmedLink}`;
    }

    const newVoucher = {
      id: Date.now().toString(),
      title,
      balance: parseFloat(balance),
      link: finalLink,
      expiry,
      stores,
    };

    setVouchers([newVoucher, ...vouchers]);
    
    setTitle("");
    setBalance("");
    setLink("");
    setExpiry("");
    setStores("");
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את השובר הזה?")) {
      setVouchers(vouchers.filter((v) => v.id !== id));
    }
  };

  const startEdit = (voucher) => {
    setEditingId(voucher.id);
    setEditBalanceValue(voucher.balance);
  };

  const saveBalance = (id) => {
    setVouchers(
      vouchers.map((v) => 
        v.id === id ? { ...v, balance: parseFloat(editBalanceValue) || 0 } : v
      )
    );
    setEditingId(null);
  };

  const sortedVouchers = [...vouchers].sort((a, b) => {
    if (a.expiry && b.expiry) return new Date(a.expiry) - new Date(b.expiry);
    if (a.expiry) return -1;
    if (b.expiry) return 1;
    return 0;
  });

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden transition-all print:hidden">
      {/* כפתור הסרגל הראשי */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50 transition-colors text-right outline-none cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Ticket size={16} className="text-violet-500" />
          <span className="text-xs font-bold text-slate-700">שוברים וכרטיסי מתנה</span>
          <span className="bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
            {vouchers.length}
          </span>
        </div>
        <div className="text-slate-400">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* תוכן השוברים */}
      {isOpen && (
        <div className="p-5 border-t border-slate-100/60 bg-white space-y-4">
          
          {/* שורת פעולות עליונה */}
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-500">השוברים שלך (לפי תאריך תפוגה)</h3>
            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1 text-[11px] bg-violet-50 text-violet-600 font-bold px-2.5 py-1.5 rounded-xl hover:bg-violet-100 transition-colors cursor-pointer"
              >
                <Plus size={12} /> הוספת שובר חדש
              </button>
            )}
          </div>

          {/* טופס הוספה */}
          {isAdding && (
            <form onSubmit={handleAddVoucher} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">פרטי השובר החדש</span>
                <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">שם השובר / חברה</label>
                  <input
                    type="text" required placeholder="למשל: תו הזהב, BuyMe" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">יתרה בשקלים (₪)</label>
                  <input
                    type="number" required step="0.01" placeholder="0.00" value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">תוקף השובר (אופציונלי)</label>
                  <input
                    type="date" value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">קישור לאתר או מספר קוד השובר</label>
                  <input
                    type="text" placeholder="הדבק לינק או הקלד מספר שובר" value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:border-violet-400 text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">רשתות מכבדות עיקריות</label>
                <input
                  type="text" placeholder="למשל: שופרסל, פוקס, קסטרו..." value={stores}
                  onChange={(e) => setStores(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-white text-xs outline-none focus:border-violet-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                שמירת שובר במערכת
              </button>
            </form>
          )}

          {/* תצוגת רשימת השוברים */}
          {sortedVouchers.length === 0 ? (
            <p className="text-slate-400 text-center text-xs py-4">אין עדיין שוברים רשומים במערכת</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pl-1">
              {sortedVouchers.map((v) => {
                const isExpired = v.expiry && new Date(v.expiry) < new Date();
                
                return (
                  <div 
                    key={v.id} 
                    className={`p-4 rounded-xl border flex flex-col gap-3 transition-all shadow-2xs ${
                      isExpired ? "bg-rose-50/40 border-rose-100" : "bg-slate-50/50 border-slate-100"
                    }`}
                  >
                    {/* שורה עליונה: כותרת, תוקף ופקדים */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* ימין: כותרת ותג תוקף */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className={`p-2 rounded-xl ${isExpired ? "bg-rose-100 text-rose-600" : "bg-violet-100 text-violet-600"}`}>
                          <Wallet size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs">{v.title}</h4>
                          <div className="mt-1">
                            {v.expiry ? (
                              <span className={`text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                                isExpired ? "bg-rose-100 text-rose-700 font-bold" : "bg-slate-200/70 text-slate-600"
                              }`}>
                                <Calendar size={11} /> תוקף: {v.expiry.split("-").reverse().join("/")} {isExpired && "(פג תוקף)"}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md">ללא הגבלת תוקף</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* שמאל: מנגנון רינדור חכם לקישור / קוד שובר */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-200/60">
                        
                        {/* זיהוי דינמי בין קוד למספר טקסטואלי */}
                        {v.link ? (
                          (() => {
                            let cleanValue = v.link.trim();
                            let isUrl = false;

                            if (cleanValue.startsWith("https://") && !cleanValue.slice(8).includes(".")) {
                              cleanValue = cleanValue.slice(8);
                            } else if (cleanValue.startsWith("http://") && !cleanValue.slice(7).includes(".")) {
                              cleanValue = cleanValue.slice(7);
                            } else if (cleanValue.startsWith("http") && cleanValue.includes(".")) {
                              isUrl = true;
                            } else if (cleanValue.includes(".") && !cleanValue.includes(" ")) {
                              isUrl = true;
                            }

                            if (isUrl) {
                              const hrefUrl = cleanValue.startsWith("http") ? cleanValue : `https://${cleanValue}`;
                              return (
                                <a
                                  href={hrefUrl} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[10px] text-violet-600 font-bold hover:underline bg-violet-50 px-2.5 py-1.5 rounded-lg border border-violet-100"
                                >
                                  שובר דיגיטלי <ExternalLink size={11} />
                                </a>
                              );
                            }

                            return (
                              <div className="flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200/60 font-mono">
                                <span className="text-[10px] text-slate-400 font-sans font-normal">קוד:</span>
                                <span className="font-bold tracking-wider selection:bg-violet-200">{cleanValue}</span>
                              </div>
                            );
                          })()
                        ) : (
                          <span className="text-[10px] text-slate-400 italic px-1">אין קוד/קישור</span>
                        )}

                        {/* תצוגת/עריכת יתרה */}
                        <div className="bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-3xs flex items-center justify-center min-w-[80px] h-8">
                          {editingId === v.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number" step="0.01" value={editBalanceValue}
                                onChange={(e) => setEditBalanceValue(e.target.value)}
                                className="w-14 p-0.5 border border-violet-300 rounded text-xs text-center font-bold text-slate-700 outline-none"
                                autoFocus
                              />
                              <button onClick={() => saveBalance(v.id)} className="p-0.5 text-emerald-600 hover:text-emerald-700 cursor-pointer">
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 cursor-pointer group w-full justify-center" onClick={() => startEdit(v)}>
                              <span className="text-xs font-black text-slate-800 group-hover:text-violet-600 transition-colors">₪{v.balance}</span>
                              <Edit2 size={10} className="text-slate-300 group-hover:text-violet-400 transition-colors" />
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50/50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {v.stores && (
                      <div className="text-xs text-slate-600 flex items-start gap-1.5 bg-white/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed shadow-3xs">
                        <Store size={13} className="text-slate-400 mt-0.5 shrink-0" />
                        <span><strong>רשתות מכבדות עיקריות:</strong> {v.stores}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 pt-2 border-t border-slate-100 cursor-pointer"
          >
            <X size={12} /> סגור תפריט שוברים
          </button>
        </div>
      )}
    </div>
  );
}
