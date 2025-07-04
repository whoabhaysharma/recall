// components/NoteInput.js
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';
import { Plus, X } from 'lucide-react';

function NoteInput({ onSave }) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef(null);

  const handleAdd = async () => {
    if (!text.trim()) return;
    
    const currentText = text.trim();
    setText(''); // Clear text immediately
    
    setSaving(true);
    try {
      await onSave(currentText);
      setExpanded(false); // Collapse after successful save
    } catch (error) {
      console.error('Error saving note:', error);
      setText(currentText); // Restore text if save failed
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Enter to save, Shift+Enter for newline
      e.preventDefault(); // Prevent newline on Enter
      handleAdd();
    } else if (e.key === 'Escape') {
      setExpanded(false);
      setText('');
    }
  };

  const handleTextareaChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (expanded && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [expanded]);


  if (!expanded) {
    return (
      <motion.button
        layoutId="note-input" // Shared layout ID for smooth animation
        onClick={() => setExpanded(true)}
        className="w-full bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800/60 border border-dashed border-gray-300 dark:border-neutral-700 hover:border-gray-400 dark:hover:border-neutral-600 transition-colors rounded-lg p-3 flex items-center gap-2.5 text-gray-500 dark:text-gray-400 hover:text-[var(--primary-accent)] dark:hover:text-[var(--primary-accent)] cursor-pointer group mb-6"
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-[var(--primary-accent)] transition-colors" />
        <span className="text-sm font-medium">Add task</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      layoutId="note-input" // Shared layout ID
      initial={{ opacity: 0 }} // Animate opacity for a smoother transition with layout animation
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[var(--background)] dark:bg-neutral-800 rounded-lg border border-gray-300 dark:border-neutral-700 shadow-lg p-3 mb-6" // Todoist input is often bordered and part of the main BG
    >
      <textarea
        ref={textareaRef}
        rows={1} // Start with one row, auto-expands
        className="w-full resize-none outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-[var(--foreground)] text-sm mb-2.5 leading-relaxed"
        placeholder="e.g., Book flight to Bali next month"
        value={text}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
      />
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-neutral-700/50">
        {/* Placeholder for due date/project buttons if needed later */}
        <div className="flex gap-1">
           {/* <button className="button-secondary text-xs p-1.5">Date</button>
           <button className="button-secondary text-xs p-1.5">Project</button> */}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setExpanded(false);
              setText('');
            }}
            disabled={saving}
            className="button-secondary text-xs px-3 py-1.5"
            aria-label="Cancel"
          >
            Cancel
          </button>
          
          <button
            onClick={handleAdd}
            disabled={saving || !text.trim()}
            className="button-primary text-xs px-3 py-1.5 flex items-center gap-1"
            aria-label="Add Task"
          >
            {saving ? <Spinner size={14} /> : 'Add Task'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default NoteInput;