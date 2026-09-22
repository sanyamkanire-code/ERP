import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ERPDataProvider } from './context/ERPDataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/layout/Toast';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FacultyPortal } from './components/faculty/FacultyPortal';
import { StudentAndroidApp } from './components/student/StudentAndroidApp';
import { StudentWebPortal } from './components/student/StudentWebPortal';
import { CampusChatRoom } from './components/collaboration/CampusChatRoom';
import { MonthlyAnalyticsReport } from './components/analytics/MonthlyAnalyticsReport';
import { EventManagement } from './components/events/EventManagement';
import { OfflineMaterialsHub } from './components/materials/OfflineMaterialsHub';
import { NotificationsScreen } from './components/notifications/NotificationsScreen';
import { GeofenceAttendanceTracker } from './components/attendance/GeofenceAttendanceTracker';
import { ApttechHub } from './components/apttech/ApttechHub';

const MainLayout: React.FC = () => {
  const { currentRole, viewMode } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('admin-dashboard');

  // Handle URL parameter ?is_new_user=true on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('is_new_user') === 'true') {
      setActiveTab('apttech');
      return;
    }

    if (currentRole === 'admin') {
      setActiveTab('admin-dashboard');
    } else if (currentRole === 'faculty') {
      setActiveTab('faculty-attendance');
    } else {
      setActiveTab('student-portal');
    }
  }, [currentRole]);

  // If Student role with Android app mode requested:
  const isStudentAndroidView = currentRole === 'student' && viewMode === 'android';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      {isStudentAndroidView ? (
        // Dedicated Student Android Application Simulation
        <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
          <StudentAndroidApp />
        </main>
      ) : (
        // Web Application for Staff & Desktop Portal
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 p-6 lg:p-8 overflow-y-auto min-h-[calc(100vh-4rem)]">
            {/* Admin Tabs */}
            {activeTab === 'admin-dashboard' && <AdminDashboard setActiveTab={setActiveTab} />}
            {activeTab === 'departments' && <AdminDashboard setActiveTab={setActiveTab} />}
            {activeTab === 'faculty-dir' && <AdminDashboard setActiveTab={setActiveTab} />}

            {/* Faculty Tabs */}
            {activeTab === 'faculty-attendance' && (
              <FacultyPortal initialSubTab="attendance" />
            )}
            {activeTab === 'faculty-grades' && (
              <FacultyPortal initialSubTab="grades" />
            )}

            {/* Student Web Portal Tabs */}
            {(activeTab === 'student-portal' ||
              activeTab === 'student-attendance' ||
              activeTab === 'student-grades') && (
              <StudentWebPortal setActiveTab={setActiveTab} />
            )}

            {/* Common Unified Modules */}
            {activeTab === 'apttech' && <ApttechHub />}
            {activeTab === 'collaboration' && <CampusChatRoom />}
            {activeTab === 'analytics-report' && <MonthlyAnalyticsReport />}
            {activeTab === 'events' && <EventManagement />}
            {activeTab === 'materials' && <OfflineMaterialsHub />}
            {activeTab === 'notifications' && (
              <NotificationsScreen onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === 'geofence-attendance' && <GeofenceAttendanceTracker />}
          </main>
        </div>
      )}

      {/* Floating Alert Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ERPDataProvider>
        <MainLayout />
      </ERPDataProvider>
    </AuthProvider>
  );
}
