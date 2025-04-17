// components/NoteCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Pin } from 'lucide-react';

function NoteCard({ note, onDelete, onEdit, onPin }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.content);

  const handleSave = async () => {
    try {
      await onEdit(note.id, text);
      setEditing(false);
    } catch {
      // Handle error if needed
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{ backgroundColor: note.color, breakInside: 'avoid' }}
      className="mb-4 p-4 rounded-2xl shadow group relative overflow-hidden"
    >
      {editing ? (
        <textarea
          className="w-full resize-none bg-transparent outline-none text-gray-800"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <p className="text-gray-800 whitespace-pre-wrap break-words">{note.content}</p>
      )}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex space-x-1">
        {editing ? (
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-green-400 rounded text-white focus:ring-2 focus:ring-green-300"
          >
            Save
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="p-1 rounded focus:ring-2 focus:ring-blue-300">
            <Edit size={16} />
          </button>
        )}
        <button
          onClick={() => {
            if (confirm('Delete note?')) onDelete(note.id);
          }}
          className="p-1 rounded focus:ring-2 focus:ring-red-300"
        >
          <Trash2 size={16} />
        </button>
        <button onClick={() => onPin(note.id)} className="p-1 rounded focus:ring-2 focus:ring-yellow-300">
          <Pin size={16} className={note.pinned ? 'text-yellow-500' : 'text-gray-600'} />
        </button>
      </div>
    </motion.div>
  );
}

export default NoteCard;