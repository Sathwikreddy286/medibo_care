import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, markAllAlertsRead, unreadAlertCount, acknowledgeAlert, setActiveTab } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string, severity: string) => {
    if (severity === 'critical') return <AlertCircle className="w-4 h-4 text-rose-600" />;
    if (severity === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <Info className="w-4 h-4 text-brand-600" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-charcoal-600 hover:text-charcoal-900 hover:border-brand-300 transition-colors"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadAlertCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadAlertCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-elevated z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-charcoal-900">Notifications & Alerts</span>
              {unreadAlertCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">
                  {unreadAlertCount} new
                </span>
              )}
            </div>
            {unreadAlertCount > 0 && (
              <button
                onClick={markAllAlertsRead}
                className="text-xs text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-charcoal-400">
                No active notifications
              </div>
            ) : (
              alerts.slice(0, 6).map(alert => (
                <div
                  key={alert.id}
                  className={`p-3.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3 ${
                    !alert.read_status ? 'bg-purple-50/30' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1 rounded-lg bg-slate-100">
                    {getIcon(alert.type, alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-charcoal-900 truncate">{alert.title}</p>
                      <span className="text-[10px] text-charcoal-400">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed">{alert.message}</p>
                    {!alert.acknowledged && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2 py-1 text-[11px] font-medium rounded-md bg-white border border-slate-200 text-charcoal-700 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-200"
                        >
                          Acknowledge
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
            <button
              onClick={() => {
                setActiveTab('alerts');
                setIsOpen(false);
              }}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900"
            >
              View All Alerts & Hardware Logs →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
