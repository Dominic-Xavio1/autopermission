'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Database, Code, Table, ShieldCheck } from 'lucide-react';

export default function SchemaViewerModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('sql');

  const sqlSchema = `-- ============================================================================
-- ASYV PassFlow - School Permission Management System
-- PostgreSQL Database Schema Definition
-- Agahozo-Shalom Youth Village (ASYV)
-- ============================================================================

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
  status VARCHAR(50) NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_name VARCHAR(255),
  reviewer_role VARCHAR(50),
  reviewer_note TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_requests_status ON permission_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_teacher_email ON permission_requests(teacher_email);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON permission_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_department ON permission_requests(department);`;

  const drizzleSchema = `import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(), // 'teacher', 'admin', 'principal'
  department: text('department').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const permissionRequests = pgTable('permission_requests', {
  id: serial('id').primaryKey(),
  teacherName: text('teacher_name').notNull(),
  teacherEmail: text('teacher_email').notNull(),
  department: text('department').notNull(),
  requestDate: text('request_date').notNull(),
  duration: text('duration').notNull(),
  category: text('category').notNull().default('Official Duty'),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('pending'),
  reviewerName: text('reviewer_name'),
  reviewerRole: text('reviewer_role'),
  reviewerNote: text('reviewer_note'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});`;

  const handleCopy = () => {
    const textToCopy = activeTab === 'sql' ? sqlSchema : drizzleSchema;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c1411] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-[#ea580c] dark:bg-[#3ed598]/15 dark:border-[#3ed598]/30 dark:text-[#3ed598] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                PostgreSQL Database Schema &amp; Architecture
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#98a69f]">
                Cloud SQL PostgreSQL instance with Next.js Server Actions (JavaScript)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#080e0b]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeTab === 'sql'
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-[#b5c2bc] dark:hover:bg-white/[0.06]'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>SQL DDL Script</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('drizzle')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeTab === 'drizzle'
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-[#b5c2bc] dark:hover:bg-white/[0.06]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Drizzle ORM Schema</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-[#b5c2bc] dark:hover:bg-white/[0.06]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Architecture</span>
            </button>
          </div>

          {activeTab !== 'architecture' && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/[0.06] transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#3ed598]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Definition'}</span>
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 dark:bg-[#060908] text-white/90">
          {activeTab === 'sql' && (
            <pre className="whitespace-pre-wrap leading-relaxed text-orange-300 dark:text-[#3ed598]">
              {sqlSchema}
            </pre>
          )}

          {activeTab === 'drizzle' && (
            <pre className="whitespace-pre-wrap leading-relaxed text-amber-200 dark:text-emerald-200">
              {drizzleSchema}
            </pre>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 font-sans text-slate-300 dark:text-[#c5d6ce] text-xs">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <h4 className="font-semibold text-white text-sm mb-1">PostgreSQL Database Layer</h4>
                <p>
                  Provisioned via Google Cloud SQL in region <code>europe-west2</code> using pooled client connections via <code>pg.Pool</code>.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <h4 className="font-semibold text-white text-sm mb-1">Next.js Server Actions (CRUD)</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>getPermissionRequests()</code>: Filters by status, department, and search terms.</li>
                  <li><code>createPermissionRequest()</code>: Inserts a new request and emits real-time event.</li>
                  <li><code>updateRequestStatus()</code>: Updates approval/denial state with reviewer notes.</li>
                  <li><code>deletePermissionRequest()</code>: Removes a pending record.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.02] flex items-center justify-between text-xs text-slate-500 dark:text-[#8a9992]">
          <span>PostgreSQL 15+ (Cloud SQL)</span>
          <span>Tables: users, permission_requests</span>
        </div>
      </div>
    </div>
  );
}
