// components/NoteCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Pin, Save, X, MoreHorizontal } from 'lucide-react';

function NoteCard({ note, onDelete, onEdit, onPin }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.content);
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = async () => {
    try {
      await onEdit(note.id, text);
      setEditing(false);
    } catch {
      // Handle error if needed
    }
  };

  const handleCancel = () => {
    setText(note.content);
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: note.color }}
      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 break-inside-avoid mb-4"
      onClick={() => !editing && setEditing(true)}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-0 right-0 z-10">
          <div className="w-8 h-8 bg-yellow-400 rounded-bl-xl flex items-center justify-center shadow-sm">
            <Pin size={14} className="text-yellow-700 transform -rotate-45" />
          </div>
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-4 relative">
        {/* Top buttons - always visible */}
        <div className="absolute top-1 right-1 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin(note.id);
            }}
            className={`p-2 rounded-full ${
              note.pinned 
                ? 'text-yellow-600 hover:bg-yellow-100' 
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
            } transition-colors`}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} className={note.pinned ? 'text-yellow-500' : ''} />
          </button>
          
          {!editing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Delete note"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Card content */}
        {editing ? (
          <div onClick={(e) => e.stopPropagation()} className="mt-2">
            <textarea
              className="w-full min-h-[120px] resize-none bg-transparent outline-none text-gray-800 focus:ring-2 focus:ring-blue-300 rounded p-1"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              placeholder="Write your note here..."
            />
            
            {/* Editing buttons */}
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium"
                aria-label="Save note"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <p className="text-gray-800 whitespace-pre-wrap break-words min-h-[80px] pr-10">
              {note.content}
            </p>
            
            {/* Timestamp & edit hint - visible on hover */}
            <div className="mt-2 pt-2 border-t border-black/5 flex justify-between items-center text-xs text-gray-500">
              <span>
                {note.updatedAt 
                  ? `Updated ${new Date(note.updatedAt).toLocaleDateString()}`
                  : `Created ${new Date(note.createdAt).toLocaleDateString()}`
                }
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                Click to edit
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default NoteCard;