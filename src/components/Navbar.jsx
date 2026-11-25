import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  User,
  CheckCircle2,
  Menu,
  X,
  Home,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar({ activePage, setActivePage, openLoginModal, openProfileModal }) {
  const { currentUser, logout, theme, toggleTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isPrivileged =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'moderator' ||
    currentUser?.isModerator;

  const navigateTo = (page, sectionId) => {
    setActivePage(page);
    setMobileOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleProfileClick = () => {
    if (currentUser?.role === 'student') {
      openProfileModal();
    } else {
      setActivePage('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('landing')}
              className="flex items-center gap-2.5 font-bold text-xl text-slate-900 dark:text-white group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="tracking-tight">
                Campus<span className="text-indigo-600 dark:text-indigo-400">Connect</span>
              </span>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => navigateTo('landing', 'hero-section')}
              className={`px-3 py-2 rounded-lg transition hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 ${
                activePage === 'landing' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigateTo('feed')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 ${
                activePage === 'feed'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 font-bold'
                  : ''
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-500" /> Materials & Posts
            </button>

            <button
              onClick={() => navigateTo('students')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 ${
                activePage === 'students'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 font-bold'
                  : ''
              }`}
            >
              <Users className="w-4 h-4 text-indigo-500" /> Connect Students
            </button>

            <button
              onClick={() => navigateTo('landing', 'reach-admin-section')}
              className="px-3 py-2 rounded-lg transition hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Reach Admin
            </button>

            {isPrivileged && (
              <button
                onClick={() => navigateTo('admin')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition ${
                  activePage === 'admin' ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{currentUser?.role === 'admin' ? 'Admin Console' : 'Moderator Tools'}</span>
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleProfileClick}
                  title={
                    currentUser.role === 'student'
                      ? 'View My Student Profile'
                      : 'Open Administrative Console'
                  }
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition text-left cursor-pointer border border-transparent hover:border-indigo-200 dark:hover:border-slate-600"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {currentUser.role === 'student' ? (
                      currentUser.data?.name?.charAt(0) || 'S'
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold leading-tight dark:text-white">
                      {currentUser.role === 'student'
                        ? currentUser.data?.name
                        : currentUser.role === 'admin'
                        ? 'Chief Admin'
                        : 'Moderator'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {currentUser.role === 'student'
                        ? currentUser.isModerator
                          ? 'Student Mod • Tap Profile'
                          : currentUser.data?.dscCode || 'Tap Profile'
                        : 'Tap for Console'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition"
                >
                  <span>Portal Login</span>
                  <ChevronDown className="w-4 h-4 opacity-80" />
                </button>

                {dropdownOpen && (
                  <div
                    onClick={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-fade-in"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Select Access Level
                    </div>

                    <button
                      onClick={() => openLoginModal('student')}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="leading-tight">Student / Regular</p>
                        <p className="text-[10px] text-slate-400 font-normal">Via Mobile or DSC Code</p>
                      </div>
                    </button>

                    <button
                      onClick={() => openLoginModal('moderator')}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="leading-tight">Faculty Moderator</p>
                        <p className="text-[10px] text-slate-400 font-normal">Review queue & posts</p>
                      </div>
                    </button>

                    <button
                      onClick={() => openLoginModal('admin')}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-2.5 font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="leading-tight">Admin Console</p>
                        <p className="text-[10px] text-slate-400 font-normal">Roster, Settings, Security</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 animate-fade-in shadow-xl">
          {currentUser && (
            <div className="p-3 mb-2 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.role === 'student'
                    ? currentUser.data?.name
                    : currentUser.role === 'admin'
                    ? 'Chief Administrator'
                    : 'Faculty Moderator'}
                </p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-mono">
                  {currentUser.role === 'student'
                    ? currentUser.data?.dscCode
                    : currentUser.data?.email}
                </p>
              </div>
              {currentUser.role === 'student' ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openProfileModal();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
                >
                  My Profile
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('admin')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
                >
                  Admin Console
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => navigateTo('landing', 'hero-section')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Home className="w-4 h-4 text-indigo-500" /> Home Overview
          </button>

          <button
            onClick={() => navigateTo('feed')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" /> Materials & Feed
          </button>

          <button
            onClick={() => navigateTo('students')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Users className="w-4 h-4 text-indigo-500" /> Connect Students
          </button>

          <button
            onClick={() => navigateTo('landing', 'reach-admin-section')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Mail className="w-4 h-4 text-indigo-500" /> Reach Admin Desk
          </button>

          {isPrivileged && (
            <button
              onClick={() => navigateTo('admin')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{currentUser?.role === 'admin' ? 'Open Admin Console' : 'Open Moderator Tools'}</span>
            </button>
          )}

          {currentUser?.role === 'student' && (
            <button
              onClick={() => {
                setMobileOpen(false);
                openProfileModal();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span>View & Edit My Profile</span>
            </button>
          )}

          {currentUser && (
            <button
              onClick={() => {
                setMobileOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
