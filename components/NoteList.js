// components/NoteList.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NoteCard from './NoteCard';
import { Loader2, StickyNote } from 'lucide-react';
import InfiniteScroll from './InfiniteScroll';

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

function NoteList({ notes, view, handlers, loading, hasMore, onLoadMore, loadingMore }) {
  if (loading && !loadingMore) {
    return <LoadingState />;
  }
  
  if (!notes.length && !loading) {
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
    <InfiniteScroll
      hasMore={hasMore}
      loadMore={onLoadMore}
      loading={loadingMore}
    >
      <div className={
        view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
      }>
        <AnimatePresence mode="popLayout">
          {sorted.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30, 
                mass: 1
              }}
            >
              <NoteCard
                note={note}
                onDelete={handlers.delete}
                onEdit={handlers.edit}
                onPin={handlers.pin}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loadingMore && (
          <div className="col-span-full flex justify-center py-4">
            <Loader2 size={24} className="text-blue-500 animate-spin" />
          </div>
        )}
      </div>
    </InfiniteScroll>
  );
}

export default NoteList;