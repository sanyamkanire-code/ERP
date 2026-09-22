import React, { useState } from 'react';
import { useERPData } from '../../context/ERPDataContext';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Building2,
  AlertTriangle,
  FileSpreadsheet,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
  ShieldAlert,
} from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { departments, analytics, studentsRoster, addNotification, setToastMessage } = useERPData();
  const [searchQuery, setSearchQuery] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const totalStudents = departments.reduce((acc, d) => acc + d.totalStudents, 0);
  const totalFaculty = departments.reduce((acc, d) => acc + d.totalFaculty, 0);
  const avgAttendance = (
    departments.reduce((acc, d) => acc + d.averageAttendance, 0) / departments.length
  ).toFixed(1);
  const avgPass = (
    departments.reduce((acc, d) => acc + d.passPercentage, 0) / departments.length
  ).toFixed(1);

  const atRiskStudents = studentsRoster.filter((s) => s.status === 'critical');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    addNotification({
      title: 'Dean of Academic Affairs Broadcast',
      message: broadcastMessage,
      type: 'security',
      linkTab: 'collaboration',
    });
    setToastMessage('📢 Campus-wide alert broadcasted to all students and staff!');
    setBroadcastMessage('');
    setShowBroadcastModal(false);
  };

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.headOfDepartment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Year 2026-2027 • Fall Semester</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Administration & ERP Overview
          </h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl">
            Real-time oversight of academic departments, attendance compliance, student retention, and secure collaboration infrastructure.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5">
          <button
            id="btn-admin-apttech-proctor"
            onClick={() => setActiveTab('apttech')}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-slate-950" />
            <span>AI Test &amp; Live Proctoring</span>
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          </button>
          <button
            onClick={() => setActiveTab('analytics-report')}
            className="px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            Monthly Analytics
          </button>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Bell className="w-4 h-4" />
            Campus Broadcast
          </button>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Enrolled Students</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalStudents}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 5 B.Tech & M.Tech programs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Faculty Members</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalFaculty}</span>
            <span className="text-xs font-semibold text-slate-500">Ph.D. & Industry Fellows</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Student-Faculty Ratio: 1:16.2</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Attendance Health</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgAttendance}%</span>
            <span className="text-xs font-semibold text-emerald-600">Above 75% bar</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${avgAttendance}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Semester Pass Rate</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgPass}%</span>
            <span className="text-xs font-semibold text-purple-600">Autonomous exams</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Internal Assessments + Finals</p>
        </div>
      </div>

      {/* Main Content Layout: Departments Table & Critical At-Risk Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engineering Departments Overview (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Departmental Academic Performance
              </h3>
              <p className="text-xs text-slate-500">
                Live attendance compliance and semester assessment metrics per branch
              </p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search department or HOD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-60"
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Head of Dept (HOD)</th>
                  <th className="py-3 px-3 text-center">Students</th>
                  <th className="py-3 px-3 text-center">Faculty</th>
                  <th className="py-3 px-3">Avg Attendance</th>
                  <th className="py-3 px-3">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepts.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-slate-900">{dept.name}</span>
                        <span className="ml-2 font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          {dept.code}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{dept.headOfDepartment}</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-800">
                      {dept.totalStudents}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600">{dept.totalFaculty}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{dept.averageAttendance}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              dept.averageAttendance >= 85
                                ? 'bg-emerald-500'
                                : dept.averageAttendance >= 75
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${dept.averageAttendance}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900">{dept.passPercentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Attendance Risk Alerts & System Integrity */}
        <div className="space-y-6">
          {/* At-Risk Students Card (<75% attendance) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Attendance Risk Radar</h4>
                  <p className="text-[11px] text-slate-500">Students under 75% mandatory threshold</p>
                </div>
              </div>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {atRiskStudents.length} Flagged
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {atRiskStudents.map((stu) => (
                <div
                  key={stu.id}
                  className="p-2.5 rounded-xl bg-red-50/50 border border-red-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={stu.avatar}
                      alt={stu.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{stu.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{stu.studentId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-red-600">
                      {stu.attendancePercent}%
                    </span>
                    <p className="text-[9px] text-red-500 font-medium">Notice Required</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                addNotification({
                  title: 'Automated Attendance Warning Dispatched',
                  message:
                    'Automated SMS and email notices sent to 2 students with attendance under 75%.',
                  type: 'attendance',
                });
                setToastMessage('⚠️ Advisory notices dispatched to at-risk students and parents.');
              }}
              className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Dispatch Advisory Warnings
            </button>
          </div>

          {/* Quick Real-Time Audit Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-indigo-600" />
              Real-time Campus Activity Log
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Attendance Logged • CS301</p>
                  <p className="text-[11px] text-slate-500">Prof. Sarah Jenkins recorded 64 students</p>
                  <span className="text-[10px] text-slate-400">10 mins ago</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Curriculum Material Published</p>
                  <p className="text-[11px] text-slate-500">Unit 3 Dynamic Programming Handbook</p>
                  <span className="text-[10px] text-slate-400">1 hour ago</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">HackNexus 2026 Registration</p>
                  <p className="text-[11px] text-slate-500">340 student registrations confirmed</p>
                  <span className="text-[10px] text-slate-400">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Broadcast Campus Notice
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Sends an urgent push alert to all students, faculty members, and mobile apps.
            </p>

            <form onSubmit={handleSendBroadcast}>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="e.g. Due to weather conditions, evening lab sessions are rescheduled to Saturday morning..."
                rows={4}
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
                >
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
