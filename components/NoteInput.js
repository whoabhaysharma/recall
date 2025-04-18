// components/NoteInput.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';
import { Plus, X } from 'lucide-react';

function NoteInput({ onSave }) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await onSave(text.trim());
      setText('');
      setExpanded(false);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAdd();
    } else if (e.key === 'Escape') {
      setExpanded(false);
      setText('');
    }
  };

  if (!expanded) {
    return (
      <motion.button
        layout
        onClick={() => setExpanded(true)}
        className="w-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all rounded-xl p-4 flex items-center gap-3 text-gray-500 dark:text-gray-400 cursor-text"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={18} className="text-gray-400 dark:text-gray-500" />
        <span>Create a new note...</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      layout
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6"
    >
      <textarea
        autoFocus
        rows={4}
        className="w-full resize-none outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-600 text-gray-800 dark:text-gray-200 mb-3"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      
      <div className="flex justify-between items-center border-t dark:border-gray-700 pt-3 mt-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to save
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setExpanded(false);
              setText('');
            }}
            disabled={saving}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
          
          <button
            onClick={handleAdd}
            disabled={saving || !text.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {saving ? <Spinner size={16} /> : 'Save Note'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default NoteInput;