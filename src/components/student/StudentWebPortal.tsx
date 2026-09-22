import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERPData } from '../../context/ERPDataContext';
import {
  Smartphone,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface StudentWebPortalProps {
  setActiveTab: (tab: string) => void;
}

export const StudentWebPortal: React.FC<StudentWebPortalProps> = ({ setActiveTab }) => {
  const { currentUser, setViewMode } = useAuth();
  const { grades, events, materials } = useERPData();

  const studentAttendanceList = [
    { code: 'CS301', name: 'Design & Analysis of Algorithms', attended: 28, total: 32, pct: 87.5 },
    { code: 'CS302', name: 'Operating Systems & Concurrency', attended: 26, total: 30, pct: 86.6 },
    { code: 'CS303', name: 'DBMS & Cloud Computing', attended: 24, total: 26, pct: 92.3 },
    { code: 'CS304', name: 'Software Eng & DevOps', attended: 25, total: 26, pct: 96.1 },
    { code: 'EC204', name: 'Embedded Systems & IoT', attended: 19, total: 24, pct: 79.1 },
  ];

  const overallAttendance = (
    studentAttendanceList.reduce((acc, curr) => acc + curr.pct, 0) /
    studentAttendanceList.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner with Android App Switcher Recommendation */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Dedicated Student Android App Ready</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            Roll: {currentUser.studentId} • Semester 5 • Computer Science & Engineering
          </p>
        </div>

        <button
          onClick={() => setViewMode('android')}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-900/30 shrink-0"
        >
          <Smartphone className="w-4 h-4" />
          <span>Launch Android App Simulation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cumulative Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{overallAttendance}%</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Compliant (&gt;75%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${overallAttendance}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Current CGPA</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">8.85</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              First Class Distinction
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total Credits Earned: 84 / 160</p>
        </div>

        {/* Apt-Tech Solutions Placement Readiness Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase">Apt-Tech PRI</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-950 font-mono">78%</span>
              <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                Tier 1 Prime
              </span>
            </div>
            <p className="text-[11px] text-amber-800 mt-1">Eligible for ₹7.5+ LPA Drives</p>
          </div>
          <button
            onClick={() => setActiveTab('apttech')}
            className="mt-3 text-xs font-bold text-amber-950 hover:text-amber-800 flex items-center gap-1 transition cursor-pointer"
          >
            <span>Open AptTech CRT Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Offline Course Cache</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {materials.filter((m) => m.isCachedOffline).length} Files
            </span>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Encrypted
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for disconnected revision</p>
        </div>
      </div>

      {/* Main Grid: Subject Attendance and Gradebook */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Course Attendance Tracker (Semester 5)
              </h3>
              <p className="text-xs text-slate-500">
                Real-time synchronization with faculty period registers
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Exam Eligible
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {studentAttendanceList.map((sub) => (
              <div key={sub.code} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="font-mono font-bold text-indigo-700">{sub.code}</span>
                    <span className="text-slate-800 ml-2">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">
                      {sub.attended} / {sub.total} classes
                    </span>
                    <span
                      className={`font-bold ${
                        sub.pct >= 85
                          ? 'text-emerald-600'
                          : sub.pct >= 75
                          ? 'text-blue-600'
                          : 'text-red-600'
                      }`}
                    >
                      {sub.pct}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      sub.pct >= 85
                        ? 'bg-emerald-500'
                        : sub.pct >= 75
                        ? 'bg-blue-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${sub.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Student ID Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300">
                Nexus College Digital ID
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-400/30">
                VERIFIED
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-indigo-400"
              />
              <div>
                <h4 className="font-extrabold text-sm">{currentUser.name}</h4>
                <p className="font-mono text-xs text-indigo-300">{currentUser.studentId}</p>
                <p className="text-[10px] text-slate-300">B.Tech Computer Science</p>
              </div>
            </div>

            <div className="mt-4 bg-white p-2.5 rounded-xl flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-slate-800" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                    Campus Gate Pass
                  </span>
                  <span className="font-mono text-[11px] font-bold text-indigo-900">
                    2023CS0142#PASS
                  </span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-indigo-200 flex items-center justify-between">
            <span>Academic Year 2026-27</span>
            <span>Batch: 2023 - 2027</span>
          </div>
        </div>
      </div>

      {/* Internal Assessments Marks & Grade Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Semester 5 Internal Assessments & Grade Card
            </h3>
            <p className="text-xs text-slate-500">
              Continuous Internal Evaluation (IA-1, IA-2, Assignments, and Practicals)
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Credits: 17 Semester Total</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50">
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3 text-center">IA-1 (25)</th>
                <th className="py-2.5 px-3 text-center">IA-2 (25)</th>
                <th className="py-2.5 px-3 text-center">Assignment (10)</th>
                <th className="py-2.5 px-3 text-center">Lab / Practical (40)</th>
                <th className="py-2.5 px-3 text-center">Total Percentage</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((grd) => (
                <tr key={grd.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-indigo-700">{grd.courseCode}</span>
                    <span className="font-semibold text-slate-900 ml-2">{grd.courseName}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-800">
                    {grd.internal1}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-slate-800">
                    {grd.internal2}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-700">
                    {grd.assignmentScore}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-700">
                    {grd.labScore || 35}
                  </td>
                  <td className="py-2.5 px-3 text-center font-extrabold text-indigo-700">
                    {grd.totalPercentage}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {grd.gradeLetter}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
