import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Camera,
  Mic,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Eye,
  Radio,
  Clock,
  Send,
  RefreshCw,
  Plus,
  Volume2,
  Layers,
  Search,
} from 'lucide-react';

interface ProctorSession {
  sessionId: string;
  studentId: string;
  studentName: string;
  testId: string;
  testTitle: string;
  startedAt: string;
  lastPing: string;
  status: 'active' | 'warning' | 'disqualified' | 'submitted';
  violations: {
    id: string;
    type: 'tab_switch' | 'face_missing' | 'multiple_faces' | 'audio_anomaly' | 'screen_resize';
    timestamp: string;
    details: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  warningCount: number;
  currentQuestion: number;
  totalQuestions: number;
  cameraActive: boolean;
  micActive: boolean;
}

export const LiveProctoringConsole: React.FC = () => {
  const [sessions, setSessions] = useState<ProctorSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'warning' | 'disqualified'>('all');
  const [selectedSession, setSelectedSession] = useState<ProctorSession | null>(null);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  // Fetch proctor sessions from backend API
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/proctor/sessions');
      if (res.ok) {
        const data = await res.json();
        if (data.sessions) {
          setSessions(data.sessions);
          if (!selectedSession && data.sessions.length > 0) {
            setSelectedSession(data.sessions[0]);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to fetch proctor sessions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminAction = async (sessionId: string, action: 'warning' | 'disqualify' | 'dismiss_warning') => {
    try {
      const res = await fetch('/api/proctor/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, action }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessions((prev) =>
          prev.map((s) => (s.sessionId === sessionId ? data.session : s))
        );
        if (selectedSession?.sessionId === sessionId) {
          setSelectedSession(data.session);
        }
        setAdminNotice(
          action === 'disqualify'
            ? `Candidate disqualified. Access terminated.`
            : action === 'warning'
            ? `Formal proctoring warning issued to candidate.`
            : `Warning count reset for candidate.`
        );
        setTimeout(() => setAdminNotice(null), 4000);
      }
    } catch (e) {
      console.error('Error executing admin proctor action:', e);
    }
  };

  // Simulate an incoming live telemetry event for testing
  const handleSimulateViolation = async (sessionId: string) => {
    try {
      const res = await fetch('/api/proctor/violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          type: 'tab_switch',
          details: 'Candidate opened new tab (DevTools / Chrome search)',
          severity: 'high',
        }),
      });
      if (res.ok) {
        fetchSessions();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const totalActive = sessions.filter((s) => s.status === 'active').length;
  const totalWarning = sessions.filter((s) => s.status === 'warning').length;
  const totalDisqualified = sessions.filter((s) => s.status === 'disqualified').length;

  return (
    <div className="space-y-6">
      {/* Console Top Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>LIVE AI PROCTORING COMMAND CENTER • TELEMETRY HUD</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Real-Time Proctored Exam Room &amp; Violation Monitor
          </h2>
          <p className="text-xs text-slate-300">
            Facial recognition verification, window blur tracking, dual-screen detection, and audio anomaly detection across active exam terminals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSessions}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Admin Toast Notice */}
      {adminNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs font-bold text-amber-950 flex items-center gap-2 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Candidates
          </span>
          <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
            {sessions.length}
          </span>
          <p className="text-[10px] text-slate-500">Connected exam sessions</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Clean &amp; Verified
          </span>
          <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
            {totalActive}
          </span>
          <p className="text-[10px] text-slate-500">0 critical violations</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            Under Warning Flag
          </span>
          <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
            {totalWarning}
          </span>
          <p className="text-[10px] text-slate-500">Tab switches or look-away</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            Disqualified
          </span>
          <span className="text-2xl font-black text-rose-600 font-mono mt-1 block">
            {totalDisqualified}
          </span>
          <p className="text-[10px] text-slate-500">Exceeded 5 violation limit</p>
        </div>
      </div>

      {/* Main Grid: Live Video Stream Matrix (8 cols) & Real-time Incident Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Video Feeds (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Live Candidate Feeds ({filteredSessions.length})
            </h3>

            <div className="flex items-center gap-1.5">
              {(['all', 'active', 'warning', 'disqualified'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition uppercase cursor-pointer ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSessions.map((session) => {
              const isSelected = selectedSession?.sessionId === session.sessionId;
              return (
                <div
                  key={session.sessionId}
                  onClick={() => setSelectedSession(session)}
                  className={`bg-white rounded-3xl border p-4 shadow-xs space-y-3 cursor-pointer transition ${
                    isSelected ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Simulated Webcam Viewport */}
                  <div className="relative bg-slate-950 rounded-2xl h-44 overflow-hidden flex items-center justify-center border border-slate-800">
                    {/* Simulated Candidate Video Avatar */}
                    <div className="text-center space-y-1">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-slate-700 to-indigo-900 mx-auto flex items-center justify-center text-white font-bold text-lg border-2 border-indigo-400/50 shadow-inner">
                        {session.studentName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <p className="text-[11px] font-mono text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        720p HD Stream Verified
                      </p>
                    </div>

                    {/* HUD Badges Overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                        <Camera className="w-2.5 h-2.5 text-emerald-400" />
                        ON
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                        <Mic className="w-2.5 h-2.5 text-emerald-400" />
                        ON
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          session.status === 'active'
                            ? 'bg-emerald-500 text-slate-950'
                            : session.status === 'warning'
                            ? 'bg-amber-400 text-slate-950 animate-pulse'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>

                    {/* Bottom overlay: Progress */}
                    <div className="absolute bottom-2 inset-x-2 bg-black/70 backdrop-blur-xs rounded-xl px-2.5 py-1 flex items-center justify-between text-[10px] text-white">
                      <span className="font-semibold truncate">{session.testTitle}</span>
                      <span className="font-mono text-amber-300 font-bold">
                        Q{session.currentQuestion}/{session.totalQuestions}
                      </span>
                    </div>
                  </div>

                  {/* Candidate Information & Quick Action */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900">{session.studentName}</h4>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {session.studentId}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Started: {session.startedAt} • Violations: {session.violations.length}
                    </p>
                  </div>

                  {/* Quick Controls Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulateViolation(session.sessionId);
                      }}
                      className="text-[10px] font-bold text-amber-700 hover:text-amber-900 transition cursor-pointer"
                    >
                      + Test Tab Warning
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdminAction(session.sessionId, 'warning');
                        }}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        Warn
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdminAction(session.sessionId, 'disqualify');
                        }}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        Disqualify
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Session Inspector & Telemetry Log (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Selected Candidate Audit Log
            </h3>
            <p className="text-[11px] text-slate-500">Detailed AI facial &amp; window blur events</p>
          </div>

          {selectedSession ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-900">{selectedSession.studentName}</p>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      selectedSession.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedSession.status === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedSession.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">{selectedSession.studentId}</p>
                <p className="text-[11px] text-slate-700">Exam: {selectedSession.testTitle}</p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAdminAction(selectedSession.sessionId, 'warning')}
                  className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Send Warning ({selectedSession.warningCount})
                </button>
                <button
                  onClick={() => handleAdminAction(selectedSession.sessionId, 'disqualify')}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Disqualify
                </button>
              </div>

              {/* Incident History Timeline */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Proctoring Telemetry Events ({selectedSession.violations.length})
                </h4>

                {selectedSession.violations.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-50 text-center text-xs text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                    No proctoring violations recorded. Clean candidate session.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {selectedSession.violations.map((v) => (
                      <div
                        key={v.id}
                        className="p-2.5 rounded-xl border text-xs space-y-1 bg-slate-50 border-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 font-mono text-[10px]">
                            {v.timestamp}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              v.severity === 'high'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {v.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 font-medium">{v.details}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Select a candidate feed to inspect</p>
          )}
        </div>
      </div>
    </div>
  );
};
