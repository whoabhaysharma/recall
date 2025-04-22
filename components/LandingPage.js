"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Sparkles, Brain, Zap, Search, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const UseCaseChat = ({ question, answer, icon, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div className="space-y-3 max-w-xl mx-auto">
      {/* User question */}
      <motion.div 
        className="flex items-start gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <MessageSquare size={16} className="text-gray-300" />
        </div>
        <div className="bg-gray-800 p-3 rounded-xl flex-1">
          <p className="text-gray-300">{question}</p>
        </div>
      </motion.div>
      
      {/* AI answer */}
      <motion.div 
        className="flex items-start gap-3 pl-8"
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="w-8 h-8 rounded-full bg-[#CD1B1B] flex items-center justify-center flex-shrink-0">
          {icon || <Sparkles size={16} className="text-white" />}
        </div>
        <div className="bg-[#CD1B1B]/10 p-3 rounded-xl border border-[#CD1B1B]/20 flex-1">
          <p className="text-gray-200">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 hover:-translate-y-1"
    variants={fadeIn}
  >
    <div className="w-12 h-12 bg-gray-800/70 rounded-xl flex items-center justify-center mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-200 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[500px] h-[500px] bg-[#CD1B1B]/20 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-[60%] -right-[5%] w-[400px] h-[400px] bg-[#CD1B1B]/10 rounded-full blur-[100px] opacity-20" />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-20 border-b border-gray-800/50 backdrop-blur-md bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/logo-white.svg" alt="RECALL" className="h-8" />
            </div>
            <div className="flex items-center gap-6">
              <Link href="#features" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                Features
              </Link>
              <Link href="#usecases" className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                Use Cases
              </Link>
              <Link href="/app" className="px-4 py-2 rounded-lg bg-[#CD1B1B] text-white text-sm font-medium hover:bg-red-700 transition-colors duration-200">
                Try Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-800/70 border border-gray-700/50 mb-6">
                <Sparkles size={16} className="text-[#CD1B1B] mr-2" />
                <span className="text-sm font-medium text-gray-300">AI-Powered Note Taking</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                Talk to Your <span className="text-[#CD1B1B]">Notes</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Store your memories, ideas, and knowledge in your personal AI assistant that understands Hinglish.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/app" className="px-6 py-3 rounded-lg bg-[#CD1B1B] text-white font-medium text-base hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/30">
                  Get Started Free
                </Link>
                <a href="#demo" className="px-6 py-3 rounded-lg bg-gray-800/70 text-gray-200 font-medium text-base border border-gray-700/50 hover:bg-gray-700/50 transition-all duration-300">
                  See How It Works
                </a>
              </div>
            </motion.div>
            
            {/* Demo terminal */}
            <motion.div 
              className="relative max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800/70 shadow-2xl shadow-black/30">
                <div className="flex items-center gap-3 p-4 border-b border-gray-800/50">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center text-sm font-mono text-gray-400">recall.ai</div>
                </div>
                
                <div id="demo" className="p-6 space-y-8">
                  <UseCaseChat 
                    question="Yaar, Sharma uncle ne Dwarka mein jo property batai thi, uska rate kya tha?"
                    answer="Sharma uncle ne 2 BHK ka rate bataya tha Dwarka Sector 12 mein - 85 lakh, ready to move. Maintenance charges 3k/month. Parking included hai. Metro station se 10 min walk."
                    delay={800}
                  />
                  
                  <UseCaseChat 
                    question="Kal jo doctor ne medicines batai thi uska schedule kya tha? Bhool gaya main"
                    answer="Dolo 650 - din mein 2 baar khana ke baad. Multivitamin subah khali pet. Aur vo green wali tablet sirf raat ko sone se pehle. 5 din tak lena hai, uske baad review ke liye jana hai."
                    delay={2500}
                  />
                </div>
              </div>

              {/* Floating badge */}
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-[#CD1B1B] rounded-xl p-4 shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 3.5 }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-white" />
                  <p className="text-white font-medium">Find anything instantly</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Supercharge Your Memory</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Recall helps you store and retrieve information effortlessly with AI that speaks your language.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <FeatureCard 
              icon={<Brain size={24} className="text-[#CD1B1B]" />}
              title="Smart Memory"
              description="Store snippets of information, ideas, and memories without worrying about organization or tagging."
            />
            
            <FeatureCard 
              icon={<Zap size={24} className="text-[#CD1B1B]" />}
              title="AI-Powered Recall"
              description="Ask questions in Hindi, English, or Hinglish and get intelligent answers based on your saved notes."
            />
            
            <FeatureCard 
              icon={<Search size={24} className="text-[#CD1B1B]" />}
              title="Semantic Search"
              description="Find what you need instantly with search that understands context, meaning, and Hinglish queries."
            />
          </motion.div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section id="usecases" className="py-24 relative bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How People Use Recall</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real-life examples of how Recall helps people remember what matters.
            </p>
          </motion.div>
          
          <div className="space-y-20">
            {/* Category 1: Personal Life */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-10 flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="w-14 h-14 rounded-full bg-gray-800/70 flex items-center justify-center mb-2">
                  <Brain size={28} className="text-[#CD1B1B]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">Roz Ki Zindagi</h3>
                  <p className="text-gray-400 mt-2">Keep track of day-to-day information you need to remember</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <UseCaseChat 
                    question="Vo naya cafe kidhar tha jahan pe last week gaye the? Menu mein kya sahi tha?"
                    answer="Cafe '91 Springs, Hudson Lane mein. Cold coffee ekdum mast thi, aur vo cheese loaded fries bhi killer the. Happy hours 3-7 PM, 20% off. Parking thodi issue hai but Gtb Nagar metro se 5 min hai."
                  />
                </div>
                <div className="space-y-6">
                  <UseCaseChat 
                    question="Priya di ka birthday aa raha hai next month. Kya gift de sakte hain? Pichli baar kya pasand aaya tha?"
                    answer="Priya di ko pichli baar vo handcrafted leather journal bohot pasand aaya tha. Unhe plants bhi bohot pasand hain. Recently unhone cooking classes ke bare mein baat ki thi. Aur unka favorite perfume Chanel No. 5 hai."
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Category 2: Work & Business */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-10 flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="w-14 h-14 rounded-full bg-gray-800/70 flex items-center justify-center mb-2">
                  <Zap size={28} className="text-[#CD1B1B]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">Work & Business</h3>
                  <p className="text-gray-400 mt-2">Never forget important work details or business information</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <UseCaseChat 
                    question="Vo vendor ka contact info mil sakta hai jisne office ke liye furniture quote bheja tha?"
                    answer="Urban Office Solutions - Rajesh bhai ka number 98110-55666. Quote 3.2L ka tha, 10 workstations ke liye. Installation free hai, 2 saal warranty. Advance 40% chahiye, baaki delivery pe."
                  />
                </div>
                <div className="space-y-6">
                  <UseCaseChat 
                    question="Chennai team meeting mein next steps kya decide hue the?"
                    answer="1. UI design ko finalize karna hai by next Friday. 2. Backend integration 3 hafton mein complete karni hai. 3. Manoj aur Shreya QA team ke saath test plan finalize karenge. 4. Next review call 15th ko hai 4pm pe."
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Category 3: Health & Wellness */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-10 flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="w-14 h-14 rounded-full bg-gray-800/70 flex items-center justify-center mb-2">
                  <Search size={28} className="text-[#CD1B1B]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">Health & Important Info</h3>
                  <p className="text-gray-400 mt-2">Keep track of critical information you can't afford to forget</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <UseCaseChat 
                    question="Bhai, aaj Sharma uncle ne kuch property ke baare mein bola tha Dwarka mein. Rate bhi bataya tha, par yaad nahi aa raha."
                    answer="Sharma uncle ne 2 BHK ka rate bataya tha Dwarka Sector 12 mein - 85 lakh, ready to move. Maintenance charges 3k/month. Parking included hai. Metro station se 10 min walk."
                  />
                </div>
                <div className="space-y-6">
                  <UseCaseChat 
                    question="Kal jo doctor ne medicines batai thi uska schedule kya tha?"
                    answer="Dolo 650 - din mein 2 baar khana ke baad. Multivitamin subah khali pet. Aur vo green wali tablet sirf raat ko sone se pehle. 5 din tak lena hai, uske baad review ke liye jana hai."
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-800/50 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to remember everything?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start capturing and conversing with your knowledge today. No more forgetting important details.
            </p>
            <Link href="/app" className="inline-flex items-center px-8 py-4 rounded-lg bg-[#CD1B1B] text-white font-medium text-lg hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/30 group">
              Get Started with Recall
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900/30 text-gray-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img src="/logo-white.svg" alt="RECALL" className="h-8 mb-2" />
              <p className="text-sm">Your AI memory assistant</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">About</a>
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">Privacy</a>
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">Terms</a>
              <a href="#" className="text-sm hover:text-white transition-colors duration-200">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800/50 text-center md:text-left text-sm">
            <p>&copy; {new Date().getFullYear()} RECALL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 