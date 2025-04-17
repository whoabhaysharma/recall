// components/ViewToggle.js
import React from 'react';
import { List, LayoutGrid } from 'lucide-react';

function ViewToggle({ view, onChange }) {
  return (
    <div className="flex justify-end mb-4 space-x-2">
      <button
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        aria-label="List view"
        className={`p-2 rounded-full focus:ring-2 focus:ring-blue-300 transition ${view === 'list' ? 'bg-gray-200' : ''}`}
      >
        <List size={20} />
      </button>
      <button
        onClick={() => onChange('grid')}
        aria-pressed={view === 'grid'}
        aria-label="Grid view"
        className={`p-2 rounded-full focus:ring-2 focus:ring-blue-300 transition ${view === 'grid' ? 'bg-gray-200' : ''}`}
      >
        <LayoutGrid size={20} />
      </button>
    </div>
  );
}

export default ViewToggle;