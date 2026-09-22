import React, { useState, useMemo } from 'react';
import { useERPData } from '../../context/ERPDataContext';
import { NotificationItem } from '../../types/erp';
import {
  Bell,
  GraduationCap,
  Receipt,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Check,
  RotateCcw,
  Trash2,
  Search,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface NotificationsScreenProps {
  onClose?: () => void;
  onNavigateTab?: (tab: string) => void;
  isMobileContainer?: boolean;
}

type NotificationCategory = 'all' | 'unread' | 'academic' | 'fee' | 'event' | 'attendance';

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onClose,
  onNavigateTab,
  isMobileContainer = false,
}) => {
  const {
    notifications,
    toggleNotificationRead,
    markNotificationAsRead,
    markNotificationAsUnread,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useERPData();

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (activeCategory === 'unread' && item.read) return false;
      if (activeCategory === 'academic' && item.type !== 'academic') return false;
      if (activeCategory === 'fee' && item.type !== 'fee' && item.type !== 'finance') return false;
      if (activeCategory === 'event' && item.type !== 'event') return false;
      if (activeCategory === 'attendance' && item.type !== 'attendance') return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMessage = item.message.toLowerCase().includes(query);
        const matchesDetails = item.details?.toLowerCase().includes(query);
        return matchesTitle || matchesMessage || matchesDetails;
      }

      return true;
    });
  }, [notifications, activeCategory, searchQuery]);

  const handleActionClick = (notif: NotificationItem) => {
    // Mark as read when action taken
    markNotificationAsRead(notif.id);

    if (notif.actionTab && onNavigateTab) {
      onNavigateTab(notif.actionTab);
      if (onClose) onClose();
    } else if (notif.linkTab && onNavigateTab) {
      onNavigateTab(notif.linkTab);
      if (onClose) onClose();
    }
  };

  const getCategoryIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case 'fee':
      case 'finance':
        return <Receipt className="w-4 h-4 text-emerald-600" />;
      case 'event':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'attendance':
        return <MapPin className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'fee':
      case 'finance':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'event':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'attendance':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getCategoryLabel = (type: NotificationItem['type']) => {
    switch (type) {
      case 'academic':
        return 'Academic Alert';
      case 'fee':
      case 'finance':
        return 'Fee Reminder';
      case 'event':
        return 'Campus Event';
      case 'attendance':
        return 'Geofence / Attendance';
      default:
        return 'System Circular';
    }
  };

  return (
    <div
      id="notifications-screen-container"
      className={`flex flex-col bg-slate-50 min-h-full ${
        isMobileContainer ? 'h-full' : 'max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200'
      }`}
    >
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3.5 sm:px-6 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {onClose && (
              <button
                id="btn-close-notifications"
                onClick={onClose}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Notification Center
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Academic alerts, fee payment reminders &amp; live geofence updates
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {unreadCount > 0 && (
              <button
                id="btn-mark-all-read"
                onClick={markAllNotificationsAsRead}
                className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition flex items-center gap-1 cursor-pointer border border-indigo-100"
                title="Mark all notifications as read"
              >
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-notifications"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts, dues, exams, geofence check-ins..."
            className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 pb-1 -mx-2 px-2 text-xs">
          <button
            id="tab-notif-all"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition text-xs flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Alerts</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeCategory === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {notifications.length}
            </span>
          </button>

          <button
            id="tab-notif-unread"
            onClick={() => setActiveCategory('unread')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition text-xs flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'unread'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === 'unread' ? 'bg-indigo-800 text-white' : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            id="tab-notif-academic"
            onClick={() => setActiveCategory('academic')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition text-xs flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'academic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic</span>
          </button>

          <button
            id="tab-notif-fee"
            onClick={() => setActiveCategory('fee')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition text-xs flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'fee'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Fee Reminders</span>
          </button>

          <button
            id="tab-notif-event"
            onClick={() => setActiveCategory('event')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition text-xs flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'event'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Events</span>
          </button>

          <button
            id="tab-notif-attendance"
            onClick={() => setActiveCategory('attendance')}
            className={`px-3 py-1 rounded-xl font-bold shrink-0 transition text-xs flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'attendance'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Geofence</span>
          </button>
        </div>
      </div>

      {/* Scrollable Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">All Caught Up!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {activeCategory === 'unread'
                  ? 'No unread alerts. You have reviewed all college circulars, fee updates, and academic notifications.'
                  : 'No notifications found matching your current filter criteria.'}
              </p>
            </div>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              id={`notification-card-${notif.id}`}
              className={`rounded-2xl transition border transition-all ${
                !notif.read
                  ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-500/10'
                  : 'bg-white/80 hover:bg-white border-slate-200/90'
              } p-4 relative group`}
            >
              <div className="flex items-start gap-3">
                {/* Category & Status Indicator Icon */}
                <div className="shrink-0 mt-0.5 relative">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${getCategoryBg(
                      notif.type
                    )}`}
                  >
                    {getCategoryIcon(notif.type)}
                  </div>
                  {!notif.read && (
                    <span
                      title="Unread notification"
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryBg(
                          notif.type
                        )}`}
                      >
                        {getCategoryLabel(notif.type)}
                      </span>

                      {notif.priority === 'urgent' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Urgent
                        </span>
                      )}

                      {notif.priority === 'high' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          Priority
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{notif.timestamp}</span>
                    </div>
                  </div>

                  <h3
                    className={`text-sm tracking-tight leading-snug ${
                      !notif.read ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-800'
                    }`}
                  >
                    {notif.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {/* Optional Detailed payload */}
                  {notif.details && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 font-mono">
                      {notif.details}
                    </div>
                  )}

                  {/* Actions & Status Controls */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    {/* Primary Action Button */}
                    <div>
                      {notif.actionLabel ? (
                        <button
                          onClick={() => handleActionClick(notif)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                            notif.type === 'fee' || notif.type === 'finance'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : notif.type === 'academic'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : notif.type === 'attendance'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span>{notif.actionLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : notif.linkTab ? (
                        <button
                          onClick={() => handleActionClick(notif)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          Official Campus Notice
                        </span>
                      )}
                    </div>

                    {/* Status Toggle & Delete Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-toggle-read-${notif.id}`}
                        onClick={() => toggleNotificationRead(notif.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer border ${
                          notif.read
                            ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                        }`}
                        title={notif.read ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {notif.read ? (
                          <>
                            <RotateCcw className="w-3 h-3" />
                            <span className="hidden sm:inline">Mark unread</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Mark read</span>
                          </>
                        )}
                      </button>

                      <button
                        id={`btn-delete-notif-${notif.id}`}
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Dismiss notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 text-center text-[10px] text-slate-400 flex items-center justify-between shrink-0 font-mono">
        <span>Campus Push Dispatch • Real-time Socket Connected</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Synced
        </span>
      </div>
    </div>
  );
};
