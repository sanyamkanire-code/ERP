import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useERPData } from '../../context/ERPDataContext';
import { UserRole } from '../../types/erp';
import {
  GraduationCap,
  ShieldCheck,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Bell,
  CheckCircle2,
  Lock,
  ChevronDown,
  Sparkles,
  Info,
  Receipt,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { NotificationsScreen } from '../notifications/NotificationsScreen';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, currentRole, switchRole, encryptionMeta, viewMode, setViewMode } = useAuth();
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    isOfflineMode,
    toggleOfflineMode,
  } = useERPData();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showFullNotifModal, setShowFullNotifModal] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* College Identity & Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tracking-tight text-lg leading-none">
                    Nexus<span className="text-indigo-600">Eng</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded">
                    ERP Campus
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Autonomous Institute of Engineering & Technology
                </p>
              </div>
            </div>

            {/* Quick Role Switcher (Crucial for Reviewing Staff Web vs Student App) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 hidden md:inline-block">
                Active Role:
              </span>
              <button
                id="role-btn-admin"
                onClick={() => switchRole('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentRole === 'admin'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
              <button
                id="role-btn-faculty"
                onClick={() => switchRole('faculty')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentRole === 'faculty'
                    ? 'bg-white text-indigo-700 shadow-xs font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Faculty</span>
              </button>
              <button
                id="role-btn-student"
                onClick={() => switchRole('student')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentRole === 'student'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Student</span>
                {currentRole === 'student' && (
                  <span className="text-[9px] bg-emerald-700 px-1 rounded text-white font-medium">App</span>
                )}
              </button>
            </div>

            {/* View Mode & Tools */}
            <div className="flex items-center gap-2">
              {/* Android App Toggle for Student mode */}
              {currentRole === 'student' && (
                <button
                  id="view-toggle-btn"
                  onClick={() => setViewMode(viewMode === 'android' ? 'web' : 'android')}
                  title="Toggle between Student Android App view and Full Web view"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                    viewMode === 'android'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {viewMode === 'android' ? (
                    <>
                      <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">Android Frame</span>
                    </>
                  ) : (
                    <>
                      <Monitor className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Web Portal</span>
                    </>
                  )}
                </button>
              )}

              {/* Offline Mode Simulator Button */}
              <button
                id="offline-sim-btn"
                onClick={toggleOfflineMode}
                title="Simulate offline network condition to verify offline course materials access"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                  isOfflineMode
                    ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isOfflineMode ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                    <span className="hidden sm:inline font-bold">Offline Active</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline text-slate-600">Online Sync</span>
                  </>
                )}
              </button>

              {/* Apt-Tech Solutions CRT & Placement Button */}
              <button
                id="navbar-apttech-btn"
                onClick={() => setActiveTab('apttech')}
                title="APT-Tech Solutions: Campus Recruitment Training, Vedic Math & Mock Tests"
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'apttech'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">APT-Tech CRT</span>
                <span className="px-1.5 py-0.2 rounded-md bg-amber-200/80 text-[10px] font-mono font-bold text-amber-950 hidden sm:inline">
                  PRI 78%
                </span>
              </button>

              {/* Security & Encryption Status Button */}
              <button
                id="security-info-btn"
                onClick={() => setShowSecurityModal(true)}
                title="View Database Encryption & Auth Details"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 transition"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>AES-256</span>
              </button>

              {/* Notification Center */}
              <div className="relative">
                <button
                  id="notif-bell-btn"
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
                  aria-label="Campus Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">Campus Alerts</h4>
                        <span className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                          {unreadNotifs.length} unread
                        </span>
                      </div>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.linkTab) setActiveTab(notif.linkTab);
                              setShowNotifMenu(false);
                            }}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex gap-3 ${
                              !notif.read ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">
                              {notif.type === 'attendance' ? (
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              ) : notif.type === 'academic' ? (
                                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                                  <GraduationCap className="w-4 h-4" />
                                </div>
                              ) : notif.type === 'finance' ? (
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                  <Receipt className="w-4 h-4" />
                                </div>
                              ) : notif.type === 'event' ? (
                                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                                  <Bell className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 leading-tight">
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {notif.timestamp}
                              </span>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-slate-100 bg-slate-50/80 rounded-b-2xl">
                      <button
                        onClick={() => {
                          setShowNotifMenu(false);
                          setShowFullNotifModal(true);
                        }}
                        className="w-full py-1.5 px-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Open Notifications Center</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {currentUser.role === 'admin'
                      ? 'Administrator'
                      : currentUser.role === 'faculty'
                      ? 'Faculty • CSE'
                      : `${currentUser.studentId} • Sem 5`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Security & Encryption Information Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Campus Data Privacy & Security</h3>
                  <p className="text-xs text-slate-500">FERPA / GDPR Academic Compliance Architecture</p>
                </div>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Encryption Standard:</span>
                  <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {encryptionMeta.algorithm}
                  </span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Session JWT Token:</span>
                  <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {encryptionMeta.sessionToken}
                  </span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Key Fingerprint:</span>
                  <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {encryptionMeta.keyFingerprint}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Role-Based Access Control (RBAC):
                </h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Student records, IA internal scores, and attendance registers are strictly cryptographically segregated. Faculty can only post assessments for their authorized courses, and students have read-only access to published gradebooks.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 text-amber-600" />
                  Offline Storage Protection:
                </h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Downloaded course materials and study handbooks cached in the student's device are encrypted at rest with local integrity validation.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowSecurityModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Notifications Screen Modal */}
      {showFullNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl">
            <NotificationsScreen
              onClose={() => setShowFullNotifModal(false)}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                setShowFullNotifModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
