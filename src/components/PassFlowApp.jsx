'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Header, { SAMPLE_USERS } from '@/src/components/Header.jsx';
import LandingHero from '@/src/components/LandingHero.jsx';
import TeacherDashboard from '@/src/components/TeacherDashboard.jsx';
import AdminDashboard from '@/src/components/AdminDashboard.jsx';
import GatePassModal from '@/src/components/GatePassModal.jsx';
import ReviewModal from '@/src/components/ReviewModal.jsx';
import SchemaViewerModal from '@/src/components/SchemaViewerModal.jsx';
import { useRealtimePermissions } from '@/src/hooks/useRealtimePermissions.js';
import { getPermissionRequests, updateRequestStatus } from '@/src/actions/permissions.js';
import { Bell, CheckCircle, X } from 'lucide-react';

export default function PassFlowApp({
  initialRequests,
  defaultRequestDate,
  initialError = null,
}) {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState(SAMPLE_USERS[0]);
  const [requests, setRequests] = useState(initialRequests);
  const [fetchError, setFetchError] = useState(initialError);

  const [gatePassRequest, setGatePassRequest] = useState(null);
  const [reviewRequest, setReviewRequest] = useState(null);
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);

  // Sync HTML .dark class with theme state
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loadRequests = useCallback(async () => {
    try {
      const res = await getPermissionRequests();
      if (res.success && res.data) {
        setRequests(res.data);
        setFetchError(null);
      } else if (res.error) {
        setFetchError(res.error);
      }
    } catch (err) {
      console.error('Error fetching permission requests:', err);
      setFetchError('Unable to refresh permission requests.');
    }
  }, []);

  const { isConnected, latestToast, clearToast } = useRealtimePermissions({
    activeRole: activePage === 'admin' ? 'admin' : 'teacher',
    userEmail: currentUser.email,
    onNewRequest: (newReq) => {
      setRequests((prev) => {
        if (prev.some((r) => r.id === newReq.id)) return prev;
        return [newReq, ...prev];
      });
    },
    onStatusChanged: (updatedReq) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
      );
    },
    onRequestDeleted: ({ id }) => {
      setRequests((prev) => prev.filter((r) => r.id !== id));
    },
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const handleReviewConfirm = async (id, status, note) => {
    await updateRequestStatus(
      id,
      status,
      currentUser.name,
      currentUser.title,
      note
    );
    await loadRequests();
  };

  const handleGetStarted = () => {
    const teacher = SAMPLE_USERS.find((u) => u.role === 'teacher') || SAMPLE_USERS[0];
    setCurrentUser(teacher);
    setActivePage('teacher');
  };

  const handleOpenAdmin = () => {
    const admin = SAMPLE_USERS.find((u) => u.role === 'principal' || u.role === 'admin') || SAMPLE_USERS[3];
    setCurrentUser(admin);
    setActivePage('admin');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#060908] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200">
      {latestToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-[#0c1411] rounded-2xl p-4 shadow-2xl border border-[#f97316] dark:border-[#3ed598]/60">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl ${
              latestToast.type === 'success'
                ? 'bg-orange-50 text-[#ea580c] dark:bg-[#3ed598]/15 dark:text-[#3ed598]'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300'
            }`}>
              {latestToast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-white text-xs">{latestToast.title}</h4>
              <p className="text-xs text-slate-600 dark:text-[#98a69f] mt-0.5 leading-snug">{latestToast.message}</p>
            </div>
            <button
              type="button"
              onClick={clearToast}
              className="text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        isConnected={isConnected}
        onOpenSchema={() => setIsSchemaOpen(true)}
        pendingCount={pendingCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {activePage === 'home' ? (
        <main className="flex-1">
          <LandingHero
            requests={requests}
            onGetStarted={handleGetStarted}
            onOpenAdmin={handleOpenAdmin}
          />
        </main>
      ) : (
        <main className="flex-1 hero-backdrop transition-colors duration-200">
          <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 pt-8">
            {fetchError && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-400/10 dark:border-amber-400/30 dark:text-amber-200 text-xs flex items-center justify-between">
                <span>{fetchError}</span>
                <button
                  type="button"
                  onClick={loadRequests}
                  className="px-3 py-1 rounded-full bg-[#f97316] text-white dark:bg-amber-400 dark:text-[#120d02] font-semibold transition cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {activePage === 'teacher' ? (
              <TeacherDashboard
                key={currentUser.email}
                currentUser={currentUser}
                requests={requests.filter(
                  (r) => r.teacherEmail === currentUser.email || r.teacherName === currentUser.name
                )}
                defaultDate={defaultRequestDate}
                onRefresh={loadRequests}
                onOpenGatePass={(req) => setGatePassRequest(req)}
              />
            ) : (
              <AdminDashboard
                currentUser={currentUser}
                requests={requests}
                onRefresh={loadRequests}
                onOpenGatePass={(req) => setGatePassRequest(req)}
                onOpenReviewModal={(req, actionType) =>
                  setReviewRequest({ request: req, actionType })
                }
              />
            )}
          </div>
        </main>
      )}

      {activePage !== 'home' && (
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#050706] py-6 transition-colors">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#8a9992]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white">ASYV PassFlow</span>
              <span>·</span>
              <span>Agahozo-Shalom Youth Village Permission System</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsSchemaOpen(true)}
                className="text-[#ea580c] dark:text-[#3ed598] hover:underline font-medium cursor-pointer"
              >
                PostgreSQL Schema
              </button>
            </div>
          </div>
        </footer>
      )}

      {gatePassRequest && (
        <GatePassModal
          request={gatePassRequest}
          onClose={() => setGatePassRequest(null)}
        />
      )}

      {reviewRequest && (
        <ReviewModal
          request={reviewRequest.request}
          actionType={reviewRequest.actionType}
          currentUser={currentUser}
          onClose={() => setReviewRequest(null)}
          onConfirm={handleReviewConfirm}
        />
      )}

      {isSchemaOpen && (
        <SchemaViewerModal onClose={() => setIsSchemaOpen(false)} />
      )}
    </div>
  );
}
