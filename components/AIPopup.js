// components/AIPopup.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from './Spinner';

function AIPopup({ messages, onClose, loading }) {
  return (
    <AnimatePresence>
      {(messages.length > 0 || loading) && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-xl p-4 max-h-1/3 overflow-auto rounded-t-2xl z-30"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">AI Response</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close AI response"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${m.sender === 'user' ? 'bg-gray-100' : 'bg-yellow-100'}`}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="flex justify-center pt-2">
                  <Spinner size={20} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AIPopup;