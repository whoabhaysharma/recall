// components/NoteList.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NoteCard from './NoteCard';
import { Loader2 } from 'lucide-react';
import InfiniteScroll from './InfiniteScroll';
import EmptyState from './EmptyState';

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 size={32} className="text-purple-500 animate-spin mb-4" />
      <p className="text-gray-500 dark:text-gray-400">Loading your memories...</p>
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
            <Loader2 size={24} className="text-purple-500 animate-spin" />
          </div>
        )}
      </div>
    </InfiniteScroll>
  );
}

export default NoteList;