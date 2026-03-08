import api, { handleApiResponse } from './api';
import type {
  JournalEntry,
  CreateJournalEntryRequest,
  MentalHealthAssessment,
  DailyAdvice,
  MoodTrendResponse,
  Baby,
  CreateBabyCommand,
  AnalysisCommand,
  SentimentAnalysisResult,
} from './types';

// Baby Services
export const babyService = {
  getAll: async () => {
    try {
      const response = await api.get<Baby[]>('/Baby');
      const data = handleApiResponse(response);
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching babies:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  create: async (data: CreateBabyCommand) => {
    const response = await api.post<Baby>('/Baby', data);
    return handleApiResponse(response);
  },

  getById: async (babyId: string) => {
    const response = await api.get<Baby>(`/Baby/${babyId}`);
    return handleApiResponse(response);
  },

  // Note: The API doesn't have a get all babies endpoint in the swagger
  // You may need to add this endpoint or fetch by userId
};

// Journal Services
export const journalService = {
  getAll: async (startDate?: string, endDate?: string) => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get<JournalEntry[]>('/Journal/entries', { params });
    return handleApiResponse(response);
  },

  getById: async (id: string) => {
    const response = await api.get<JournalEntry>(`/Journal/entries/${id}`);
    return handleApiResponse(response);
  },

  create: async (data: CreateJournalEntryRequest) => {
    const response = await api.post<JournalEntry>('/Journal/entries', data);
    return handleApiResponse(response);
  },

  update: async (id: string, data: Partial<CreateJournalEntryRequest>) => {
    const response = await api.put<JournalEntry>(`/Journal/entries/${id}`, data);
    return handleApiResponse(response);
  },

  delete: async (id: string) => {
    await api.delete(`/Journal/entries/${id}`);
  },
};

// Mental Health Services
export const mentalHealthService = {
  getAssessment: async (days: number = 14) => {
    const response = await api.get<MentalHealthAssessment>(
      `/MentalHealth/assessment?days=${days}`
    );
    return handleApiResponse(response);
  },
};

// Daily Advice Services
export const adviceService = {
  generate: async (babyId: string) => {
    const response = await api.post<DailyAdvice>(
      `/DailyAdvice/generate?babyId=${babyId}`
    );
    return handleApiResponse(response);
  },
};

// Analytics Services
export const analyticsService = {
  getMoodTrends: async (startDate: string, endDate: string) => {
    const response = await api.get<MoodTrendResponse>(
      `/Analytics/mood-trends?startDate=${startDate}&endDate=${endDate}`
    );
    return handleApiResponse(response);
  },
};

// Sentiment Analysis Services
export const sentimentService = {
  analyze: async (data: AnalysisCommand) => {
    const response = await api.post<SentimentAnalysisResult>(
      '/SentimentAnalysis/analyze',
      data
    );
    return handleApiResponse(response);
  },

  getByBabyId: async (babyId: string) => {
    const response = await api.get<SentimentAnalysisResult[]>(
      `/SentimentAnalysis/${babyId}`
    );
    return handleApiResponse(response);
  },
};
