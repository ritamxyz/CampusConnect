import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer({ setActivePage }) {
  const { adminProfile } = useApp();
  const whatsappUrl = `https://wa.me/${adminProfile.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Admin, I have an inquiry regarding Campus Connect.'
  )}`;

  return (
    <footer id="reach-admin-section" className="mt-24 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold text-xl">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span>
                Campus<span className="text-indigo-400">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The verified digital campus ecosystem for students. Zero clutter, verified peer networking, and moderation-approved academic notes.
            </p>
            <div className="flex gap-3 text-xs text-slate-400 pt-2">
              <button onClick={() => setActivePage('feed')} className="hover:text-white transition">
                Materials
              </button>
              <span>•</span>
              <button onClick={() => setActivePage('students')} className="hover:text-white transition">
                Directory
              </button>
              <span>•</span>
              <a href="#about-section" className="hover:text-white transition">
                About
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Moderation Protocol</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All community postings, revision notes, question banks, and posters must be vetted by an appointed student moderator or campus administrator prior to public display.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              🛡️ Privacy guaranteed: Student contact numbers are kept private and never exposed to broad text search indexes.
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              Official Administration Desk
            </h4>
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700/80 space-y-2.5">
              <p className="text-sm font-bold text-white">{adminProfile.name}</p>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <a href={`mailto:${adminProfile.email}`} className="hover:underline truncate">
                  {adminProfile.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{adminProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{adminProfile.office}</span>
              </div>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Reach Admin on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Campus Connect Portal. Crafted for higher education institutions.</p>
          <p className="flex items-center gap-1">Zero-config deploy for Netlify & Vercel</p>
        </div>
      </div>
    </footer>
  );
}
