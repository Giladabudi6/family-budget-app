/**
 * Computes monthly financial statistics based on transactions and selected month.
 * @param {Array} transactions 
 * @param {string} currentMonth e.g. "2026-07"
 * @returns {Object} { filtered, income, expense, savings, balance, catBreakdown }
 */
export const calculateMonthData = (transactions, currentMonth) => {
  const filtered = transactions.filter((t) => t.month === currentMonth);
  
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const savings = filtered
    .filter((t) => t.type === "savings")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const catBreakdown = {};
  filtered
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      catBreakdown[t.category] = (catBreakdown[t.category] || 0) + t.amount;
    });

  return {
    filtered,
    income,
    expense,
    savings,
    balance: income - expense,
    catBreakdown,
  };
};

/**
 * Returns recurring payments pending approval for the current month.
 * @param {Array} transactions 
 * @param {Array} recurring 
 * @param {string} currentMonth 
 * @returns {Array} pending recurring items
 */
export const getPendingRecurring = (transactions, recurring, currentMonth) => {
  const approvedIds = transactions
    .filter((t) => t.month === currentMonth && t.recurringId)
    .map((t) => t.recurringId);

  return recurring.filter((r) => !approvedIds.includes(r.id));
};
