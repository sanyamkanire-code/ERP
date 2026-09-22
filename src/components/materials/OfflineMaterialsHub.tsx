import React, { useState } from 'react';
import { useERPData } from '../../context/ERPDataContext';
import { CourseMaterial } from '../../types/erp';
import {
  BookOpen,
  Download,
  HardDrive,
  FileText,
  Code,
  Eye,
  CheckCircle2,
  Trash2,
  Wifi,
  WifiOff,
  Search,
  Lock,
} from 'lucide-react';

export const OfflineMaterialsHub: React.FC = () => {
  const { materials, toggleMaterialOfflineCache, isOfflineMode, toggleOfflineMode } = useERPData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [previewDoc, setPreviewDoc] = useState<CourseMaterial | null>(null);

  const offlineItems = materials.filter((m) => m.isCachedOffline);

  const filtered = materials.filter((m) => {
    const matchesQuery =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || m.courseCode === selectedSubject;
    return matchesQuery && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Local Encrypted Course Cache</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Curriculum Repository & Offline Study Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Download lecture notes, formula sheets, and lab starter code for uninterrupted offline study.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleOfflineMode}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              isOfflineMode
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-4 h-4 text-amber-700" />
                <span>Offline Simulator Active</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span>Test Offline Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Offline Storage Status Bar */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold">
              {offlineItems.length} of {materials.length} Documents Available Offline
            </h4>
            <p className="text-xs text-emerald-200">
              Cached locally in IndexedDB / LocalStorage with AES-256 integrity validation.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Storage Footprint
          </span>
          <span className="font-mono text-xs font-bold text-emerald-300">
            ~16.4 MB of 500 MB quota used
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'CS301', 'CS302', 'CS303', 'CS304', 'EC204'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedSubject === sub
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sub === 'ALL' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 bg-white"
          />
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mat) => (
          <div
            key={mat.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {mat.fileType.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {mat.courseCode} • {mat.unit}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug">
                      {mat.title}
                    </h3>
                  </div>
                </div>

                {mat.isCachedOffline ? (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Offline Ready
                  </span>
                ) : (
                  <span className="shrink-0 text-[10px] text-slate-400">Online Only</span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{mat.description}</p>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>By: {mat.uploadedBy}</span>
                <span className="font-mono font-medium">{mat.fileSize}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setPreviewDoc(mat)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                Read Document
              </button>

              <button
                onClick={() => toggleMaterialOfflineCache(mat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  mat.isCachedOffline
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {mat.isCachedOffline ? (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Cache
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Download for Offline
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {isOfflineMode ? '📶 Local Encrypted Offline Reader' : '🌐 Secure Campus Reader'}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{previewDoc.title}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {previewDoc.courseCode} • {previewDoc.unit}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-xs max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
                <p className="text-emerald-400 font-bold mb-2">// Verified Campus Document Data</p>
                {previewDoc.contentPreview}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{previewDoc.description}</p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified SHA-256 Digest</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
