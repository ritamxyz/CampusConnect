import React, { useState } from 'react';
import { X, Clock, Send, PenLine } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser, posts, profileRequests, requestProfileUpdate } = useApp();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [section, setSection] = useState('');
  const [group, setGroup] = useState('');
  const [remark, setRemark] = useState('');

  if (!isOpen || currentUser?.role !== 'student') return null;

  const student = currentUser.data;
  const myPosts = posts.filter((p) => p.authorIdentifier === student.dscCode);
  const pendingReqs = profileRequests.filter(
    (r) => r.studentCode === student.dscCode && r.status === 'pending'
  );

  const startEdit = () => {
    setPhone(student.phone || '');
    setStudentEmail(student.studentEmail || '');
    setSection(student.section || '');
    setGroup(student.group || '');
    setRemark(student.remark || '');
    setEditing(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    requestProfileUpdate(student.id, {
      phone: phone.trim(),
      studentEmail: studentEmail.trim(),
      section: section.trim(),
      group: group.trim(),
      remark: remark.trim()
    });
    setEditing(false);
    alert('Your profile update request has been submitted to the Admin / Moderator for approval!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-extrabold">
              {student.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg leading-tight">{student.name}</h3>
                {currentUser.isModerator && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase">
                    Moderator
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-200">
                {student.stream || student.dept} • {student.year}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {pendingReqs.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Profile Update Pending Approval</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                  You requested changes on {pendingReqs[0].submittedAt}. They will appear as soon as an Admin or Moderator verifies them.
                </p>
              </div>
            </div>
          )}

          {editing ? (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Request Profile Changes
                </h4>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-xs font-semibold text-slate-500 hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Mobile
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Group
                  </label>
                  <input
                    type="text"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Reason / Additional Remarks
                </label>
                <textarea
                  rows={2}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="e.g. Corrected contact number or batch shift..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit to Admin for Approval
              </button>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Institutional Profile Records
                </h4>
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                >
                  <PenLine className="w-3.5 h-3.5" /> Request Update
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Class Roll</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {student.roll}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Student Code</span>
                  <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 text-xs">
                    {student.dscCode}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Department</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {student.stream || student.dept}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Section</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {student.section || '—'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Group</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {student.group || '—'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Mobile (Key)</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                    {student.phone}
                  </span>
                </div>
              </div>

              {student.studentEmail && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-1">
                  Email: <strong className="text-slate-800 dark:text-slate-200">{student.studentEmail}</strong>
                </p>
              )}
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Faculty Mentor
            </h4>
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-sm text-indigo-950 dark:text-white">
                  {student.mentorName || 'Assigned Faculty'}
                </p>
                <p className="text-indigo-700 dark:text-indigo-400 mt-0.5">{student.mentorEmail}</p>
                {student.mentorPhone && (
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Phone: {student.mentorPhone}
                  </p>
                )}
              </div>
              {student.mentorEmail && (
                <a
                  href={`mailto:${student.mentorEmail}`}
                  className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-indigo-200 dark:border-slate-600 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl shadow-sm hover:bg-indigo-50"
                >
                  Email Mentor
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              My Submissions ({myPosts.length})
            </h4>
            {myPosts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notes or community posts submitted yet.</p>
            ) : (
              <div className="space-y-2">
                {myPosts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{p.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {p.category} • {p.date}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'approved'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {p.status === 'approved' ? 'Approved' : 'Pending Review'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
