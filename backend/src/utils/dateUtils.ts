export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isValidDateFormat(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  // Match YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

export function parseDateSafe(dateStr: string): Date {
  const parts = dateStr.split('-');
  return new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
}

export function getDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDateToISO(d);
}
