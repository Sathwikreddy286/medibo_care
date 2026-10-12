import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wifi, WifiOff, Watch, Heart, Wind, RefreshCw,
  AlertTriangle, CheckCircle2, Clock, Shield, Smartphone
} from 'lucide-react';

export const WatchConnectionView: React.FC = () => {
  const { watchState, connectWatch, disconnectWatch, syncWatch, settings } = useApp();

  const isConnected = watchState.status === 'Synced' || watchState.status === 'Connected' || watchState.status === 'Syncing';
  const isSyncing = watchState.status === 'Syncing' || watchState.status === 'Connecting';

  const statusConfig: Record<string, { color: string; dot: string; label: string }> = {
    'Synced':            { color: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Synced' },
    'Connected':         { color: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Connected' },
    'Syncing':           { color: 'text-blue-700',    dot: 'bg-blue-400 animate-pulse', label: 'Syncing...' },
    'Connecting':        { color: 'text-blue-700',    dot: 'bg-blue-400 animate-pulse', label: 'Connecting...' },
    'Not Connected':     { color: 'text-slate-500',   dot: 'bg-slate-400', label: 'Not Connected' },
    'Connection Error':  { color: 'text-rose-700',    dot: 'bg-rose-500', label: 'Connection Error' },
    'Permission Required': { color: 'text-amber-700', dot: 'bg-amber-500', label: 'Permission Required' },
    'Data Stale':        { color: 'text-amber-700',   dot: 'bg-amber-500', label: 'Data Stale' },
  };

  const currentStatus = statusConfig[watchState.status] ?? statusConfig['Not Connected'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-700">
            <Watch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-charcoal-900">Health Device Connection</h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Samsung Galaxy Watch 5 Pro via Android Companion Application
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Watch Status Card */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Watch Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            {/* Watch Banner */}
            <div className={`h-2 w-full ${isConnected ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-slate-200 to-slate-300'}`} />

            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Watch Icon */}
                  <div className={`p-4 rounded-2xl border-2 ${isConnected ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <Watch className={`w-8 h-8 ${isConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-charcoal-900">Samsung Galaxy Watch 5 Pro</h3>
                    <p className="text-xs text-charcoal-500 mt-0.5">SM-R920 (45mm) • Wear OS 4.0 / One UI Watch 5</p>
                    <p className="text-xs text-charcoal-400 mt-0.5">Samsung Health Sensor SDK v1.3</p>

                    <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      isConnected ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                      watchState.status === 'Connection Error' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                      isSyncing ? 'bg-blue-50 border-blue-200 text-blue-700' :
                      'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
                      {currentStatus.label}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {isConnected ? (
                    <>
                      <button
                        onClick={syncWatch}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold transition-colors disabled:opacity-60"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Sync Now'}
                      </button>
                      <button
                        onClick={disconnectWatch}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-700 text-xs font-semibold transition-colors"
                      >
                        <WifiOff className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={connectWatch}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold transition-colors disabled:opacity-60"
                    >
                      <Wifi className="w-3.5 h-3.5" />
                      {isSyncing ? 'Connecting...' : 'Connect Watch'}
                    </button>
                  )}
                </div>
              </div>

              {/* Health Data Summary */}
              {isConnected && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${watchState.heart_rate_synced ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className={`w-4 h-4 ${watchState.heart_rate_synced ? 'text-rose-500' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold text-charcoal-700">Heart Rate</span>
                      {watchState.heart_rate_synced && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                      )}
                    </div>
                    <p className={`text-sm font-medium ${watchState.heart_rate_synced ? 'text-emerald-700' : 'text-charcoal-400'}`}>
                      {watchState.heart_rate_synced ? '✓ Synced' : 'Awaiting Data'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${watchState.spo2_synced ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Wind className={`w-4 h-4 ${watchState.spo2_synced ? 'text-brand-500' : 'text-slate-400'}`} />
                      <span className="text-xs font-semibold text-charcoal-700">SpO₂</span>
                      {watchState.spo2_synced && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                      )}
                    </div>
                    <p className={`text-sm font-medium ${watchState.spo2_synced ? 'text-emerald-700' : 'text-charcoal-400'}`}>
                      {watchState.spo2_synced ? '✓ Synced' : 'Awaiting Data'}
                    </p>
                  </div>
                </div>
              )}

              {/* Last Sync */}
              {isConnected && watchState.last_sync_timestamp && (
                <div className="mt-4 flex items-center gap-2 text-xs text-charcoal-500">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  <span>Last Synchronization: <strong className="text-charcoal-700">{watchState.last_sync_relative}</strong></span>
                  <span className="text-charcoal-300">•</span>
                  <span>Source: <strong className="text-charcoal-700">Galaxy Watch 5 Pro</strong></span>
                </div>
              )}

              {/* Error State */}
              {watchState.error_message && !isConnected && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">Unable to synchronize watch data</p>
                      <p className="text-xs text-amber-700 mt-1">{watchState.error_message}</p>
                      <div className="mt-2 space-y-1 text-xs text-amber-700">
                        <p>Please check:</p>
                        <ul className="list-disc list-inside space-y-0.5 ml-1">
                          <li>Watch is charged and on wrist</li>
                          <li>Phone Bluetooth is enabled</li>
                          <li>Samsung Health permissions granted</li>
                          <li>MediBox Care Companion App is open</li>
                          <li>Internet connection available</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Not Connected State */}
              {!isConnected && !watchState.error_message && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-charcoal-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-charcoal-700">Connect your Galaxy Watch through the MediBox Care companion application.</p>
                      <p className="text-xs text-charcoal-500 mt-1">
                        Open the Android companion app on your phone, ensure Bluetooth is enabled, and tap "Connect Watch".
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo Mode Notice */}
              {settings.demo_mode && (
                <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <span className="font-bold">🟡 DEMO MODE</span>
                  <span>— Health readings are simulated. Sync in Live Mode for real watch data.</span>
                </div>
              )}
            </div>
          </div>

          {/* Health Data Permissions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
            <h3 className="font-bold text-sm text-charcoal-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-600" />
              Health Data Permissions
            </h3>
            <p className="text-xs text-charcoal-500 mb-4">
              Samsung Health SDK requires explicit user consent for health data access. Status shown reflects companion app permission grants.
            </p>
            <div className="space-y-3">
              {[
                { label: 'Heart Rate', key: 'heart_rate' as const, note: 'Samsung Health Sensor SDK' },
                { label: 'SpO₂ (Blood Oxygen)', key: 'spo2' as const, note: 'Samsung Health Sensor SDK' },
                { label: 'Blood Pressure', key: 'blood_pressure' as const, note: 'External device / conditional' },
              ].map(perm => {
                const granted = watchState.permissions[perm.key];
                return (
                  <div key={perm.key} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-xs font-semibold text-charcoal-800">{perm.label}</p>
                      <p className="text-[10px] text-charcoal-400">{perm.note}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      granted
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${granted ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {granted ? 'Allowed' : perm.key === 'blood_pressure' ? 'Not Available / Not Granted' : 'Not Granted'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Architecture + Future Data */}
        <div className="space-y-4">
          {/* Architecture Summary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
            <h3 className="font-bold text-sm text-charcoal-900 mb-3">Integration Architecture</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Galaxy Watch 5 Pro', sub: 'Wear OS 4 / One UI Watch 5', icon: '⌚', active: true },
                { label: 'Samsung Health SDK', sub: 'Sensor & Data APIs', icon: '📡', active: true },
                { label: 'Android Companion App', sub: 'com.medibox.care', icon: '📱', active: true },
                { label: 'REST API Sync', sub: 'HTTPS → Backend', icon: '🔗', active: true },
                { label: 'MediBox Dashboard', sub: 'Live Data Display', icon: '🖥️', active: true },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${step.active ? 'bg-brand-100' : 'bg-slate-100'}`}>
                      {step.icon}
                    </div>
                    {i < 4 && <div className="w-0.5 h-4 bg-slate-200 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className={`font-semibold ${step.active ? 'text-charcoal-800' : 'text-charcoal-400'}`}>{step.label}</p>
                    <p className="text-charcoal-400">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Future Data Integrations */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
            <h3 className="font-bold text-sm text-charcoal-900 mb-3">Future Health Data</h3>
            <p className="text-[11px] text-charcoal-400 mb-3">Available for Future Integration via Samsung Health Data SDK</p>
            <div className="space-y-2">
              {[
                'Steps & Activity', 'Sleep Analysis', 'Calories Burned',
                'Skin Temperature', 'ECG (where authorized)', 'Body Composition',
                'Stress Level', 'Blood Pressure (ext. device)'
              ].map(item => (
                <div key={item} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-charcoal-600">{item}</span>
                  <span className="text-[10px] font-medium text-charcoal-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    Future
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-[11px] text-amber-800">
            <p className="font-semibold mb-1">⚕️ Health & Wellness Disclaimer</p>
            <p>Samsung Health SDK data is intended for fitness and wellness monitoring only — not for medical diagnosis or clinical treatment decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
