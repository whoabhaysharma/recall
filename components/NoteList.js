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
      <Loader2 size={28} className="text-[var(--primary-accent)] animate-spin mb-3" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading notes...</p>
    </div>
  );
}

function NoteList({ notes, view, handlers, loading, hasMore, onLoadMore, loadingMore }) {
  if (loading && !notes.length && !loadingMore) { // Show initial loading state only if there are no notes yet
    return <LoadingState />;
  }
  
  if (!notes.length && !loading && !loadingMore) { // Show empty state if no notes and not loading
    return <EmptyState />;
  }
  
  // Sort notes - pinned first, then most recent
  // Todoist often sorts by creation date or manual order within sections. We'll keep pinned first.
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return b.pinned ? -1 : 1; // Pinned items first
    }
    // Sort by creation date, most recent first
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const listContainerClasses = view === 'grid'
    ? 'masonry-grid' // Using a simple class name for potential masonry CSS
    : 'flex flex-col'; // No specific spacing here, NoteCard handles its own margin-bottom

  // For grid view, we'll use CSS columns for a masonry-like effect if desired,
  // or a standard grid. For simplicity, we'll stick to the previous grid for now,
  // but Todoist itself doesn't typically use a card grid for tasks.
  // The primary view should be 'list'.

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03, // Stagger animation
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
  };

  return (
    <InfiniteScroll
      hasMore={hasMore}
      loadMore={onLoadMore}
      loading={loadingMore}
      className="w-full" // Ensure InfiniteScroll takes full width
    >
      <div className={listContainerClasses}>
        <AnimatePresence initial={false}>
          {sortedNotes.map((note, index) => (
            <motion.div
              key={note.id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout // Animate layout changes (e.g., reordering, deleting)
              className={view === 'grid' ? 'break-inside-avoid mb-4' : ''} // For masonry grid layout
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
          <div className="col-span-full flex justify-center py-6">
            <Loader2 size={24} className="text-[var(--primary-accent)] animate-spin" />
          </div>
        )}
      </div>
    </InfiniteScroll>
  );
}

export default NoteList;

// Add this to your globals.css or a relevant CSS file for masonry grid if you use it:
/*
.masonry-grid {
  column-count: 1;
  column-gap: 1rem; // Matches gap-4
}

@media (min-width: 640px) { // sm
  .masonry-grid {
    column-count: 2;
  }
}

@media (min-width: 1024px) { // lg
  .masonry-grid {
    column-count: 3;
  }
}

.break-inside-avoid {
  break-inside: avoid;
}
*/