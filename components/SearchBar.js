// components/SearchBar.js
import React, { useState, useCallback } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import debounce from 'lodash/debounce';
import Spinner from './Spinner';

function SearchBar({ onSearch, onAIQuery }) {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [aiMode, setAiMode] = useState(false);

  const debouncedSearch = useCallback(
    debounce((q) => {
      if (!aiMode) onSearch(q);
      setLoading(false);
    }, 300),
    [onSearch, aiMode]
  );

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    
    if (!aiMode) {
      setLoading(true);
      debouncedSearch(q.toLowerCase());
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setAiMode(false); // Optionally reset AI mode as well, or keep it as is
  };

  const handleKey = async (e) => {
    if (e.key !== 'Enter') return;
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    if (aiMode) {
      await onAIQuery(q);
    } else {
      onSearch(q);
    }
    setLoading(false);
  };

  const toggleAiMode = () => {
    setAiMode(!aiMode);
    if (query && !aiMode) { // If switching to AI mode with an existing query
      onSearch(''); // Clear regular search results
    } else if (query && aiMode) { // If switching from AI to regular with an existing query
      setLoading(true);
      debouncedSearch(query.toLowerCase()); // Trigger search for the current query
    }
  };

  // Todoist-like search bar: typically a light grey background, rounded, with an icon.
  // AI mode can have a subtle visual difference, perhaps a border color or icon color.

  const inputBaseClasses = "w-full py-2.5 pl-10 pr-10 outline-none transition-colors duration-150 ease-in-out appearance-none text-sm";
  const inputBgColor = "bg-[var(--secondary-accent)] dark:bg-[var(--secondary-accent)]";
  const inputTextColor = "text-[var(--foreground)] dark:text-[var(--foreground)] placeholder-gray-500 dark:placeholder-gray-400";
  const inputBorderRadius = "rounded-md"; // Todoist uses slightly rounded rect, not full pill

  const aiModeRing = aiMode ? "ring-2 ring-[var(--primary-accent)]" : "ring-1 ring-gray-300 dark:ring-gray-600 focus-within:ring-2 focus-within:ring-[var(--primary-accent)]";

  return (
    <div className={`relative flex w-full items-center ${inputBorderRadius} ${inputBgColor} ${aiModeRing} shadow-sm`}>
      <Search
        className="absolute left-3 text-gray-400 dark:text-gray-500 z-10"
        size={16}
        aria-hidden="true"
      />
      <input
        type="text"
        aria-label={aiMode ? "Ask AI about your notes" : "Search notes"}
        className={`${inputBaseClasses} ${inputBgColor} ${inputTextColor} ${inputBorderRadius} border-transparent focus:border-transparent focus:ring-0`}
        placeholder={aiMode ? "Ask Recall..." : "Search..."}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKey}
        spellCheck="false"
      />
      {query && !loading && (
        <button
          onClick={clearSearch}
          className="absolute right-10 mr-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full"
          aria-label="Clear search"
          type="button"
        >
          <X size={16} />
        </button>
      )}
      {loading && (
        <div className="absolute right-10 mr-1">
          <Spinner size={16} />
        </div>
      )}
      
      <button
        onClick={toggleAiMode}
        className={`flex items-center justify-center p-2.5 rounded-r-md transition-colors ${
          aiMode 
            ? 'text-[var(--primary-accent)] hover:bg-red-500/10'
            : 'text-gray-500 hover:text-[var(--primary-accent)] hover:bg-gray-500/10 dark:text-gray-400 dark:hover:text-[var(--primary-accent)]'
        }`}
        aria-label={aiMode ? "Switch to regular search" : "Switch to AI search"}
        aria-pressed={aiMode}
        type="button"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
}

export default SearchBar;