import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCheck,
  Check,
  Volume2,
  VolumeX,
  Filter,
  Trash2,
  PhoneCall,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { serialService } from '../../services/serialService';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, markAllAlertsRead, unreadAlertCount, patient } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Alerts' },
    { id: 'medication', label: 'Medication' },
    { id: 'health', label: 'Health Vitals' },
    { id: 'device', label: 'Device & Hardware' },
    { id: 'inventory', label: 'Inventory Refill' }
  ];

  const filteredAlerts = alerts.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.type === selectedCategory;
  });

  const handleTestBuzzer = () => {
    setIsPlayingAudio(true);
    serialService.playAlertSound();
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Critical
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Warning
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            <Info className="w-3.5 h-3.5" /> Notice
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <BellRing className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">System Alerts & Notifications</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Real-time event logging from the 8051 RTC alarm, missed dose detectors, and Galaxy Watch 5 Pro vitals.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            onClick={handleTestBuzzer}
            disabled={isPlayingAudio}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-brand-800 hover:bg-purple-100 border border-purple-200/80 text-xs font-semibold transition-colors"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-brand-700' : ''}`} />
            {isPlayingAudio ? 'Sounding Buzzer...' : 'Test Hardware Buzzer'}
          </button>

          {unreadAlertCount > 0 && (
            <button
              onClick={markAllAlertsRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-xs font-semibold shadow-xs transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Acknowledge All ({unreadAlertCount})
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => {
          const count = alerts.filter(a => (cat.id === 'all' ? true : a.type === cat.id) && !a.acknowledged).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-white text-charcoal-600 hover:text-charcoal-900 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    selectedCategory === cat.id
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-base font-bold text-charcoal-800">All Systems Clear</h4>
            <p className="text-xs text-charcoal-400 mt-1">
              No active warnings or unacknowledged alerts in this category.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                alert.acknowledged
                  ? 'border-slate-200/60 opacity-60'
                  : alert.severity === 'critical'
                  ? 'border-rose-300 shadow-subtle ring-1 ring-rose-200/50'
                  : alert.severity === 'warning'
                  ? 'border-amber-300 shadow-subtle'
                  : 'border-slate-200 shadow-subtle'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      alert.severity === 'critical'
                        ? 'bg-rose-50 text-rose-600'
                        : alert.severity === 'warning'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-brand-50 text-brand-700'
                    }`}
                  >
                    {alert.severity === 'critical' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-charcoal-900">{alert.title}</h4>
                      {getSeverityBadge(alert.severity)}
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-charcoal-600">
                        {alert.type}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-600 mt-1.5 leading-relaxed">
                      {alert.message}
                    </p>

                    {alert.action_required && (
                      <div className="mt-2 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60 inline-block">
                        Action Required: {alert.action_required}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-[11px] text-charcoal-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span>•</span>
                      <span>Caregiver Contact: {patient.caregiver_name}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="self-end sm:self-center shrink-0">
                  {alert.acknowledged ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <Check className="w-4 h-4" /> Acknowledged
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
