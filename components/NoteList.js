// components/NoteList.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NoteCard from './NoteCard';
import { Loader2, StickyNote } from 'lucide-react';

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <StickyNote size={28} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No notes yet</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        Create your first note by clicking the button above.
      </p>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
      <p className="text-gray-500 dark:text-gray-400">Loading your notes...</p>
    </div>
  );
}

function NoteList({ notes, view, handlers, loading }) {
  if (loading) {
    return <LoadingState />;
  }
  
  if (!notes.length) {
    return <EmptyState />;
  }
  
  // Sort notes - pinned first, then most recent
  const sorted = [...notes].sort((a, b) => {
    // First by pin status
    if (a.pinned !== b.pinned) {
      return b.pinned ? 1 : -1;
    }
    // Then by date if we have it (descending)
    return b.createdAt?.getTime?.() - a.createdAt?.getTime?.() || 0;
  });

  return (
    <motion.div
      layout
      className={
        view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
      }
    >
      <AnimatePresence>
        {sorted.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={handlers.delete}
            onEdit={handlers.edit}
            onPin={handlers.pin}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default NoteList;