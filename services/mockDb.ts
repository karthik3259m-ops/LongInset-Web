import { User } from '../types';
import { MOCK_USER } from './mockData';

const DB_KEY = 'examgps_users_db';
const SESSION_KEY = 'examgps_session';

/**
 * DATABASE SCHEMA
 * 
 * Table: Users
 * -----------------------------------------------------------------
 * | Column      | Type    | Constraints                           |
 * |-------------|---------|---------------------------------------|
 * | id          | string  | Primary Key                           |
 * | email       | string  | Unique, Not Null                      |
 * | password    | string  | Not Null (Stored in plaintext for UI) |
 * | name        | string  | Not Null                              |
 * | examTarget  | string  | Default: "General"                    |
 * | streak      | number  | Default: 0                            |
 * | points      | number  | Default: 0                            |
 * | quickNotes  | string  | Default: ""                           |
 * -----------------------------------------------------------------
 */

interface DBUser extends User {
  password: string; // Internal field for authentication
}

// Initial seed data
const SEED_DATA: DBUser[] = [
  {
    ...MOCK_USER,
    password: 'password123'
  }
];

export const mockDb = {
  // Initialize DB if empty
  init: () => {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify(SEED_DATA));
    }
  },

  // READ: Get all users
  getUsers: (): DBUser[] => {
    mockDb.init();
    const users = localStorage.getItem(DB_KEY);
    return users ? JSON.parse(users) : [];
  },

  // CREATE: Add new user
  createUser: (userData: Omit<DBUser, 'id' | 'streak' | 'points' | 'quickNotes'>): User => {
    const users = mockDb.getUsers();
    
    if (users.some(u => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: DBUser = {
      id: Math.random().toString(36).substr(2, 9),
      streak: 0,
      points: 0,
      quickNotes: '',
      ...userData
    };

    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    
    // Return sanitized user object (without password)
    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  // UPDATE: Update user notes
  updateUserNotes: (userId: string, notes: string) => {
    const users = mockDb.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].quickNotes = notes;
      localStorage.setItem(DB_KEY, JSON.stringify(users));
      
      // Update session if it matches the current user
      const session = mockDb.getSession();
      if (session && session.id === userId) {
        session.quickNotes = notes;
        mockDb.createSession(session);
      }
    }
  },

  // UPDATE: Update user profile
  updateUser: (userId: string, updates: Partial<User>): User | null => {
    const users = mockDb.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      localStorage.setItem(DB_KEY, JSON.stringify(users));
      
      // Update session if it matches the current user
      const session = mockDb.getSession();
      if (session && session.id === userId) {
        const { password, ...safeUser } = updatedUser;
        mockDb.createSession(safeUser);
      }
      
      const { password, ...safeResult } = updatedUser;
      return safeResult;
    }
    return null;
  },

  // READ: Find user by email and password
  authenticate: (email: string, passwordAttempt: string): User | null => {
    const users = mockDb.getUsers();
    const user = users.find(u => u.email === email && u.password === passwordAttempt);
    
    if (!user) return null;
    
    const { password, ...safeUser } = user;
    return safeUser;
  },

  // SESSION: Create session
  createSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  // SESSION: Get current session
  getSession: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  // SESSION: Destroy session
  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};