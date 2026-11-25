import React, { useState, useMemo } from 'react';
import { Lock, Search, MessageCircle, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StudentDirectory({ openLoginModal }) {
  const { currentUser, students } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return students.filter((s) => {
      const matchesText =
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.dscCode && s.dscCode.toLowerCase().includes(q)) ||
        (s.roll && String(s.roll).toLowerCase().includes(q)) ||
        (s.stream && s.stream.toLowerCase().includes(q)) ||
        (s.dept && s.dept.toLowerCase().includes(q));

      const streamVal = (s.stream || s.dept || '').toUpperCase();
      const matchesDept = selectedDept === 'All' || streamVal === selectedDept.toUpperCase();

      return matchesText && matchesDept;
    });
  }, [students, searchQuery, selectedDept]);

  const visibleStudents = useMemo(() => {
    return searchQuery.trim() !== '' || showAll ? filteredStudents : filteredStudents.slice(0, 25);
  }, [filteredStudents, searchQuery, showAll]);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Student Directory is Locked
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
          The student contact directory is restricted to verified students and faculty.
        </p>
        <button
          onClick={() => openLoginModal('student')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition"
        >
          Sign In with Registered Mobile or DSC Code
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Enlisted Students Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search by <strong className="text-slate-700 dark:text-slate-200">Name, DSC Code, or Roll Number</strong>. Connect on WhatsApp.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold self-start sm:self-center">
          {filteredStudents.length} Students Listed
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, DSC code (e.g. DSC-102), or Roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none shadow-sm"
        >
          <option value="All">All Departments / Streams</option>
          <option value="CSE">Computer Science & Engg (CSE)</option>
          <option value="AIML">AI & Machine Learning (AIML)</option>
          <option value="ECE">Electronics & Comm (ECE)</option>
          <option value="CS">Computer Science (CS)</option>
          <option value="EE">Electrical Engg (EE)</option>
          <option value="ME">Mechanical Engg (ME)</option>
          <option value="CE">Civil Engg (CE)</option>
          <option value="DS">Data Science (DS)</option>
          <option value="AUE">Automobile Engg (AUE)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleStudents.map((student) => {
          const waUrl = `https://wa.me/91${
            student.phone ? student.phone.replace(/[^0-9]/g, '') : ''
          }?text=${encodeURIComponent(
            `Hi ${student.name}, I am your college classmate reaching out from Campus Connect!`
          )}`;

          return (
            <div
              key={student.id}
              className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-slate-700 border border-indigo-100 dark:border-slate-600 text-indigo-700 dark:text-indigo-300 font-extrabold flex items-center justify-center text-lg">
                    {student.name?.charAt(0) || 'S'}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {student.isModerator && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                        Mod
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold">
                      {student.dscCode}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug">
                    {student.name}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {student.stream || student.dept} {student.section ? `• ${student.section}` : ''}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span>Class Roll:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {student.roll}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Group:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {student.group || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faculty Mentor:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate ml-2">
                      {student.mentorName || 'Assigned Mentor'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" /> Connect on WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {!showAll && searchQuery.trim() === '' && filteredStudents.length > 25 && (
        <div className="text-center pt-6">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm transition"
          >
            <span>View More ({filteredStudents.length - 25} Remaining Students)</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
