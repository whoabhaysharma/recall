// NotesApp.js
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import NoteInput from '../components/NoteInput';
import ViewToggle from '../components/ViewToggle';
import NoteList from '../components/NoteList';
import AIPopup from '../components/AIPopup';
import { MessageSquare, Sparkles } from 'lucide-react';

// Types for our application
interface Note {
  id: string;
  content: string;
  pinned: boolean;
  color: string;
  createdAt: Date;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

// Main NotesApp
export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [aiMsgs, setAiMsgs] = useState<Message[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const getRandomColor = () => {
    const colors = [
      '#f3f4f6', // gray-100
      '#fee2e2', // red-100
      '#fef3c7', // amber-100
      '#d1fae5', // emerald-100
      '#dbeafe', // blue-100
      '#ede9fe', // violet-100
      '#fce7f3', // pink-100
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const updateNotes = async () => {
    setLoadingNotes(true);
    try {
      const { data } = await axios.get('/api/notes/list');
      setNotes(
        data.map((item: any) => ({
          id: item.id,
          content: item.content,
          pinned: item.pinned || false,
          color: getRandomColor(),
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        }))
      );
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const saveNote = async (content: string) => {
    try {
      await axios.post('/api/save', { content });
      updateNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      throw error; // Let the component handle the error
    }
  };

  useEffect(() => {
    updateNotes();
  }, []);

  const filtered = notes.filter((n) => n.content.toLowerCase().includes(search.toLowerCase()));

  const handleAI = async (q: string) => {
    setAiMsgs([{ sender: 'user', text: q }]);
    setAiLoading(true);
    try {
      const response = await axios.post('/api/query', { q });
      if (response.data && response.data.answer) {
        setAiMsgs((msgs) => [...msgs, { sender: 'ai', text: response.data.answer }]);
      } else {
        setAiMsgs((msgs) => [...msgs, { sender: 'ai', text: "Sorry, I couldn't find a relevant answer in your notes." }]);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiMsgs((msgs) => [...msgs, { sender: 'ai', text: "Sorry, I encountered an error while trying to answer." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handlers = {
    delete: async (id: string) => {
      try {
        await axios.post('/api/notes/delete', { id });
        updateNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    },
    edit: async (id: string, content: string) => {
      try {
        await axios.post('/api/notes/update', { id, content });
        updateNotes();
      } catch (error) {
        console.error("Error updating note:", error);
        throw error;
      }
    },
    pin: async (id: string) => {
      try {
        const note = notes.find((n) => n.id === id);
        if (note) {
          await axios.post('/api/notes/pin', { id, pinned: !note.pinned });
          updateNotes();
        }
      } catch (error) {
        console.error("Error pinning note:", error);
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with AI Search Focus */}
      <header className="bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">AI-Powered Notes</h1>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900">
                <Sparkles size={14} className="text-purple-500 dark:text-purple-400 mr-1" />
                <span className="text-xs font-medium text-purple-800 dark:text-purple-300">AI Search</span>
              </div>
            </div>
            
            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xl">
              <SearchBar onSearch={setSearch} onAIQuery={handleAI} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-6">
          {/* Note Input */}
          <NoteInput onSave={saveNote} />
          
          {/* Controls */}
          <div className="flex flex-wrap justify-between items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            {filtered.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filtered.length} {filtered.length === 1 ? 'note' : 'notes'}
                {search && ` matching "${search}"`}
              </div>
            )}
          </div>
          
          {/* Note List */}
          <NoteList notes={filtered} view={view} handlers={handlers} loading={loadingNotes} />
        </div>
      </main>

      {/* AI Popup */}
      <AIPopup messages={aiMsgs} onClose={() => setAiMsgs([])} loading={aiLoading} />
    </div>
  );
}