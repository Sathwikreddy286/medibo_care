import React, { useState } from 'react';
import {
  Clock, Heart, Activity, Wind, CheckCircle2, XCircle,
  AlertCircle, ChevronRight, Sparkles, ShieldAlert, Cpu,
  Pill, Timer, Info, Watch, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import { DoseBadge } from '../common/Badge';
import { CaregiverBanner } from '../caregiver/CaregiverBanner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    patient, todayDoses, updateDoseStatus, currentVitals,
    hardware, watchState, alerts, setActiveTab,
    isCaregiverMode, simulateHardwareDispense, healthReadings,
    settings
  } = useApp();

  const upcomingDose = todayDoses.find(d => d.status === 'upcoming') || null;
  const takenCount = todayDoses.filter(d => d.status === 'taken').length;
  const missedCount = todayDoses.filter(d => d.status === 'missed').length;
  const adherencePercent = Math.round((takenCount / Math.max(1, todayDoses.length)) * 100);

  const chartData = [...healthReadings].slice(0, 8).reverse().map(r => ({
    time: new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hr: r.heart_rate,
    spo2: r.spo2
  }));

  const nowFormattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date());

  // Safety score calculation
  const safetyScore = Math.min(100, Math.max(0,
    70
    + (adherencePercent >= 90 ? 10 : adherencePercent >= 70 ? 5 : 0)
    + (currentVitals.isLive ? 8 : 0)
    + (missedCount === 0 ? 12 : missedCount === 1 ? 6 : 0)
  ));

  const watchSynced = watchState.status === 'Synced' || watchState.status === 'Connected';
  const isWatchDemo = settings.demo_mode;

  return (
    <div className="space-y-5">
      {isCaregiverMode && <CaregiverBanner />}

      {/* Demo Mode Banner */}
      {isWatchDemo && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span><strong>🟡 DEMO MODE ACTIVE</strong> — Health readings are simulated. Connect your Samsung Galaxy Watch 5 Pro via the companion app for live data.</span>
        </div>
      )}

      {/* Greeting Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight">
              Good Morning, {patient.name}
            </h2>
            {!isWatchDemo && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Here's your medication and health overview for today — <span className="font-medium text-charcoal-700">{nowFormattedDate}</span>.
          </p>
        </div>

        {/* Device status pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
            hardware.arduino_status === 'Connected' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-charcoal-500'
          }`}>
            <Cpu className="w-3 h-3" />
            <span>Arduino {hardware.arduino_status === 'Connected' ? '🟢' : '⚫'}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
            watchSynced ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-charcoal-500'
          }`}>
            <Watch className="w-3 h-3" />
            <span>Watch {watchSynced ? '🟢' : isWatchDemo ? '🟡' : '⚫'}{isWatchDemo ? ' DEMO' : ''}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Medicine */}
        <KpiCard
          title="Next Dose"
          value={upcomingDose ? upcomingDose.scheduled_time : 'All Done'}
          subtitle={upcomingDose ? `${upcomingDose.medicine_name} • C${upcomingDose.compartment}` : 'All scheduled doses complete'}
          icon={<Timer className="w-4.5 h-4.5" />}
          highlight={!!upcomingDose}
          statusBadge={upcomingDose
            ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-900">Upcoming</span>
            : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">✓ Complete</span>
          }
          onClick={() => setActiveTab('schedule')}
        />

        {/* Adherence */}
        <KpiCard
          title="Today's Adherence"
          value={`${adherencePercent}%`}
          subtitle={`${takenCount} taken · ${missedCount} missed · ${todayDoses.filter(d => d.status === 'upcoming').length} upcoming`}
          icon={<Activity className="w-4.5 h-4.5" />}
          trend={{ value: '+4%', isPositive: true, label: 'vs last week' }}
          statusBadge={
            <span className={`text-xs font-semibold ${adherencePercent >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {adherencePercent >= 90 ? '✓ Excellent' : adherencePercent >= 70 ? '~ Good' : '⚠ Low'}
            </span>
          }
          onClick={() => setActiveTab('adherence')}
        />

        {/* Heart Rate */}
        <KpiCard
          title="Heart Rate"
          value={currentVitals.heartRate}
          unit="BPM"
          subtitle={currentVitals.secondsAgo > 0 ? `${currentVitals.secondsAgo}s ago` : 'Just now'}
          icon={<Heart className="w-4.5 h-4.5 text-rose-500 animate-heartbeat" />}
          trend={{ value: currentVitals.status, isPositive: currentVitals.status === 'Normal' }}
          statusBadge={
            <div className="flex items-center gap-1.5">
              <Watch className="w-3 h-3 text-charcoal-400" />
              <span className="text-[10px] font-bold text-charcoal-400">Galaxy Watch 5 Pro</span>
              {isWatchDemo && <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-100 text-amber-700">DEMO</span>}
            </div>
          }
          onClick={() => setActiveTab('health-monitoring')}
        />

        {/* SpO₂ */}
        <KpiCard
          title="Blood Oxygen (SpO₂)"
          value={`${currentVitals.spo2}%`}
          subtitle={currentVitals.secondsAgo > 0 ? `${currentVitals.secondsAgo}s ago` : 'Just now'}
          icon={<Wind className="w-4.5 h-4.5 text-brand-600" />}
          trend={{ value: currentVitals.status, isPositive: currentVitals.status === 'Normal' }}
          statusBadge={
            <div className="flex items-center gap-1.5">
              <Watch className="w-3 h-3 text-charcoal-400" />
              <span className="text-[10px] font-bold text-charcoal-400">Galaxy Watch 5 Pro</span>
              {isWatchDemo && <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-100 text-amber-700">DEMO</span>}
            </div>
          }
          onClick={() => setActiveTab('health-monitoring')}
        />
      </div>

      {/* Main Grid: Today's Medication + Health Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Medication Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-50 rounded-xl text-brand-700">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-charcoal-900">Today's Medication Schedule</h3>
                <p className="text-[11px] text-charcoal-400">Synchronized with 8051 Microcontroller & Reed switch</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('schedule')} className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-0.5">
              Full Schedule <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {todayDoses.map(dose => (
              <div
                key={dose.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-brand-200 hover:shadow-subtle transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-900 font-bold flex items-center justify-center text-xs shrink-0">
                    C{dose.compartment}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">{dose.time_slot}</span>
                      <span className="text-charcoal-200">•</span>
                      <span className="text-xs font-semibold text-charcoal-700">{dose.scheduled_time}</span>
                    </div>
                    <h4 className="font-bold text-sm text-charcoal-900">{dose.medicine_name}</h4>
                    <p className="text-[11px] text-charcoal-400">
                      {dose.dosage}{dose.accessed_time && ` • Accessed: ${dose.accessed_time}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <DoseBadge status={dose.status} />
                  {dose.status === 'upcoming' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => { updateDoseStatus(dose.id, 'taken'); simulateHardwareDispense(dose.compartment); }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors"
                      >
                        Mark Taken
                      </button>
                      <button
                        onClick={() => updateDoseStatus(dose.id, 'missed')}
                        className="px-2 py-1 text-xs rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                      >
                        Missed
                      </button>
                    </div>
                  )}
                  {dose.status === 'missed' && (
                    <button
                      onClick={() => updateDoseStatus(dose.id, 'taken')}
                      className="px-2 py-1 text-xs rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      Retake
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-charcoal-500">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-500" />
              Box Lid: <strong className="text-charcoal-800">{hardware.box_lid}</strong>
            </span>
            <span className="text-[11px] text-charcoal-400">DS3231 RTC {hardware.rtc_ds3231_status}</span>
          </div>
        </div>

        {/* Health Trend + Safety Score */}
        <div className="flex flex-col gap-4">
          {/* Heart Rate Sparkline */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-charcoal-900">Heart Rate Trend</h3>
              </div>
              <button onClick={() => setActiveTab('health-monitoring')} className="text-xs font-semibold text-brand-700 hover:text-brand-900">
                View →
              </button>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gradHr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7E22CE" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#7E22CE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={9} tickLine={false} width={28} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="hr" stroke="#7E22CE" strokeWidth={2} fill="url(#gradHr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
                <span className="text-[10px] font-bold text-charcoal-400 uppercase">Heart Rate</span>
                <p className="text-base font-extrabold text-brand-900">{currentVitals.heartRate} BPM</p>
              </div>
              <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
                <span className="text-[10px] font-bold text-charcoal-400 uppercase">SpO₂</span>
                <p className="text-base font-extrabold text-brand-900">{currentVitals.spo2}%</p>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-charcoal-400 text-center italic flex items-center justify-center gap-1">
              <Watch className="w-3 h-3" /> Galaxy Watch 5 Pro{isWatchDemo ? ' · DEMO DATA' : ''}
            </p>
          </div>

          {/* Safety Score */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle">
            <h3 className="font-bold text-xs text-charcoal-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-brand-600" />
              Medication & Device Safety Score
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-black text-charcoal-900">{safetyScore}<span className="text-sm font-semibold text-charcoal-400"> / 100</span></span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${safetyScore >= 85 ? 'bg-emerald-100 text-emerald-800' : safetyScore >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'}`}>
                {safetyScore >= 85 ? 'Good' : safetyScore >= 70 ? 'Fair' : 'Needs Attention'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${safetyScore >= 85 ? 'bg-emerald-500' : safetyScore >= 70 ? 'bg-amber-400' : 'bg-rose-500'}`}
                style={{ width: `${safetyScore}%` }}
              />
            </div>
            <div className="mt-2.5 space-y-1 text-[11px]">
              {adherencePercent >= 90 && <p className="text-emerald-600"><span className="font-bold">+12</span> All scheduled medicines taken</p>}
              {currentVitals.isLive && <p className="text-emerald-600"><span className="font-bold">+8</span> Watch health data synchronized</p>}
              {missedCount > 0 && <p className="text-rose-600"><span className="font-bold">-{missedCount * 5}</span> {missedCount} dose{missedCount > 1 ? 's' : ''} missed today</p>}
            </div>
            <p className="mt-2 text-[9px] text-charcoal-400 italic">Not a medical risk score. Based on medication adherence & device status.</p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Alerts + Hardware Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Alerts */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-700" />
              <h3 className="font-bold text-sm text-charcoal-900">Recent Alerts</h3>
            </div>
            <button onClick={() => setActiveTab('alerts')} className="text-xs font-semibold text-brand-700 hover:text-brand-900">
              All Alerts →
            </button>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} className="py-3 flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                  alert.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                  alert.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                  'bg-purple-100 text-brand-700'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-bold text-charcoal-900 truncate">{alert.title}</h5>
                    <span className="text-[10px] text-charcoal-400 shrink-0">
                      {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-0.5 line-clamp-2">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware Status Mini */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-sm text-charcoal-900">Device Status</h3>
            </div>
            <button onClick={() => setActiveTab('device-status')} className="text-xs font-semibold text-brand-700 hover:text-brand-900">
              Details →
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { label: 'Arduino UNO', status: hardware.arduino_status === 'Connected' ? 'online' : 'offline' },
              { label: '8051 Controller', status: hardware.controller_8051_status === 'Active' ? 'online' : 'offline' },
              { label: 'DS3231 RTC', status: hardware.rtc_ds3231_status === 'Working' ? 'online' : 'offline' },
              { label: 'Galaxy Watch 5 Pro', status: watchSynced ? 'synced' : 'offline' },
            ].map(dev => (
              <div key={dev.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-xs text-charcoal-700 font-medium">{dev.label}</span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                  dev.status === 'online' || dev.status === 'synced' ? 'text-emerald-600' : 'text-charcoal-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    dev.status === 'online' ? 'bg-emerald-500 animate-pulse' :
                    dev.status === 'synced' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                  {dev.status === 'synced' ? 'Synced' : dev.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
