// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://y3vmpncgmc.ap-south-1.awsapprunner.com/api/v1';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  SELECTED_BABY: 'selected_baby',
} as const;

// Mood Colors
export const MOOD_COLORS = {
  happy: '#10b981',
  neutral: '#6b7280',
  sad: '#3b82f6',
  anxious: '#f59e0b',
  stressed: '#ef4444',
} as const;

// Sentiment Color Mapping
export const getSentimentColor = (sentiment: number): string => {
  if (sentiment >= 0.6) return '#10b981'; // green
  if (sentiment >= 0.2) return '#3b82f6'; // blue
  if (sentiment >= -0.2) return '#6b7280'; // gray
  if (sentiment >= -0.6) return '#f59e0b'; // orange
  return '#ef4444'; // red
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  JOURNAL: '/journal',
  ADVICE: '/advice',
  MENTAL_HEALTH: '/assessment',
  TRENDS: '/mood-trends',
  EMERGENCY: '/emergency',
} as const;
