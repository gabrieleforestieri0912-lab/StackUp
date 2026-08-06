'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';


export interface User {
 _id: string;
 id: string;
 name: string;
 email: string;
 avatar?: string;
 authMethod: 'local' | 'google' | 'github';
 createdAt: string;
 enrolledCourses: string[];
 certificates: { courseId: string; completedAt: string; certificateId: string }[];
  studyStreak: number;
  studyHours: number;
  exp: number;
}

export interface AuthContextType {
 user: User | null;
 loading: boolean;
 login: (email: string, password: string) => Promise<User>;
 register: (name: string, email: string, password: string) => Promise<User>;
 logout: () => void;
 completeOAuthLogin: (userData: User, token: string) => void;
 completeGoogleLogin: (userData: User, token: string) => void;
 refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const init = async () => {
   const { data: { session } } = await supabase.auth.getSession();
   if (session?.access_token) {
    await fetchUser(session.access_token);
   }
   setLoading(false);
  };

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
   if (event === 'SIGNED_IN' && session?.access_token) {
    await fetchUser(session.access_token);
   } else if (event === 'SIGNED_OUT') {
    setUser(null);
   }
  });

  init();
  return () => subscription.unsubscribe();
 }, []);

 const fetchUser = async (token: string) => {
  try {
   const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
   });
   const data = await res.json();
   if (res.ok && data.user) {
    setUser(data.user);
   }
  } catch {
   console.error('Failed to fetch user');
  }
 };

 const login = useCallback(async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login fallito');

  setUser(data.user);
  toast.success(`Bentornato, ${data.user.name}!`);
  return data.user as User;
 }, []);

 const register = useCallback(async (name: string, email: string, password: string) => {
  const response = await fetch('/api/auth/register', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Errore durante la registrazione');

  setUser(data.user);
  toast.success(`Account creato! Benvenuto ${name}`);
  return data.user as User;
 }, []);

 const completeOAuthLogin = useCallback((userData: User, _token: string) => {
  setUser(userData);
  toast.success(`Bentornato, ${userData.name}!`);
 }, []);

 const refreshUser = useCallback(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return;
  await fetchUser(session.access_token);
 }, []);

 const logout = useCallback(async () => {
  setUser(null);
  await supabase.auth.signOut();
  toast.success('Sessione chiusa');
  window.location.href = '/login';
 }, []);

  return (
   <AuthContext.Provider value={{ user, login, register, logout, completeOAuthLogin, completeGoogleLogin: completeOAuthLogin, refreshUser, loading }}>
    {children}
   </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
 const context = useContext(AuthContext);
 if (!context) throw new Error('useAuth must be used within an AuthProvider');
 return context;
};
