// components/NoteCard.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, Pin, Save, X, MoreHorizontal, Loader } from 'lucide-react';

function NoteCard({ note, onDelete, onEdit, onPin }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const handleSave = async () => {
    if (text.trim() === note.content) {
      setEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await onEdit(note.id, text);
      setEditing(false);
    } catch {
      // Handle error if needed
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setText(note.content);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);
      try {
        await onDelete(note.id);
        // No need to reset state as component will unmount
      } catch {
        setIsDeleting(false);
      }
    }
  };

  const handlePin = async () => {
    setIsPinning(true);
    try {
      await onPin(note.id);
    } finally {
      setIsPinning(false);
    }
  };

  // Determine if we should show processing animation
  const isProcessing = note.isOptimistic && !note.isError;
  const hasError = note.isOptimistic && note.isError;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isDeleting ? 0.6 : 1, 
        y: 0,
        boxShadow: isProcessing ? 
          ['0 1px 3px rgba(0,0,0,0.12)', '0 4px 6px rgba(59,130,246,0.5)', '0 1px 3px rgba(0,0,0,0.12)'] : 
          undefined
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.2,
        layoutDependency: false,
        boxShadow: {
          repeat: isProcessing ? Infinity : 0,
          duration: 1.5
        }
      }}
      style={{ 
        backgroundColor: hasError ? '#fee2e2' : note.color,
        border: isProcessing ? '1px solid rgba(59,130,246,0.5)' : undefined,
        borderColor: hasError ? '#ef4444' : undefined,
        borderWidth: (isProcessing || hasError) ? '1px' : undefined,
        opacity: isDeleting ? 0.6 : 1
      }}
      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 break-inside-avoid mb-4"
      onClick={() => !editing && !isDeleting && !isProcessing && setEditing(true)}
    >
      {/* Loading overlay for delete */}
      {isDeleting && (
        <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl z-30 flex items-center justify-center">
          <Loader size={24} className="text-red-500 animate-spin" />
        </div>
      )}
      
      {/* Optimistic indicator */}
      {isProcessing && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/5 bg-opacity-40 rounded-xl z-20 pointer-events-none">
          <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full flex items-center">
            <Loader size={12} className="mr-1 animate-spin" />
            <span>Saving...</span>
          </div>
        </div>
      )}
      
      {/* Error indicator */}
      {hasError && (
        <div className="absolute top-2 left-2 bg-red-100 text-red-800 text-xs py-1 px-2 rounded-full">
          Error saving
        </div>
      )}

      {/* Pin indicator with loading state */}
      <AnimatePresence>
        {note.pinned && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute top-0 right-0 z-10"
          >
            <div className="w-8 h-8 bg-yellow-400 rounded-bl-xl flex items-center justify-center shadow-sm">
              <Pin size={14} className="text-yellow-700 transform -rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Card Content */}
      <div className="p-4 relative">
        {/* Top buttons - always visible */}
        <div className="absolute top-1 right-1 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePin();
            }}
            disabled={isPinning || isDeleting}
            className={`p-2 rounded-full ${
              note.pinned 
                ? 'text-yellow-600 hover:bg-yellow-100' 
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
            } transition-colors relative`}
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin size={16} className={note.pinned ? 'text-yellow-500' : ''} />
            {isPinning && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader size={16} className="animate-spin text-blue-500" />
              </span>
            )}
          </button>
          
          {!editing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
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
              disabled={isSaving}
            />
            
            {/* Editing buttons */}
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || text.trim() === note.content || text.trim() === ''}
                className="px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                aria-label="Save note"
              >
                {isSaving ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    <span>Saving</span>
                  </>
                ) : 'Save'}
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