// Format date as day, month, year
export const formatDate = (utcDateString) => {
  if (!utcDateString) return '';
  
  const date = new Date(utcDateString);
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}; 