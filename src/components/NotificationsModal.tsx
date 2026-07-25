import React, { useState } from 'react';
import { AppNotification } from '../types';
import { Bell, X, Check, Trash2, CheckCircle2, AlertTriangle, AlertCircle, Info, CheckCheck, Sparkles, Filter } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts' | 'pipeline'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'alerts') return n.type === 'warning' || n.type === 'error';
    if (filter === 'pipeline') return n.stage !== undefined;
    return true;
  });

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  const getTypeBadgeStyle = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'error':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      default:
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse border-2 border-slate-900" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white">Pipeline Notifications & Alerts</h3>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                    {unreadCount} New
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full">
                    All Read
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time execution updates, system alerts, and pipeline milestones.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation Bar */}
        <div className="p-3 border-b border-white/10 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center space-x-1 ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>All</span>
              <span className="px-1.5 py-0.2 bg-white/10 rounded-full text-[10px]">{notifications.length}</span>
            </button>

            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center space-x-1 ${
                filter === 'unread'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded-full text-[10px] font-bold">{unreadCount}</span>
              )}
            </button>

            <button
              onClick={() => setFilter('alerts')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center space-x-1 ${
                filter === 'alerts'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Alerts & Warnings</span>
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full text-[10px]">
                {notifications.filter((n) => n.type === 'warning' || n.type === 'error').length}
              </span>
            </button>

            <button
              onClick={() => setFilter('pipeline')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center space-x-1 ${
                filter === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Pipeline Stages</span>
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-slate-950/40 border border-white/5 rounded-2xl p-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Bell className="w-6 h-6 text-slate-500" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">No Notifications</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No notifications match your current filter. Real-time updates will automatically populate during campaign execution.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                  notification.read
                    ? 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-950/70'
                    : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200 hover:bg-indigo-950/50 shadow-md'
                }`}
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="mt-0.5">{getTypeIcon(notification.type)}</div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-xs font-bold ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                        {notification.title}
                      </h4>
                      {notification.stage && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getTypeBadgeStyle(notification.type)}`}>
                          Stage {notification.stage}
                        </span>
                      )}
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300 break-words">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-slate-500 block pt-0.5">
                      {notification.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNotification(notification.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          {notifications.length > 0 ? (
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Notifications</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
