import React, { useState } from 'react';
import { useERPData } from '../../context/ERPDataContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const MonthlyAnalyticsReport: React.FC = () => {
  const { analytics, departments, setToastMessage } = useERPData();
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Subject Code,Subject Name,Pass Percentage,Average Score\n' +
      analytics.subjectPassRates
        .map((s) => `${s.code},"${s.subject}",${s.passRate}%,${s.averageScore}`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NexusEng_Monthly_Report_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMessage(`📊 Downloaded CSV Report for ${selectedMonth}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-100">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive Performance Analytics Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Monthly Academic & Attendance Report
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated compliance audits, department pass benchmarks, and retention risk tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="September 2026">September 2026 (Current)</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Engineering Branches</option>
            <option value="CSE">Computer Science (CSE)</option>
            <option value="AIDS">AI & Data Science (AIDS)</option>
            <option value="ECE">Electronics (ECE)</option>
            <option value="MECH">Mechanical (MECH)</option>
            <option value="CIVIL">Civil Engineering (CIVIL)</option>
          </select>

          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Formal Report
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            CSV Data
          </button>
        </div>
      </div>

      {/* Monthly Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Overall Attendance Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {analytics.overallAttendanceRate}%
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +1.8% MoM
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all 5 departments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pass Percentage (CIE)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {analytics.passPercentage}%
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Above target
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Internal assessments average</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Conducted Classes & Labs
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-600">
              {analytics.totalClassesConducted}
            </span>
            <span className="text-xs font-bold text-slate-500">Periods logged</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% digital audit verified</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            At-Risk Students Identified
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-600">
              {analytics.atRiskStudentsCount}
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Intervention Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">&lt;75% attendance or score deficit</p>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Distribution Range */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Student Attendance Bracket Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown of student body compliance with mandatory 75% attendance rule
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {analytics.attendanceDistribution.map((item, idx) => {
              const total = analytics.attendanceDistribution.reduce((a, b) => a + b.count, 0);
              const percentage = ((item.count / total) * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{item.range}</span>
                    <span className="text-slate-900 font-bold">
                      {item.count} students ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Rankings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Department Academic & Attendance Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Rankings across engineering branches for {selectedMonth}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Attendance Rate</th>
                  <th className="py-2.5 px-3">Pass Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.departmentRankings.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{dept.dept}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{dept.attendance}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${dept.attendance}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{dept.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Subject-Wise Pass & Average Score Matrix */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Course-Wise Performance & Difficulty Index
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Continuous assessment outcomes for core engineering subjects in 5th Semester
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50">
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4 text-center">Pass Rate</th>
                <th className="py-3 px-4 text-center">Average Score</th>
                <th className="py-3 px-4 text-center">Outcome Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.subjectPassRates.map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{sub.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{sub.subject}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-slate-800">
                    {sub.passRate}%
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    {sub.averageScore} / 100
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.passRate >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {sub.passRate >= 90 ? 'High Proficiency' : 'Standard'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formal Printable Monthly Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200 text-slate-900 my-8">
            {/* Report Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                  Nexus Institute of Technology
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Office of the Dean of Academic Affairs & Controller of Examinations
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Accredited by NBA & Tier-1 Autonomous Council
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  DOC: NIT-ACAD-2026-SEP
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Document Title */}
            <div className="py-4 text-center border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Official Monthly Performance Analytics & Compliance Review
              </h2>
              <p className="text-xs text-slate-500">Period: {selectedMonth}</p>
            </div>

            {/* Content summary */}
            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Overall Student Attendance:</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    {analytics.overallAttendanceRate}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Continuous Assessment Pass Rate:</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    {analytics.passPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Academic Hours Delivered:</span>
                  <span className="font-bold text-slate-800">
                    {analytics.totalClassesConducted} Classes
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Identified At-Risk Students:</span>
                  <span className="font-bold text-red-600">
                    {analytics.atRiskStudentsCount} Under Remedial Action
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Subject Performance Summary:</h4>
                <table className="w-full text-left border border-slate-200 text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2 border">Code</th>
                      <th className="p-2 border">Course</th>
                      <th className="p-2 border text-center">Pass %</th>
                      <th className="p-2 border text-center">Avg Mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.subjectPassRates.map((s) => (
                      <tr key={s.code}>
                        <td className="p-2 border font-mono font-bold">{s.code}</td>
                        <td className="p-2 border">{s.subject}</td>
                        <td className="p-2 border text-center font-bold">{s.passRate}%</td>
                        <td className="p-2 border text-center">{s.averageScore}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between items-end border-t border-slate-200 mt-6">
                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 w-36 mb-1" />
                  <p className="font-bold text-[11px]">Dr. Sarah Jenkins</p>
                  <p className="text-[10px] text-slate-500">Academic Coordinator</p>
                </div>
                <div className="text-center">
                  <div className="h-10 border-b border-dashed border-slate-400 w-36 mb-1" />
                  <p className="font-bold text-[11px]">Dr. Arvind Subramanian</p>
                  <p className="text-[10px] text-slate-500">Dean of Academic Affairs</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowPrintModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
