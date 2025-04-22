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
                  <Sparkles size={16} className="text-[#CD1B1B] mr-2" />
                  <span className="text-sm font-medium text-gray-300">AI-Powered Note Taking</span>
                </div>
                <div className="flex items-center">
                  <img src="/logo-white.svg" alt="RECALL" className="h-12 mb-4" />
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Talk to Your <span className="text-[#CD1B1B]">Notes</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300">
                  Store your memories, ideas, and knowledge. Then chat with them using AI.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/app" className="px-6 py-3 rounded-lg bg-[#CD1B1B] text-white font-medium text-base hover:bg-red-700 transition shadow-sm">
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
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#CD1B1B]"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#CD1B1B]"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-[#CD1B1B]"></div>
                  </div>
                  <div className="flex-1 text-center text-sm font-mono text-gray-400">Recall - AI Notes</div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-300">Dinner @ Dilli Haat with Rahul bhai: Try the momos from the Northeastern stall and that butter chicken place near the entrance. Parking scene was totally chill, hardly any bheed-bhaad after 6pm.</p>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-300">Meeting with design team: Need to finalize app ke icons by Friday. Aryan said he'll finish UI screens but usko thoda time do yaar, banda busy hai.</p>
                  </div>
                  <div className="bg-[#CD1B1B]/10 rounded-lg p-4 border border-[#CD1B1B]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-[#CD1B1B]" />
                      <p className="text-sm font-medium text-[#CD1B1B]">Question for AI</p>
                    </div>
                    <p className="text-gray-200">Yaar, where did I go for dinner with Rahul last month?</p>
                  </div>
                  <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-[#CD1B1B]" />
                      <p className="text-sm font-medium text-[#CD1B1B]">AI Answer</p>
                    </div>
                    <p className="text-gray-300">You had dinner with Rahul bhai at Dilli Haat. You mentioned trying momos from the Northeastern stall and a butter chicken place near the entrance. You also noted that parking wasn't crowded after 6pm.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#CD1B1B] rounded-xl p-5 shadow-lg">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-white" />
                  <p className="text-white font-medium">Find your note hassle free</p>
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
                <Brain size={24} className="text-[#CD1B1B]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Smart Memory</h3>
              <p className="text-gray-400">
                Store snippets of information, ideas, and memories without worrying about organization.
              </p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <Zap size={24} className="text-[#CD1B1B]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Recall</h3>
              <p className="text-gray-400">
                Ask questions and get intelligent answers based on your saved notes and memories.
              </p>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <Search size={24} className="text-[#CD1B1B]" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Semantic Search</h3>
              <p className="text-gray-400">
                Find what you need quickly with search that understands context and meaning.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Dekho Kaise Kaam Karta Hai</h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Yeh dekho real-life examples, bilkul tumhari life ke jaise
            </p>
          </div>
          
          <div className="mb-16 bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 border border-gray-700 mb-4">
                <Brain size={18} className="text-[#CD1B1B] mr-2" />
                <span className="text-base font-medium text-gray-300">Har Roz Ke Kaam</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">Roz Ke Kaam Ko Banao Aasan</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Example 1 */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                <div className="absolute -top-3 left-4 bg-[#CD1B1B] px-3 py-1 rounded text-sm font-medium text-white">
                  Use Case #1
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white mt-2">Doctor's Prescription</h4>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageSquare size={16} className="text-gray-300" />
                    </div>
                    <div className="bg-gray-750 p-3 rounded-lg flex-1">
                      <p className="text-gray-300">Kal jo doctor ne medicines batai thi uska schedule kya tha? Bhool gaya main</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-[#CD1B1B] flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="bg-[#CD1B1B]/10 p-3 rounded-lg border border-[#CD1B1B]/20 flex-1">
                      <p className="text-gray-200">Dolo 650 - din mein 2 baar khana ke baad. Multivitamin subah khali pet. Aur vo green wali tablet sirf raat ko sone se pehle. 5 din tak lena hai, uske baad review ke liye jana hai.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Apne medical prescriptions ko save karo aur kabhi bhi details check karo</p>
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                <div className="absolute -top-3 left-4 bg-[#CD1B1B] px-3 py-1 rounded text-sm font-medium text-white">
                  Use Case #2
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white mt-2">Restaurant Details</h4>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageSquare size={16} className="text-gray-300" />
                    </div>
                    <div className="bg-gray-750 p-3 rounded-lg flex-1">
                      <p className="text-gray-300">Yaar vo naya cafe kidhar tha jahan pe last week gaye the? Menu mein kya sahi tha?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-[#CD1B1B] flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="bg-[#CD1B1B]/10 p-3 rounded-lg border border-[#CD1B1B]/20 flex-1">
                      <p className="text-gray-200">Cafe '91 Springs, Hudson Lane mein. Cold coffee ekdum mast thi, aur vo cheese loaded fries bhi killer the. Happy hours 3-7 PM, 20% off. Parking thodi issue hai but Gtb Nagar metro se 5 min hai.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Favourite jagahon ki details yaad rakho - location, menu, offers sab kuch</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16 bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 border border-gray-700 mb-4">
                <Zap size={18} className="text-[#CD1B1B] mr-2" />
                <span className="text-base font-medium text-gray-300">Work & Business</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">Office Ke Kaam Mein Bano Smart</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Example 3 */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                <div className="absolute -top-3 left-4 bg-[#CD1B1B] px-3 py-1 rounded text-sm font-medium text-white">
                  Use Case #3
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white mt-2">Business Contacts</h4>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageSquare size={16} className="text-gray-300" />
                    </div>
                    <div className="bg-gray-750 p-3 rounded-lg flex-1">
                      <p className="text-gray-300">Vo vendor ka contact info mil sakta hai jisne office ke liye furniture quote bheja tha?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-[#CD1B1B] flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="bg-[#CD1B1B]/10 p-3 rounded-lg border border-[#CD1B1B]/20 flex-1">
                      <p className="text-gray-200">Urban Office Solutions - Rajesh bhai ka number 98110-55666. Quote 3.2L ka tha, 10 workstations ke liye. Installation free hai, 2 saal warranty. Advance 40% chahiye, baaki delivery pe.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Business contacts, quotes aur deals ki details ko easily track karo</p>
                </div>
              </div>

              {/* Example 4 */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                <div className="absolute -top-3 left-4 bg-[#CD1B1B] px-3 py-1 rounded text-sm font-medium text-white">
                  Use Case #4
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white mt-2">Property Details</h4>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageSquare size={16} className="text-gray-300" />
                    </div>
                    <div className="bg-gray-750 p-3 rounded-lg flex-1">
                      <p className="text-gray-300">Bhai, aaj Sharma uncle ne kuch property ke baare mein bola tha Dwarka mein. Rate bhi bataya tha, par yaad nahi aa raha. Kya bol rahe the?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-[#CD1B1B] flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="bg-[#CD1B1B]/10 p-3 rounded-lg border border-[#CD1B1B]/20 flex-1">
                      <p className="text-gray-200">Sharma uncle ne 2 BHK ka rate bataya tha Dwarka Sector 12 mein - 85 lakh, ready to move. Maintenance charges 3k/month. Parking included hai. Metro station se 10 min walk.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Property details, rates aur locations ko save karo future reference ke liye</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 border border-gray-700 mb-4">
                <Search size={18} className="text-[#CD1B1B] mr-2" />
                <span className="text-base font-medium text-gray-300">Personal Life</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">Apna Personal Life Karo Organize</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Example 5 */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                <div className="absolute -top-3 left-4 bg-[#CD1B1B] px-3 py-1 rounded text-sm font-medium text-white">
                  Use Case #5
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white mt-2">Gift Ideas</h4>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageSquare size={16} className="text-gray-300" />
                    </div>
                    <div className="bg-gray-750 p-3 rounded-lg flex-1">
                      <p className="text-gray-300">Arre yaar, Priya di ka birthday aa raha hai next month. Kya gift de sakte hain? Pichli baar kya pasand aaya tha unko?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-[#CD1B1B] flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="bg-[#CD1B1B]/10 p-3 rounded-lg border border-[#CD1B1B]/20 flex-1">
                      <p className="text-gray-200">Priya di ko pichli baar vo handcrafted leather journal bohot pasand aaya tha. Unhe plants bhi bohot pasand hain. Recently unhone cooking classes ke bare mein baat ki thi. Aur unka favorite perfume Chanel No. 5 hai jo khatam hone wala tha.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Gift ideas aur doston ke preferences ko track karo special occasions ke liye</p>
                </div>
              </div>

              {/* Example 6 */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                <div className="absolute -top-3 left-4 bg-[#CD1B1B] px-3 py-1 rounded text-sm font-medium text-white">
                  Use Case #6
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white mt-2">Movie/Show Recommendations</h4>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <MessageSquare size={16} className="text-gray-300" />
                    </div>
                    <div className="bg-gray-750 p-3 rounded-lg flex-1">
                      <p className="text-gray-300">Vo konsi series thi jo Rohit ne recommend ki thi? Usne kaha tha must watch hai</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="min-w-8 h-8 rounded-full bg-[#CD1B1B] flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="bg-[#CD1B1B]/10 p-3 rounded-lg border border-[#CD1B1B]/20 flex-1">
                      <p className="text-gray-200">Rohit ne "The Night Manager" recommend ki thi, Apple TV+ pe hai. Usne bola tha 6 episodes hain, ek weekend mein finish ho jayegi aur screenplay ekdum paisa vasool hai. Aur Aditya Roy Kapur ka best performance hai usme.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>Movies, shows aur recommendations ko save karo aur kabhi miss mat karo</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-xl bg-[#CD1B1B]/10 border border-[#CD1B1B]/20 mb-6">
              <Sparkles size={20} className="text-[#CD1B1B] mr-3" />
              <span className="text-xl font-medium text-white">Aur bhi bohot kuch...</span>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Bas type karo jo yaad rakhna hai, aur jab bhi zarurat ho, pooch lo. Ekdum easy!
            </p>
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
          <Link href="/app" className="inline-block px-8 py-4 rounded-lg bg-[#CD1B1B] text-white font-medium text-lg hover:bg-red-700 transition shadow-sm">
            Get Started with Recall
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <img src="/logo-white.svg" alt="RECALL" className="h-8" />
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
            <p>&copy; {new Date().getFullYear()} RECALL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 