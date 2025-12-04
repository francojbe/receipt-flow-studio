// Currency formatter for Chilean Pesos
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

// Format time from date string
export const formatTime = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
};

// Format date for display
export const formatDate = (dateString: string): string => {
  if (!dateString) return '--';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
};

// Format month label
export const formatMonthLabel = (date: Date): string => {
  const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
  const year = date.getFullYear();
  return `${monthName} ${year}`;
};

// Get current datetime for input
export const getCurrentDateTimeLocal = (): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

// Get current month for input (YYYY-MM)
export const getCurrentMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

// Format YYYY-MM to "Month YYYY"
export const formatMonthYear = (monthString: string): string => {
  if (!monthString) return '';
  try {
    const [year, month] = monthString.split('-');
    if (!year || !month) return monthString;
    const date = new Date(parseInt(year), parseInt(month) - 1);
    if (isNaN(date.getTime())) return monthString;
    // Format as "Month YYYY" manually to avoid "de"
    const monthName = date.toLocaleDateString('es-ES', { month: 'long' });
    return `${monthName} ${year}`;
  } catch (e) {
    return monthString;
  }
};

// Convert data to CSV
export const convertToCSV = (data: Record<string, unknown>[]): string => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

// Download CSV file
export const downloadCSV = (csvString: string, filename: string): void => {
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
