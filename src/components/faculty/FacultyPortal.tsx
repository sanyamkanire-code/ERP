import React, { useState } from 'react';
import { useERPData } from '../../context/ERPDataContext';
import { useAuth } from '../../context/AuthContext';
import { AttendanceStatus, AcademicGradeRecord } from '../../types/erp';
import {
  CalendarCheck,
  GraduationCap,
  Users,
  Check,
  X,
  Clock,
  Award,
  BookOpen,
  Plus,
  Send,
  Sparkles,
  AlertTriangle,
  UploadCloud,
  FileText,
  Search,
  ShieldAlert,
  Video,
  BrainCircuit,
} from 'lucide-react';
import { AiTestGeneratorModal } from '../apttech/AiTestGeneratorModal';
import { LiveProctoringConsole } from '../apttech/LiveProctoringConsole';
import { MockAssessment } from '../../types/apttech';

interface FacultyPortalProps {
  initialSubTab?: 'attendance' | 'grades' | 'materials' | 'ai-test-gen' | 'proctoring';
}

export const FacultyPortal: React.FC<FacultyPortalProps> = ({ initialSubTab = 'attendance' }) => {
  const { currentUser } = useAuth();
  const {
    courses,
    studentsRoster,
    markAttendance,
    grades,
    updateGrade,
    addCourseMaterial,
    setToastMessage,
  } = useERPData();

  const [activeTab, setActiveTab] = useState<
    'attendance' | 'grades' | 'materials' | 'ai-test-gen' | 'proctoring'
  >(initialSubTab);

  const [showAiModal, setShowAiModal] = useState(false);
  const [createdAssessments, setCreatedAssessments] = useState<MockAssessment[]>([]);

  // Attendance state
  const [selectedCourse, setSelectedCourse] = useState<string>('CS301');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState<number>(1);
  const [topicCovered, setTopicCovered] = useState<string>('Dynamic Programming: Bellman-Ford Recurrence & Path Reconstruction');
  
  // Student ID -> status map
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>(() => {
    const map: Record<string, AttendanceStatus> = {};
    studentsRoster.forEach((s) => {
      // Default to present, except devansh as absent for realistic demo
      map[s.id] = s.status === 'critical' ? 'absent' : 'present';
    });
    return map;
  });

  // Gradebook state
  const [gradeEditModal, setGradeEditModal] = useState<AcademicGradeRecord | null>(null);

  // Material upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    unit: 'Unit 3',
    fileType: 'pdf' as 'pdf' | 'pptx' | 'code' | 'doc',
    contentPreview: '',
  });

  // Toggle single student attendance
  const cycleAttendanceStatus = (studentId: string) => {
    setAttendanceMap((prev) => {
      const current = prev[studentId] || 'present';
      let next: AttendanceStatus = 'present';
      if (current === 'present') next = 'absent';
      else if (current === 'absent') next = 'late';
      else if (current === 'late') next = 'od';
      else next = 'present';
      return { ...prev, [studentId]: next };
    });
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    studentsRoster.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    markAttendance(selectedCourse, attendanceMap, topicCovered);
    setToastMessage(
      `✅ Attendance for ${selectedCourse} (Period ${period}) recorded and synchronized to student apps!`
    );
  };

  // Tallies
  const presentCount = Object.values(attendanceMap).filter((v) => v === 'present' || v === 'od').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === 'absent').length;
  const lateCount = Object.values(attendanceMap).filter((v) => v === 'late').length;
  const currentBatchAttendanceRate = (
    (presentCount / (studentsRoster.length || 1)) *
    100
  ).toFixed(1);

  // Grade calculation helper
  const calculateGradeMetrics = (ia1: number, ia2: number, lab: number, assign: number) => {
    const total = ia1 + ia2 + lab + assign; // Max 25+25+40+10 = 100
    let letter: AcademicGradeRecord['gradeLetter'] = 'A';
    if (total >= 90) letter = 'A+';
    else if (total >= 80) letter = 'A';
    else if (total >= 70) letter = 'B+';
    else if (total >= 60) letter = 'B';
    else if (total >= 50) letter = 'C';
    else letter = 'RA';
    return { total, letter };
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeEditModal) return;
    const { total, letter } = calculateGradeMetrics(
      Number(gradeEditModal.internal1),
      Number(gradeEditModal.internal2),
      Number(gradeEditModal.labScore || 0),
      Number(gradeEditModal.assignmentScore)
    );
    const updated: AcademicGradeRecord = {
      ...gradeEditModal,
      totalPercentage: total,
      gradeLetter: letter,
    };
    updateGrade(updated);
    setGradeEditModal(null);
    setToastMessage(`Updated marks for ${updated.studentName} in ${updated.courseCode}!`);
  };

  const handleUploadMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCourseMaterial({
      courseCode: selectedCourse,
      courseName:
        courses.find((c) => c.code === selectedCourse)?.name || 'Computer Science Course',
      title: materialForm.title,
      description: materialForm.description,
      fileType: materialForm.fileType,
      fileSize: '3.4 MB',
      downloadUrl: '#',
      uploadedBy: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      unit: materialForm.unit,
      contentPreview: materialForm.contentPreview || 'Lecture notes prepared by faculty.',
    });
    setShowUploadModal(false);
    setMaterialForm({
      title: '',
      description: '',
      unit: 'Unit 3',
      fileType: 'pdf',
      contentPreview: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Live Attendance Marker
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'grades'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Academic Gradebook
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Course Materials & Upload
          </button>
          <button
            id="btn-faculty-ai-test-gen"
            onClick={() => setActiveTab('ai-test-gen')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ai-test-gen'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            AI Test Generator
          </button>
          <button
            id="btn-faculty-live-proctoring"
            onClick={() => setActiveTab('proctoring')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'proctoring'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Live Exam Proctoring
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      {/* TAB 1: LIVE ATTENDANCE MARKER */}
      {activeTab === 'attendance' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Select Subject
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    {courses.map((crs) => (
                      <option key={crs.id} value={crs.code}>
                        {crs.code} • {crs.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Class Date
                  </label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Period
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(Number(e.target.value))}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>Period 1 (09:00 - 10:00 AM)</option>
                    <option value={2}>Period 2 (10:15 - 11:15 AM)</option>
                    <option value={3}>Period 3 (11:30 - 12:30 PM)</option>
                    <option value={4}>Period 4 (01:30 - 02:30 PM)</option>
                    <option value={5}>Period 5 (02:45 - 03:45 PM)</option>
                  </select>
                </div>
              </div>

              {/* Attendance Quick Stats */}
              <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold block">PRESENT</span>
                  <span className="text-base font-extrabold text-emerald-600">{presentCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold block">ABSENT</span>
                  <span className="text-base font-extrabold text-red-600">{absentCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold block">LATE / OD</span>
                  <span className="text-base font-extrabold text-amber-600">{lateCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold block">RATE</span>
                  <span className="text-base font-extrabold text-indigo-600">
                    {currentBatchAttendanceRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Topic Input & Bulk Actions */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={topicCovered}
                  onChange={(e) => setTopicCovered(e.target.value)}
                  placeholder="Topic covered today (e.g. Asymptotic Notation, Red-Black Tree Rotations)..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => markAll('present')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll('absent')}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-200 transition"
                >
                  All Absent
                </button>
                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Attendance
                </button>
              </div>
            </div>
          </div>

          {/* Student Interactive Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Student Roll Call • {selectedCourse}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tap any status pill to toggle: Present → Absent → Late → On-Duty (OD)
                </p>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {studentsRoster.length} Students in Section A
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                    <th className="py-3 px-4">Roll No.</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Cumulative Attendance</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-center">Interactive Quick Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsRoster.map((student) => {
                    const currentStatus = attendanceMap[student.id] || 'present';
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {student.studentId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{student.name}</p>
                              <p className="text-[10px] text-slate-400">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                student.attendancePercent >= 75
                                  ? 'text-emerald-600'
                                  : student.attendancePercent >= 65
                                  ? 'text-amber-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {student.attendancePercent}%
                            </span>
                            {student.status === 'critical' && (
                              <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                &lt;75% Warning
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              currentStatus === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : currentStatus === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : currentStatus === 'late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {currentStatus === 'present' && <Check className="w-3 h-3" />}
                            {currentStatus === 'absent' && <X className="w-3 h-3" />}
                            {currentStatus === 'late' && <Clock className="w-3 h-3" />}
                            {currentStatus === 'od' && <Award className="w-3 h-3" />}
                            {currentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setAttendanceMap((prev) => ({ ...prev, [student.id]: 'present' }))
                              }
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              P
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setAttendanceMap((prev) => ({ ...prev, [student.id]: 'absent' }))
                              }
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                                currentStatus === 'absent'
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              A
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setAttendanceMap((prev) => ({ ...prev, [student.id]: 'late' }))
                              }
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                                currentStatus === 'late'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              L
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setAttendanceMap((prev) => ({ ...prev, [student.id]: 'od' }))
                              }
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                                currentStatus === 'od'
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              OD
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC GRADEBOOK */}
      {activeTab === 'grades' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Continuous Internal Evaluation (CIE) Gradebook
              </h3>
              <p className="text-xs text-slate-500">
                Manage IA-1, IA-2, Lab Practicals, and Assignment marks with automatic grade computation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Subject: CS301 (Algorithms)</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center">IA-1 (25)</th>
                    <th className="py-3 px-4 text-center">IA-2 (25)</th>
                    <th className="py-3 px-4 text-center">Assign (10)</th>
                    <th className="py-3 px-4 text-center">Lab (40)</th>
                    <th className="py-3 px-4 text-center">Total (100)</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grades.map((grd) => (
                    <tr key={grd.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {grd.studentName}
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {grd.studentId}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{grd.courseCode}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {grd.internal1}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {grd.internal2}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700">
                        {grd.assignmentScore}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700">{grd.labScore || 35}</td>
                      <td className="py-3 px-4 text-center font-extrabold text-indigo-700">
                        {grd.totalPercentage}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {grd.gradeLetter}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setGradeEditModal(grd)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
                        >
                          Edit Marks
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE MATERIALS PUBLISHER */}
      {activeTab === 'materials' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Publish Curriculum Materials & Offline Handbooks
              </h3>
              <p className="text-xs text-slate-500">
                Uploaded lecture notes and lab manuals are instantly cached for offline student review
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Upload New Material
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  PDF
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Unit 3: Dynamic Programming & Recurrences
                  </h4>
                  <p className="text-xs text-slate-500">CS301 • 4.8 MB • Published Sep 18, 2026</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contains optimal substructure proofs for 0/1 knapsack, Bellman-Ford shortest paths, and Floyd-Warshall DP.
              </p>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Available for Offline Download on Student App
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  CODE
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Lab Manual: Graph Traversal & Dijkstra
                  </h4>
                  <p className="text-xs text-slate-500">CS301 • 1.2 MB • Published Sep 15, 2026</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                C++ starter templates with adjacency list implementations and sample benchmark inputs.
              </p>
              <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Available for Offline Download on Student App
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grade Edit Modal */}
      {gradeEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Edit Marks: {gradeEditModal.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Subject: {gradeEditModal.courseCode} ({gradeEditModal.courseName})
            </p>

            <form onSubmit={handleSaveGrade} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    IA-1 (Max 25)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.5}
                    value={gradeEditModal.internal1}
                    onChange={(e) =>
                      setGradeEditModal({
                        ...gradeEditModal,
                        internal1: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    IA-2 (Max 25)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.5}
                    value={gradeEditModal.internal2}
                    onChange={(e) =>
                      setGradeEditModal({
                        ...gradeEditModal,
                        internal2: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assignment (Max 10)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={gradeEditModal.assignmentScore}
                    onChange={(e) =>
                      setGradeEditModal({
                        ...gradeEditModal,
                        assignmentScore: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lab / Practical (Max 40)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    step={0.5}
                    value={gradeEditModal.labScore || 0}
                    onChange={(e) =>
                      setGradeEditModal({
                        ...gradeEditModal,
                        labScore: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 mt-4">
                <button
                  type="button"
                  onClick={() => setGradeEditModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Upload Course Document</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add study material for {selectedCourse}. Files will be optimized for offline caching.
            </p>

            <form onSubmit={handleUploadMaterialSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  placeholder="e.g. Unit 4: Memory Management & Paging Notes"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Curriculum Unit
                  </label>
                  <select
                    value={materialForm.unit}
                    onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Unit 1">Unit 1: Fundamentals</option>
                    <option value="Unit 2">Unit 2: Core Architecture</option>
                    <option value="Unit 3">Unit 3: Advanced Topics</option>
                    <option value="Unit 4">Unit 4: Applications</option>
                    <option value="Laboratory">Laboratory & Practicals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    File Type
                  </label>
                  <select
                    value={materialForm.fileType}
                    onChange={(e: any) =>
                      setMaterialForm({ ...materialForm, fileType: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="code">Source Code / Lab (.cpp, .py)</option>
                    <option value="pptx">Slide Deck (.pptx)</option>
                    <option value="doc">Formula Sheet (.docx)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Summary
                </label>
                <textarea
                  value={materialForm.description}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, description: e.target.value })
                  }
                  placeholder="Brief summary of what this document covers..."
                  rows={2}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Content Preview / Summary Snippet
                </label>
                <textarea
                  value={materialForm.contentPreview}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, contentPreview: e.target.value })
                  }
                  placeholder="Text preview for student quick review in offline mode..."
                  rows={3}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4" />
                  Publish & Cache
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: FACULTY AI TEST GENERATOR */}
      {activeTab === 'ai-test-gen' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>TEACHER AI TEST STUDIO • GEMINI 3.8 FLASH</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Topic-to-Test AI Generator
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Type any syllabus unit or topic name (e.g., "Dynamic Programming", "Probability & Combinatorics", "TCS NQT Advanced Reasoning") or upload reference curriculum text. The Gemini AI engine will structure multiple-choice questions with step-by-step explanations and configure live webcam &amp; tab proctoring rules.
              </p>
            </div>

            <button
              onClick={() => setShowAiModal(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open AI Test Generator</span>
            </button>
          </div>

          {/* List of Created AI Assessments */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Faculty-Synthesized Assessments ({createdAssessments.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Ready for student dispatch with live proctoring telemetry
                </p>
              </div>
              <button
                onClick={() => setShowAiModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New AI Test</span>
              </button>
            </div>

            {createdAssessments.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No Custom AI Tests Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the button above to specify your course topic and let Gemini synthesize an assessment with live proctoring enforcement.
                </p>
                <button
                  onClick={() => setShowAiModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Generate First Test
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdAssessments.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                          AI Synthesized
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {a.durationMinutes} mins
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2">{a.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {a.questions?.length || a.totalQuestions} Questions
                      </span>
                      <button
                        onClick={() => setActiveTab('proctoring')}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldAlert className="w-3 h-3" />
                        <span>Live Monitor</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: LIVE EXAM PROCTORING */}
      {activeTab === 'proctoring' && <LiveProctoringConsole />}

      {/* Faculty AI Test Generator Modal */}
      <AiTestGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onTestPublished={(newTest) => {
          setCreatedAssessments((prev) => [newTest, ...prev]);
          setToastMessage(`Assessment "${newTest.title}" synthesized by Gemini & published with Live Proctoring!`);
        }}
      />
    </div>
  );
};
