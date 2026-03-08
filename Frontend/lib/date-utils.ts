import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatStr) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const calculateAge = (birthDate: string): string => {
  try {
    const birth = parseISO(birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 
      ? `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
      : `${years} year${years !== 1 ? 's' : ''}`;
  } catch {
    return 'Unknown';
  }
};
