'use client';

import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';

export default function ReviewModal({
  request,
  actionType,
  currentUser,
  onClose,
  onConfirm,
}) {
  const isApprove = actionType === 'approve';
  const defaultPresets = isApprove
    ? [
        'Approved. All duties cleared with department.',
        'Approved. Transport log coordinated with ASYV fleet.',
        'Approved. Please ensure class coverage is assigned.',
      ]
    : [
        'Regrettably declined due to examination schedule coverage.',
        'Declined. Essential campus departmental presence required on this date.',
        'Please reschedule for an alternative date next week.',
      ];

  const [note, setNote] = useState(defaultPresets[0]);
  const [submitting, setSubmitting] = useState(false);

  if (!request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onConfirm(request.id, actionType === 'approve' ? 'approved' : 'rejected', note);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1411] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/15 overflow-hidden">
        <div className={`px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/10 ${
          isApprove ? 'bg-orange-50 dark:bg-[#3ed598]/10' : 'bg-rose-50 dark:bg-rose-500/10'
        }`}>
          <div className="flex items-center gap-2.5">
            {isApprove ? (
              <CheckCircle className="w-5 h-5 text-[#ea580c] dark:text-[#3ed598]" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            )}
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              {isApprove ? 'Approve Permission Request' : 'Deny Permission Request'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.04] dark:border-white/10 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white text-sm">{request.teacherName}</span>
              <span className="text-slate-500 dark:text-[#98a69f] text-[11px]">{request.department}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-600 dark:text-[#c5d6ce] tabular-nums">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#3ed598]" />
                {request.requestDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#3ed598]" />
                {request.duration}
              </span>
            </div>
            <p className="text-slate-700 dark:text-white/80 italic border-t border-slate-200 dark:border-white/10 pt-2">
              &ldquo;{request.reason}&rdquo;
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc] mb-2">
              Quick Decision Note Presets
            </label>
            <div className="flex flex-col gap-1.5">
              {defaultPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNote(preset)}
                  className={`text-left text-xs p-2.5 rounded-xl border transition cursor-pointer ${
                    note === preset
                      ? isApprove
                        ? 'border-[#f97316] bg-orange-50 text-slate-900 dark:border-[#3ed598] dark:bg-[#3ed598]/15 dark:text-white font-medium'
                        : 'border-rose-400 bg-rose-50 text-rose-950 dark:bg-rose-500/15 dark:text-white font-medium'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:text-[#98a69f]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-[#b5c2bc] mb-1.5">
              Custom Reviewer Comments (Visible to Teacher)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              required
              placeholder="Enter feedback or administrative notes for this decision..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 placeholder:text-slate-400 dark:border-white/15 dark:bg-white/[0.04] dark:focus:border-[#3ed598] dark:text-white dark:placeholder:text-white/30"
            />
            <p className="text-[11px] text-slate-400 dark:text-[#8a9992] mt-1">
              Reviewing as: <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> ({currentUser.title})
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#b5c2bc] dark:hover:text-white dark:hover:bg-white/10 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                isApprove
                  ? 'bg-[#f97316] hover:bg-[#ea580c] text-white dark:bg-[#3ed598] dark:hover:bg-[#4ee2a6] dark:text-[#05140d]'
                  : 'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-400'
              } disabled:opacity-50`}
            >
              {isApprove ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{submitting ? 'Updating...' : isApprove ? 'Confirm Approval' : 'Confirm Denial'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
