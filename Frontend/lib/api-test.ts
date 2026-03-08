/**
 * API Testing Utilities
 * Use these functions to test API endpoints during development
 */

import api from './api';
import type { LoginCredentials, RegisterData } from './types';

export const testAPI = {
  // Test authentication
  async testAuth() {
    console.group('🔐 Testing Authentication');
    
    try {
      // Test login
      console.log('Testing login...');
      const loginData: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const loginResponse = await api.post('/auth/login', loginData);
      console.log('✅ Login successful:', loginResponse.data);

      // Test get current user
      console.log('Testing get current user...');
      const meResponse = await api.get('/auth/me');
      console.log('✅ Get user successful:', meResponse.data);
    } catch (error) {
      console.error('❌ Auth test failed:', error);
    }
    
    console.groupEnd();
  },

  // Test baby endpoints
  async testBabies() {
    console.group('👶 Testing Baby Endpoints');
    
    try {
      // Get all babies
      console.log('Testing get all babies...');
      const babiesResponse = await api.get('/babies');
      console.log('✅ Get babies successful:', babiesResponse.data);

      // Create baby
      console.log('Testing create baby...');
      const newBaby = {
        name: 'Test Baby',
        dateOfBirth: '2024-01-01',
        gender: 'male' as const,
      };
      const createResponse = await api.post('/babies', newBaby);
      console.log('✅ Create baby successful:', createResponse.data);
    } catch (error) {
      console.error('❌ Baby test failed:', error);
    }
    
    console.groupEnd();
  },

  // Test journal endpoints
  async testJournals(babyId: string) {
    console.group('📝 Testing Journal Endpoints');
    
    try {
      // Get all journals
      console.log('Testing get all journals...');
      const journalsResponse = await api.get(`/journals?babyId=${babyId}`);
      console.log('✅ Get journals successful:', journalsResponse.data);

      // Create journal
      console.log('Testing create journal...');
      const newJournal = {
        babyId,
        date: new Date().toISOString(),
        mood: 'happy' as const,
        content: 'Test journal entry',
      };
      const createResponse = await api.post('/journals', newJournal);
      console.log('✅ Create journal successful:', createResponse.data);
    } catch (error) {
      console.error('❌ Journal test failed:', error);
    }
    
    console.groupEnd();
  },

  // Test mental health endpoints
  async testMentalHealth(babyId: string) {
    console.group('🧠 Testing Mental Health Endpoints');
    
    try {
      // Get score
      console.log('Testing get mental health score...');
      const scoreResponse = await api.get(`/mental-health/score?babyId=${babyId}`);
      console.log('✅ Get score successful:', scoreResponse.data);

      // Get history
      console.log('Testing get mental health history...');
      const historyResponse = await api.get(`/mental-health/history?babyId=${babyId}&days=30`);
      console.log('✅ Get history successful:', historyResponse.data);
    } catch (error) {
      console.error('❌ Mental health test failed:', error);
    }
    
    console.groupEnd();
  },

  // Test all endpoints
  async testAll() {
    console.log('🚀 Starting comprehensive API tests...\n');
    
    await this.testAuth();
    await this.testBabies();
    
    // Use a test baby ID - replace with actual ID from your API
    const testBabyId = 'test-baby-id';
    await this.testJournals(testBabyId);
    await this.testMentalHealth(testBabyId);
    
    console.log('\n✨ All API tests completed!');
  },
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAPI = testAPI;
}
