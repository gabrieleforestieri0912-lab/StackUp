'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
export default function Providers({ children }: { children: React.ReactNode }) {
 return (
  <AuthProvider>
   {children}
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          color: '#e4e4e7',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 600,
        },
        success: {
          iconTheme: { primary: '#f97316', secondary: '#1a1a1a' },
        },
      }}
    />
  </AuthProvider>
 );
}
