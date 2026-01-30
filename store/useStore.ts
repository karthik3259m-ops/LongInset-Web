import { create } from 'zustand';
import { MOCK_QUESTIONS, MOCK_TOPICS_MASTERY } from '../services/mockData';
import { Question, TopicMastery, User } from '../types';
import { supabase } from '../services/supabase';

interface RouteState {
  path: string;
  state?: any;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean; // Track if initial auth check is done
  mastery: TopicMastery[];
  activeQuestion: Question | null;
  currentQuestionIndex: number;
  sessionQuestions: Question[];
  isExamMode: boolean;
  currentRoute: RouteState;
  
  // Actions
  initializeAuth: () => Promise<void>;
  _syncProfile: (authUser: any) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, examTarget: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message?: string }>;
  updateQuickNotes: (notes: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  
  startSession: (topicId?: string) => void;
  submitAnswer: (answer: string) => boolean;
  nextQuestion: () => void;
  navigate: (path: string, state?: any) => void;
}

// Automatically detect the production URL for redirects (e.g., email confirmation)
const PRODUCTION_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAuthInitialized: false, // Default to false
  mastery: MOCK_TOPICS_MASTERY,
  activeQuestion: null,
  currentQuestionIndex: 0,
  sessionQuestions: [],
  isExamMode: false,
  currentRoute: { path: '/', state: null },

  initializeAuth: async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Sync profile
        await get()._syncProfile(session.user);
      }
    } catch (error) {
      console.error("Auth init error:", error);
    } finally {
      // Mark auth as initialized regardless of result
      set({ isAuthInitialized: true });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Redirect to update password page when recovery link is clicked
        set({ currentRoute: { path: '/update-password' } });
      } else if (session?.user) {
        await get()._syncProfile(session.user);
      } else {
        set({ user: null, isAuthenticated: false });
        // Only redirect to login if explicitly signed out or session expired
        if (event === 'SIGNED_OUT') {
            set({ currentRoute: { path: '/login' } });
        }
      }
    });
  },

  // Helper to sync Supabase Auth User with Public Profile
  _syncProfile: async (authUser: any) => {
    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (profile && !error) {
        set({ user: profile as User, isAuthenticated: true });
        return;
    }

    // If profile missing but auth exists
    const metadata = authUser.user_metadata || {};
    const newProfile = {
        id: authUser.id,
        email: authUser.email,
        name: metadata.full_name || metadata.name || 'User', // Ensure full_name is captured
        examTarget: metadata.examTarget || 'General',
        streak: 0,
        points: 0,
        quickNotes: ''
    };

    const { data: createdProfile, error: insertError } = await supabase
        .from('users')
        .insert([newProfile])
        .select()
        .single();
    
    if (createdProfile && !insertError) {
        set({ user: createdProfile as User, isAuthenticated: true });
    } else {
        console.error("Profile sync failed:", insertError);
    }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.error('Login error:', error?.message);
      return false;
    }
    
    set({ currentRoute: { path: '/' } });
    return true;
  },

  register: async (name, email, password, examTarget) => {
    // Explicitly use the dynamic PRODUCTION_URL for email redirection
    const redirectUrl = PRODUCTION_URL;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: name,
          name,
          examTarget,
        }
      }
    });

    if (error) {
      console.error('Registration error:', error.message);
      return { success: false, message: error.message };
    }

    if (data.session && data.user) {
        const newUserProfile = {
            id: data.user.id,
            email: email,
            name: name,
            examTarget: examTarget,
            streak: 0,
            points: 0,
            quickNotes: ''
        };

        await supabase.from('users').insert([newUserProfile]);

        set({ user: newUserProfile as User, isAuthenticated: true, currentRoute: { path: '/' } });
        return { success: true };
    } 
    
    if (data.user && !data.session) {
        return { success: true, message: 'Please check your email to confirm your account.' };
    }

    return { success: false, message: 'Unknown error occurred.' };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, currentRoute: { path: '/login' } });
  },

  resetPassword: async (email) => {
    // Explicitly use the dynamic PRODUCTION_URL for password reset redirection
    const redirectUrl = PRODUCTION_URL;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('Reset Password Error:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Password reset instructions sent to your email.' };
  },

  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      console.error('Update Password Error:', error.message);
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Password updated successfully' };
  },

  updateQuickNotes: async (notes) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, quickNotes: notes } });
      const { error } = await supabase
        .from('users')
        .update({ quickNotes: notes })
        .eq('id', user.id);
      if (error) console.error('Failed to save notes:', error.message);
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (user) {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        const { data: updatedUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (updatedUser) {
           set({ user: updatedUser as User });
           return true;
        }
      }
    }
    return false;
  },

  startSession: (topicId) => {
    const questions = [...MOCK_QUESTIONS];
    set({
      sessionQuestions: questions,
      activeQuestion: questions[0],
      currentQuestionIndex: 0,
      isExamMode: true
    });
  },

  submitAnswer: (answer) => {
    const { activeQuestion } = get();
    if (!activeQuestion) return false;
    return answer === activeQuestion.correctOption;
  },

  nextQuestion: () => {
    const { currentQuestionIndex, sessionQuestions } = get();
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < sessionQuestions.length) {
      set({
        currentQuestionIndex: nextIndex,
        activeQuestion: sessionQuestions[nextIndex]
      });
    } else {
      set({ isExamMode: false });
    }
  },

  navigate: (path, state = null) => {
    set({ currentRoute: { path, state } });
  }
}));