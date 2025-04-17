// components/NoteInput.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';

function NoteInput({ onSave }) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await onSave(text.trim());
      setText('');
      setExpanded(false);
    } catch {
      console.error('GETTING THE ERROR');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section
      layout
      onClick={() => !expanded && setExpanded(true)}
      className="bg-white rounded-xl shadow p-4 mb-6 cursor-text hover:shadow-md transition"
      aria-label="Add a new note"
    >
      {!expanded ? (
        <p className="text-gray-500">Take a note…</p>
      ) : (
        <>
          <textarea
            autoFocus
            rows={3}
            className="w-full resize-none bg-transparent outline-none placeholder-gray-400 text-gray-800"
            placeholder="Write your note…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex justify-end mt-3 space-x-2 items-center">
            {saving && <Spinner size={16} />}
            <button
              onClick={() => setExpanded(false)}
              disabled={saving}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-800 font-semibold hover:bg-yellow-300 disabled:opacity-50 transition"
            >
              Add
            </button>
          </div>
        </>
      )}
    </motion.section>
  );
}

export default NoteInput;