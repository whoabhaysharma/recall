// components/NoteCard.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, Pin, Save, X, MoreHorizontal, Loader, Calendar, Tag } from 'lucide-react'; // Added Calendar, Tag, Edit3

function NoteCard({ note, onDelete, onEdit, onPin }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const textareaRef = useRef(null);

  const handleSave = async () => {
    if (text.trim() === note.content && !note.isOptimistic) { // Don't save if content unchanged unless optimistic
      setEditing(false);
      return;
    }
    
    setIsSaving(true);
    try {
      await onEdit(note.id, text.trim());
      setEditing(false);
    } catch (error) {
      console.error("Error saving note:", error);
      // Error state will be handled by parent via note.isError
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setText(note.content);
    setEditing(false);
  };

  const handleDelete = async () => {
    // Todoist often uses a more subtle confirmation or undo, but window.confirm is fine for now
    if (window.confirm('Are you sure you want to delete this note?')) {
      setIsDeleting(true);
      try {
        await onDelete(note.id);
      } catch {
        setIsDeleting(false); // Reset if delete fails
      }
    }
  };

  const handlePin = async (e) => {
    e.stopPropagation();
    setIsPinning(true);
    try {
      await onPin(note.id);
    } finally {
      setIsPinning(false);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [editing, text]);

  const handleTextareaChange = (e) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const isProcessing = note.isOptimistic && !note.isError; // Optimistic save in progress
  const hasError = note.isError; // Error from optimistic save

  // Todoist card style: border, padding, subtle hover.
  // Pinned notes might have a slightly different background or a prominent pin icon.
  const cardBaseClasses = "group relative flex flex-col rounded-lg border transition-shadow duration-200 ease-in-out mb-3";
  const cardBgColor = hasError ? "bg-red-50 dark:bg-red-900/30" : "bg-[var(--background)] dark:bg-neutral-800"; // Use page background for cards, or a slightly off-white/grey for depth
  const cardBorderColor = hasError ? "border-red-500" : (isProcessing ? "border-[var(--primary-accent)]" : "border-gray-200 dark:border-neutral-700");
  const cardShadow = "hover:shadow-md"; // Subtle shadow on hover

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDeleting ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
      className={`${cardBaseClasses} ${cardBgColor} ${cardBorderColor} ${cardShadow} ${isDeleting ? 'pointer-events-none' : ''}`}
      style={{ opacity: isDeleting ? 0.6 : 1 }}
      onClick={() => !editing && !isDeleting && !isProcessing && setEditing(true)} // Allow click to edit if not already editing
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg z-30 flex items-center justify-center">
          <Loader size={20} className="text-[var(--primary-accent)] animate-spin" />
        </div>
      )}
      {isProcessing && (
         <div className="absolute top-1.5 right-1.5 z-20">
            <Loader size={16} className="text-[var(--primary-accent)] animate-spin" />
        </div>
      )}
       {hasError && (
        <div className="absolute top-1.5 right-1.5 text-red-500 text-xs font-medium z-20" title="Error saving note">
          Error
        </div>
      )}

      {/* Main content area */}
      <div className={`flex-grow p-3.5 ${editing ? 'pt-2' : ''}`}>
        {editing ? (
          <div onClick={(e) => e.stopPropagation()} className="w-full">
            <textarea
              ref={textareaRef}
              className="w-full resize-none bg-transparent outline-none text-[var(--foreground)] placeholder-gray-400 dark:placeholder-gray-500 text-sm leading-relaxed"
              value={text}
              onChange={handleTextareaChange}
              onBlur={handleSave} // Save on blur
              placeholder="Task name or description..."
              disabled={isSaving}
              rows={1} // Start with one row, auto-expands
            />
          </div>
        ) : (
          <div className="flex items-start">
            {/* Checkbox-like element for consistency, non-functional for now */}
            <button
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 mt-0.5 transition-colors ${
                note.pinned ? 'border-[var(--primary-accent)] bg-[var(--primary-accent)]' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500'
              }`}
              onClick={handlePin}
              disabled={isPinning || isDeleting || isProcessing}
              aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            >
              {isPinning && <Loader size={10} className="animate-spin text-white m-auto" />}
              {note.pinned && !isPinning && <Pin size={10} className="text-white m-auto transform -rotate-0" />}
            </button>
            <p className="text-[var(--foreground)] text-sm whitespace-pre-wrap break-words leading-relaxed flex-grow">
              {note.content}
            </p>
          </div>
        )}
      </div>

      {/* Footer / Actions area */}
      {!editing && (
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-1 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-neutral-700/50 mt-2">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            {/* Placeholder for tags/project */}
            {/* <Tag size={14} /> <span>Project X</span> */}
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEditClick}
              disabled={isDeleting || isProcessing}
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Edit note"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || isProcessing}
              className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-700/30 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
              aria-label="Delete note"
            >
              <Trash2 size={15} />
            </button>
            {/* <button
              // onClick={handlePin} // Pin button is now the "checkbox"
              // disabled={isPinning || isDeleting || isProcessing}
              className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 ${note.pinned ? 'text-[var(--primary-accent)]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}
              aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
            >
              {isPinning ? <Loader size={15} className="animate-spin" /> : <Pin size={15} className={note.pinned ? 'fill-current' : ''}/>}
            </button> */}
          </div>
        </div>
      )}

      {editing && (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end gap-2 p-3 border-t border-gray-100 dark:border-neutral-700/50">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="button-secondary text-xs px-3 py-1.5"
            aria-label="Cancel editing"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || text.trim() === '' || (text.trim() === note.content && !note.isOptimistic)}
            className="button-primary text-xs px-3 py-1.5 flex items-center gap-1"
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
      )}
    </motion.div>
  );
}

export default NoteCard;