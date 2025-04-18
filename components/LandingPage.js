import React from 'react';
import Link from 'next/link';
import { MessageSquare, Sparkles, Brain, Zap, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-200">
      {/* Hero Section */}
      <section className="bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700">
                  <Sparkles size={16} className="text-indigo-400 mr-2" />
                  <span className="text-sm font-medium text-gray-300">AI-Powered Note Taking</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Talk to Your <span className="text-indigo-400">Notes</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300">
                  Store your memories, ideas, and knowledge. Then chat with them using AI.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/app" className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium text-base hover:bg-indigo-700 transition shadow-sm">
                  Try Now
                </Link>
                <a href="#features" className="px-6 py-3 rounded-lg bg-gray-800 text-gray-200 font-medium text-base border border-gray-700 hover:bg-gray-750 transition">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
                <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                  <div className="flex-1 text-center text-sm font-mono text-gray-400">Recall - AI Notes</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-300">Project meeting ideas: Create user onboarding flow and improve dashboard analytics</p>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-300">Book recommendation: "Atomic Habits" by James Clear - read chapter on habit stacking</p>
                  </div>
                  <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-800/30">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-indigo-400" />
                      <p className="text-sm font-medium text-indigo-300">Question for AI</p>
                    </div>
                    <p className="text-gray-200">What were the key points from my last meeting?</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-indigo-600 rounded-xl p-5 shadow-lg">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-white" />
                  <p className="text-white font-medium">Creating user onboarding flow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Supercharge Your Memory</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Recall helps you store and retrieve information effortlessly with AI assistance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <Brain size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Smart Memory</h3>
              <p className="text-gray-400">
                Store snippets of information, ideas, and memories without worrying about organization.
              </p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <Zap size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Recall</h3>
              <p className="text-gray-400">
                Ask questions and get intelligent answers based on your saved notes and memories.
              </p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <Search size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Semantic Search</h3>
              <p className="text-gray-400">
                Find what you need quickly with search that understands context and meaning.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to enhance your memory?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Start capturing and conversing with your knowledge today. No more forgetting important details.
          </p>
          <Link href="/app" className="inline-block px-8 py-4 rounded-lg bg-indigo-600 text-white font-medium text-lg hover:bg-indigo-700 transition shadow-sm">
            Get Started for Free
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-400" />
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