'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  Wifi,
  BatteryFull,
  Signal,
  ShieldCheck,
  Clock,
  Activity,
  SlidersHorizontal,
  PenLine,
  BarChart2,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

export default function LandingHero({
  requests,
  onGetStarted,
  onOpenAdmin,
}) {
  const [selectedMetricView, setSelectedMetricView] = useState('weekly');

  const totalCount = requests.length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvalRate = totalCount > 0 ? Math.round((approvedCount / totalCount) * 1000) / 10 : 94.2;

  const recentRequests = requests.slice(0, 3);

  return (
    <div className="hero-backdrop min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-x-hidden transition-colors duration-200">
      {/* Main Split Hero Section */}
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 pt-10 pb-16 lg:pt-16 lg:pb-20 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">

          {/* LEFT COLUMN: Editorial Headline & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50/80 text-[#c2410c] dark:border-white/15 dark:bg-white/[0.04] dark:text-[#c5d6ce] px-4 py-1.5 text-xs font-medium tracking-wide">
              Easy Campus Leave · Made Smarter
            </div>

            {/* Hero Headline matching reference layout */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-medium tracking-[-0.03em] leading-[1.08] text-slate-900 dark:text-white text-balance">
              Manage your
              <br />
              permissions easily and
              <br />
              with{' '}
              <span className="font-serif italic font-normal text-[#ea580c] dark:text-white">
                confidence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#98a69f] leading-relaxed max-w-md font-normal">
              ASYV PassFlow empowers teachers and administrators to securely submit, smartly track, and instantly approve campus leave passes.
            </p>

            {/* Primary & Secondary Action Pills */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white shadow-[0_8px_24px_rgba(249,115,22,0.28)] dark:bg-[#3ed598] dark:hover:bg-[#4ee2a6] dark:text-[#05140d] dark:shadow-[0_0_24px_rgba(62,213,152,0.25)] font-semibold text-sm px-6 py-3 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
              </button>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 dark:border-white/20 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-white font-medium text-sm px-6 py-3 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Smartphone Mockup + Overlapping Floating Chart Card */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[410px] pb-6 sm:pb-0">

              {/* Smartphone Frame */}
              <div className="w-full rounded-t-[2.4rem] rounded-b-[1.5rem] sm:rounded-b-none border border-slate-200 bg-gradient-to-b from-white via-slate-50/90 to-slate-100/70 shadow-[0_24px_70px_rgba(15,23,42,0.12)] dark:border-white/15 dark:from-[#0e1a15]/95 dark:via-[#09100d]/95 dark:to-[#060908] dark:shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-5 pb-10 relative overflow-hidden">
                {/* Subtle top glow inside phone */}
                <div className="pointer-events-none absolute -top-12 right-8 w-44 h-44 rounded-full bg-orange-400/15 dark:bg-[#1a6849]/25 blur-3xl" />

                {/* Phone Status Bar */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-white/85 px-1 pb-5">
                  <span className="tabular-nums">9:41</span>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-white/80">
                    <Signal className="w-3.5 h-3.5" />
                    <Wifi className="w-3.5 h-3.5" />
                    <BatteryFull className="w-4 h-4" />
                  </div>
                </div>

                {/* Phone Inner Greeting */}
                <div className="px-1">
                  <p className="text-xl font-medium text-slate-900 dark:text-white tracking-tight mb-4">
                    Welcome
                  </p>

                  {/* Two Stat Boxes inside phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-gradient-to-b dark:from-white/[0.09] dark:to-white/[0.02] p-3.5 shadow-2xs dark:shadow-none">
                      <p className="text-[11px] text-slate-500 dark:text-[#98a69f] font-medium mb-1">
                        Approved
                      </p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white tabular-nums tracking-tight">
                        {approvedCount} Passes
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white dark:border-white/15 dark:bg-gradient-to-b dark:from-white/[0.09] dark:to-white/[0.02] p-3.5 shadow-2xs dark:shadow-none">
                      <p className="text-[11px] text-slate-500 dark:text-[#98a69f] font-medium mb-1">
                        Pending
                      </p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white tabular-nums tracking-tight">
                        {pendingCount} Active
                      </p>
                    </div>
                  </div>

                  {/* More Section */}
                  <div className="flex items-center justify-between mt-5 mb-2.5">
                    <span className="text-[11px] font-medium text-slate-400 dark:text-white/40">
                      Recent Activity
                    </span>
                    <button
                      type="button"
                      onClick={onOpenAdmin}
                      className="text-[11px] font-medium text-slate-600 hover:text-[#ea580c] dark:text-white/75 dark:hover:text-[#3ed598] transition-colors cursor-pointer"
                    >
                      More
                    </button>
                  </div>

                  {/* Department Preview Cards */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03] p-3">
                      <p className="text-[11px] font-medium text-slate-700 dark:text-white/80 truncate">
                        STEM / Physics
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">
                        {requests.filter((r) => r.department.includes('STEM')).length} Logs
                      </p>
                      <p className="text-[10px] text-[#ea580c] dark:text-[#3ed598] mt-0.5">+100% Tracked</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03] p-3">
                      <p className="text-[11px] font-medium text-slate-700 dark:text-white/80 truncate">
                        Humanities
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">
                        {requests.filter((r) => r.department.includes('Humanities')).length} Logs
                      </p>
                      <p className="text-[10px] text-[#ea580c] dark:text-[#3ed598] mt-0.5">+Live Sync</p>
                    </div>
                  </div>

                  {/* Lower subtle request row */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 space-y-2.5 opacity-75 dark:opacity-60">
                    {recentRequests.slice(0, 2).map((req) => (
                      <div key={req.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#f97316] dark:text-[#3ed598] shrink-0" />
                          <span className="text-slate-700 dark:text-white/80 truncate">{req.teacherName}</span>
                        </div>
                        <span className="text-slate-500 dark:text-white/60 tabular-nums shrink-0">{req.requestDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Analytics Chart Card */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-left-16 sm:bottom-5 w-full sm:w-[305px] rounded-2xl border border-slate-200 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.14)] dark:border-white/15 dark:bg-[#0b1310]/95 dark:shadow-[0_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-xl p-4 z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xl font-semibold text-slate-900 dark:text-white tabular-nums tracking-tight">
                      {totalCount} Requests
                    </p>
                    <p className="text-[11px] font-medium text-[#ea580c] dark:text-[#3ed598] mt-0.5 tabular-nums">
                      +{approvalRate}% Clearance Rate
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    title="Open Admin Command Center"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-white/15 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-white/80 flex items-center justify-center transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>

                {/* Theme-adaptive SVG Line Chart (Orange in Light Mode, Mint-Emerald in Dark Mode) */}
                <div className="relative h-32 w-full">
                  <svg viewBox="0 0 260 110" className="w-full h-full overflow-visible">
                    {[20, 40, 60, 80].map((y) => (
                      <line
                        key={y}
                        x1="24"
                        y1={y}
                        x2="252"
                        y2={y}
                        className="stroke-slate-200 dark:stroke-white/[0.07]"
                        strokeWidth="1"
                      />
                    ))}
                    {[55, 100, 145, 190, 235].map((x) => (
                      <line
                        key={x}
                        x1={x}
                        y1="10"
                        x2={x}
                        y2="90"
                        className="stroke-slate-100 dark:stroke-white/[0.05]"
                        strokeWidth="1"
                      />
                    ))}

                    <text x="0" y="23" className="fill-slate-400 dark:fill-white/35" fontSize="8">100%</text>
                    <text x="4" y="43" className="fill-slate-400 dark:fill-white/35" fontSize="8">75%</text>
                    <text x="4" y="63" className="fill-slate-400 dark:fill-white/35" fontSize="8">50%</text>
                    <text x="4" y="83" className="fill-slate-400 dark:fill-white/35" fontSize="8">25%</text>

                    <line
                      x1="245"
                      y1="26"
                      x2="245"
                      y2="90"
                      className="stroke-orange-400/50 dark:stroke-[#3ed598]/35"
                      strokeWidth="1"
                    />

                    <path
                      d={
                        selectedMetricView === 'weekly'
                          ? 'M 26 70 C 48 54, 62 56, 78 68 C 94 80, 110 24, 132 28 C 154 32, 162 66, 178 52 C 192 40, 198 78, 212 56 C 224 38, 232 76, 245 26'
                          : 'M 26 62 C 48 74, 66 42, 86 48 C 106 54, 118 28, 138 36 C 158 44, 172 60, 192 40 C 210 24, 226 50, 245 22'
                      }
                      fill="none"
                      className="stroke-[#f97316] dark:stroke-[#3ed598]"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    <circle
                      cx="245"
                      cy={selectedMetricView === 'weekly' ? '26' : '22'}
                      r="7"
                      className="fill-[#f97316]/25 dark:fill-[#3ed598]/22"
                    />
                    <circle
                      cx="245"
                      cy={selectedMetricView === 'weekly' ? '26' : '22'}
                      r="3.5"
                      className="fill-[#f97316] dark:fill-[#3ed598]"
                    />

                    <text x="42" y="103" className="fill-slate-400 dark:fill-white/35" fontSize="8">08:00</text>
                    <text x="88" y="103" className="fill-slate-400 dark:fill-white/35" fontSize="8">10:00</text>
                    <text x="134" y="103" className="fill-slate-400 dark:fill-white/35" fontSize="8">12:00</text>
                    <text x="180" y="103" className="fill-slate-400 dark:fill-white/35" fontSize="8">14:00</text>
                    <text x="226" y="103" className="fill-slate-400 dark:fill-white/35" fontSize="8">16:00</text>
                  </svg>
                </div>

                {/* Bottom Chart Toolbar Icons */}
                <div className="mt-2 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-around text-slate-400 dark:text-white/45">
                  <button
                    type="button"
                    onClick={() => setSelectedMetricView('weekly')}
                    title="Weekly Overview"
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      selectedMetricView === 'weekly'
                        ? 'text-[#ea580c] bg-orange-50 dark:text-[#3ed598] dark:bg-white/[0.06]'
                        : 'hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMetricView('daily')}
                    title="Daily Activity Trend"
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      selectedMetricView === 'daily'
                        ? 'text-[#ea580c] bg-orange-50 dark:text-[#3ed598] dark:bg-white/[0.06]'
                        : 'hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onGetStarted}
                    title="New Permission Request"
                    className="p-1.5 rounded-lg hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    title="Department Breakdown"
                    className="p-1.5 rounded-lg hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    title="Expand Command Center"
                    className="p-1.5 rounded-lg hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    title="Full View"
                    className="p-1.5 rounded-lg hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Trust Band */}
      <div className="border-t border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-[#050706] py-7 transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-[#98a69f]">
            Trusted across ASYV campus departments
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs font-medium text-slate-400 dark:text-white/35 tracking-wide">
            <span>STEM &amp; Sciences</span>
            <span>Humanities &amp; Languages</span>
            <span>Vocational &amp; IT</span>
            <span>Student Life &amp; Counseling</span>
            <span>Principal&apos;s Office</span>
          </div>
        </div>
      </div>
    </div>
  );
}
