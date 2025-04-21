'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, listenToAuthChanges, signOut } from '../../firebase/auth';

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
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setEmailVerified(currentUser.emailVerified);
    }

    // Listen for auth state changes
    const unsubscribe = listenToAuthChanges((user) => {
      setUser(user);
      setEmailVerified(user?.emailVerified || false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Redirect based on authentication status
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
      
      // Allow access to forgot-password page regardless of auth status
      if (pathname === '/forgot-password') {
        return;
      }
      
      if (!user && pathname.startsWith('/app')) {
        // If not logged in and trying to access protected route
        router.push('/login');
      } else if (user && isAuthPage) {
        // If signed in with Google or verified email, redirect to app
        if (user.providerData[0]?.providerId === 'google.com' || user.emailVerified) {
          router.push('/app');
        }
        // If email not verified, let them stay on login page to see verification warning
      }
    }
  }, [user, isLoading, pathname, router, emailVerified]);

  const logout = async () => {
    try {
      await signOut();
      router.push('/login');
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