/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------

// Use environment variables for sensitive data
// In Vite, use import.meta.env.VITE_...
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or Anon Key is missing. Check your environment variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------------------------------------------------------
// REQUIRED DATABASE SCHEMA (Run this in Supabase SQL Editor)
// ---------------------------------------------------------
/*
  -- 1. Table for public user profiles
  create table public.users (
    id uuid references auth.users not null primary key,
    email text,
    name text,
    "examTarget" text,
    streak int default 0,
    points int default 0,
    "quickNotes" text default ''
  );

  alter table public.users enable row level security;

  create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

  create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

  create policy "Users can insert their own profile" on public.users
  for insert with check (auth.uid() = id);

  -- 2. Table for Exam Details (Career Governance)
  create table public.exam_details (
    id uuid default gen_random_uuid() primary key,
    exam_name text unique not null,
    description text,
    syllabus_highlights text[], -- Array of strings
    prep_tips text[],          -- Array of strings
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  alter table public.exam_details enable row level security;
  
  -- Allow everyone to read exam details
  create policy "Public read access" on public.exam_details for select using (true);

  -- 3. Table for Past Papers
  create table public.past_papers (
    id uuid default gen_random_uuid() primary key,
    year int,
    exam text,
    shift text,
    date text,
    time text,
    download_url text
  );

  alter table public.past_papers enable row level security;
  create policy "Public read past_papers" on public.past_papers for select using (true);
  create policy "Public insert past_papers" on public.past_papers for insert with check (true);

  -- 4. SEED DATA FOR EXAMS (Run this once to populate)
  insert into public.exam_details (exam_name, description, syllabus_highlights, prep_tips)
  values 
  ('CSE', 'The Civil Services Examination (CSE) is a nationwide competitive examination in India conducted by the Union Public Service Commission (UPSC).', ARRAY['General Studies (History, Geography, Polity)', 'CSAT (Reasoning, Math)', 'Essay & Optional Subject'], ARRAY['Read The Hindu newspaper daily', 'Focus on Answer Writing for Mains', 'Start with NCERTs for foundation']),
  ('NDA', 'The National Defence Academy (NDA) exam is conducted by UPSC for admission to the Army, Navy and Air Force wings of the NDA.', ARRAY['Mathematics (Algebra, Matrices, Trig)', 'General Ability Test (English, GK)'], ARRAY['Work on physical fitness simultaneously', 'Improve English communication skills', 'Focus on Math speed and accuracy']),
  ('CGL', 'SSC CGL (Combined Graduate Level) is for recruitment to Group B and C posts in various ministries and departments of the Government of India.', ARRAY['Quantitative Aptitude (Arithmetic, Advanced)', 'General Intelligence & Reasoning', 'English Comprehension', 'General Awareness'], ARRAY['Master short-tricks for Math', 'Practice mock tests for speed', 'Current affairs of last 6 months']),
  ('IBPS PO', 'The Institute of Banking Personnel Selection Probationary Officer exam is for recruitment of POs in public sector banks.', ARRAY['Reasoning Ability (Puzzles, Seating)', 'Quantitative Aptitude (Data Interpretation)', 'English Language'], ARRAY['Practice high-level puzzles daily', 'Focus on Data Interpretation sets', 'Read editorials for English']),
  ('UGC-NET', 'University Grants Commission National Eligibility Test is to determine eligibility for Assistant Professor and/or Junior Research Fellowship.', ARRAY['Paper 1: Teaching & Research Aptitude', 'Paper 2: Subject Specific'], ARRAY['Solve previous 10 years papers', 'Focus on Research Methodology', 'Time management between Paper 1 and 2']);
*/