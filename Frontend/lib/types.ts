// API Response Types based on actual Swagger API

// Authentication Types
export interface User {
  userId: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  location?: string;
}

// Baby Profile Types
export interface Baby {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  gender?: string;
  feedingType?: string;
  notes?: string;
}

export interface CreateBabyCommand {
  userId?: string;
  name: string;
  dateOfBirth: string;
  gender?: string;
  feedingType?: string;
  notes?: string;
}

// Journal Entry Types
export interface SentimentScores {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

export interface EmergencyResource {
  name: string;
  phone: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  sentiment: string;
  sentimentScores: SentimentScores;
  confidenceScore: number;
  language: string;
  createdAt: string;
  hasRedFlags: boolean;
  emergencyResources?: EmergencyResource[];
}

export interface CreateJournalEntryRequest {
  content: string;
  mood?: string;
  babyId: string;
}

// Mental Health Assessment Types
export interface MentalHealthAssessment {
  riskLevel: string;
  riskScore: number;
  recommendations: string[];
  concerningPatterns: string[];
  positiveIndicators: string[];
  assessmentDate: string;
}

// Mood Trends Types
export interface MoodTrendResponse {
  startDate: string;
  endDate: string;
  averageSentiment: number;
  trend: string;
  hasConcerningPattern: boolean;
}

// Daily Advice Types
export interface DailyAdvice {
  advice: string;
  category: string;
  babyAgeInDays: number;
  generatedAt: string;
}

// Sentiment Analysis Types
export interface AnalysisCommand {
  babyId?: string;
  text: string;
}

export interface SentimentAnalysisResult {
  sentiment: string;
  sentimentScores: SentimentScores;
  confidenceScore: number;
  language: string;
  hasRedFlags: boolean;
  emergencyResources?: EmergencyResource[];
}

// Generic API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
