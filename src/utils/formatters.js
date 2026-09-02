/**
/**
 * Formats a number as ILS currency with thousands separators.
 * @param {number} amount
 * @returns {string} e.g. "₪1,500"
 */
export const formatCurrency = (amount) => {
  return `₪${(amount || 0).toLocaleString()}`;
};

/**
 * Formats a YYYY-MM string to MM/YYYY or DD/MM/YYYY
 * @param {string} monthStr e.g. "2026-07"
 * @returns {string} e.g. "07/2026"
 */
export const formatMonthDisplay = (monthStr) => {
  if (!monthStr) return "";
  return monthStr.split("-").reverse().join("/");
};

/**
 * Formats a YYYY-MM-DD string to DD/MM/YYYY
 * @param {string} dateStr e.g. "2026-07-28"
 * @returns {string} e.g. "28/07/2026"
 */
export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.split("-").reverse().join("/");
};
