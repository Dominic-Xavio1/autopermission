'use client';

import React from 'react';
import { Sparkles, ChevronDown, UserCheck, Database, Sun, Moon } from 'lucide-react';

export const SAMPLE_USERS = [
  {
    name: 'Jean-Paul Mugabo',
    email: 'jp.mugabo@asyv.ac.rw',
    role: 'teacher',
    department: 'STEM & Sciences',
    title: 'Senior Physics & Robotics Teacher',
  },
  {
    name: 'Chantal Uwase',
    email: 'c.uwase@asyv.ac.rw',
    role: 'teacher',
    department: 'Humanities & Languages',
    title: 'Literature & History Educator',
  },
  {
    name: 'Eric Habimana',
    email: 'e.habimana@asyv.ac.rw',
    role: 'teacher',
    department: 'Vocational & IT',
    title: 'ICT & Applied Engineering Instructor',
  },
  {
    name: 'Innocent Nkurunziza',
    email: 'i.nkurunziza@asyv.ac.rw',
    role: 'principal',
    department: 'School Administration',
    title: 'High School Principal',
  },
  {
    name: 'Alice Mukamana',
    email: 'a.mukamana@asyv.ac.rw',
    role: 'admin',
    department: 'Student Life & Operations',
    title: 'Operations & Staff Administrator',
  },
];

export default function Header({
  activePage,
  onNavigate,
  currentUser,
  onUserChange,
  onOpenSchema,
  pendingCount,
  theme,
  onToggleTheme,
}) {
  const teachers = SAMPLE_USERS.filter((u) => u.role === 'teacher');
  const admins = SAMPLE_USERS.filter((u) => u.role === 'admin' || u.role === 'principal');

  const handleNavClick = (page) => {
    onNavigate(page);
    if (page === 'teacher' && currentUser.role !== 'teacher') {
      onUserChange(teachers[0]);
    } else if (page === 'admin' && currentUser.role === 'teacher') {
      onUserChange(admins[0]);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#060908]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.06] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-6 h-20">

          {/* Zone 1: Brand Mark + Wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 text-[#ea580c] dark:bg-[#3ed598]/15 dark:border-[#3ed598]/30 dark:text-[#3ed598] flex items-center justify-center transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white text-lg tracking-tight">
              ASYV PassFlow
            </span>
          </button>

          {/* Zone 2: Center Capsule Pill Nav */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100/80 dark:border-white/15 dark:bg-black/50 p-1">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'home'
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#b5c2bc] dark:hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('teacher')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'teacher'
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#b5c2bc] dark:hover:text-white'
              }`}
            >
              Teacher View
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
                activePage === 'admin'
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#b5c2bc] dark:hover:text-white'
              }`}
            >
              <span>Admin Desk</span>
              {pendingCount > 0 && (
                <span className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full ${
                  activePage === 'admin'
                    ? 'bg-white/20 text-white dark:bg-[#05140d]/15 dark:text-[#05140d]'
                    : 'bg-orange-100 text-[#ea580c] dark:bg-white/10 dark:text-[#3ed598]'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSchema}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-[#b5c2bc] dark:hover:text-white transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              Database
            </button>
          </nav>

          {/* Zone 3: Right Actions (Theme Toggle + Account + Primary CTA) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Light / Dark Mode Switch */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to White Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? 'Switch to White Mode (Orange)' : 'Switch to Dark Mode (Emerald)'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200/70 dark:border-white/15 dark:bg-white/[0.06] dark:text-[#d1ddd7] dark:hover:bg-white/[0.12] text-xs font-medium transition cursor-pointer whitespace-nowrap"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden lg:inline">White Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span className="hidden lg:inline">Dark Mode</span>
                </>
              )}
            </button>

            {/* Persona Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-[#d1ddd7] dark:hover:text-white transition cursor-pointer whitespace-nowrap"
              >
                <span className="hidden sm:inline truncate max-w-[135px]">
                  {currentUser.name}
                </span>
                <span className="sm:hidden">Account</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#8a9992]" />
              </button>

              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0b1310] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/15 py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
                <div className="px-3.5 py-2 text-[11px] font-semibold text-slate-500 dark:text-[#8a9992] border-b border-slate-100 dark:border-white/10">
                  Switch Active Persona
                </div>

                <div className="py-1">
                  <div className="px-3.5 py-1 text-[10px] font-semibold text-[#ea580c] dark:text-[#3ed598]">
                    Administrators &amp; Principals
                  </div>
                  {admins.map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => {
                        onUserChange(u);
                        onNavigate('admin');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.06] transition cursor-pointer ${
                        currentUser.email === u.email
                          ? 'bg-orange-50/70 text-slate-900 dark:bg-white/[0.08] dark:text-white font-semibold'
                          : 'text-slate-600 dark:text-[#b5c2bc]'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-[#8a9992]">{u.title}</p>
                      </div>
                      {currentUser.email === u.email && (
                        <UserCheck className="w-4 h-4 text-[#ea580c] dark:text-[#3ed598]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="py-1 border-t border-slate-100 dark:border-white/10">
                  <div className="px-3.5 py-1 text-[10px] font-semibold text-[#ea580c] dark:text-[#3ed598]">
                    Teachers &amp; Instructors
                  </div>
                  {teachers.map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => {
                        onUserChange(u);
                        onNavigate('teacher');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.06] transition cursor-pointer ${
                        currentUser.email === u.email
                          ? 'bg-orange-50/70 text-slate-900 dark:bg-white/[0.08] dark:text-white font-semibold'
                          : 'text-slate-600 dark:text-[#b5c2bc]'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-[#8a9992]">{u.department}</p>
                      </div>
                      {currentUser.email === u.email && (
                        <UserCheck className="w-4 h-4 text-[#ea580c] dark:text-[#3ed598]" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-white/10 px-2">
                  <button
                    type="button"
                    onClick={onOpenSchema}
                    className="w-full text-left px-2 py-2 text-xs text-slate-600 hover:text-slate-900 dark:text-[#98a69f] dark:hover:text-white flex items-center gap-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.05] cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#3ed598]" />
                    <span>Inspect PostgreSQL Schema</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Primary CTA Pill Button (Orange in White Mode, Mint-Emerald in Dark Mode) */}
            <button
              type="button"
              onClick={() => handleNavClick(activePage === 'teacher' ? 'admin' : 'teacher')}
              className="rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white dark:bg-[#3ed598] dark:hover:bg-[#4ee2a6] dark:text-[#05140d] font-semibold text-xs sm:text-sm px-5 py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {activePage === 'teacher' ? 'Admin Desk' : 'Request Pass'}
            </button>
          </div>
        </div>

        {/* Mobile Compact Nav Row */}
        <div className="flex md:hidden items-center justify-center gap-1 pb-3 overflow-x-auto">
          {['home', 'teacher', 'admin'].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handleNavClick(page)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                activePage === page
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 bg-slate-100 border border-slate-200 dark:text-[#b5c2bc] dark:bg-white/[0.04] dark:border-white/10'
              }`}
            >
              {page === 'home' ? 'Home' : page === 'teacher' ? 'Teacher View' : `Admin Desk (${pendingCount})`}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
