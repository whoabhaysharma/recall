// NotesApp.js
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import NoteInput from '../components/NoteInput';
import ViewToggle from '../components/ViewToggle';
import NoteList from '../components/NoteList';
import AIPopup from '../components/AIPopup';

// Main NotesApp
export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [aiMsgs, setAiMsgs] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  };

  const updateNotes = async () => {
    setLoadingNotes(true);
    try {
      const { data } = await axios.get('/api/notes/list');
      setNotes(
        data.map((item) => ({
          id: item.id,
          content: item.content,
          pinned: item.pinned || false,
          color: getRandomColor(),
        }))
      );
    } catch (error) {
      console.error("Error fetching notes:", error);
      // Optionally display an error message to the user
    } finally {
      setLoadingNotes(false);
    }
  };

  const saveNote = async (content) => {
    try {
      await axios.post('/api/save', { content });
      updateNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      // Optionally display an error message to the user
    }
  };

  useEffect(() => {
    updateNotes();
  }, []);

  const filtered = notes.filter((n) => n.content.toLowerCase().includes(search.toLowerCase()));

  const handleAI = async (q) => {
    setAiMsgs([{ sender: 'user', text: q }]);
    setAiLoading(true);
    try {
      const response = await axios.post('/api/query', { q });
      if (response.data && response.data.answer) {
        setAiMsgs((msgs) => [...msgs, { sender: 'ai', text: response.data.answer }]);
      } else {
        setAiMsgs((msgs) => [...msgs, { sender: 'ai', text: "Sorry, I couldn't get a relevant answer." }]);
      }
      console.log("AI Response:", response.data); // Log the full response for debugging
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiMsgs((msgs) => [...msgs, { sender: 'ai', text: "Sorry, I encountered an error while trying to answer." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handlers = {
    delete: async (id) => {
      try {
        await axios.post('/api/notes/delete', { id });
        updateNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
        // Optionally display an error message to the user
      }
    },
    edit: async (id, content) => {
      try {
        await axios.post('/api/notes/update', { id, content });
        updateNotes();
      } catch (error) {
        console.error("Error updating note:", error);
        // Optionally display an error message to the user
      }
    },
    pin: async (id) => {
      try {
        const note = notes.find((n) => n.id === id);
        await axios.post('/api/notes/pin', { id, pinned: !note.pinned });
        updateNotes();
      } catch (error) {
        console.error("Error pinning note:", error);
        // Optionally display an error message to the user
      }
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">My Notes</h1>
          <SearchBar onSearch={setSearch} onAIQuery={handleAI} />
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          <NoteInput onSave={saveNote} />
          <ViewToggle view={view} onChange={setView} />
          <NoteList notes={filtered} view={view} handlers={handlers} loading={loadingNotes} />
        </main>

        {/* AI Popup */}
        <AIPopup messages={aiMsgs} onClose={() => setAiMsgs([])} loading={aiLoading} />
      </div>
    </div>
  );
}