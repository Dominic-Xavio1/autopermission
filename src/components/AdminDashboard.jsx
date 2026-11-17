'use client';

import React, { useState, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Calendar,
  FileText,
  ArrowUpDown,
  Printer,
  Inbox,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { updateRequestStatus } from '@/src/actions/permissions.js';

export default function AdminDashboard({
  currentUser,
  requests,
  onRefresh,
  onOpenGatePass,
  onOpenReviewModal,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [actionInProgress, setActionInProgress] = useState(null);

  const pendingRequests = useMemo(() => requests.filter((r) => r.status === 'pending'), [requests]);
  const approvedRequests = useMemo(() => requests.filter((r) => r.status === 'approved'), [requests]);
  const rejectedRequests = useMemo(() => requests.filter((r) => r.status === 'rejected'), [requests]);

  const departmentsList = useMemo(() => {
    const set = new Set(requests.map((r) => r.department));
    return Array.from(set).filter(Boolean);
  }, [requests]);

  const handleQuickApprove = async (request) => {
    setActionInProgress(request.id);
    try {
      await updateRequestStatus(
        request.id,
        'approved',
        currentUser.name,
        currentUser.title,
        'Approved for official duty. Gate clearance authorized.'
      );
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#3ed598', '#10b981', '#f97316'],
      });
      onRefresh();
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredLogs = useMemo(() => {
    return requests
      .filter((item) => {
        if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
        if (selectedDepartment !== 'all' && item.department !== selectedDepartment) return false;
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase().trim();
          const matchTeacher = item.teacherName.toLowerCase().includes(q);
          const matchDept = item.department.toLowerCase().includes(q);
          const matchReason = item.reason.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          if (!matchTeacher && !matchDept && !matchReason && !matchCategory) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = '';
        let valB = '';

        if (sortField === 'requestDate') {
          valA = a.requestDate;
          valB = b.requestDate;
        } else if (sortField === 'teacherName') {
          valA = a.teacherName.toLowerCase();
          valB = b.teacherName.toLowerCase();
        } else {
          valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        }

        return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
      });
  }, [requests, searchQuery, selectedStatus, selectedDepartment, sortField, sortOrder]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Teacher Name', 'Email', 'Department', 'Category', 'Request Date', 'Duration', 'Status', 'Reviewer', 'Reason', 'Created At'];
    const rows = filteredLogs.map((r) => [
      r.id,
      `"${r.teacherName.replace(/"/g, '""')}"`,
      r.teacherEmail,
      `"${r.department}"`,
      `"${r.category}"`,
      r.requestDate,
      `"${r.duration}"`,
      r.status,
      `"${r.reviewerName || ''}"`,
      `"${r.reason.replace(/"/g, '""')}"`,
      r.createdAt ? new Date(r.createdAt).toISOString() : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ASYV_Permission_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white/95 dark:border-white/15 dark:bg-[#0c1411]/90 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs dark:shadow-none">
        <div>
          <p className="text-xs font-medium text-[#ea580c] dark:text-[#3ed598] mb-1">
            Unified Administrative Center · Principal &amp; Operations Desk
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Permission <span className="font-serif italic font-normal">Command Center</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#98a69f] mt-1 max-w-xl">
            Review incoming campus leave requests, authorize gate passes in one click, and audit historical records.
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-white/[0.04] dark:border-white/15 text-xs">
          <span className="text-slate-400 dark:text-[#8a9992] block">Active Approver</span>
          <span className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</span>
          <span className="text-[#ea580c] dark:text-[#3ed598] block text-[11px]">{currentUser.title}</span>
        </div>
      </div>

      {/* 1. TOP ANALYTICS DISPLAY */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-[#0c1411]/90 dark:border-white/15 shadow-xs dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#98a69f]">Total Requests</span>
            <FileText className="w-4 h-4 text-slate-400 dark:text-white/50" />
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums mt-3">{requests.length}</p>
          <p className="text-xs text-slate-400 dark:text-[#8a9992] mt-1">Recorded in PostgreSQL</p>
        </div>

        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-300 dark:bg-amber-400/[0.06] dark:border-amber-400/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-300" />
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums mt-3">{pendingRequests.length}</p>
          <p className="text-xs text-amber-700/80 dark:text-amber-200/75 mt-1">Awaiting decision</p>
        </div>

        <div className="p-6 rounded-2xl bg-orange-50/70 border border-orange-300 dark:bg-[#3ed598]/[0.06] dark:border-[#3ed598]/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#ea580c] dark:text-[#3ed598]">Approved Passes</span>
            <CheckCircle2 className="w-4 h-4 text-[#ea580c] dark:text-[#3ed598]" />
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums mt-3">{approvedRequests.length}</p>
          <p className="text-xs text-slate-600 dark:text-[#98a69f] mt-1">Authorized for campus exit</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 dark:bg-[#0c1411]/90 dark:border-white/15 shadow-xs dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-[#98a69f]">Declined / Archived</span>
            <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <p className="text-3xl font-semibold text-slate-900 dark:text-white tabular-nums mt-3">{rejectedRequests.length}</p>
          <p className="text-xs text-slate-400 dark:text-[#8a9992] mt-1">With administrative feedback</p>
        </div>
      </section>

      {/* 2. ACTIVE INBOX */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 dark:bg-amber-400/15 dark:border-amber-400/30 dark:text-amber-300 flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Active Pending Inbox · <span className="text-[#ea580c] dark:text-amber-300 tabular-nums">{pendingRequests.length} pending</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#98a69f]">
              Immediate decision requests routed in real time from staff
            </p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white border border-slate-200 dark:bg-[#0c1411]/90 dark:border-white/15 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#ea580c] dark:text-[#3ed598] mx-auto mb-2.5" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Inbox Cleared</h3>
            <p className="text-xs text-slate-500 dark:text-[#98a69f] mt-1">
              There are no pending permission requests awaiting review at this moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl p-6 bg-white border-2 border-amber-400/70 dark:bg-[#0c1411]/95 dark:border-amber-400/50 flex flex-col justify-between shadow-xs dark:shadow-none"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-amber-800 dark:bg-amber-400/15 dark:border-amber-400/40 dark:text-amber-300 font-semibold flex items-center justify-center text-sm">
                        {req.teacherName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{req.teacherName}</h4>
                        <p className="text-xs text-slate-500 dark:text-[#98a69f]">{req.department} · {req.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 my-3.5 text-xs text-slate-600 dark:text-[#c5d6ce] tabular-nums">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#3ed598]" />
                      {req.requestDate}
                    </span>
                    <span className="text-slate-300 dark:text-white/25">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#ea580c] dark:text-[#3ed598]" />
                      {req.duration}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-white/[0.04] dark:border-white/10 text-xs text-slate-700 dark:text-white/85 leading-relaxed">
                    &ldquo;{req.reason}&rdquo;
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 dark:text-white/40" suppressHydrationWarning>
                    Requested: {req.createdAt ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenReviewModal(req, 'reject')}
                      disabled={actionInProgress === req.id}
                      className="px-4 py-2 rounded-full text-xs font-medium text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 dark:text-white/80 dark:bg-white/[0.06] dark:hover:bg-rose-500/20 dark:hover:text-rose-200 dark:border-white/15 transition cursor-pointer"
                    >
                      Deny
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickApprove(req)}
                      disabled={actionInProgress === req.id}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#f97316] hover:bg-[#ea580c] text-white dark:text-[#05140d] dark:bg-[#3ed598] dark:hover:bg-[#4ee2a6] transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{actionInProgress === req.id ? 'Approving...' : 'Approve'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. REPORTING & LOGS */}
      <section className="rounded-3xl border border-slate-200 bg-white dark:border-white/15 dark:bg-[#0c1411]/90 overflow-hidden space-y-4 p-6 sm:p-8 shadow-xs dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Permission Logs &amp; Reports
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#98a69f] mt-0.5">
              Comprehensive audit trail of all campus permission history
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] text-xs font-medium transition self-start md:self-auto cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#ea580c] dark:text-[#3ed598]" />
            <span>Export Report (CSV)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#8a9992] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by teacher name, department, reason..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 placeholder:text-slate-400 dark:border-white/15 dark:bg-white/[0.04] dark:focus:border-[#3ed598] dark:text-white dark:placeholder:text-white/30"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-4 py-2.5 rounded-full border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 dark:border-white/15 dark:bg-[#0c1411] dark:focus:border-[#3ed598] dark:text-white"
            >
              <option value="all">All Statuses ({requests.length})</option>
              <option value="pending">Pending ({pendingRequests.length})</option>
              <option value="approved">Approved ({approvedRequests.length})</option>
              <option value="rejected">Declined ({rejectedRequests.length})</option>
            </select>
          </div>

          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full text-xs px-4 py-2.5 rounded-full border border-slate-200 bg-white focus:outline-none focus:border-[#f97316] text-slate-900 dark:border-white/15 dark:bg-[#0c1411] dark:focus:border-[#3ed598] dark:text-white"
            >
              <option value="all">All Departments</option>
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-white/15 rounded-2xl overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 dark:bg-white/[0.04] dark:border-white/10 dark:text-[#98a69f] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Ref</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition"
                  onClick={() => toggleSort('teacherName')}
                >
                  <div className="flex items-center gap-1">
                    <span>Teacher / Staff</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Department</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition"
                  onClick={() => toggleSort('requestDate')}
                >
                  <div className="flex items-center gap-1">
                    <span>Leave Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.07]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-white/40">
                    No matching permission logs found with current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isPending = log.status === 'pending';
                  const isApproved = log.status === 'approved';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition">
                      <td className="py-3.5 px-4 font-mono text-slate-400 dark:text-white/40 tabular-nums">
                        #{log.id.toString().padStart(4, '0')}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{log.teacherName}</div>
                        <div className="text-[11px] text-slate-400 dark:text-[#8a9992]">{log.teacherEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-[#c5d6ce]">{log.department}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white whitespace-nowrap tabular-nums">
                        {log.requestDate}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-[#c5d6ce] whitespace-nowrap">{log.duration}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 dark:text-[#98a69f]" title={log.reason}>
                        {log.reason}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 font-medium capitalize ${
                          isPending
                            ? 'text-amber-600 dark:text-amber-300'
                            : isApproved
                            ? 'text-[#ea580c] dark:text-[#3ed598]'
                            : 'text-rose-600 dark:text-rose-300'
                        }`}>
                          {isPending && <Clock className="w-3 h-3" />}
                          {isApproved && <CheckCircle2 className="w-3 h-3" />}
                          {!isPending && !isApproved && <XCircle className="w-3 h-3" />}
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => onOpenGatePass(log)}
                              title="View Official Gate Pass"
                              className="p-1.5 rounded-lg text-[#ea580c] hover:bg-orange-50 dark:text-[#3ed598] dark:hover:bg-white/[0.08] transition cursor-pointer"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleQuickApprove(log)}
                                className="px-3 py-1 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white dark:bg-[#3ed598] dark:text-[#05140d] font-semibold dark:hover:bg-[#4ee2a6] transition cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => onOpenReviewModal(log, 'reject')}
                                className="px-2.5 py-1 rounded-full text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/15 transition font-medium cursor-pointer"
                              >
                                Deny
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-[#8a9992] pt-2 tabular-nums">
          <span>Showing {filteredLogs.length} of {requests.length} records</span>
          <span>Sorted by: {sortField} ({sortOrder.toUpperCase()})</span>
        </div>
      </section>
    </div>
  );
}
