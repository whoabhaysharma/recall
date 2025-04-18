// components/SearchBar.js
import React, { useState, useCallback } from 'react';
import { Search, Sparkles } from 'lucide-react';
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
    setAiMode(false);
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
    if (query && !aiMode) {
      // Clear regular search when switching to AI mode
      onSearch('');
    }
  };

  return (
    <div className="relative flex w-full">
      <div className="relative flex-1 rounded-l-full overflow-hidden shadow-sm">
        <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
        <input
          type="search"
          aria-label={aiMode ? "Ask AI about your notes" : "Search notes"}
          className={`w-full pl-12 pr-10 py-3 outline-none transition-colors bg-white dark:bg-gray-800 ${aiMode ? 'border-2 border-r-0 border-purple-400 dark:border-purple-600 text-purple-700 dark:text-purple-400' : 'border border-r-0 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}`}
          placeholder={aiMode ? "Ask AI about your notes..." : "Search notes..."}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKey}
        />
        {query && !loading && (
          <button
            onClick={clearSearch}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        {loading && (
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
            <Spinner size={18} />
          </div>
        )}
      </div>
      <button
        onClick={toggleAiMode}
        className={`flex items-center justify-center px-4 rounded-r-full transition-colors ${
          aiMode 
            ? 'bg-purple-500 hover:bg-purple-600 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
        }`}
        aria-label={aiMode ? "Switch to regular search" : "Switch to AI search"}
        aria-pressed={aiMode}
      >
        <Sparkles size={18} className={aiMode ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
      </button>
    </div>
  );
}

export default SearchBar;