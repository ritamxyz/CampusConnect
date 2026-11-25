import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  AlertTriangle,
  ShieldCheck,
  Clock,
  Eye,
  ExternalLink,
  Check,
  Trash2,
  Search,
  Info,
  FileSpreadsheet,
  Upload,
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminConsole() {
  const {
    currentUser,
    students,
    posts,
    profileRequests,
    adminProfile,
    adminAuth,
    approvePost,
    deletePost,
    approveProfileUpdate,
    rejectProfileUpdate,
    toggleStudentModerator,
    addStudent,
    importStudentsBatch,
    deleteStudents,
    updateAdminProfileData,
    updateAdminCredentials
  } = useApp();

  const [activeTab, setActiveTab] = useState('approvals');
  const [feedSubTab, setFeedSubTab] = useState('pending');
  const fileInputRef = useRef(null);

  const [rosterSearch, setRosterSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [pasteText, setPasteText] = useState('');


  const [singleForm, setSingleForm] = useState({
    roll: '',
    studentCode: '',
    name: '',
    stream: 'CSE',
    section: 'Sec A',
    group: 'Grp A',
    phone: '',
    studentEmail: '',
    mentorName: '',
    mentorPhone: '',
    mentorEmail: '',
    hodName: '',
    hodPhone: '',
    hodEmail: '',
    remark: ''
  });


  const [profName, setProfName] = useState(adminProfile?.name || '');
  const [profEmail, setProfEmail] = useState(adminProfile?.email || '');
  const [profPhone, setProfPhone] = useState(adminProfile?.phone || '');
  const [profOffice, setProfOffice] = useState(adminProfile?.office || '');

  const [secEmail, setSecEmail] = useState(adminAuth?.email || '');
  const [secPassword, setSecPassword] = useState(adminAuth?.password || '');

  useEffect(() => {
    if (adminProfile) {
      setProfName(adminProfile.name || '');
      setProfEmail(adminProfile.email || '');
      setProfPhone(adminProfile.phone || '');
      setProfOffice(adminProfile.office || '');
    }
  }, [adminProfile]);

  useEffect(() => {
    if (adminAuth) {
      setSecEmail(adminAuth.email || '');
      setSecPassword(adminAuth.password || '');
    }
  }, [adminAuth]);

  const isPrivileged =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'moderator' ||
    currentUser?.isModerator;
  const isAdmin = currentUser?.role === 'admin';

  if (!isPrivileged) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Restricted Console</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          This console is reserved for college administrators and appointed student moderators.
        </p>
      </div>
    );
  }

  const pendingPosts = posts.filter((p) => p.status === 'pending');
  const approvedPosts = posts.filter((p) => p.status === 'approved');
  const pendingProfileReqs = (profileRequests || []).filter((r) => r.status === 'pending');

  const extractFirstPhone = (val) => {
    if (!val) return '';
    const matches = String(val).trim().match(/\d+/g);
    return matches ? matches[0] : '';
  };

  const mapRowToStudent = (cols, idx) => {
    const roll = cols[0] ? String(cols[0]).trim() : '';
    const dscCode = cols[1] ? String(cols[1]).trim() : '';
    const name = cols[2] ? String(cols[2]).trim() : '';
    const stream = cols[3] ? String(cols[3]).trim() : 'CSE';
    const section = cols[4] ? String(cols[4]).trim() : '';
    const group = cols[5] ? String(cols[5]).trim() : '';
    const rawPhone = cols[6] ? String(cols[6]) : '';
    const studentEmail = cols[7] ? String(cols[7]).trim() : '';
    const mentorName = cols[8] ? String(cols[8]).trim() : '';
    const mentorPhone = cols[9] ? String(cols[9]).trim() : '';
    const mentorEmail = cols[10] ? String(cols[10]).trim() : '';
    const hodName = cols[11] ? String(cols[11]).trim() : '';
    const hodPhone = cols[12] ? String(cols[12]).trim() : '';
    const hodEmail = cols[13] ? String(cols[13]).trim() : '';
    const remark = cols[14] ? String(cols[14]).trim() : '';

    return {
      id: `std_${Date.now()}_${idx}`,
      roll,
      dscCode,
      name,
      dept: stream,
      stream,
      section,
      group,
      phone: extractFirstPhone(rawPhone),
      rawPhone,
      studentEmail,
      year: '1st Year',
      mentorName,
      mentorPhone: extractFirstPhone(mentorPhone),
      mentorEmail,
      hodName,
      hodPhone: extractFirstPhone(hodPhone),
      hodEmail,
      remark,
      isModerator: false
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames.includes('B.Tech. Final 26')
          ? 'B.Tech. Final 26'
          : workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (!rows || rows.length < 2) {
          alert('Spreadsheet appears empty or unreadable.');
          return;
        }

        let validRows = rows;
        const firstRowStr = JSON.stringify(validRows[0]).toLowerCase();
        if (
          firstRowStr.includes('roll') ||
          firstRowStr.includes('code') ||
          firstRowStr.includes('stream')
        ) {
          validRows = validRows.slice(1);
        }

        const parsed = validRows
          .filter((r) => r && r[2] && String(r[2]).trim() !== '')
          .map((r, i) => mapRowToStudent(r, i));

        if (parsed.length > 0) {
          importStudentsBatch(parsed);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setActiveTab('roster');
        } else {
          alert('No valid student rows found with names in this sheet.');
        }
      } catch (err) {
        console.error(err);
        alert('Error parsing Excel file. Please ensure it is a valid .xlsx or .csv file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePasteImport = () => {
    if (!pasteText.trim()) return;
    const lines = pasteText.trim().split(/\r?\n/);
    const parsed = [];

    lines.forEach((line, idx) => {
      if (!line.trim()) return;
      const cols = line.includes('\t')
        ? line.split('\t').map((c) => c.trim())
        : line.split(',').map((c) => c.trim());

      if (
        idx === 0 &&
        (cols[0]?.toLowerCase().includes('roll') || cols[1]?.toLowerCase().includes('code'))
      ) {
        return;
      }
      if (cols.length >= 7) {
        parsed.push(mapRowToStudent(cols, idx));
      }
    });

    if (parsed.length > 0) {
      importStudentsBatch(parsed);
      setPasteText('');
      setActiveTab('roster');
    } else {
      alert('Could not parse rows. Ensure you copied columns across the 15 fields.');
    }
  };

  const handleSingleStudentSubmit = (e) => {
    e.preventDefault();

    const newStd = {
      id: `std_${Date.now()}`,
      roll: singleForm.roll.trim(),
      dscCode: singleForm.studentCode.trim(),
      name: singleForm.name.trim(),
      dept: singleForm.stream,
      stream: singleForm.stream,
      section: singleForm.section.trim(),
      group: singleForm.group.trim(),
      phone: extractFirstPhone(singleForm.phone),
      rawPhone: singleForm.phone.trim(),
      studentEmail: singleForm.studentEmail.trim(),
      year: '1st Year',
      mentorName: singleForm.mentorName.trim(),
      mentorPhone: extractFirstPhone(singleForm.mentorPhone),
      mentorEmail: singleForm.mentorEmail.trim(),
      hodName: singleForm.hodName.trim(),
      hodPhone: extractFirstPhone(singleForm.hodPhone),
      hodEmail: singleForm.hodEmail.trim(),
      remark: singleForm.remark.trim(),
      isModerator: false
    };

    addStudent(newStd);
    alert(`Enlisted ${singleForm.name} successfully!`);
    setSingleForm({
      roll: '',
      studentCode: '',
      name: '',
      stream: 'CSE',
      section: 'Sec A',
      group: 'Grp A',
      phone: '',
      studentEmail: '',
      mentorName: '',
      mentorPhone: '',
      mentorEmail: '',
      hodName: '',
      hodPhone: '',
      hodEmail: '',
      remark: ''
    });
  };

  const filteredRoster = students.filter((s) => {
    const q = rosterSearch.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.dscCode && s.dscCode.toLowerCase().includes(q)) ||
      (s.roll && String(s.roll).toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q)) ||
      (s.stream && s.stream.toLowerCase().includes(q)) ||
      (s.dept && s.dept.toLowerCase().includes(q))
    );
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRoster.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRoster.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Remove ${selectedIds.length} student(s) from the college roster?`)) {
      deleteStudents(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleConfirmDeletePost = (id, title) => {
    if (confirm(`Are you sure you want to permanently remove "${title}"?`)) {
      deletePost(id);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" /> Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Logged in as{' '}
            <strong className="text-slate-800 dark:text-slate-200">
              {currentUser?.data?.name || 'Administrator'}
            </strong>
            . Total Enrolled:{' '}
            <strong className="text-slate-800 dark:text-slate-200">{students.length} students</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${activeTab === 'approvals'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Posts & Queue ({pendingPosts.length > 0 ? `${pendingPosts.length} Pending` : `${posts.length} Total`})
          </button>

          <button
            onClick={() => setActiveTab('profileReqs')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${activeTab === 'profileReqs'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Profile Updates ({pendingProfileReqs.length})
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${activeTab === 'roster'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Roster & Mods ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${activeTab === 'import'
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Add / Import
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${activeTab === 'profile'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                Profile & Footer
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${activeTab === 'security'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                Security
              </button>
            </>
          )}
        </div>
      </div>

      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Campus Feed & Moderation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review incoming submissions or remove existing published posts from the feed.
              </p>
            </div>

            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start">
              <button
                onClick={() => setFeedSubTab('pending')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${feedSubTab === 'pending'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                  }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Queue ({pendingPosts.length})</span>
              </button>
              <button
                onClick={() => setFeedSubTab('approved')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${feedSubTab === 'approved'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                  }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Posts ({approvedPosts.length})</span>
              </button>
            </div>
          </div>

          {feedSubTab === 'pending' && (
            <div className="space-y-4">
              {pendingPosts.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 text-center text-slate-400 text-xs">
                  No pending uploads. Moderation queue is clear!
                </div>
              ) : (
                pendingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 overflow-hidden"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                          {post.category}
                        </span>
                        <span className="text-slate-400 truncate">
                          By {post.authorName} ({post.authorIdentifier})
                        </span>
                        <span className="text-slate-400 font-mono text-[10px] shrink-0">
                          • {post.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white break-words [overflow-wrap:anywhere]">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 break-words [overflow-wrap:anywhere] leading-relaxed whitespace-pre-line">
                        {post.description}
                      </p>
                      {post.link && (
                        <div className="pt-1">
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1 break-all"
                          >
                            Inspect File / Link <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                      {post.image && (
                        <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                          <img src={post.image} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                      <button
                        onClick={() => approvePost(post.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleConfirmDeletePost(post.id, post.title)}
                        className="flex items-center gap-1 px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-bold transition hover:bg-rose-100 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {feedSubTab === 'approved' && (
            <div className="space-y-4">
              {approvedPosts.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 text-center text-slate-400 text-xs">
                  No approved posts on the feed yet.
                </div>
              ) : (
                approvedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 overflow-hidden"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shrink-0">
                          Live
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                          {post.category}
                        </span>
                        <span className="text-slate-400 truncate">
                          By {post.authorName} ({post.authorIdentifier})
                        </span>
                        <span className="text-slate-400 font-mono text-[10px] shrink-0">
                          • {post.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white break-words [overflow-wrap:anywhere]">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 break-words [overflow-wrap:anywhere] leading-relaxed whitespace-pre-line">
                        {post.description}
                      </p>
                      {post.link && (
                        <div className="pt-1">
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1 break-all"
                          >
                            File Link <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                      {post.image && (
                        <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                          <img src={post.image} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                      <button
                        onClick={() => handleConfirmDeletePost(post.id, post.title)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
                        title="Delete this approved post permanently from the live feed"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Post
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profileReqs' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Student Profile Update Requests
          </h2>
          {pendingProfileReqs.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 text-center text-slate-400 text-xs">
              No pending student profile changes to review.
            </div>
          ) : (
            pendingProfileReqs.map((req) => (
              <div
                key={req.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                      {req.studentName}
                    </h3>
                    <p className="text-slate-400 font-mono">
                      Code: {req.studentCode} • Requested on: {req.submittedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveProfileUpdate(req.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Update
                    </button>
                    <button
                      onClick={() => rejectProfileUpdate(req.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Requested Modifications:</p>
                  {Object.entries(req.requestedChanges).map(([key, val]) =>
                    val ? (
                      <div key={key} className="flex gap-2">
                        <span className="capitalize text-slate-400">{key}:</span>
                        <span className="font-bold text-slate-900 dark:text-white break-words">
                          {val}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Name, Roll, DSC Code, Phone, Stream..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAll}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {selectedIds.length === filteredRoster.length && filteredRoster.length > 0
                  ? 'Deselect All'
                  : 'Select All'}
              </button>

              {selectedIds.length > 0 && isAdmin && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-[11px] whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-8 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === filteredRoster.length && filteredRoster.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-3">Roll</th>
                    <th className="p-3">Student Code</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Stream</th>
                    <th className="p-3">Section</th>
                    <th className="p-3">Group</th>
                    <th className="p-3">Contact (Key)</th>
                    <th className="p-3">Mentor</th>
                    <th className="p-3">Moderator Privileges</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredRoster.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-slate-400">
                        No students found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredRoster.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(student.id)}
                            onChange={() => toggleSelectOne(student.id)}
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {student.roll}
                        </td>
                        <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {student.dscCode}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                          {student.stream || student.dept}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {student.section || '—'}
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {student.group || '—'}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {student.phone}
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {student.mentorName || '—'}
                        </td>
                        <td className="p-3">
                          {student.isModerator ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                              Active Moderator
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Student</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {isAdmin && (
                            <button
                              onClick={() => toggleStudentModerator(student.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${student.isModerator
                                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                                  : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                                }`}
                            >
                              {student.isModerator ? 'Revoke Mod' : 'Appoint Mod'}
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => deleteStudents([student.id])}
                              className="p-1 text-rose-600 hover:text-rose-800"
                              title="Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="space-y-8">
          <div className="p-4 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
              <p className="font-bold">15-Column Institutional Excel Structure:</p>
              <p className="font-mono text-[11px] text-indigo-800 dark:text-indigo-300 break-all">
                Class Roll no. | Student Code | Student Name | Stream | Section Name | Group Name | Contact no. of Student | Email id of student | Name of Mentor | Contact no. of Mentor | E-mail ID of mentor | Name of HOD | Contact number of HOD | E-mail ID of HOD | Remark
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                ⚡ <em>Uploaded students automatically sync to Firebase Cloud across all devices.</em>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Upload File or Paste Rows
                </h3>
              </div>

              <div className="p-5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/40">
                <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Upload Excel File (.xlsx or .csv)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="mt-2 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Or Paste cells directly from Excel:
                </label>
                <textarea
                  rows={6}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste rows copied from Excel here..."
                  className="w-full p-3 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handlePasteImport}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Parse & Add Pasted Students
              </button>
            </div>

            <form
              onSubmit={handleSingleStudentSubmit}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Add Individual Student
                </h3>
              </div>

              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Academic Information</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input type="text" required placeholder="Class Roll" value={singleForm.roll}
                  onChange={(e) => setSingleForm({ ...singleForm, roll: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                <input type="text" required placeholder="Student Code" value={singleForm.studentCode}
                  onChange={(e) => setSingleForm({ ...singleForm, studentCode: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono" />
                <select value={singleForm.stream}
                  onChange={(e) => setSingleForm({ ...singleForm, stream: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white">
                  <option value="CSE">CSE</option><option value="AIML">AIML</option><option value="CS">CS</option>
                  <option value="DS">DS</option><option value="ECE">ECE</option><option value="EE">EE</option>
                  <option value="ME">ME</option><option value="CE">CE</option><option value="AUE">AUE</option>
                </select>
              </div>
              <input type="text" required placeholder="Student Full Name" value={singleForm.name}
                onChange={(e) => setSingleForm({ ...singleForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white uppercase" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input type="text" placeholder="Section Name" value={singleForm.section}
                  onChange={(e) => setSingleForm({ ...singleForm, section: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                <input type="text" placeholder="Group Name" value={singleForm.group}
                  onChange={(e) => setSingleForm({ ...singleForm, group: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
              </div>

              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide pt-2">Student Contact Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input type="text" required placeholder="Contact Number of Student" value={singleForm.phone}
                  onChange={(e) => setSingleForm({ ...singleForm, phone: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                <input type="email" placeholder="Email ID of Student" value={singleForm.studentEmail}
                  onChange={(e) => setSingleForm({ ...singleForm, studentEmail: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
              </div>

              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide pt-2">Faculty Mentor Information</p>
              <input type="text" placeholder="Name of Mentor" value={singleForm.mentorName}
                onChange={(e) => setSingleForm({ ...singleForm, mentorName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input type="text" placeholder="Contact Number of Mentor" value={singleForm.mentorPhone}
                  onChange={(e) => setSingleForm({ ...singleForm, mentorPhone: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                <input type="email" placeholder="E-mail ID of Mentor" value={singleForm.mentorEmail}
                  onChange={(e) => setSingleForm({ ...singleForm, mentorEmail: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
              </div>

              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide pt-2">HOD Information</p>
              <input type="text" placeholder="Name of HOD" value={singleForm.hodName}
                onChange={(e) => setSingleForm({ ...singleForm, hodName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input type="text" placeholder="Contact Number of HOD" value={singleForm.hodPhone}
                  onChange={(e) => setSingleForm({ ...singleForm, hodPhone: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                <input type="email" placeholder="E-mail ID of HOD" value={singleForm.hodEmail}
                  onChange={(e) => setSingleForm({ ...singleForm, hodEmail: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
              </div>

              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide pt-2">Additional Information</p>
              <textarea rows={3} placeholder="Remark (Optional)" value={singleForm.remark}
                onChange={(e) => setSingleForm({ ...singleForm, remark: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-y" />

              <button type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition">
                Enlist Single Student
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'profile' && isAdmin && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateAdminProfileData({
              name: profName,
              email: profEmail,
              phone: profPhone,
              office: profOffice
            });
          }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl shadow-sm space-y-4"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Admin Profile & Website Footer Sync
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Updates made here save to Firebase Cloud and reflect on the footer across every student's phone and computer.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name / Designation
            </label>
            <input
              type="text"
              required
              value={profName}
              onChange={(e) => setProfName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Official Contact Email
            </label>
            <input
              type="email"
              required
              value={profEmail}
              onChange={(e) => setProfEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              WhatsApp / Contact Phone
            </label>
            <input
              type="text"
              required
              value={profPhone}
              onChange={(e) => setProfPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Office Room / Location
            </label>
            <input
              type="text"
              required
              value={profOffice}
              onChange={(e) => setProfOffice(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Save & Sync Live Across All Devices
          </button>
        </form>
      )}

      {activeTab === 'security' && isAdmin && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await updateAdminCredentials(secEmail, secPassword);
          }}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md shadow-sm space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Change Admin Login ID & Password
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Admin Email (Username)
            </label>
            <input
              type="email"
              required
              value={secEmail}
              onChange={(e) => setSecEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              New Password
            </label>
            <input
              type="text"
              required
              value={secPassword}
              onChange={(e) => setSecPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
          >
            Save New Credentials
          </button>
        </form>
      )}
    </div>
  );
}