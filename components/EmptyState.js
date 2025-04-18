import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
        <BrainCircuit size={40} className="text-purple-500 dark:text-purple-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-3">Welcome to Recall</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
        Your personal memory bank. Create your first note and start building a collection you can chat with later.
      </p>
      <div className="text-sm text-gray-400 dark:text-gray-500 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>Create notes to store your thoughts</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>Search through your memories anytime</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          <span>Chat with your notes using the AI assistant</span>
        </div>
      </div>
    </motion.div>
  );
}

export default EmptyState; 