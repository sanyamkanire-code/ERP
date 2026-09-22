import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  MessageSquare,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Building2,
  BookOpen,
  Smartphone,
  Shield,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, currentUser, setViewMode } = useAuth();

  const getNavItems = () => {
    if (currentRole === 'admin') {
      return [
        { id: 'admin-dashboard', label: 'Admin Overview', icon: LayoutDashboard },
        { id: 'apttech', label: 'APT-Tech Placement (CRT)', icon: Zap },
        { id: 'departments', label: 'Departments & HODs', icon: Building2 },
        { id: 'faculty-dir', label: 'Faculty Directory', icon: Users },
        { id: 'analytics-report', label: 'Monthly Analytics', icon: BarChart3 },
        { id: 'events', label: 'Campus Events & Drives', icon: Calendar },
        { id: 'collaboration', label: 'Classrooms & Broadcasts', icon: MessageSquare },
        { id: 'materials', label: 'Curriculum Repository', icon: BookOpen },
      ];
    } else if (currentRole === 'faculty') {
      return [
        { id: 'faculty-attendance', label: 'Live Attendance Marker', icon: CalendarCheck },
        { id: 'faculty-grades', label: 'Academic Gradebook', icon: GraduationCap },
        { id: 'apttech', label: 'APT-Tech Placement Prep', icon: Zap },
        { id: 'collaboration', label: 'Remote Classrooms (AptTech)', icon: MessageSquare },
        { id: 'materials', label: 'Course Materials Hub', icon: FileText },
        { id: 'analytics-report', label: 'Monthly Class Analytics', icon: BarChart3 },
        { id: 'events', label: 'Campus Events & RSVPs', icon: Calendar },
      ];
    } else {
      // Student in web mode
      return [
        { id: 'student-portal', label: 'Student Dashboard', icon: LayoutDashboard },
        { id: 'apttech', label: 'APT-Tech CRT & Mocks', icon: Zap },
        { id: 'student-attendance', label: 'My Attendance Radar', icon: CalendarCheck },
        { id: 'student-grades', label: 'Internal Marks & CGPA', icon: GraduationCap },
        { id: 'collaboration', label: 'Classroom Discussions', icon: MessageSquare },
        { id: 'materials', label: 'Offline Study Hub', icon: BookOpen },
        { id: 'events', label: 'Campus Events & Clubs', icon: Calendar },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between py-5 px-3 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Card */}
        <div className="px-3 py-3 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/40 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-indigo-700 font-semibold truncate">
                {currentUser.role === 'admin'
                  ? 'Administrator'
                  : currentUser.role === 'faculty'
                  ? currentUser.designation || 'Faculty'
                  : `B.Tech ${currentUser.departmentCode} • Sem ${currentUser.semester}`}
              </p>
            </div>
          </div>
          {currentRole === 'student' && (
            <button
              onClick={() => setViewMode('android')}
              className="mt-2.5 w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Switch to Android App View
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {currentRole.toUpperCase()} WORKSPACE
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* College Info & Security Footnote */}
      <div className="pt-4 border-t border-slate-100 px-3 space-y-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Nexus College ERP v4.2</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          End-to-end encrypted academic records & real-time attendance system.
        </p>
      </div>
    </aside>
  );
};
