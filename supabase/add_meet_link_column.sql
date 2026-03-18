-- Migration: add meet_link column to meetings table
-- Run this in Supabase → SQL Editor if the meetings table already exists

ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS meet_link TEXT;
