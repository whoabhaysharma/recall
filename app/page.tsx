'use client';

import { useState, useRef, useCallback } from 'react';
import { Search, LayoutGrid, List, Trash2, Edit, Pin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';

// Stub AI fetch function – replace with real API call
async function fetchAIResponse(query) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ answer: `AI answer for "${query}"` });
    }, 800);
  });
}

export default function NotesApp() {
  const [view, setView] = useState('grid');
  const [notes, setNotes] = useState([
    { id: 1, content: 'Eggs, Milk, Bread, Coffee', pinned: false, color: '#ffffff' },
    { id: 2, content: 'AI Note Assistant, Fitness App', pinned: true, color: '#fef9c3' },
    { id: 3, content: 'Book: "The Alchemist"', pinned: false, color: '#fce7f3' },
    { id: 4, content: 'Meeting at 3 PM with John', pinned: false, color: '#e0f2fe' },
  ]);
  const [newContent, setNewContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const searchRef = useRef(null);
  const colors = ['#ffffff', '#fef9c3', '#fce7f3', '#e0f2fe', '#dcfce7', '#ede9fe'];

  const updateSearch = useCallback(
    debounce(text => {
      setSearchText(text);
      const lower = text.toLowerCase();
      const sug = notes
        .filter(n => n.content.toLowerCase().includes(lower))
        .slice(0, 5)
        .map(n => n.content);
      setSuggestions(sug);
    }, 200),
    [notes]
  );

  const handleInput = e => {
    const val = e.target.value;
    updateSearch(val);
    setShowSuggestions(true);
  };

  const handleSearchKey = async e => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      setShowSuggestions(false);
      if (query.endsWith('?')) {
        // AI query: open bottom popup
        setShowPopup(true);
        setAiMessages([{ sender: 'user', text: query }]);
        const resp = await fetchAIResponse(query);
        setAiMessages(msgs => [...msgs, { sender: 'ai', text: resp.answer }]);
      } else {
        // normal filter
        setSearchText(query);
      }
    }
  };

  const saveNote = () => {
    if (!newContent.trim()) return;
    const color = colors[Math.floor(Math.random() * colors.length)];
    setNotes([{ id: Date.now(), content: newContent.trim(), pinned: false, color }, ...notes]);
    setNewContent('');
    setIsExpanded(false);
  };
  const cancelInput = () => setIsExpanded(false);

  const filteredNotes = notes.filter(n => n.content.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with centered container */}
      <header className="sticky top-0 bg-white z-20 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-2 px-4">
          <div className="relative flex-1 mr-4">
            <Search
              size={24}
              className="text-gray-500 absolute top-1/2 left-3 -translate-y-1/2"
              aria-hidden
            />
            <input
              ref={searchRef}
              type="search"
              className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ask me about your notes..."
              onChange={handleInput}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleSearchKey}
              aria-label="Search or ask AI"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-lg max-h-48 overflow-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setSearchText(s);
                      setShowSuggestions(false);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Main content centered */}
      <main className="flex-1 overflow-auto py-4">
        <div className="max-w-6xl mx-auto px-4">
          {/* Collapsing Note Input */}
          <motion.section
            layout
            onClick={() => setIsExpanded(true)}
            className="bg-white rounded-xl shadow p-4 mb-6 cursor-text hover:shadow-md transition"
            aria-label="Add a new note"
          >
            {!isExpanded ? (
              <p className="text-gray-500">Take a note...</p>
            ) : (
              <>
                <textarea
                  autoFocus
                  rows={3}
                  className="w-full bg-transparent resize-none outline-none placeholder-gray-400 text-gray-800"
                  placeholder="Write your note..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    onClick={cancelInput}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNote}
                    className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-800 font-semibold hover:bg-yellow-300"
                  >
                    Add
                  </button>
                </div>
              </>
            )}
          </motion.section>

          {/* View Toggle & Notes */}
          <div className="flex justify-end mb-4 space-x-2">
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={`p-2 rounded-full focus:ring-2 focus:ring-blue-300 ${
                view === "list" ? "bg-gray-200" : ""
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`p-2 rounded-full focus:ring-2 focus:ring-blue-300 ${
                view === "grid" ? "bg-gray-200" : ""
              }`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>

          {/* Masonry-style Grid */}
          <div
            className={
              view === "grid"
                ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 space-y-4"
                : "space-y-4"
            }
          >
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ backgroundColor: note.color, breakInside: "avoid" }}
                  className="mb-4 p-4 rounded-2xl shadow group relative overflow-hidden"
                >
                  <p className="text-gray-800 whitespace-pre-wrap break-words">
                    {note.content}
                  </p>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex space-x-1">
                    <button
                      onClick={() =>
                        setNotes((ns) => ns.filter((n) => n.id !== note.id))
                      }
                      aria-label="Delete note"
                      className="p-1 rounded focus:ring-2 focus:ring-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setIsExpanded(true);
                        setNewContent(note.content);
                      }}
                      aria-label="Edit note"
                      className="p-1 rounded focus:ring-2 focus:ring-blue-300"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setNotes((ns) =>
                          ns.map((n) =>
                            n.id === note.id ? { ...n, pinned: !n.pinned } : n
                          )
                        )
                      }
                      aria-label="Pin note"
                      className="p-1 rounded focus:ring-2 focus:ring-yellow-300"
                    >
                      <Pin
                        size={16}
                        className={
                          note.pinned ? "text-yellow-500" : "text-gray-600"
                        }
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom AI Popup (centered) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-white shadow-xl p-4 max-h-1/3 overflow-auto rounded-t-2xl z-30"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">AI Response</h3>
                <button
                  onClick={() => setShowPopup(false)}
                  aria-label="Close popup"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${
                      msg.sender === "user" ? "bg-gray-100" : "bg-yellow-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}