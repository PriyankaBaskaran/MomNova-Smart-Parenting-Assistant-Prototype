'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { BabyProvider } from '@/contexts/baby-context';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <BabyProvider>
          {children}
          <Toaster position="top-right" richColors />
        </BabyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
