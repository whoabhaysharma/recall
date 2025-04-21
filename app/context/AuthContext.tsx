'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getCurrentUser, listenToAuthChanges, signOut } from '../../firebase/auth';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  emailVerified: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  emailVerified: false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();

  // Verify the session token on the server side
  const verifySession = async () => {
    try {
      const response = await axios.get('/api/auth/verify');
      return response.data.authenticated;
    } catch (error) {
      console.error('Session verification failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // Check if user is already logged in locally
      const currentUser = getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setEmailVerified(currentUser.emailVerified);
        
        // Verify the session is also valid on the server
        const isSessionValid = await verifySession();
        
        // If the session is invalid but we have a local user,
        // it means the session has expired on the server
        if (!isSessionValid) {
          console.log('Session expired, logging out');
          await signOut();
          setUser(null);
        }
      }

      // Listen for auth state changes
      const unsubscribe = listenToAuthChanges((user) => {
        setUser(user);
        setEmailVerified(user?.emailVerified || false);
        setIsLoading(false);
      });

      setIsLoading(false);
      return unsubscribe;
    };

    initAuth();
  }, []);

  // The middleware will handle redirects at the server level,
  // preventing any flash of unauthorized content.

  const logout = async () => {
    try {
      await signOut();
      // Let middleware handle redirection after logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, emailVerified, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 