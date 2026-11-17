'use client';

import React from 'react';
import { X, Printer, CheckCircle2, QrCode, Shield, Calendar, Clock, User, Building, FileText } from 'lucide-react';

export default function GatePassModal({ request, onClose }) {
  if (!request) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(request.requestDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const passCode = `ASYV-PASS-${request.id.toString().padStart(5, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <span className="text-xs font-semibold text-slate-700">Official Campus Gate Pass</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white dark:bg-[#047857] dark:hover:bg-[#065f46] text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div id="printable-gate-pass" className="p-8 bg-white text-slate-900">
          <div className="flex items-start justify-between border-b-2 border-emerald-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl">
                ASYV
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Agahozo-Shalom Youth Village
                </h2>
                <p className="text-xs font-semibold text-emerald-800">
                  Campus Security &amp; Gate Clearance Authorization
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                AUTHORIZED
              </span>
              <p className="text-[11px] font-mono text-slate-500 mt-1 font-semibold">{passCode}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400">Authorized Staff</span>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-emerald-700" />
                <span className="text-sm font-bold text-slate-900">{request.teacherName}</span>
              </div>
              <p className="text-xs text-slate-500 pl-6">{request.teacherEmail}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400">Department</span>
              <div className="flex items-center gap-2 mt-1">
                <Building className="w-4 h-4 text-emerald-700" />
                <span className="text-sm font-bold text-slate-900">{request.department}</span>
              </div>
              <p className="text-xs text-orange-700 font-semibold pl-6">{request.category}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Valid Date</span>
                </div>
                <p className="mt-1 text-sm font-bold text-slate-900">{request.requestDate}</p>
                <p className="text-[11px] text-slate-500">{formattedDate}</p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Duration Granted</span>
                </div>
                <p className="mt-1 text-sm font-bold text-slate-900">{request.duration}</p>
                <p className="text-[11px] text-slate-500">Must sign log upon campus return</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Authorized Purpose / Destination</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                {request.reason}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Approved by {request.reviewerName || 'ASYV Principal'}</span>
                  <span className="text-[11px] font-semibold text-emerald-600">({request.reviewerRole || 'Principal'})</span>
                </div>
                {request.reviewerNote && (
                  <p className="text-xs text-emerald-900 mt-1 italic font-medium">
                    &ldquo;{request.reviewerNote}&rdquo;
                  </p>
                )}
                <p className="text-[10px] text-slate-500 mt-1" suppressHydrationWarning>
                  Validated on: {request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : 'Official Record'}
                </p>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center text-center p-1 text-emerald-700">
                <Shield className="w-5 h-5 text-emerald-700" />
                <span className="text-[8px] font-black uppercase leading-tight">ASYV PASS VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-slate-500 text-xs">
            <div className="flex items-center gap-2">
              <QrCode className="w-10 h-10 text-slate-700" />
              <div>
                <p className="text-[11px] font-mono font-bold text-slate-800">{passCode}</p>
                <p className="text-[10px] text-slate-400">Scan at Main Gate Security Booth</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400 font-medium">
              <p>Rwamagana District, Eastern Province</p>
              <p>Rwanda · ASYV Operations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
