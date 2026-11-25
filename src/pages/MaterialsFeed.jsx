import React, { useState, useMemo } from 'react';
import { PlusCircle, Search, Filter, FileText, ExternalLink, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MaterialsFeed({ openLoginModal }) {
  const { currentUser, posts, submitPost } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [postType, setPostType] = useState('material');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lecture Notes');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isPrivileged =
    currentUser?.role === 'admin' ||
    currentUser?.role === 'moderator' ||
    currentUser?.isModerator;

  const categories = useMemo(() => {
    const set = new Set();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return posts.filter((p) => {
      const canSee =
        p.status === 'approved' ||
        isPrivileged ||
        (currentUser && p.authorIdentifier === currentUser.data?.dscCode);

      if (!canSee) return false;

      const matchesType = typeFilter === 'All' || p.type === typeFilter;
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesSearch =
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.authorName?.toLowerCase().includes(q);

      return matchesType && matchesCat && matchesSearch;
    });
  }, [posts, typeFilter, categoryFilter, searchQuery, isPrivileged, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the title and description.');
      return;
    }

    try {
      setSubmitting(true);
      const publishedImmediately = await submitPost({
        type: postType,
        title: title.trim(),
        category,
        description: description.trim(),
        link: postType === 'material' ? link.trim() : '',
        image: postType === 'image_post' ? image.trim() : '',
        authorName: currentUser?.data?.name || 'Classmate',
        authorIdentifier: currentUser?.data?.dscCode || 'STUDENT'
      });

      setModalOpen(false);
      setTitle('');
      setDescription('');
      setLink('');
      setImage('');

      alert(
        publishedImmediately
          ? 'Your post is published live immediately!'
          : 'Post submitted successfully! It will appear on the public feed after Admin or Moderator approval.'
      );
    } catch (err) {
      console.error('Submit post error:', err);
      alert('Failed to submit post: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Campus Materials & Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse lecture notes, PYQs, exam notices, and student club posters.
          </p>
        </div>

        <div>
          {currentUser ? (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" /> Create Post / Share Notes
            </button>
          ) : (
            <button
              onClick={() => openLoginModal('student')}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition"
            >
              Sign In to Post
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'All Feeds', val: 'All' },
            { label: 'Study Materials', val: 'material' },
            { label: 'Important Notices', val: 'event' },
            { label: 'Event Posters', val: 'image_post' }
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setTypeFilter(tab.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                typeFilter === tab.val
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, subject, keywords, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Posts Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try resetting the category filter or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between min-w-0 overflow-hidden"
            >
              <div className="space-y-4 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
                    {post.category}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    {post.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                        Pending Approval
                      </span>
                    )}
                    <span className="text-slate-400 text-[11px] font-mono">{post.date}</span>
                  </div>
                </div>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden max-h-60 border border-slate-100 dark:border-slate-700 shrink-0">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug break-words [overflow-wrap:anywhere]">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-line">
                    {post.description}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 dark:text-slate-500 truncate min-w-0">
                  Shared by <strong className="text-slate-700 dark:text-slate-300">{post.authorName}</strong>
                </span>

                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold transition shrink-0"
                  >
                    Open Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Share Post or Notes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Posts submitted by students undergo review by moderators before appearing on the campus feed.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3">
                <button
                  type="button"
                  onClick={() => setPostType('material')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    postType === 'material'
                      ? 'bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Study Material / Link
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('image_post')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    postType === 'image_post'
                      ? 'bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Poster / Club Flyer
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End-Sem Solved Mathematics Papers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Lecture Notes">Lecture Notes</option>
                  <option value="PYQ">Previous Year Questions (PYQs)</option>
                  <option value="Lab Manual">Lab Manual</option>
                  <option value="Campus Event">Campus Event / Club Activity</option>
                  <option value="Important Day">Exam / Fee Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context, syllabus modules covered, or date of event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {postType === 'material' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Google Drive or File Link
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Image URL / Poster Link
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... or hosted image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
