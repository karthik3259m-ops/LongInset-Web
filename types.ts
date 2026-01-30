export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard'
}

export enum QuestionType {
  Conceptual = 'conceptual',
  Direct = 'direct',
  Numerical = 'numerical',
  Reasoning = 'reasoning'
}

export enum MasteryLevel {
  NotStarted = 'not_started',
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
  Mastered = 'mastered'
}

export enum PriorityLabel {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

export interface Topic {
  id: string;
  name: string;
  subject: string;
  totalQuestions: number;
}

export interface Question {
  id: string;
  topicId: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: Difficulty;
  type: QuestionType;
  yearAsked: number[];
  weightageScore: number;
}

export interface TopicMastery {
  topicId: string;
  topicName: string;
  accuracy: number;
  priorityScore: number;
  priorityLabel: PriorityLabel;
  questionsAttempted: number;
  masteryLevel: MasteryLevel;
  isWeakSpot: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  examTarget: string;
  streak: number;
  points: number;
  quickNotes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// New Types for Past Papers
export interface PastPaper {
  id: string;
  year: number;
  exam: string;
  shift: string;
  date: string;
  time: string;
  downloadUrl: string;
}

// New Types for Governance
export interface GovernanceLevel {
  level: string;
  description: string;
  hindiName?: string;
  politicalHead?: string;
  adminHead?: string;
  count?: string; // e.g. "28 States"
}

export interface ExamDetail {
  name: string;
  fullName: string;
  roles: string;
  tentativeDate: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface CareerGroup {
  id: string;
  name: string;
  fullForm: string;
  goal: string;
  positions: string;
  authorityLevel: string;
  description: string;
  examsList: ExamDetail[];
  postingLevel: string;
}