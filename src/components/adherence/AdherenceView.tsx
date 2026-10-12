import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KpiCard } from '../common/KpiCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdherenceView: React.FC = () => {
  const { todayDoses, medicines, patient } = useApp();
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');

  // Adherence calculations
  const takenCount = todayDoses.filter(d => d.status === 'taken').length;
  const missedCount = todayDoses.filter(d => d.status === 'missed').length;
  const delayedCount = todayDoses.filter(d => d.status === 'delayed').length;
  const upcomingCount = todayDoses.filter(d => d.status === 'upcoming').length;

  const weeklyAdherenceData = [
    { day: 'Mon', taken: 4, missed: 0, delayed: 0, adherence: 100 },
    { day: 'Tue', taken: 3, missed: 1, delayed: 0, adherence: 75 },
    { day: 'Wed', taken: 4, missed: 0, delayed: 0, adherence: 100 },
    { day: 'Thu', taken: 3, missed: 0, delayed: 1, adherence: 85 },
    { day: 'Fri', taken: 4, missed: 0, delayed: 0, adherence: 100 },
    { day: 'Sat', taken: 3, missed: 1, delayed: 0, adherence: 75 },
    { day: 'Sun (Today)', taken: takenCount, missed: missedCount, delayed: delayedCount, adherence: 80 }
  ];

  const pieData = [
    { name: 'Taken on Time', value: 24, color: '#10B981' },
    { name: 'Delayed', value: 2, color: '#F59E0B' },
    { name: 'Missed', value: 2, color: '#EF4444' }
  ];

  const compartmentAdherence = [
    { compartment: 'Compartment 1', medicine: 'Amoxicillin', taken: '14/14', score: 100, color: '#10B981' },
    { compartment: 'Compartment 2', medicine: 'Atorvastatin', taken: '12/14', score: 86, color: '#7E22CE' },
    { compartment: 'Compartment 3', medicine: 'Metformin', taken: '13/14', score: 93, color: '#10B981' },
    { compartment: 'Compartment 4', medicine: 'Multivitamin', taken: '14/14', score: 100, color: '#10B981' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">Medication Adherence Analytics</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Historical intake adherence metrics evaluated against the DS3231 RTC schedule & Reed switch detection.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '7days' ? 'bg-white text-charcoal-900 shadow-xs' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeRange === '30days' ? 'bg-white text-charcoal-900 shadow-xs' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Overall Adherence"
          value="89.3"
          unit="%"
          icon={<TrendingUp className="w-5 h-5 text-brand-700" />}
          trend={{ value: "+2.4%", isPositive: true, label: "vs last week" }}
          highlight={true}
        />
        <KpiCard
          title="Current Streak"
          value="5"
          unit="Days"
          subtitle="Target: 14 Days"
          icon={<Award className="w-5 h-5 text-emerald-600" />}
        />
        <KpiCard
          title="Doses Taken"
          value="24"
          unit="doses"
          subtitle="Out of 28 scheduled"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <KpiCard
          title="Missed Doses"
          value="2"
          unit="doses"
          subtitle="Alerted caregiver"
          icon={<XCircle className="w-5 h-5 text-rose-600" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Bar Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Intake Compliance History</h3>
              <p className="text-xs text-charcoal-500">Daily breakdown of taken, delayed, and missed medications</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Good Compliance Grade (B+)
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAdherenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="taken" name="Taken" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delayed" name="Delayed" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="missed" name="Missed" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Adherence Distribution Donut */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">Dose Status Ratio</h3>
            <p className="text-xs text-charcoal-500">Ratio over the observed evaluation window</p>

            <div className="h-56 mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '12px',
                      color: '#FFF',
                      border: 'none',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-charcoal-900">89%</span>
                <span className="text-[10px] uppercase font-bold text-charcoal-400">On Track</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-charcoal-600">{item.name}</span>
                </div>
                <span className="font-bold text-charcoal-900">{item.value} doses</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compartment Specific Compliance & Behavioral Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compartment-Wise Table */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
          <h3 className="text-base font-bold text-charcoal-900">Compartment Compliance Breakdown</h3>
          <p className="text-xs text-charcoal-500 mb-4">Verification per physical compartment sensor</p>

          <div className="space-y-4">
            {compartmentAdherence.map(item => (
              <div key={item.compartment} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div>
                    <span className="font-bold text-charcoal-900">{item.compartment}: </span>
                    <span className="text-charcoal-600 font-medium">{item.medicine}</span>
                  </div>
                  <span className="font-extrabold text-brand-700">{item.score}% ({item.taken})</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.score >= 90 ? '#10B981' : item.score >= 80 ? '#7E22CE' : '#F59E0B'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Suggestions & Microcontroller Insights */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-50 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-charcoal-900">Adherence Insights & System Notes</h3>
            </div>
            <p className="text-xs text-charcoal-500 mt-1">Algorithmic analysis of timing deviations</p>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs">
                <h4 className="font-bold text-amber-900">Afternoon Slot Vulnerability</h4>
                <p className="text-amber-800 mt-1 leading-relaxed">
                  The system noticed 2 missed doses in the 01:00 PM slot (Atorvastatin). Consider increasing the 8051 buzzer reminder window from 30 minutes to 45 minutes or sending automated caregiver SMS notifications.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs">
                <h4 className="font-bold text-brand-900">Reed Switch Sensor Verification</h4>
                <p className="text-brand-800 mt-1 leading-relaxed">
                  Magnetic reed switch logged valid lid openings for 96% of dispensed doses within 5 minutes of RTC audio alerts, demonstrating high patient responsiveness.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-charcoal-500">
            <span>Logged for Patient: <strong className="text-charcoal-800">{patient.name}</strong></span>
            <span className="text-brand-700 font-semibold flex items-center gap-1 cursor-pointer hover:underline">
              Review full alert log <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
