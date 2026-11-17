'use client';

import React, { useState } from 'react';
import {
  Send,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Clock3,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Printer,
  Trash2,
  AlertCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createPermissionRequest, deletePermissionRequest } from '@/src/actions/permissions.js';

const DEPARTMENTS = [
  'STEM & Sciences',
  'Humanities & Languages',
  'Creative Arts & Music',
  'Vocational & IT',
  'Physical Education & Sports',
  'Student Life & Counseling',
];

const DURATIONS = [
  { id: '2 Hours (Campus exit)', label: '2 Hours', desc: 'Short campus pass (errand or district hospital)' },
  { id: 'Half Day (Morning)', label: 'Half Day (AM)', desc: '8:00 AM – 1:00 PM' },
  { id: 'Half Day (Afternoon)', label: 'Half Day (PM)', desc: '1:00 PM – 6:00 PM' },
  { id: 'Full Day (1 Day)', label: 'Full Day', desc: 'Single day absence (clear class coverage)' },
  { id: '2 Days', label: '2 Days', desc: 'Multi-day official assignment or training' },
  { id: '3 Days or more', label: '3+ Days', desc: 'Extended leave or external delegation' },
];

const CATEGORIES = [
  'Academic Field Trip',
  'Official Duty',
  'Professional Development',
  'Medical & Health',
  'Personal / Family Leave',
];

export default function TeacherDashboard({
  currentUser,
  requests,
  defaultDate,
  onRefresh,
  onOpenGatePass,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const [fullName, setFullName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [requestDate, setRequestDate] = useState(defaultDate);
  const [duration, setDuration] = useState(DURATIONS[0].id);
  const [reason, setReason] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const validateStep = (step) => {
    setFormError(null);
    if (step === 1) {
      if (!fullName.trim() || !department) {
        setFormError('Please ensure your full name and department are specified.');
        return false;
      }
    } else if (step === 2) {
      if (!requestDate) {
        setFormError('Please select the date for which permission is requested.');
        return false;
      }
      if (!duration) {
        setFormError('Please select a duration for the permission.');
        return false;
      }
    } else if (step === 3) {
      if (!reason.trim() || reason.trim().length < 10) {
        setFormError('Please provide a descriptive reason (at least 10 characters) explaining the request.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setFormError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await createPermissionRequest({
        teacherName: fullName,
        teacherEmail: email,
        department,
        requestDate,
        duration,
        category,
        reason,
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to submit request');
        setIsSubmitting(false);
        return;
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3ed598', '#10b981', '#f97316', '#fb923c'],
      });

      setShowSuccessBanner(true);
      setCurrentStep(1);
      setReason('');
      onRefresh();

      setTimeout(() => setShowSuccessBanner(false), 5000);
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to withdraw and delete this permission request?')) {
      await deletePermissionRequest(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Welcome Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white/95 dark:border-white/15 dark:bg-[#0c1411]/90 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs dark:shadow-none">
        <div>
          <p className="text-xs font-medium text-[#ea580c] dark:text-[#3ed598] mb-1">
            Teacher Workspace · {currentUser.department}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Muraho, <span className="font-serif italic font-normal">{currentUser.name.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#98a69f] mt-1 max-w-xl">
            Submit campus leave or official duty permissions. Requests route directly to the Principal and Administration in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-400/10 dark:border-amber-400/30 text-center">
            <p className="text-[11px] font-medium text-amber-700 dark:text-amber-300">Pending</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">{pendingCount}</p>
          </div>
          <div className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-orange-50 border border-orange-200 dark:bg-[#3ed598]/10 dark:border-[#3ed598]/30 text-center">
            <p className="text-[11px] font-medium text-[#ea580c] dark:text-[#3ed598]">Approved</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">{approvedCount}</p>
          </div>
        </div>
      </div>

      {showSuccessBanner && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-slate-900 dark:bg-[#3ed598]/15 dark:border-[#3ed598]/40 dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#ea580c] dark:text-[#3ed598] shrink-0" />
            <div>
              <p className="font-semibold text-sm">Permission Request Submitted</p>
              <p className="text-xs text-slate-600 dark:text-[#b5c2bc]">Administration has been notified in real time. Track approval progress below.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessBanner(false)}
            className="text-xs font-semibold text-[#ea580c] dark:text-[#3ed598] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. MULTI-STEP SLIDING REQUEST FORM */}
      <section className="rounded-3xl border border-slate-200 bg-white/95 dark:border-white/15 dark:bg-[#0c1411]/90 backdrop-blur-md overflow-hidden shadow-xs dark:shadow-none">
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Request Campus Leave Permission</h2>
              <p className="text-xs text-slate-500 dark:text-[#98a69f]">
                Step {currentStep} of 4 · {
                  currentStep === 1 ? 'Teacher Profile & Category' :
                  currentStep === 2 ? 'Date & Duration Selection' :
                  currentStep === 3 ? 'Purpose & Justification' :
                  'Review & Instant Dispatch'
                }
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all tabular-nums ${
                      currentStep === step
                        ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d]'
                        : currentStep > step
                        ? 'bg-orange-100 text-[#ea580c] border border-orange-300 dark:bg-[#3ed598]/20 dark:text-[#3ed598] dark:border-[#3ed598]/40'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-white/[0.06] dark:text-white/40 dark:border-white/10'
                    }`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-6 h-0.5 mx-1 transition ${currentStep > step ? 'bg-[#f97316] dark:bg-[#3ed598]' : 'bg-slate-200 dark:bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {formError && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-500/15 dark:border-rose-400/30 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 dark:text-[#8a9992] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Jean-Paul Mugabo"
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 placeholder:text-slate-400 dark:border-white/15 dark:bg-white/[0.04] dark:focus:border-[#3ed598] dark:text-white dark:placeholder:text-white/30 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc] mb-2">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@asyv.ac.rw"
                    className="w-full text-sm px-4 py-2.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 placeholder:text-slate-400 dark:border-white/15 dark:bg-white/[0.04] dark:focus:border-[#3ed598] dark:text-white dark:placeholder:text-white/30 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc] mb-2">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 dark:border-white/15 dark:bg-[#0c1411] dark:focus:border-[#3ed598] dark:text-white font-medium"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-white text-slate-900 dark:bg-[#0c1411] dark:text-white">{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc] mb-2">
                    Leave Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 dark:border-white/15 dark:bg-[#0c1411] dark:focus:border-[#3ed598] dark:text-white font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-white text-slate-900 dark:bg-[#0c1411] dark:text-white">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc] mb-2">
                  Requested Date of Leave / Exit
                </label>
                <div className="relative max-w-sm">
                  <Calendar className="w-4 h-4 text-[#ea580c] dark:text-[#3ed598] absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 dark:border-white/15 dark:bg-white/[0.04] dark:focus:border-[#3ed598] dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc] mb-2">
                  Select Duration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DURATIONS.map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setDuration(dur.id)}
                      className={`text-left p-4 rounded-2xl border transition cursor-pointer ${
                        duration === dur.id
                          ? 'border-[#f97316] bg-orange-50/70 dark:border-[#3ed598] dark:bg-[#3ed598]/10'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 dark:border-white/15 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{dur.label}</span>
                        {duration === dur.id && <CheckCircle2 className="w-4 h-4 text-[#ea580c] dark:text-[#3ed598]" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#98a69f] mt-1">{dur.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc]">
                    Detailed Reason &amp; Justification
                  </label>
                  <span className={`text-xs font-medium tabular-nums ${
                    reason.length >= 10 ? 'text-[#ea580c] dark:text-[#3ed598]' : 'text-slate-400 dark:text-[#8a9992]'
                  }`}>
                    {reason.length} characters (min 10)
                  </span>
                </div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  required
                  placeholder="Detail the specific reason for this permission request, official destination if leaving ASYV campus, and arrangements made for ongoing student classes..."
                  className="w-full text-sm p-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 placeholder:text-slate-400 dark:border-white/15 dark:bg-white/[0.04] dark:focus:border-[#3ed598] dark:text-white dark:placeholder:text-white/30"
                />
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 dark:bg-white/[0.04] dark:border-white/10 flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-[#ea580c] dark:text-[#3ed598] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-[#b5c2bc] leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">ASYV Gate Security Protocol:</strong> For overnight leaves or trips involving student delegations, verify transport requisition with the ASYV logistics coordinator prior to departure.
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Review Request Summary</h3>
                <p className="text-xs text-slate-500 dark:text-[#98a69f] mt-0.5">
                  Preview how your request will appear in the administrative inbox.
                </p>
              </div>

              <div className="max-w-lg mx-auto p-6 rounded-2xl border border-amber-300 bg-amber-50/40 dark:border-amber-400/50 dark:bg-amber-400/[0.05]">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                  <div>
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Pending Review</span>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm mt-1">{fullName}</h4>
                    <p className="text-xs text-slate-500 dark:text-[#98a69f]">{department} · {category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 my-4 text-xs">
                  <div className="bg-white border border-slate-200 dark:bg-white/[0.04] p-3 rounded-xl dark:border-white/10">
                    <span className="text-[11px] text-slate-500 dark:text-[#8a9992]">Leave Date</span>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5 tabular-nums">{requestDate}</p>
                  </div>
                  <div className="bg-white border border-slate-200 dark:bg-white/[0.04] p-3 rounded-xl dark:border-white/10">
                    <span className="text-[11px] text-slate-500 dark:text-[#8a9992]">Duration</span>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{duration}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 dark:bg-white/[0.04] p-3.5 rounded-xl dark:border-white/10 text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-[#8a9992]">Reason</span>
                  <p className="text-slate-700 dark:text-white/90 mt-1 italic">&ldquo;{reason}&rdquo;</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/[0.06] text-xs font-medium transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white dark:bg-[#3ed598] dark:hover:bg-[#4ee2a6] dark:text-[#05140d] text-xs font-semibold transition cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white dark:bg-[#3ed598] dark:hover:bg-[#4ee2a6] dark:text-[#05140d] text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Permission Request'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. MY PERMISSION REQUESTS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              My Permission Requests
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#98a69f] mt-0.5">
              Live status tracker for {currentUser.name}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full border border-slate-200 bg-slate-100/80 dark:border-white/15 dark:bg-black/40">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#b5c2bc] dark:hover:text-white'
              }`}
            >
              All ({requests.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-400 text-[#120d02] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#b5c2bc] dark:hover:text-white'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('approved')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                statusFilter === 'approved'
                  ? 'bg-[#f97316] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#b5c2bc] dark:hover:text-white'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('rejected')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                statusFilter === 'rejected'
                  ? 'bg-rose-500 text-white dark:bg-rose-400 dark:text-[#1b050a] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#b5c2bc] dark:hover:text-white'
              }`}
            >
              Declined ({rejectedCount})
            </button>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0c1411]/80 p-8">
            <Clock3 className="w-10 h-10 text-slate-300 dark:text-white/25 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">No requests in this view</h3>
            <p className="text-xs text-slate-500 dark:text-[#98a69f] mt-1 max-w-sm mx-auto">
              {statusFilter === 'all'
                ? "You haven't submitted any permission requests yet. Use the form above to submit your first request."
                : `No ${statusFilter} permission requests found for this account.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';

              return (
                <div
                  key={req.id}
                  className={`rounded-2xl p-6 transition-all flex flex-col justify-between bg-white dark:bg-[#0c1411]/95 ${
                    isPending
                      ? 'border-2 border-amber-400/70 shadow-[0_4px_24px_rgba(251,191,36,0.12)]'
                      : isApproved
                      ? 'border-2 border-[#f97316]/70 dark:border-[#3ed598]/60 shadow-[0_4px_24px_rgba(249,115,22,0.1)] dark:shadow-[0_0_24px_rgba(62,213,152,0.08)]'
                      : 'border-2 border-rose-300 dark:border-rose-400/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        isPending
                          ? 'text-amber-700 dark:text-amber-300'
                          : isApproved
                          ? 'text-[#ea580c] dark:text-[#3ed598]'
                          : 'text-rose-600 dark:text-rose-300'
                      }`}>
                        {isPending && <Clock3 className="w-3.5 h-3.5" />}
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {!isPending && !isApproved && <XCircle className="w-3.5 h-3.5" />}
                        <span>{isPending ? 'Pending Approval' : isApproved ? 'Approved' : 'Declined'}</span>
                      </span>

                      <span className="text-xs font-mono text-slate-400 dark:text-white/40 tabular-nums">
                        #{req.id.toString().padStart(4, '0')}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug">
                      {req.category}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#98a69f] mt-0.5">{req.department}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-[#c5d6ce] my-4 tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#3ed598]" />
                        {req.requestDate}
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-white/25">·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#3ed598]" />
                        {req.duration}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-white/[0.04] dark:border-white/10 text-xs text-slate-700 dark:text-white/85 leading-relaxed">
                      &ldquo;{req.reason}&rdquo;
                    </div>

                    {!isPending && req.reviewerNote && (
                      <div className={`mt-3 p-3 rounded-xl text-xs border ${
                        isApproved
                          ? 'bg-orange-50/70 border-orange-200 text-orange-950 dark:bg-[#3ed598]/10 dark:border-[#3ed598]/25 dark:text-[#d7f5e8]'
                          : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-500/10 dark:border-rose-400/25 dark:text-rose-200'
                      }`}>
                        <p className="font-semibold text-[11px] mb-0.5 text-slate-600 dark:text-white/70">
                          {req.reviewerName || 'Administration'} ({req.reviewerRole || 'Reviewer'}):
                        </p>
                        <p className="italic">&ldquo;{req.reviewerNote}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-white/40" suppressHydrationWarning>
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                    </span>

                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <button
                          type="button"
                          onClick={() => onOpenGatePass(req)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white dark:bg-[#3ed598] dark:hover:bg-[#4ee2a6] dark:text-[#05140d] text-xs font-semibold transition cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Official Pass</span>
                        </button>
                      )}

                      {isPending && (
                        <button
                          type="button"
                          onClick={() => handleDelete(req.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/15 text-xs font-medium transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Withdraw</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
