// components/NoteCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Pin, Save, X } from 'lucide-react';

function NoteCard({ note, onDelete, onEdit, onPin }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.content);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{ backgroundColor: note.color }}
      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow break-inside-avoid mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-0 right-0">
          <div className="w-8 h-8 bg-yellow-400 rotate-45 transform origin-bottom-left"></div>
        </div>
      )}
      
      <div className="p-4">
        {editing ? (
          <textarea
            className="w-full min-h-[120px] resize-none bg-transparent outline-none text-gray-800 focus:ring-2 focus:ring-blue-300 rounded p-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap break-words min-h-[80px]">
            {note.content}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div 
        className={`flex border-t border-black/10 transition-opacity duration-200 ${
          isHovered || editing ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {editing ? (
          <>
            <button
              onClick={handleCancel}
              className="flex-1 p-3 flex justify-center items-center gap-1 text-gray-600 hover:bg-red-50 transition-colors"
              aria-label="Cancel editing"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 p-3 flex justify-center items-center gap-1 text-green-600 hover:bg-green-50 transition-colors"
              aria-label="Save note"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="flex-1 p-3 flex justify-center items-center gap-1 text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Edit note"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onPin(note.id)}
              className={`flex-1 p-3 flex justify-center items-center gap-1 transition-colors ${
                note.pinned 
                  ? 'text-yellow-600 hover:bg-yellow-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin size={16} className={note.pinned ? 'text-yellow-500' : ''} />
              <span>{note.pinned ? 'Unpin' : 'Pin'}</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 p-3 flex justify-center items-center gap-1 text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Delete note"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default NoteCard;