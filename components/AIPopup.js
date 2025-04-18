// components/AIPopup.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from './Spinner';
import { X, MessageSquare, User } from 'lucide-react';

function AIPopup({ messages, onClose, loading }) {
  const hasContent = messages.length > 0 || loading;
  
  return (
    <AnimatePresence>
      {hasContent && (
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl p-4 sm:p-6 rounded-t-2xl z-40 max-h-[60vh] overflow-auto"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-900 py-2">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <MessageSquare size={20} className="text-purple-500 dark:text-purple-400" />
                AI Assistant
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Close AI response"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <MessageSquare size={16} />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.sender === 'user' 
                        ? 'bg-blue-500 text-white ml-auto rounded-tr-sm' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  
                  {m.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 p-4"
                >
                  <Spinner size={20} />
                  <span>AI is thinking...</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AIPopup;