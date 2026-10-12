import React, { useState } from 'react';
import {
  HeartPulse, Heart, Wind, Activity, AlertCircle, RefreshCw,
  Sparkles, Info, CheckCircle2, Watch, WifiOff, Smartphone, TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine
} from 'recharts';

type TimeRange = 'today' | '7days' | '30days';

export const HealthMonitoringView: React.FC = () => {
  const {
    currentVitals, healthReadings, addHealthReading,
    watchState, syncWatch, settings, connectWatch
  } = useApp();

  const [hrRange, setHrRange] = useState<TimeRange>('today');
  const [spo2Range, setSpo2Range] = useState<TimeRange>('today');

  // Build chart data
  const getChartData = (range: TimeRange) => {
    const now = Date.now();
    const cutoff = range === 'today'
      ? now - 24 * 3600 * 1000
      : range === '7days'
      ? now - 7 * 24 * 3600 * 1000
      : now - 30 * 24 * 3600 * 1000;

    return [...healthReadings]
      .filter(r => new Date(r.recorded_at).getTime() >= cutoff)
      .slice(0, 30)
      .reverse()
      .map(r => ({
        time: new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        heartRate: r.heart_rate,
        spo2: r.spo2
      }));
  };

  const hrData = getChartData(hrRange);
  const spo2Data = getChartData(spo2Range);

  const watchSynced = watchState.status === 'Synced' || watchState.status === 'Connected';
  const isSyncing = watchState.status === 'Syncing';
  const isDemo = settings.demo_mode;

  const getStatusColor = (status: string) =>
    status === 'Normal' ? 'text-emerald-700' : status === 'Attention' ? 'text-amber-700' : 'text-rose-700';

  const TimeRangeSelector: React.FC<{ value: TimeRange; onChange: (v: TimeRange) => void }> = ({ value, onChange }) => (
    <div className="flex rounded-xl border border-slate-200 overflow-hidden text-xs">
      {(['today', '7days', '30days'] as TimeRange[]).map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1.5 font-medium transition-colors ${
            value === r ? 'bg-brand-700 text-white' : 'bg-white text-charcoal-600 hover:bg-slate-50'
          }`}
        >
          {r === 'today' ? 'Today' : r === '7days' ? '7 Days' : '30 Days'}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-charcoal-900">Health Monitoring</h2>
          </div>
          <p className="text-xs text-charcoal-500">
            Heart Rate & SpO₂ from <strong>Samsung Galaxy Watch 5 Pro</strong> via Android Companion App
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              🟡 DEMO DATA
            </span>
          )}
          <button
            onClick={syncWatch}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Watch'}
          </button>
        </div>
      </div>

      {/* Watch Status Banner */}
      <div className={`rounded-2xl p-4 border flex items-start gap-3 ${
        watchSynced ? 'bg-emerald-50 border-emerald-200' :
        watchState.status === 'Connection Error' ? 'bg-rose-50 border-rose-200' :
        'bg-slate-50 border-slate-200'
      }`}>
        <Watch className={`w-5 h-5 mt-0.5 shrink-0 ${watchSynced ? 'text-emerald-600' : 'text-charcoal-400'}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-charcoal-800">Samsung Galaxy Watch 5 Pro</span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
              watchSynced ? 'bg-emerald-100 border-emerald-200 text-emerald-700' :
              isSyncing ? 'bg-blue-100 border-blue-200 text-blue-700' :
              'bg-slate-200 border-slate-300 text-charcoal-500'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${watchSynced ? 'bg-emerald-500' : isSyncing ? 'bg-blue-400 animate-pulse' : 'bg-slate-400'}`} />
              {watchState.status}
            </span>
          </div>
          {watchState.last_sync_timestamp && (
            <p className="text-xs text-charcoal-500 mt-1">
              Last Sync: <strong>{watchState.last_sync_relative}</strong> • Source: Galaxy Watch 5 Pro
              {isDemo && ' (DEMO)'}
            </p>
          )}
          {!watchSynced && !isSyncing && (
            <div className="mt-2">
              <button
                onClick={connectWatch}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 underline"
              >
                Connect Watch →
              </button>
              <span className="text-xs text-charcoal-500 ml-2">via MediBox Care Companion App</span>
            </div>
          )}
        </div>
      </div>

      {/* Vitals Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Heart Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Heart Rate</span>
            <Heart className="w-4 h-4 text-rose-400 animate-heartbeat" />
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-black text-charcoal-900">{currentVitals.heartRate}</span>
            <span className="text-lg font-semibold text-charcoal-400">BPM</span>
          </div>
          <span className={`text-xs font-semibold ${getStatusColor(currentVitals.status)}`}>
            Status: {currentVitals.status}
          </span>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
            <p className="text-[11px] text-charcoal-500 flex items-center gap-1.5">
              <Watch className="w-3 h-3" /> Source: Samsung Galaxy Watch 5 Pro
            </p>
            <p className="text-[11px] text-charcoal-400">
              Last Updated: {currentVitals.secondsAgo > 0 ? `${currentVitals.secondsAgo} seconds ago` : 'Just now'}
            </p>
            {isDemo && <p className="text-[10px] font-bold text-amber-700">⚠ DEMO DATA</p>}
          </div>
        </div>

        {/* SpO₂ */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Blood Oxygen (SpO₂)</span>
            <Wind className="w-4 h-4 text-brand-500" />
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-black text-charcoal-900">{currentVitals.spo2}</span>
            <span className="text-lg font-semibold text-charcoal-400">%</span>
          </div>
          <span className={`text-xs font-semibold ${getStatusColor(currentVitals.status)}`}>
            Status: {currentVitals.spo2 >= 95 ? 'Normal' : currentVitals.spo2 >= 90 ? 'Attention' : 'Critical'}
          </span>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
            <p className="text-[11px] text-charcoal-500 flex items-center gap-1.5">
              <Watch className="w-3 h-3" /> Source: Samsung Galaxy Watch 5 Pro
            </p>
            <p className="text-[11px] text-charcoal-400">
              Last Updated: {currentVitals.secondsAgo > 0 ? `${currentVitals.secondsAgo} seconds ago` : 'Just now'}
            </p>
            {isDemo && <p className="text-[10px] font-bold text-amber-700">⚠ DEMO DATA</p>}
          </div>
        </div>

        {/* Blood Pressure — Integration Ready */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Blood Pressure</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-black text-charcoal-300">--</span>
            <span className="text-sm font-semibold text-charcoal-300">mmHg</span>
          </div>
          <span className="text-xs font-semibold text-charcoal-400">Ready for Integration</span>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
            <p className="text-[11px] text-charcoal-500">Source: External BP Device</p>
            <p className="text-[11px] text-charcoal-400">Systolic / Diastolic</p>
            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-charcoal-400 border border-slate-200">
              Available for Future Integration
            </span>
          </div>
        </div>
      </div>

      {/* Heart Rate Trend Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-sm text-charcoal-900">Heart Rate Trend</h3>
          </div>
          <TimeRangeSelector value={hrRange} onChange={setHrRange} />
        </div>

        {hrData.length > 0 ? (
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hrData}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7E22CE" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7E22CE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 110]} stroke="#94a3b8" fontSize={10} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '11px' }} />
                <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1} label={{ value: 'Max', fill: '#ef4444', fontSize: 9 }} />
                <ReferenceLine y={55} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1} label={{ value: 'Min', fill: '#f59e0b', fontSize: 9 }} />
                <Area type="monotone" dataKey="heartRate" stroke="#7E22CE" strokeWidth={2.5} fill="url(#hrGrad)" name="HR (BPM)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center text-charcoal-400 text-sm">
            <div className="text-center">
              <Watch className="w-8 h-8 mx-auto mb-2 text-charcoal-300" />
              <p className="font-semibold">No health readings yet.</p>
              <p className="text-xs mt-1">Connect your Galaxy Watch to start receiving health data.</p>
            </div>
          </div>
        )}

        <p className="mt-2 text-[10px] text-charcoal-400 text-center">
          Source: Samsung Galaxy Watch 5 Pro via Android Companion App{isDemo ? ' · DEMO DATA' : ''}
        </p>
      </div>

      {/* SpO₂ Trend Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-brand-500" />
            <h3 className="font-bold text-sm text-charcoal-900">SpO₂ Trend</h3>
          </div>
          <TimeRangeSelector value={spo2Range} onChange={setSpo2Range} />
        </div>

        {spo2Data.length > 0 ? (
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spo2Data}>
                <defs>
                  <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[88, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} width={30} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '11px' }} />
                <ReferenceLine y={94} stroke="#ef4444" strokeDasharray="4 2" strokeWidth={1} label={{ value: 'Min', fill: '#ef4444', fontSize: 9 }} />
                <Area type="monotone" dataKey="spo2" stroke="#9333EA" strokeWidth={2.5} fill="url(#spo2Grad)" name="SpO₂ (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-52 flex items-center justify-center text-charcoal-400 text-sm">
            <div className="text-center">
              <Wind className="w-8 h-8 mx-auto mb-2 text-charcoal-300" />
              <p>No SpO₂ readings yet.</p>
            </div>
          </div>
        )}

        <p className="mt-2 text-[10px] text-charcoal-400 text-center">
          Source: Samsung Galaxy Watch 5 Pro via Android Companion App{isDemo ? ' · DEMO DATA' : ''}
        </p>
      </div>

      {/* Future Health Data */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
        <h3 className="font-bold text-sm text-charcoal-900 mb-1">Additional Health Data</h3>
        <p className="text-xs text-charcoal-400 mb-4">The following data types are supported by Samsung Health Data SDK and can be integrated in future versions.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Steps & Activity', 'Sleep Analysis', 'Calories Burned', 'Skin Temperature', 'ECG (authorized)', 'Body Composition', 'Stress Level', 'Exercise Sessions'].map(item => (
            <div key={item} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-xs font-medium text-charcoal-600">{item}</p>
              <span className="mt-1 inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-200 text-charcoal-400">Future</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
        <strong>⚕️ Health & Wellness Disclaimer:</strong> MediBox Care is an academic prototype. Health sensor readings from Samsung Galaxy Watch 5 Pro are intended for fitness, wellness, and monitoring purposes only — not for medical diagnosis or treatment. Samsung Health SDK data should not replace professional medical advice.
      </div>
    </div>
  );
};
