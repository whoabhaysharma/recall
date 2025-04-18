import React from 'react';
import Link from 'next/link';
import { MessageSquare, Sparkles, Brain, Zap, Clock, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles size={16} className="text-amber-300 mr-2" />
                  <span className="text-sm font-medium">AI-Powered Note Taking</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Talk to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-500">Notes</span>
                </h1>
                <p className="text-xl md:text-2xl text-purple-100">
                  Store your memories, ideas, and knowledge. Then chat with them using AI.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/app" className="px-6 py-3 rounded-lg bg-white text-purple-700 font-semibold text-lg hover:bg-purple-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Try Now
                </Link>
                <a href="#features" className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold text-lg hover:bg-purple-500 transition">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 text-center text-sm font-mono">Recall - AI Notes</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-200">Project meeting ideas: Create user onboarding flow and improve dashboard analytics</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-200">Book recommendation: "Atomic Habits" by James Clear - read chapter on habit stacking</p>
                  </div>
                  <div className="bg-purple-500/30 rounded-lg p-4 border border-purple-400/30">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} />
                      <p className="text-sm font-medium">Question for AI</p>
                    </div>
                    <p className="text-white">What were the key points from my last meeting?</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-amber-400 to-pink-500 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-white" />
                  <p className="text-white font-medium">Create user onboarding flow and improve dashboard analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Supercharge Your Memory</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Recall helps you store and retrieve information effortlessly with AI assistance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Brain size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Memory</h3>
              <p className="text-gray-600">
                Store snippets of information, ideas, and memories without worrying about organization.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Zap size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Recall</h3>
              <p className="text-gray-600">
                Ask questions and get intelligent answers based on your saved notes and memories.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Search size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Semantic Search</h3>
              <p className="text-gray-600">
                Find what you need quickly with search that understands context and meaning.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to enhance your memory?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Start capturing and conversing with your knowledge today. No more forgetting important details.
          </p>
          <Link href="/app" className="inline-block px-8 py-4 rounded-lg bg-white text-purple-700 font-semibold text-lg hover:bg-purple-50 transition shadow-lg">
            Get Started for Free
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-purple-400" />
                <span className="text-xl font-semibold text-white">Recall</span>
              </div>
              <p className="mt-2">Your AI memory assistant</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition">About</a>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Recall. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 