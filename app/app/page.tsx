'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';
import NoteInput from '../../components/NoteInput';
import ViewToggle from '../../components/ViewToggle';
import NoteList from '../../components/NoteList';
import AIPopup from '../../components/AIPopup';
import { MessageSquare, Sparkles, LogOut, User } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

// Types for our application
interface Note {
  id: string;
  content: string;
  pinned: boolean;
  color: string;
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
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [aiMsgs, setAiMsgs] = useState<Message[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 0,
    limit: 20,
    totalPages: 0,
    hasMore: false
  });

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

  const applyColors = (notesArray: Note[]): Note[] => {
    return notesArray.map(note => ({
      ...note,
      color: getRandomColor(),
      createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
    }));
  };

  const fetchNotes = async (page = 1, reset = true, retryCount = 0) => {
    const isInitialLoad = page === 1;
    
    if (isInitialLoad && reset) {
      setLoadingNotes(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const { data } = await axios.get<NotesResponse>(`/api/notes?page=${page}&limit=${pagination.limit}`);
      
      // Apply colors to notes
      const coloredNotes = applyColors(data.notes);
      
      if (reset) {
        // Replace all notes (filter out optimistic ones that might already be saved)
        const optimisticNotes = notes.filter(n => n.isOptimistic);
        setNotes([...optimisticNotes, ...coloredNotes]);
      } else {
        // Append to existing notes
        setNotes(prev => {
          // Remove optimistic notes from previous array before appending new notes
          const nonOptimistic = prev.filter(n => !n.isOptimistic);
          return [...nonOptimistic, ...coloredNotes];
        });
      }
      
      setPagination(data.pagination);
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      
      // Check if this is an authentication error (401)
      if (error?.response?.status === 401 && retryCount < 3) {
        console.log(`Authentication not ready yet, retrying (${retryCount + 1}/3)...`);
        
        // Wait a bit longer with each retry
        const delay = (retryCount + 1) * 700;
        
        // Retry the request after a delay
        setTimeout(() => {
          fetchNotes(page, reset, retryCount + 1);
        }, delay);
        
        // Don't clear loading state when we're going to retry
        return;
      }
    } finally {
      // Only clear loading state if we're not retrying
      setLoadingNotes(false);
      setLoadingMore(false);
    }
  };

  const loadMoreNotes = useCallback(() => {
    if (pagination.hasMore && !loadingMore) {
      fetchNotes(pagination.page + 1, false);
    }
  }, [pagination.hasMore, pagination.page, loadingMore]);

  const createNote = async (content: string) => {
    // Create optimistic note that will be immediately shown in UI
    const optimisticNote: Note = {
      id: uuidv4(), // Temporary ID
      content,
      pinned: false,
      color: getRandomColor(),
      createdAt: new Date(),
      isOptimistic: true,
    };

    // Add optimistic note to state immediately
    setNotes(prev => [optimisticNote, ...prev]);

    try {
      // Send actual API request
      const { data } = await axios.post('/api/notes', { content });
      
      // Replace optimistic note with real one from API
      setNotes(prev => prev.map(note => 
        note.isOptimistic && note.content === content 
          ? { ...data.note, color: note.color } // Keep the same color
          : note
      ));

      // Update pagination if needed
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));
    } catch (error) {
      console.error("Error creating note:", error);
      
      // Mark optimistic note as having an error
      setNotes(prev => prev.map(note => 
        note.isOptimistic && note.content === content
          ? { ...note, isError: true }
          : note
      ));

      // Show a toast or notification here if you have one
      throw error;
    }
  };

  const updateNote = async (id: string, content: string) => {
    // Apply optimistic update immediately
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id ? { ...note, content, updatedAt: new Date() } : note
      )
    );

    try {
      // Send actual API request
      await axios.patch(`/api/notes/${id}`, { content });
    } catch (error) {
      console.error("Error updating note:", error);
      
      // Revert optimistic update on error
      fetchNotes(1, true);
      
      // Show a toast or notification here if you have one
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    // Get a copy of the note before removing it
    const noteToDelete = notes.find(note => note.id === id);
    
    // Remove note optimistically from state
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    
    try {
      // Send actual API request
      await axios.delete(`/api/notes/${id}`);
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
    } catch (error) {
      console.error("Error deleting note:", error);
      
      // If deletion fails, put the note back
      if (noteToDelete) {
        setNotes(prev => [...prev, noteToDelete]);
      }
      
      // Show a toast or notification here if you have one
    }
  };

  const togglePinNote = async (id: string) => {
    // Find the note to pin/unpin
    const note = notes.find((n) => n.id === id);
    
    if (note) {
      const newPinnedStatus = !note.pinned;
      
      // Update optimistically
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === id ? { ...note, pinned: newPinnedStatus } : note
        )
      );
      
      try {
        // Send actual API request
        await axios.patch(`/api/notes/${id}/pin`, { pinned: newPinnedStatus });
      } catch (error) {
        console.error("Error toggling pin status:", error);
        
        // Revert optimistic update on error
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === id ? { ...note, pinned: !newPinnedStatus } : note
          )
        );
        
        // Show a toast or notification here if you have one
      }
    }
  };

  // Effect for initial load
  useEffect(() => {
    fetchNotes(1, true);
  }, []);

  // Effect for search - reset pagination and fetch first page
  useEffect(() => {
    if (search) {
      // TODO: Implement server-side search API
      // For now, we'll just filter client-side
    }
  }, [search]);

  // Get the filtered notes based on search input
  const filtered = search 
    ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase()))
    : notes;

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

  // Handle loading state for authentication
  if (authLoading) {
    return null; // No need to show loading state - middleware ensures this page only loads for auth users
  }

  // Group handlers for the note list component
  const handlers = {
    edit: updateNote,
    delete: deleteNote,
    pin: togglePinNote,
  };

  // Check if user's email is verified
  const isUserEmailVerified = user?.emailVerified || user?.providerData[0]?.providerId === 'google.com';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Email verification banner */}
      {!isUserEmailVerified && (
        <div className="bg-yellow-600 dark:bg-yellow-700 py-2">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-white text-sm">
            <span className="font-semibold">Your email is not verified.</span> Please check your inbox for a verification link or{' '}
            <Link href="/login" className="underline font-medium hover:text-yellow-100">
              click here
            </Link>{' '}
            to resend the verification email.
          </div>
        </div>
      )}

      {/* Header with user information and logout */}
      <header className="bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded">
                <img src="/logo.svg" alt="RECALL" className="h-8" />
              </div>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 dark:bg-[#CD1B1B]/20">
                <Sparkles size={14} className="text-[#CD1B1B] dark:text-[#CD1B1B] mr-1" />
                <span className="text-xs font-medium text-[#CD1B1B] dark:text-[#CD1B1B]/90">Chat with your notes</span>
              </div>
            </div>
            
            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-xl">
              <SearchBar onSearch={setSearch} onAIQuery={handleAI} />
            </div>

            {/* User profile and logout */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <User size={16} className="text-gray-300" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">{user?.displayName || user?.email}</span>
              </div>
              <button 
                onClick={logout}
                className="text-sm flex items-center gap-1 py-1 px-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-6">
          {/* Note Input */}
          <NoteInput onSave={createNote} />
          
          {/* Controls */}
          <div className="flex flex-wrap justify-between items-center gap-3">
            <ViewToggle view={view} onChange={setView} />
            {filtered.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filtered.length} of {pagination.total} {pagination.total === 1 ? 'note' : 'notes'}
                {search && ` matching "${search}"`}
              </div>
            )}
          </div>
          
          {/* Note List with Infinite Scrolling */}
          <NoteList 
            notes={filtered} 
            view={view} 
            handlers={handlers} 
            loading={loadingNotes}
            loadingMore={loadingMore}
            hasMore={pagination.hasMore}
            onLoadMore={loadMoreNotes}
          />
        </div>
      </main>

      {/* AI Popup */}
      <AIPopup messages={aiMsgs} onClose={() => setAiMsgs([])} loading={aiLoading} />
    </div>
  );
} 