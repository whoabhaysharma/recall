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

  // Border styles based on mode
  const borderStyle = aiMode ? 
    "border-2 border-[#CD1B1B] dark:border-[#CD1B1B]" : 
    "border border-gray-200 dark:border-gray-700";

  return (
    <div className="relative flex w-full shadow-sm overflow-hidden rounded-full">
      <div className="flex-1 flex items-center relative">
        <Search 
          className="absolute left-4 text-gray-400 z-10" 
          size={18} 
          aria-hidden="true" 
        />
        <input
          type="text"
          aria-label={aiMode ? "Ask AI about your notes" : "Search notes"}
          className={`w-full py-3 pl-12 pr-10 outline-none rounded-l-full transition-colors bg-white dark:bg-gray-800 ${borderStyle} border-r-0 ${
            aiMode ? 'text-[#CD1B1B] dark:text-[#CD1B1B]' : 'text-gray-800 dark:text-gray-200'
          } appearance-none`}
          placeholder={aiMode ? "Ask Recall about your notes..." : "Search your memories..."}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKey}
          spellCheck="false"
        />
        {query && !loading && (
          <button
            onClick={clearSearch}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Clear search"
            type="button"
          >
            <X size={16} />
          </button>
        )}
        {loading && (
          <div className="absolute right-3">
            <Spinner size={18} />
          </div>
        )}
      </div>
      
      <button
        onClick={toggleAiMode}
        className={`flex items-center justify-center px-4 rounded-r-full transition-colors ${borderStyle} border-l-0 ${
          aiMode 
            ? 'bg-[#CD1B1B] hover:bg-red-700 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
        }`}
        aria-label={aiMode ? "Switch to regular search" : "Switch to AI search"}
        aria-pressed={aiMode}
        type="button"
      >
        <Sparkles size={18} className={aiMode ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
      </button>
    </div>
  );
}

export default SearchBar;