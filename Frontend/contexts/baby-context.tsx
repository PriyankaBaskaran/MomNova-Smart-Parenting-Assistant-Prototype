'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { babyService } from '@/lib/api-services';
import { handleApiError } from '@/lib/api';
import { getSelectedBaby, setSelectedBaby as saveSelectedBaby, removeSelectedBaby } from '@/lib/storage';
import type { Baby, CreateBabyCommand } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from './auth-context';

interface BabyContextType {
  babies: Baby[];
  selectedBaby: Baby | null;
  isLoading: boolean;
  selectBaby: (baby: Baby) => void;
  fetchBabies: () => Promise<void>;
  addBaby: (baby: CreateBabyCommand) => Promise<Baby>;
  updateBaby: (id: string, baby: Partial<CreateBabyCommand>) => Promise<void>;
}

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBabyState] = useState<Baby | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize selected baby from localStorage
  useEffect(() => {
    const storedBaby = getSelectedBaby();
    if (storedBaby) {
      setSelectedBabyState(storedBaby);
    }
  }, []);

  // Fetch babies when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBabies();
    }
  }, [isAuthenticated, user]);

  const selectBaby = (baby: Baby) => {
    setSelectedBabyState(baby);
    saveSelectedBaby(baby);
  };

  const fetchBabies = async () => {
    try {
      setIsLoading(true);
      const babiesData = await babyService.getAll();
      
      // Ensure babiesData is an array
      const babies = Array.isArray(babiesData) ? babiesData : [];
      setBabies(babies);

      // Auto-select first baby if none selected
      if (!selectedBaby && babies.length > 0) {
        selectBaby(babies[0]);
      }
    } catch (error) {
      const message = handleApiError(error);
      console.error('Failed to fetch babies:', message);
      // Set empty array on error
      setBabies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addBaby = async (baby: CreateBabyCommand) => {
    try {
      setIsLoading(true);
      const babyData = {
        ...baby,
        userId: user?.userId,
      };
      const newBaby = await babyService.create(babyData);
      setBabies((prev) => [...prev, newBaby]);
      selectBaby(newBaby);
      toast.success('Baby profile added successfully!');
      return newBaby;
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBaby = async (id: string, baby: Partial<CreateBabyCommand>) => {
    try {
      setIsLoading(true);
      // Note: The API doesn't have an update endpoint in swagger
      // You may need to add this endpoint to your backend
      toast.error('Update baby endpoint not available yet');
      throw new Error('Update not implemented');
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: BabyContextType = {
    babies,
    selectedBaby,
    isLoading,
    selectBaby,
    fetchBabies,
    addBaby,
    updateBaby,
  };

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};

export const useBaby = (): BabyContextType => {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
};
