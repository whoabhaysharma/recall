// components/NoteList.js
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import NoteCard from './NoteCard';

function NoteList({ notes, view, handlers, loading }) {
  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading notes...</div>;
  }
  if (!notes.length) {
    return <div className="p-10 text-center text-gray-500">No notes found. Add one above!</div>;
  }
  const sorted = [...notes].sort((a, b) => (b.pinned - a.pinned));
  const containerClass =
    view === 'grid'
      ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 space-y-4'
      : 'space-y-4';

  return (
    <div className={containerClass}>
      <AnimatePresence>
        {sorted.map((n) => (
          <NoteCard
            key={n.id}
            note={n}
            onDelete={handlers.delete}
            onEdit={handlers.edit}
            onPin={handlers.pin}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NoteList;