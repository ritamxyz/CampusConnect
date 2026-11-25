import React from 'react';
import {
  Users,
  BookOpen,
  ArrowRight,
  FileCheck2,
  ShieldCheck,
  MessageSquare,
  CalendarDays,
  Sparkles
} from 'lucide-react';

export default function LandingPage({ setActivePage, openLoginModal }) {
  return (
    <div className="space-y-24 py-8">
      <section
        id="hero-section"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-950 text-white p-8 sm:p-16 shadow-2xl border border-indigo-800/40"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Campus Connect Academic Portal 2026–2027
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Connect with Classmates. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-indigo-300">
              Access Verified Materials.
            </span>
          </h1>

          <p className="text-indigo-100 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
            A controlled digital environment for students and faculty. Access peer notes, check exam timelines, and connect on WhatsApp with classmates verified directly by the college administration.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActivePage('students')}
              className="px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm shadow-xl hover:bg-indigo-50 transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-indigo-600" /> Connect with Students
            </button>

            <button
              onClick={() => setActivePage('feed')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-extrabold text-sm transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Study Materials Feed <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section id="about-section" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            About Our Portal
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
            Eliminating Spam and Unverified Noise from Campus Networks
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Campus Connect was built to solve a major problem: random social media groups filled with spam, outdated syllabus guides, and unverified contacts.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            By verifying student identities through official admission rosters (using Mobile Numbers and DSC Codes) and enforcing strict admin & moderator approval on all shared notes and image posts, your academic experience remains authentic and productive.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Roster-Verified Enlistment
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Only students uploaded via the official college spreadsheet can access student contact cards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Curated Moderation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Every study material, question bank link, or image post must receive admin approval before appearing on the campus feed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Direct WhatsApp Redirects
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Connect directly with classmates for study circles with pre-filled respectful greeting messages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features-section" className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            Key Highlights
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Engineered for Academic Success
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Everything students and faculty need in one unified, protected interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              25 Student Discovery
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Instantly see 25 classmates or search by Roll Number, Name, or DSC Code. One-click WhatsApp triggers.
            </p>
            <button
              onClick={() => setActivePage('students')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Explore Directory <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Verified Study Materials
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Previous year question papers (PYQs), lecture slides, and syllabus modules organized and verified by department.
            </p>
            <button
              onClick={() => setActivePage('feed')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Browse Materials <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
              Notice Board & Posters
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Stay ahead of exam schedules, holidays, campus hackathons, or event flyers shared by student clubs.
            </p>
            <button
              onClick={() => setActivePage('feed')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              Check Feed <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 dark:bg-slate-900/90 border border-slate-800 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
        <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to Connect with Your Classmates?
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Sign in using your college registered Mobile Number or DSC Code to open the complete directory and view your student mentor information.
        </p>
        <button
          onClick={() => openLoginModal('student')}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition"
        >
          Sign In to Student Portal
        </button>
      </section>
    </div>
  );
}
