import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Smartphone, Mail, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginModal({ isOpen, onClose, initialRole = 'student' }) {
  const { loginStudent, loginModerator, loginAdmin } = useApp();
  const [role, setRole] = useState(initialRole);
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRole(initialRole);
      setError('');
      setStudentIdentifier('');
      setEmail('');
      setPassword('');
    }
  }, [isOpen, initialRole]);

  if (!isOpen) return null;

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginStudent(studentIdentifier);
    if (res.success) {
      setStudentIdentifier('');
      onClose();
    } else {
      setError(res.message);
    }
  };

  const handleModeratorSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginModerator(email, password);
    if (res.success) {
      setEmail('');
      setPassword('');
      onClose();
    } else {
      setError(res.message);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginAdmin(email, password);
    if (res.success) {
      setEmail('');
      setPassword('');
      onClose();
    } else {
      setError(res.message);
    }
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => switchRole('student')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                role === 'student'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => switchRole('moderator')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                role === 'moderator'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Moderator
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                role === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {role === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Student Sign In</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your registered mobile number or DSC code as recorded in the official roster.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile Number or DSC Code
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter phone or DSC code"
                    value={studentIdentifier}
                    onChange={(e) => setStudentIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition"
              >
                Sign In as Student
              </button>
            </form>
          )}

          {role === 'moderator' && (
            <form onSubmit={handleModeratorSubmit} className="space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Faculty Moderator Portal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Access requires verified moderator credentials.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Moderator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@campusconnect.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition shadow-md"
              >
                Sign In as Moderator
              </button>
            </form>
          )}

          {role === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Administrator Console
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Master administrative privileges for student rosters, approvals, and portal settings.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="admin@campusconnect.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-emerald-600/20"
              >
                Sign In as Administrator
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
