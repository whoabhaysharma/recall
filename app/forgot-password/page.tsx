"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../../firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { success, error } = await resetPassword(email);
    
    if (error) {
      setError(error);
      setIsLoading(false);
      return;
    }
    
    if (success) {
      setSuccessMessage(`Password reset email sent to ${email}. Please check your inbox and follow the instructions to reset your password.`);
    }
    
    setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-white">Reset your password</h1>
          <p className="text-gray-400 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 bg-green-900/30 border border-green-800 text-green-200 px-4 py-3 rounded-lg flex items-start">
              <CheckCircle2 size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          {!successMessage ? (
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
                    "Send reset link"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Check your email for further instructions.
              </p>
              <p className="text-gray-400 text-sm">
                If you don't see the email in your inbox, please check your spam folder.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 