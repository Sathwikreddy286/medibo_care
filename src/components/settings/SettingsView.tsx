import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Volume2,
  Bell,
  Cpu,
  RefreshCw,
  Save,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_SETTINGS } from '../../data/mockData';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState(settings);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all threshold settings to academic baseline defaults?')) {
      setForm(INITIAL_SETTINGS);
      updateSettings(INITIAL_SETTINGS);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
      }, 3000);
    }
  };

  const handleRequestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setForm(prev => ({ ...prev, enable_browser_notifications: true }));
        updateSettings({ enable_browser_notifications: true });
        new Notification('MediBox Care Alert', {
          body: 'Browser notifications enabled for medication reminders and vital spikes.',
          icon: '/favicon.ico'
        });
      }
    } else {
      alert('Browser notifications not supported in this environment.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <Settings className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">System Settings & Parameters</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Configure vital alarm thresholds, buzzer audio behavior, and serial communication baud rate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-700 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
        </div>
      </div>

      {showSavedToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings successfully updated and synced with 8051 runtime memory!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Biometric Alarm Thresholds */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-brand-700" />
            <div>
              <h3 className="text-sm font-bold text-charcoal-900">Biometric Vital Thresholds</h3>
              <p className="text-xs text-charcoal-500">
                Trigger alerts when Galaxy Watch 5 Pro or external readings cross these bounds
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heart Rate Minimum */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-charcoal-700">Heart Rate Lower Bound (Bradycardia):</label>
                <span className="font-bold text-brand-700">{form.heart_rate_min} BPM</span>
              </div>
              <input
                type="range"
                min="40"
                max="70"
                value={form.heart_rate_min}
                onChange={e => setForm({ ...form, heart_rate_min: Number(e.target.value) })}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <span className="text-[11px] text-charcoal-400">Triggers alert if pulse drops below this level.</span>
            </div>

            {/* Heart Rate Maximum */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-charcoal-700">Heart Rate Upper Bound (Tachycardia):</label>
                <span className="font-bold text-brand-700">{form.heart_rate_max} BPM</span>
              </div>
              <input
                type="range"
                min="90"
                max="160"
                value={form.heart_rate_max}
                onChange={e => setForm({ ...form, heart_rate_max: Number(e.target.value) })}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <span className="text-[11px] text-charcoal-400">Triggers alarm if pulse exceeds this value.</span>
            </div>

            {/* SpO2 Minimum */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-charcoal-700">SpO₂ Oxygen Minimum Threshold (Hypoxia):</label>
                <span className="font-bold text-brand-700">{form.spo2_min}%</span>
              </div>
              <input
                type="range"
                min="85"
                max="97"
                value={form.spo2_min}
                onChange={e => setForm({ ...form, spo2_min: Number(e.target.value) })}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <span className="text-[11px] text-charcoal-400">Clinical standard recommends 90-94% threshold.</span>
            </div>

            {/* Reminder Window */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-charcoal-700">Missed Dose Grace Period Window:</label>
                <span className="font-bold text-brand-700">{form.reminder_window_mins} Mins</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={form.reminder_window_mins}
                onChange={e => setForm({ ...form, reminder_window_mins: Number(e.target.value) })}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <span className="text-[11px] text-charcoal-400">Time allowed after RTC alarm before marking dose missed.</span>
            </div>
          </div>
        </div>

        {/* Section 2: Audio & Notification Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Volume2 className="w-5 h-5 text-brand-700" />
            <div>
              <h3 className="text-sm font-bold text-charcoal-900">Audio & Notification Dispatch</h3>
              <p className="text-xs text-charcoal-500">Configure reminder chimes and web notification push</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-charcoal-900">Enable Hardware Buzzer & Web Audio</div>
                <div className="text-[11px] text-charcoal-500">Play chime for dose alerts and vital alarms.</div>
              </div>
              <input
                type="checkbox"
                checked={form.enable_sound}
                onChange={e => setForm({ ...form, enable_sound: e.target.checked })}
                className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-charcoal-900">Browser Push Notifications</div>
                <div className="text-[11px] text-charcoal-500">Show desktop notifications when doses are due.</div>
              </div>
              <button
                type="button"
                onClick={handleRequestNotificationPermission}
                className="px-3 py-1.5 rounded-lg bg-purple-50 text-brand-800 text-xs font-semibold hover:bg-purple-100 border border-purple-200"
              >
                {form.enable_browser_notifications ? 'Enabled' : 'Request Permission'}
              </button>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="text-xs font-semibold text-charcoal-900">Demo Simulator Mode</div>
                <div className="text-[11px] text-charcoal-500">Generate simulated Galaxy Watch 5 Pro health readings when not connected to live hardware.</div>
              </div>
              <input
                type="checkbox"
                checked={form.demo_mode}
                onChange={e => setForm({ ...form, demo_mode: e.target.checked })}
                className="w-4 h-4 accent-purple-700 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Serial Baud Rate */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-brand-700" />
            <div>
              <h3 className="text-sm font-bold text-charcoal-900">Serial Bus Communication Protocol</h3>
              <p className="text-xs text-charcoal-500">Configure Web Serial port baud rate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                UART Baud Rate
              </label>
              <select
                value={form.baud_rate}
                onChange={e => setForm({ ...form, baud_rate: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              >
                <option value={9600}>9600 bps (Standard 8051)</option>
                <option value={57600}>57600 bps</option>
                <option value={115200}>115200 bps (High-Speed Arduino UNO)</option>
              </select>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/60 text-xs text-brand-900">
              <span className="font-bold">Hardware Note: </span>
              Ensure Arduino sketch <code>Serial.begin(115200)</code> matches this setting to avoid character garbling during live packet transmission.
            </div>
          </div>
        </div>

        {/* Watch Integration Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-brand-700" />
            <div>
              <h3 className="text-sm font-bold text-charcoal-900">Watch & Backend Integration</h3>
              <p className="text-xs text-charcoal-500">Configure Samsung Galaxy Watch 5 Pro backend API endpoint</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Backend API Endpoint URL
              </label>
              <input
                type="text"
                value={form.api_endpoint}
                onChange={e => setForm({ ...form, api_endpoint: e.target.value })}
                placeholder="https://api.medibox.care (leave blank for local demo)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500 text-charcoal-800 placeholder-charcoal-300"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">Used for Samsung Galaxy Watch 5 Pro REST API sync. Never include API secrets here — use server-side environment variables.</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
              <strong>Security Note:</strong> Never store API keys or database credentials in frontend code. Configure backend credentials using server-side .env files only.
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
