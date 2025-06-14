"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle, resendVerificationEmail } from '../../firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationWarning, setVerificationWarning] = useState<string | null>(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setVerificationWarning(null);
    
    try {
      const { user, error } = await signInWithEmail(email, password);
      
      if (error) {
        // Handle verification error specifically
        if (error.includes('email-not-verified') || error.includes('not verified')) {
          setVerificationWarning("Your email is not verified. Please check your inbox and verify your email before logging in.");
          setIsLoading(false);
          return;
        }
        
        setError(error);
        setIsLoading(false);
        return;
      }
      
      if (user) {
        // Small delay before redirecting to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to app dashboard
        router.push('/app');
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }
      
      if (user) {
        // Small delay before redirecting to ensure cookie is set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to app dashboard
        router.push('/app');
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login");
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || !password) {
      setError("Please enter your email and password to resend the verification email");
      return;
    }
    
    setResendingEmail(true);
    setResendSuccess(false);
    
    // First login to get the user object
    const { user, error } = await signInWithEmail(email, password);
    
    if (error) {
      setError(error);
      setResendingEmail(false);
      return;
    }
    
    if (user) {
      // Resend verification email
      const { success, error } = await resendVerificationEmail(user);
      
      if (error) {
        setError(error);
      } else if (success) {
        setResendSuccess(true);
        setVerificationWarning("Verification email has been resent. Please check your inbox.");
      }
      
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 text-gray-200 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <div className="inline-block">
              <img src="/logo-white.svg" alt="RECALL" className="h-12 mb-6" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 mt-2">Sign in to access your notes</p>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {verificationWarning && (
            <div className={`mb-6 ${resendSuccess ? 'bg-green-900/30 border-green-800 text-green-200' : 'bg-yellow-900/30 border-yellow-800 text-yellow-200'} px-4 py-3 rounded-lg flex flex-col`}>
              <div className="flex items-start mb-2">
                <Info size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>{verificationWarning}</p>
              </div>
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail || resendSuccess}
                className="self-end text-sm font-medium underline hover:text-white transition-colors"
              >
                {resendingEmail ? 'Sending...' : resendSuccess ? 'Email sent!' : 'Resend verification email'}
              </button>
            </div>
          )}
          
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-white bg-gray-800 hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors mb-6"
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CD1B1B] focus:border-transparent"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#CD1B1B] focus:border-transparent"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-[#CD1B1B] focus:ring-[#CD1B1B] focus:ring-offset-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#CD1B1B] hover:text-red-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#CD1B1B] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CD1B1B] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-[#CD1B1B] hover:text-red-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 