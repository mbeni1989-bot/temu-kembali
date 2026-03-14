-- Add passwordHash column to users table for email/password authentication
ALTER TABLE users ADD COLUMN passwordHash TEXT;
