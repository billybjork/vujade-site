// dateUtils.js
export function formatDate(dateString) {
  if (!dateString) return "[Date not available]"; // Handle undefined or null dates
  const date = new Date(dateString);
  if (isNaN(date)) return "[Invalid Date]"; // Check if the date is valid
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${month}, ${year}`;
}
