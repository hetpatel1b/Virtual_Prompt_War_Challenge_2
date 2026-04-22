/**
 * Format a date string to locale-friendly display.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format quiz score as "8/10 (80%)".
 * @param {number} correct
 * @param {number} total
 * @returns {string}
 */
export function formatScore(correct, total) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return `${correct}/${total} (${pct}%)`;
}

/**
 * Truncate text with ellipsis.
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export function truncateText(text, max = 120) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} ms
 * @returns {Function}
 */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
