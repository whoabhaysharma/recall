'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';
import NoteInput from '../../components/NoteInput';
import ViewToggle from '../../components/ViewToggle';
import NoteList from '../../components/NoteList';
import AIPopup from '../../components/AIPopup';
import { Menu, Plus, Settings, LogOut, User, AlertTriangle, CheckCircle } from 'lucide-react'; // Updated icons
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

// Types for our application
interface Note {
  id: string;
  content: string;
  pinned: boolean;
  color: string; // Will be unused with Todoist theme, but keep for data structure
  createdAt: Date;
  updatedAt?: Date;
  isOptimistic?: boolean;
  isError?: boolean;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

interface NotesResponse {
  notes: Note[];
  pagination: Pagination;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

// Main NotesApp
export default function AppDashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [view, setView] = useState('list'); // Default to list view for Todoist style
  const [search, setSearch] = useState('');
  const [aiMsgs, setAiMsgs] = useState<Message[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 0,
    limit: 20, // Keep pagination limit
    totalPages: 0,
    hasMore: false
  });

  // Color randomization is not very Todoist-like, tasks usually have uniform appearance.
  // We'll keep the function but not apply it, or apply a standard color.
  const getRandomColor = () => {
    // For Todoist, cards are typically white/light grey or dark grey in dark mode.
    // This function becomes less relevant. We can assign a default or remove its usage.
    return 'var(--secondary-accent)'; // Use CSS variable for card background
  };

  const processNotes = (notesArray: Note[]): Note[] => {
    return notesArray.map(note => ({
      ...note,
      // color: getRandomColor(), // No longer using random colors per note
      createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
      updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
    }));
  };

  const fetchNotes = async (page = 1, reset = true, retryCount = 0) => {
    const isInitialLoad = page === 1;
    if (isInitialLoad && reset) setLoadingNotes(true);
    else setLoadingMore(true);
    
    try {
      const { data } = await axios.get<NotesResponse>(`/api/notes?page=${page}&limit=${pagination.limit}`);
      const processedNotes = processNotes(data.notes);
      
      setNotes(prev => {
        const existingNotes = reset ? [] : prev.filter(n => !n.isOptimistic);
        // Prevent duplicates if retrying or loading more
        const newNotes = processedNotes.filter(pn => !existingNotes.some(en => en.id === pn.id));
        return [...existingNotes, ...newNotes];
      });
      
      setPagination(data.pagination);
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      if (error?.response?.status === 401 && retryCount < 3) {
        setTimeout(() => fetchNotes(page, reset, retryCount + 1), (retryCount + 1) * 700);
        return; // Don't clear loading state if retrying
      }
      // For other errors, ensure loading states are cleared
      setLoadingNotes(false);
      setLoadingMore(false);
    } finally {
      // Only clear loading state if not retrying
      if (!(error?.response?.status === 401 && retryCount < 3)) {
        setLoadingNotes(false);
        setLoadingMore(false);
      }
    }
  };

  const loadMoreNotes = useCallback(() => {
    if (pagination.hasMore && !loadingMore && !loadingNotes) { // Added !loadingNotes to prevent parallel loads
      fetchNotes(pagination.page + 1, false);
    }
  }, [pagination.hasMore, pagination.page, loadingMore, loadingNotes]);

  const createNote = async (content: string) => {
    const optimisticNote: Note = {
      id: uuidv4(),
      content,
      pinned: false,
      color: getRandomColor(), // Still assign a color, though it might not be used by NoteCard directly
      createdAt: new Date(),
      isOptimistic: true,
    };
    setNotes(prev => [optimisticNote, ...prev.filter(n => n.id !== optimisticNote.id)]);

    try {
      const { data } = await axios.post('/api/notes', { content });
      const savedNote = processNotes([data.note])[0];
      setNotes(prev => prev.map(n => n.id === optimisticNote.id ? savedNote : n));
      setPagination(prev => ({ ...prev, total: prev.total + 1 }));
    } catch (error) {
      console.error("Error creating note:", error);
      setNotes(prev => prev.map(n => n.id === optimisticNote.id ? { ...n, isError: true, isOptimistic: false } : n));
      throw error;
    }
  };

  const updateNote = async (id: string, content: string) => {
    const originalNotes = [...notes];
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, content, updatedAt: new Date(), isOptimistic: true, isError: false } : n)
    );
    try {
      const { data } = await axios.patch(`/api/notes/${id}`, { content });
      const updatedNote = processNotes([data.note])[0];
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
    } catch (error) {
      console.error("Error updating note:", error);
      setNotes(originalNotes.map(n => n.id === id ? { ...n, isError: true, isOptimistic: false } : n));
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    setNotes(prev => prev.filter(note => note.id !== id));
    try {
      await axios.delete(`/api/notes/${id}`);
      setPagination(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (error) {
      console.error("Error deleting note:", error);
      if (noteToDelete) setNotes(prev => [...prev, noteToDelete]); // Revert optimistic deletion
    }
  };

  const togglePinNote = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const newPinnedStatus = !note.pinned;
    const originalNotes = [...notes];

    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, pinned: newPinnedStatus, isOptimistic: true, isError: false } : n)
    );
    try {
      const { data } = await axios.patch(`/api/notes/${id}/pin`, { pinned: newPinnedStatus });
      const updatedNote = processNotes([data.note])[0];
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
    } catch (error) {
      console.error("Error toggling pin status:", error);
      setNotes(originalNotes.map(n => n.id === id ? { ...n, isError: true, isOptimistic: false } : n));
    }
  };

  useEffect(() => {
    if (!authLoading && user) { // Ensure user is loaded before fetching
      fetchNotes(1, true);
    }
  }, [authLoading, user]); // Depend on authLoading and user

  useEffect(() => {
    // Client-side search for simplicity. Todoist likely uses server-side.
    // This effect doesn't trigger a re-fetch, just filters displayed notes.
  }, [search]);

  const filteredNotes = search
    ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase()))
    : notes;

  const handleAI = async (q: string) => {
    setAiMsgs([{ sender: 'user', text: q }]);
    setAiLoading(true);
    try {
      const response = await axios.post('/api/query', { q });
      setAiMsgs(prev => [...prev, { sender: 'ai', text: response.data.answer || "Sorry, I couldn't find an answer." }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiMsgs(prev => [...prev, { sender: 'ai', text: "Sorry, an error occurred." }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (authLoading) {
    // Optional: A more Todoist-like full-page loader
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Loader2 size={32} className="text-[var(--primary-accent)] animate-spin" />
      </div>
    );
  }

  const handlers = { edit: updateNote, delete: deleteNote, pin: togglePinNote };
  const isUserEmailVerified = user?.emailVerified || user?.providerData[0]?.providerId === 'google.com';

  // Todoist UI: Clean header, main content area, possibly a sidebar (out of scope for now).
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Email verification banner - styled to be less intrusive or more integrated */}
      {!isUserEmailVerified && (
        <div className="bg-yellow-100 dark:bg-yellow-700/30 border-b border-yellow-300 dark:border-yellow-600/50 py-2.5 text-yellow-800 dark:text-yellow-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-sm flex items-center justify-center">
            <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
            <span>Your email is not verified.</span>
            <Link href="/login" className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100 ml-1.5">
              Resend verification
            </Link>
          </div>
        </div>
      )}

      {/* Header - Todoist style: often simpler, menu icon, search, add task, user/settings */}
      <header className="sticky top-0 z-20 bg-[var(--background)] dark:bg-neutral-800/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-700/80">
        <div className="max-w-full mx-auto px-3 sm:px-5 h-14 flex items-center justify-between">
          {/* Left side: Menu (placeholder) and Home/Logo (optional) */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
              <Menu size={20} />
            </button>
             {/* <img src="/logo.svg" alt="RECALL" className="h-7 hidden sm:block" /> */}
          </div>

          {/* Center: Search Bar - more prominent in Todoist */}
          <div className="flex-1 mx-4 sm:mx-8 max-w-xl">
            <SearchBar onSearch={setSearch} onAIQuery={handleAI} />
          </div>

          {/* Right side: Add Task, AI Sparkles (optional), User/Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={() => document.querySelector<HTMLButtonElement>('button[aria-label="Add task"]')?.click()} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 text-[var(--primary-accent)]">
              <Plus size={22} />
            </button>
            {/* <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
              <Sparkles size={20} className="text-gray-600 dark:text-gray-300"/>
            </button> */}
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
              <Settings size={20} className="text-gray-600 dark:text-gray-300"/>
            </button>
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                {user?.email?.[0]?.toUpperCase() || <User size={16} />}
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-[var(--background)] dark:bg-neutral-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-neutral-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium truncate">{user?.displayName || user?.email}</p>
                </div>
                <a href="#" onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700/70 w-full text-left">
                  <LogOut size={15} /> Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Todoist: typically a single column list */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-3 sm:px-4 py-5 sm:py-6">
        {/* Today's Date or Project Title - Placeholder */}
        {/* <h1 className="text-xl font-semibold mb-4">Today</h1> */}

        <div className="space-y-0"> {/* Removed space-y-6, NoteCard has mb-3 */}
          <NoteInput onSave={createNote} />
          
          {/* Controls: ViewToggle might be less prominent or removed for strict Todoist list view */}
          <div className="flex flex-wrap justify-end items-center gap-3 mb-3">
             <ViewToggle view={view} onChange={setView} />
            {/* {filteredNotes.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {pagination.total} {pagination.total === 1 ? 'task' : 'tasks'}
                {search && ` matching "${search}"`}
              </div>
            )} */}
          </div>
          
          <NoteList 
            notes={filteredNotes}
            view={view} // Pass current view (should be 'list' for Todoist)
            handlers={handlers} 
            loading={loadingNotes && notes.length === 0} // Only show main loader if no notes loaded yet
            loadingMore={loadingMore}
            hasMore={pagination.hasMore}
            onLoadMore={loadMoreNotes}
          />
        </div>
      </main>

      <AIPopup messages={aiMsgs} onClose={() => setAiMsgs([])} loading={aiLoading} />
    </div>
  );
}