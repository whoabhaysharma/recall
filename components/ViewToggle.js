// components/ViewToggle.js
import React from 'react';
import { List, Grid } from 'lucide-react';

function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
      <button
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        aria-label="List view"
        className={`px-4 py-2 flex items-center gap-2 transition-colors ${
          view === 'list' 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <List size={18} />
        <span className="text-sm font-medium">List</span>
      </button>
      <button
        onClick={() => onChange('grid')}
        aria-pressed={view === 'grid'}
        aria-label="Grid view"
        className={`px-4 py-2 flex items-center gap-2 transition-colors ${
          view === 'grid' 
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Grid size={18} />
        <span className="text-sm font-medium">Grid</span>
      </button>
    </div>
  );
}

export default ViewToggle;