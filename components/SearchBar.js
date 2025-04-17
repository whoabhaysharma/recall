// components/SearchBar.js
import React, { useState, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';
import Spinner from './Spinner';

function SearchBar({ onSearch, onAIQuery }) {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef();

  const debouncedSearch = useCallback(
    debounce((q) => {
      onSearch(q);
      setLoading(false);
    }, 300),
    [onSearch]
  );

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    setLoading(true);
    debouncedSearch(q.toLowerCase());
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleKey = async (e) => {
    if (e.key !== 'Enter') return;
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    if (q.endsWith('?')) {
      await onAIQuery(q);
    } else {
      onSearch(q);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex-1 max-w-2xl mx-auto">
      <Search className="absolute top-3 left-3 text-gray-500" size={20} aria-hidden="true" />
      <input
        ref={ref}
        type="search"
        aria-label="Search notes or ask AI"
        className="w-full pl-10 pr-10 py-2 rounded-full bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none transition"
        placeholder="Search or ask AI…"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKey}
      />
      {query && !loading && (
        <button
          onClick={clearSearch}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      {loading && (
        <div className="absolute top-3 right-3">
          <Spinner size={16} />
        </div>
      )}
    </div>
  );
}

export default SearchBar;