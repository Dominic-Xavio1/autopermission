-- ============================================================================
-- ASYV PassFlow - School Permission Management System
-- PostgreSQL Database Schema Definition
-- Agahozo-Shalom Youth Village (ASYV)
-- ============================================================================

-- Drop existing tables if re-initializing
-- DROP TABLE IF EXISTS permission_requests;
-- DROP TABLE IF EXISTS users;

-- 1. Users and Roles Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('teacher', 'admin', 'principal')),
  department VARCHAR(100) NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on users for lookup by email and role
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Permission Requests Table
CREATE TABLE IF NOT EXISTS permission_requests (
  id SERIAL PRIMARY KEY,
  teacher_name VARCHAR(255) NOT NULL,
  teacher_email VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  request_date VARCHAR(50) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Official Duty',
  reason TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_name VARCHAR(255),
  reviewer_role VARCHAR(50),
  reviewer_note TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on permission_requests for fast query filtering & sorting
CREATE INDEX IF NOT EXISTS idx_requests_status ON permission_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_teacher_email ON permission_requests(teacher_email);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON permission_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_department ON permission_requests(department);
