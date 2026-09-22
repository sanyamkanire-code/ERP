import React, { useEffect } from 'react';
import { useERPData } from '../../context/ERPDataContext';
import { Bell, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, setToastMessage } = useERPData();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce-in shadow-2xl">
      <div className="bg-slate-900 border border-slate-700 text-white p-4 rounded-xl flex items-start gap-3 shadow-indigo-900/20 backdrop-blur-md">
        <div className="p-2 bg-indigo-600/30 text-indigo-400 rounded-lg shrink-0 mt-0.5">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 text-sm">
          <p className="font-semibold text-slate-200">Campus Notification</p>
          <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{toastMessage}</p>
        </div>
        <button
          onClick={() => setToastMessage(null)}
          className="text-slate-400 hover:text-white p-1 rounded transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
