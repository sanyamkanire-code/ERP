import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useERPData } from '../../context/ERPDataContext';
import { CourseMaterial, StudentFeeRecord } from '../../types/erp';
import { FeeReceiptModal } from './FeeReceiptModal';
import { NotificationsScreen } from '../notifications/NotificationsScreen';
import { GeofenceAttendanceTracker } from '../attendance/GeofenceAttendanceTracker';
import {
  Smartphone,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  Wifi,
  WifiOff,
  Bell,
  Clock,
  QrCode,
  Download,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ExternalLink,
  BookMarked,
  Shield,
  FileText,
  RotateCw,
  Maximize2,
  Minimize2,
  Search,
  X,
  Receipt,
  Printer,
  Building2,
  DollarSign,
  ArrowRight,
  MapPin,
  Radio,
  Navigation,
  Zap,
} from 'lucide-react';

export const StudentAndroidApp: React.FC = () => {
  const { currentUser, setViewMode } = useAuth();
  const {
    courses,
    grades,
    materials,
    events,
    toggleMaterialOfflineCache,
    toggleEventRSVP,
    isOfflineMode,
    toggleOfflineMode,
    feeRecords,
    defaultFeeStructure,
    payCollegeFee,
    notifications,
    geofenceZones,
    geofencedLogs,
  } = useERPData();

  // Android Bottom Bar Tabs
  const [activeTab, setActiveTab] = useState<
    'home' | 'attendance' | 'academics' | 'materials' | 'fees' | 'idcard'
  >('home');
  const [selectedMaterialForPreview, setSelectedMaterialForPreview] = useState<CourseMaterial | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Notification & Geofence Screens State
  const [showNotificationsScreen, setShowNotificationsScreen] = useState<boolean>(false);
  const [showGeofenceModal, setShowGeofenceModal] = useState<boolean>(false);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterType, setSearchFilterType] = useState<'all' | 'materials' | 'events'>('all');

  // Fee Payment & Receipt State
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<StudentFeeRecord | null>(null);
  const [isPayingFee, setIsPayingFee] = useState(false);
  const [feePaymentMethod, setFeePaymentMethod] = useState<'UPI' | 'Net Banking' | 'Debit Card'>('UPI');
  const [upiVpa, setUpiVpa] = useState('rahul.sharma@okaxis');

  // Filtered materials
  const offlineMaterials = materials.filter((m) => m.isCachedOffline);
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Current student Sem 5 fee record
  const currentSemFee =
    feeRecords.find((r) => r.studentId === currentUser.id && r.semester === 5) || feeRecords[0];

  // Dynamic search matching
  const matchingMaterials = materials.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.courseCode.toLowerCase().includes(q) ||
      m.courseName.toLowerCase().includes(q) ||
      m.unit.toLowerCase().includes(q) ||
      m.fileType.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  const matchingEvents = events.filter((e) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  });

  const handleMobileFeePay = () => {
    setIsPayingFee(true);
    setTimeout(() => {
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti fallback
      }

      const generated = payCollegeFee(
        currentSemFee ? currentSemFee.id : 'fee-rec-sem5',
        feePaymentMethod,
        currentSemFee?.items || defaultFeeStructure,
        8000
      );

      setIsPayingFee(false);
      setSelectedReceiptForModal(generated);
    }, 1200);
  };

  // Compute student attendance across subjects
  const studentAttendanceList = [
    { code: 'CS301', name: 'Algorithms', attended: 28, total: 32, pct: 87.5, status: 'safe' },
    { code: 'CS302', name: 'Operating Systems', attended: 26, total: 30, pct: 86.6, status: 'safe' },
    { code: 'CS303', name: 'DBMS & Cloud', attended: 24, total: 26, pct: 92.3, status: 'safe' },
    { code: 'CS304', name: 'DevOps & Software', attended: 25, total: 26, pct: 96.1, status: 'safe' },
    { code: 'EC204', name: 'Embedded Systems', attended: 19, total: 24, pct: 79.1, status: 'safe' },
  ];

  const overallAttendance = (
    studentAttendanceList.reduce((acc, curr) => acc + curr.pct, 0) /
    studentAttendanceList.length
  ).toFixed(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-4">
      {/* Top Banner with Device Frame Toggle & Info */}
      <div className="w-full max-w-4xl mb-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs sm:text-sm">
              Student Android App Experience (NexusEng Mobile)
            </span>
            <p className="text-[11px] text-slate-500">
              Designed specifically for engineering students with offline caching, live attendance & digital ID
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand to Full Width</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Phone Bezel Mode</span>
              </>
            )}
          </button>

          <button
            onClick={() => setViewMode('web')}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition"
          >
            Switch to Staff Web Portal
          </button>
        </div>
      </div>

      {/* Android Device Shell Container */}
      <div
        className={`transition-all duration-300 w-full ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-[48px] p-3.5 bg-slate-900 shadow-2xl ring-12 ring-slate-800'
            : 'max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden'
        }`}
      >
        {/* Device Inner Screen */}
        <div className="bg-slate-50 text-slate-900 rounded-[38px] overflow-hidden flex flex-col h-[780px] relative border border-slate-200/40">
          {/* Android Status Bar */}
          <div className="bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none">
            <span>09:41 AM</span>
            {/* Camera Punch Hole */}
            <div className="w-3.5 h-3.5 bg-black rounded-full ring-1 ring-slate-700" />
            <div className="flex items-center gap-2">
              {isOfflineMode ? (
                <div className="flex items-center gap-1 text-amber-400">
                  <WifiOff className="w-3 h-3" />
                  <span className="text-[9px]">Offline</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400">
                  <Wifi className="w-3 h-3" />
                  <span className="text-[9px]">5G</span>
                </div>
              )}
              <span className="font-mono text-[10px]">94%</span>
            </div>
          </div>

          {/* Android Top App Bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <h3 className="font-bold text-xs text-slate-900 leading-tight">
                  {currentUser.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  {currentUser.studentId} • Sem 5 CSE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleOfflineMode}
                title="Toggle Offline Simulator"
                className={`p-1.5 rounded-lg border text-xs transition cursor-pointer ${
                  isOfflineMode
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              </button>
              <button
                id="btn-student-notifications-bell"
                onClick={() => setShowNotificationsScreen(!showNotificationsScreen)}
                title="Open Notifications Screen"
                className={`p-1.5 rounded-lg border text-xs transition relative cursor-pointer ${
                  showNotificationsScreen
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Offline Banner if offline active */}
          {isOfflineMode && (
            <div className="bg-amber-500 text-white px-4 py-1.5 text-[11px] font-bold flex items-center justify-between shrink-0 shadow-inner">
              <span className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5" />
                Offline Mode: Accessing cached notes & materials
              </span>
              <button
                onClick={toggleOfflineMode}
                className="underline text-[10px] hover:text-amber-100"
              >
                Reconnect
              </button>
            </div>
          )}

          {/* NOTIFICATIONS SCREEN VIEW (When Bell Icon is active) */}
          {showNotificationsScreen ? (
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
              <NotificationsScreen
                isMobileContainer
                onClose={() => setShowNotificationsScreen(false)}
                onNavigateTab={(tab) => {
                  setShowNotificationsScreen(false);
                  if (tab === 'fees' || tab === 'finance-accounts') {
                    setActiveTab('fees');
                  } else if (tab === 'attendance') {
                    setActiveTab('attendance');
                    setShowGeofenceModal(true);
                  } else if (tab === 'materials') {
                    setActiveTab('materials');
                  } else if (tab === 'academics') {
                    setActiveTab('academics');
                  } else if (tab === 'events' || tab === 'idcard') {
                    setActiveTab('idcard');
                  } else {
                    setActiveTab('home');
                  }
                }}
              />
            </div>
          ) : (
            <>
              {/* SEARCH BAR AT TOP OF SCREEN (Filter Course Materials & Events) */}
              <div className="bg-white px-3.5 py-2.5 border-b border-slate-200 shrink-0 shadow-2xs">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    id="student-android-search-bar"
                    type="text"
                    placeholder="Search course materials, notes, symposiums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-100/90 text-xs text-slate-900 placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition border border-transparent focus:border-emerald-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick Filter Chips when typing */}
                {searchQuery && (
                  <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setSearchFilterType('all')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition shrink-0 ${
                        searchFilterType === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({matchingMaterials.length + matchingEvents.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchFilterType('materials')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition shrink-0 ${
                        searchFilterType === 'materials'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      Materials ({matchingMaterials.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchFilterType('events')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition shrink-0 ${
                        searchFilterType === 'events'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                      }`}
                    >
                      Events ({matchingEvents.length})
                    </button>
                  </div>
                )}
              </div>

              {/* SCROLLABLE MAIN CONTENT AREA */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* LIVE SEARCH RESULTS VIEW (Appears whenever search query is non-empty) */}
            {searchQuery.trim().length > 0 ? (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-extrabold text-slate-900">
                    Search Results for &quot;{searchQuery}&quot;
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[10px] text-emerald-700 font-bold hover:underline"
                  >
                    Clear Filter
                  </button>
                </div>

                {/* Course Materials Matching Section */}
                {(searchFilterType === 'all' || searchFilterType === 'materials') && (
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        Course Materials ({matchingMaterials.length})
                      </h4>
                    </div>

                    {matchingMaterials.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        No course materials match &quot;{searchQuery}&quot;
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {matchingMaterials.map((mat) => (
                          <div
                            key={mat.id}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-bold text-xs text-slate-900 block leading-tight">
                                  {mat.title}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {mat.courseCode} • {mat.unit} • {mat.fileSize}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase">
                                {mat.fileType}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {mat.description}
                            </p>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                              <button
                                onClick={() => setSelectedMaterialForPreview(mat)}
                                className="text-indigo-600 font-bold text-[10px] hover:underline"
                              >
                                Read Preview
                              </button>
                              <button
                                onClick={() => toggleMaterialOfflineCache(mat.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                                  mat.isCachedOffline
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                <Download className="w-3 h-3" />
                                {mat.isCachedOffline ? 'Cached' : 'Save Offline'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Campus Events Matching Section */}
                {(searchFilterType === 'all' || searchFilterType === 'events') && (
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        Campus Events &amp; Symposiums ({matchingEvents.length})
                      </h4>
                    </div>

                    {matchingEvents.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        No campus events match &quot;{searchQuery}&quot;
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {matchingEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {ev.title}
                                </span>
                                <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded uppercase shrink-0">
                                  {ev.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {ev.date} • {ev.venue} ({ev.organizer})
                              </p>
                            </div>

                            <button
                              onClick={() => toggleEventRSVP(ev.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 ${
                                ev.isRegistered
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                            >
                              {ev.isRegistered ? '✓ Registered' : 'RSVP'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            {/* TAB 1: HOME */}
            {!searchQuery && activeTab === 'home' && (
              <div className="space-y-4">
                {/* Hero Attendance & CGPA Snapshot Card */}
                <div className="bg-gradient-to-tr from-indigo-900 to-indigo-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">
                        Overall Attendance
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold">{overallAttendance}%</span>
                        <span className="text-xs font-semibold text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded-md">
                          Safe (&gt;75%)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">
                        CGPA
                      </span>
                      <p className="text-2xl font-black mt-1 text-emerald-300">8.85</p>
                    </div>
                  </div>

                  <div className="mt-3 w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${overallAttendance}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-indigo-200 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Eligible for End-Semester examinations
                  </p>
                </div>

                {/* Semester 5 Fee Payment & Auto-Receipt Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          College Fee Assessment
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">
                          Semester 5 Tuition &amp; Labs
                        </p>
                      </div>
                    </div>

                    {currentSemFee && currentSemFee.status === 'paid' ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        PAID &amp; VERIFIED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                        DUE: OCT 31
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Payable</span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">
                        ₹{(currentSemFee?.totalAmount || 73500).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Merit Concession</span>
                      <span className="font-mono text-emerald-600 font-bold text-xs">- ₹8,000 (8.85 CGPA)</span>
                    </div>
                  </div>

                  {currentSemFee && currentSemFee.status === 'paid' ? (
                    <button
                      onClick={() => setSelectedReceiptForModal(currentSemFee)}
                      className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View &amp; Print Official e-Receipt</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('fees')}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Pay College Fee &amp; Get Instant Receipt</span>
                    </button>
                  )}
                </div>

                {/* Apt-Tech Solutions Placement & CRT Card */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-4 text-white shadow-md space-y-3 border border-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          APT-Tech CRT &amp; Placements
                        </h4>
                        <p className="text-[10px] text-amber-300 font-medium">
                          Sanir Kittur Speed Math &amp; Mocks
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      PRI: 78%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    TCS NQT, Infosys &amp; Capgemini mock drives with Vedic shortcuts and instant rank
                    benchmarks.
                  </p>

                  <button
                    onClick={() => setViewMode('web')}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Launch Full Apt-Tech Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Today's Schedule Timetable */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      Today's Lecture Schedule
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold">Monday</span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">CS301 • Algorithms</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Present
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          09:00 AM - 10:00 AM • Turing Hall 302
                        </p>
                        <p className="text-[10px] text-indigo-700 font-medium mt-1">
                          Prof. Sarah Jenkins (Topic: Bellman-Ford)
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">CS303 • DBMS & Cloud</span>
                          <span className="text-[9px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                            Upcoming
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          01:30 PM - 03:00 PM • Ada Lovelace 101
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offline Course Materials Quick Access */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
                      Cached Offline Materials ({offlineMaterials.length})
                    </h4>
                    <button
                      onClick={() => setActiveTab('materials')}
                      className="text-[10px] font-bold text-indigo-600"
                    >
                      View All
                    </button>
                  </div>

                  <div className="mt-2.5 space-y-2">
                    {offlineMaterials.slice(0, 2).map((mat) => (
                      <div
                        key={mat.id}
                        onClick={() => setSelectedMaterialForPreview(mat)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {mat.fileType.toUpperCase()}
                          </div>
                          <div className="truncate">
                            <p className="text-[11px] font-bold text-slate-900 truncate">
                              {mat.title}
                            </p>
                            <p className="text-[9px] text-slate-500 font-mono">
                              {mat.courseCode} • {mat.fileSize}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                          Offline Ready
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campus Hackathon / Event Teaser */}
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-3.5 text-white shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase bg-purple-500/30 px-2 py-0.5 rounded text-purple-200">
                      National Hackathon
                    </span>
                    <h5 className="font-extrabold text-xs mt-1">HackNexus 2026: 36H Sprint</h5>
                    <p className="text-[10px] text-purple-200 mt-0.5">
                      Oct 14-15 • You are registered!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('idcard')}
                    className="px-2.5 py-1.5 bg-white text-purple-900 rounded-xl text-[10px] font-bold shadow-xs shrink-0"
                  >
                    View Pass
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ATTENDANCE DETAILS */}
            {activeTab === 'attendance' && (
              <div className="space-y-3.5">
                {/* LIVE GEOFENCED ATTENDANCE CHECK-IN (5-METER STRICT PERIMETER) */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Radio className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white tracking-tight">
                            Live Geofenced Attendance
                          </h4>
                          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                            5.0m Radius
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300">
                          Turing Hall 302 • CS301 (Algorithms)
                        </p>
                      </div>
                    </div>

                    <button
                      id="btn-open-geofence-radar"
                      onClick={() => setShowGeofenceModal(true)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Radar</span>
                    </button>
                  </div>

                  <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-200 text-[11px]">
                          GPS Proximity: ~2.1m from Beacon
                        </p>
                        <p className="text-[10px] text-emerald-400 font-medium">
                          ✓ Validated: Inside 5-Meter Perimeter
                        </p>
                      </div>
                    </div>
                    <button
                      id="btn-quick-geofence-checkin"
                      onClick={() => setShowGeofenceModal(true)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-xs transition cursor-pointer"
                    >
                      Mark Check-In
                    </button>
                  </div>

                  {geofencedLogs.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Recent Verified Attendance:</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {geofencedLogs[0].courseCode} • {geofencedLogs[0].timestamp}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    Subject-wise Attendance Health
                  </h4>
                  <p className="text-[10px] text-slate-500 mb-3">
                    Minimum 75% required per university autonomous regulations.
                  </p>

                  <div className="space-y-3">
                    {studentAttendanceList.map((sub) => (
                      <div key={sub.code} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800">
                            {sub.code} • {sub.name}
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
                            {sub.pct}% ({sub.attended}/{sub.total})
                          </span>
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

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Zero Attendance Deficit</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      You are in the green zone for all 5 subjects. You can safely take 2 casual leaves without breaching the 75% threshold.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ACADEMICS & GRADES */}
            {activeTab === 'academics' && (
              <div className="space-y-3.5">
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    Continuous Internal Evaluation (CIE)
                  </h4>
                  <p className="text-[10px] text-slate-500 mb-3">
                    Semester 5 Internal Assessments & Lab Practicals
                  </p>

                  <div className="space-y-2.5">
                    {grades.map((grd) => (
                      <div
                        key={grd.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/70"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-slate-900">
                              {grd.courseCode}
                            </span>
                            <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                              {grd.courseName}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded font-extrabold text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {grd.gradeLetter}
                            </span>
                            <span className="block text-[10px] font-bold text-slate-700 mt-0.5">
                              {grd.totalPercentage}%
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-center text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 block">IA-1</span>
                            <span className="font-bold text-slate-800">{grd.internal1}/25</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block">IA-2</span>
                            <span className="font-bold text-slate-800">{grd.internal2}/25</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block">Assign</span>
                            <span className="font-bold text-slate-800">
                              {grd.assignmentScore}/10
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block">Lab</span>
                            <span className="font-bold text-slate-800">{grd.labScore || 35}/40</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: OFFLINE MATERIALS & HANDBOOKS */}
            {activeTab === 'materials' && (
              <div className="space-y-3.5">
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-900">Course Materials & Offline Cache</h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {offlineMaterials.length} Cached
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-3">
                    Downloaded files are stored securely in local device memory for offline study.
                  </p>

                  <div className="space-y-2.5">
                    {materials.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {mat.fileType.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-slate-900 leading-tight">
                                {mat.title}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {mat.courseCode} • {mat.unit} • {mat.fileSize}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {mat.description}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => setSelectedMaterialForPreview(mat)}
                            className="text-indigo-600 font-bold text-[11px] hover:underline"
                          >
                            Read Document Preview
                          </button>
                          <button
                            onClick={() => toggleMaterialOfflineCache(mat.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                              mat.isCachedOffline
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                            }`}
                          >
                            <Download className="w-3 h-3" />
                            {mat.isCachedOffline ? 'Downloaded (Offline)' : 'Save Offline'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: FEES & AUTO-GENERATED RECEIPT */}
            {activeTab === 'fees' && (
              <div className="space-y-3.5">
                {/* Semester Fee Overview Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Semester 5 • 2024-2025
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        Institutional Fee Assessment
                      </h4>
                    </div>
                    {currentSemFee && currentSemFee.status === 'paid' ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        PAID &amp; RECONCILED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                        DUE: OCT 31, 2024
                      </span>
                    )}
                  </div>

                  {/* Fee Calculation Breakdown */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Approved Fee Structure
                    </p>
                    <div className="space-y-1.5 text-xs">
                      {(currentSemFee?.items || defaultFeeStructure).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-slate-600">
                          <span className="text-[11px] truncate max-w-[200px]">{item.name}</span>
                          <span className="font-mono font-medium text-slate-900">
                            ₹{item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Gross Assessment</span>
                        <span className="font-mono">₹73,500</span>
                      </div>
                      <div className="flex justify-between text-xs text-emerald-600 font-medium">
                        <span>Dean&apos;s Merit Scholarship (CGPA 8.85)</span>
                        <span className="font-mono font-bold">- ₹8,000</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                        <span>Net Payable</span>
                        <span className="font-mono text-indigo-700 text-base">
                          ₹{(currentSemFee?.totalAmount || 65500).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Gateway or Paid Confirmation */}
                  {currentSemFee && currentSemFee.status === 'paid' ? (
                    <div className="space-y-2.5">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900 leading-tight">
                            Payment Settled Successfully
                          </p>
                          <p className="text-[10px] text-emerald-700 mt-0.5">
                            Transaction Ref: {currentSemFee.transactionId} • Receipt #{currentSemFee.receiptNumber}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-mono mt-1">
                            Dispatched &amp; confirmed in Finance Dept ledger
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedReceiptForModal(currentSemFee)}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-emerald-400" />
                        <span>View &amp; Print Official e-Receipt</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1.5">
                          Select Payment Mode
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['UPI', 'Net Banking', 'Debit Card'] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setFeePaymentMethod(method)}
                              className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition ${
                                feePaymentMethod === method
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      {feePaymentMethod === 'UPI' && (
                        <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-indigo-900 block">
                            UPI ID / Virtual Payment Address
                          </span>
                          <input
                            type="text"
                            value={upiVpa}
                            onChange={(e) => setUpiVpa(e.target.value)}
                            className="w-full bg-white border border-indigo-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                            placeholder="username@okhdfcbank"
                          />
                          <p className="text-[9px] text-indigo-600">
                            Fast UPI approval with real-time receipt dispatch
                          </p>
                        </div>
                      )}

                      <button
                        onClick={handleMobileFeePay}
                        disabled={isPayingFee}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {isPayingFee ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing &amp; Reconciling...</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4" />
                            <span>Pay ₹{(currentSemFee?.totalAmount || 65500).toLocaleString()} &amp; Get Receipt</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* College Fee Receipts Archive */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                      Official Fee Receipts History
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {feeRecords.filter((r) => r.studentId === currentUser.id && r.status === 'paid').length} Paid
                    </span>
                  </div>

                  <div className="space-y-2">
                    {feeRecords
                      .filter((r) => r.studentId === currentUser.id)
                      .map((rec) => (
                        <div
                          key={rec.id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">
                                Semester {rec.semester}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  rec.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {rec.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {rec.receiptNumber} • {rec.paymentDate || 'Pending'}
                            </p>
                            <p className="text-[10px] font-bold text-slate-700">
                              ₹{(rec.paidAmount || rec.totalAmount).toLocaleString()} via {rec.paymentMethod || 'Portal'}
                            </p>
                          </div>

                          {rec.status === 'paid' ? (
                            <button
                              onClick={() => setSelectedReceiptForModal(rec)}
                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Printer className="w-3 h-3" />
                              <span>Receipt</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleMobileFeePay();
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: DIGITAL STUDENT ID CARD & EVENTS */}
            {activeTab === 'idcard' && (
              <div className="space-y-4">
                {/* Official College ID Card */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 shadow-xl border border-indigo-500/30 relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                      <span className="font-extrabold text-xs tracking-wider uppercase">
                        Nexus Institute of Technology
                      </span>
                    </div>
                    <span className="text-[9px] font-bold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/40">
                      ACTIVE STUDENT
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400"
                    />
                    <div>
                      <h3 className="font-extrabold text-base">{currentUser.name}</h3>
                      <p className="font-mono text-xs text-indigo-300 font-bold">
                        {currentUser.studentId}
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        B.Tech Computer Science (2023 - 2027)
                      </p>
                      <p className="text-[10px] text-slate-400">Valid through: June 2027</p>
                    </div>
                  </div>

                  {/* Dynamic QR Code for Gate & Library Access */}
                  <div className="mt-5 bg-white p-3 rounded-2xl flex items-center justify-between text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-slate-100 rounded-xl">
                        <QrCode className="w-10 h-10 text-slate-900" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">
                          Contactless Turnstile Pass
                        </span>
                        <span className="font-mono text-xs font-extrabold text-indigo-900">
                          {currentUser.studentId}#AUTH_FERPA
                        </span>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                </div>

                {/* Campus Events & Hackathon RSVP */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 mb-2">
                    Campus Symposiums & Hackathons
                  </h4>
                  <div className="space-y-2.5">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-xs text-slate-900">{ev.title}</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {ev.date} • {ev.venue}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleEventRSVP(ev.id)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                            ev.isRegistered
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {ev.isRegistered ? '✓ Registered' : 'RSVP'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

          {/* ANDROID BOTTOM NAVIGATION BAR */}
          <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shrink-0 select-none shadow-lg">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeTab === 'home'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeTab === 'attendance'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="text-[10px]">Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab('academics')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                activeTab === 'academics'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="text-[10px]">Grades</span>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition relative ${
                activeTab === 'materials'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px]">Offline</span>
              {offlineMaterials.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-2" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                activeTab === 'fees'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span className="text-[10px]">Fees</span>
            </button>

            <button
              onClick={() => setActiveTab('idcard')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                activeTab === 'idcard'
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[10px]">ID &amp; Events</span>
            </button>
          </div>

          {/* Android Gesture Bar */}
          <div className="bg-white py-1 flex justify-center shrink-0">
            <div className="w-24 h-1 bg-slate-300 rounded-full" />
          </div>
        </div>
      </div>

      {/* Document Reader Preview Modal (Simulates Offline Reader) */}
      {selectedMaterialForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {isOfflineMode ? '📶 Cached Offline Reader' : '🌐 Secure Campus Reader'}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">
                  {selectedMaterialForPreview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMaterialForPreview(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>Course: {selectedMaterialForPreview.courseCode}</span>
                <span>Uploaded by: {selectedMaterialForPreview.uploadedBy}</span>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs max-h-60 overflow-y-auto leading-relaxed border border-slate-800">
                <p className="text-indigo-400 font-bold mb-2">
                  // {selectedMaterialForPreview.unit} Study Extract
                </p>
                {selectedMaterialForPreview.contentPreview}
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {selectedMaterialForPreview.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Encrypted at rest (AES-256)
              </span>
              <button
                onClick={() => setSelectedMaterialForPreview(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Fee Receipt Modal */}
      {selectedReceiptForModal && (
        <FeeReceiptModal
          receipt={selectedReceiptForModal}
          onClose={() => setSelectedReceiptForModal(null)}
        />
      )}

      {/* Live Geofence Attendance Tracker Modal */}
      {showGeofenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl">
            <GeofenceAttendanceTracker onClose={() => setShowGeofenceModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
