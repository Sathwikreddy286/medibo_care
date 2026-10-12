import React, { useState } from 'react';
import {
  History,
  Download,
  Filter,
  Search,
  Heart,
  Wind,
  Activity,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HealthHistoryView: React.FC = () => {
  const { healthReadings, exportCsvData } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredReadings = healthReadings.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (sourceFilter !== 'All' && r.source !== sourceFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchSource = r.source.toLowerCase().includes(q);
      const matchStatus = r.status.toLowerCase().includes(q);
      const matchHr = r.heart_rate.toString().includes(q);
      return matchSource || matchStatus || matchHr;
    }
    return true;
  });

  // Calculate Averages
  const totalCount = healthReadings.length;
  const avgHr = Math.round(healthReadings.reduce((acc, r) => acc + r.heart_rate, 0) / Math.max(1, totalCount));
  const avgSpo2 = Math.round(healthReadings.reduce((acc, r) => acc + r.spo2, 0) / Math.max(1, totalCount));
  const abnormalCount = healthReadings.filter(r => r.status !== 'Normal').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <History className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">Health History Logs</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Complete chronological vital logs from Samsung Galaxy Watch 5 Pro & manual entries.
          </p>
        </div>

        <button
          onClick={() => exportCsvData('health')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-charcoal-700 hover:text-brand-700 hover:border-brand-200 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-brand-600" /> Export CSV Log
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="text-xs font-semibold text-charcoal-500 uppercase">Average Pulse</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-charcoal-900">{avgHr}</span>
            <span className="text-xs font-semibold text-charcoal-500">BPM</span>
          </div>
          <span className="mt-2 inline-block text-[11px] text-emerald-600 font-semibold">Normal Baseline</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="text-xs font-semibold text-charcoal-500 uppercase">Average SpO₂</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-charcoal-900">{avgSpo2}</span>
            <span className="text-xs font-semibold text-charcoal-500">%</span>
          </div>
          <span className="mt-2 inline-block text-[11px] text-cyan-600 font-semibold">Healthy Oxygenation</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="text-xs font-semibold text-charcoal-500 uppercase">Total Readings Logged</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-charcoal-900">{totalCount}</span>
            <span className="text-xs font-semibold text-charcoal-500">entries</span>
          </div>
          <span className="mt-2 inline-block text-[11px] text-brand-700 font-semibold">Continuous Telemetry</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle">
          <div className="text-xs font-semibold text-charcoal-500 uppercase">Abnormal Spikes</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-charcoal-900">{abnormalCount}</span>
            <span className="text-xs font-semibold text-charcoal-500">flagged</span>
          </div>
          <span className="mt-2 inline-block text-[11px] text-amber-600 font-semibold">Caregiver Notified</span>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by source or status..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-charcoal-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-charcoal-700 focus:outline-none focus:border-brand-500"
              >
                <option value="All">All Statuses</option>
                <option value="Normal">Normal</option>
                <option value="Attention">Attention</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-charcoal-500 font-medium">Source:</span>
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-charcoal-700 focus:outline-none focus:border-brand-500"
              >
                <option value="All">All Sources</option>
                <option value="Galaxy Watch 5 Pro">Galaxy Watch 5 Pro</option>
                <option value="External BP Device">External BP Device</option>
                <option value="Manual Entry">Manual Entry</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-charcoal-500 uppercase tracking-wider">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Heart Rate</th>
                <th className="py-3 px-6">SpO₂ Oxygen</th>
                <th className="py-3 px-6">Blood Pressure</th>
                <th className="py-3 px-6">Sensor Source</th>
                <th className="py-3 px-6">Clinical Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredReadings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal-400">
                    No vital readings match the chosen filters.
                  </td>
                </tr>
              ) : (
                filteredReadings.map(reading => {
                  const dateObj = new Date(reading.recorded_at);
                  const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                  const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                  return (
                    <tr key={reading.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-charcoal-900 whitespace-nowrap">
                        <div>{formattedDate}</div>
                        <div className="text-[11px] text-charcoal-400">{formattedTime}</div>
                      </td>

                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="font-extrabold text-charcoal-900 text-sm">{reading.heart_rate}</span>{' '}
                        <span className="text-charcoal-500 text-[11px]">BPM</span>
                      </td>

                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="font-extrabold text-charcoal-900 text-sm">{reading.spo2}</span>{' '}
                        <span className="text-charcoal-500 text-[11px]">%</span>
                      </td>

                      <td className="py-3.5 px-6 whitespace-nowrap">
                        {reading.systolic_bp && reading.diastolic_bp ? (
                          <span className="font-semibold text-charcoal-800">
                            {reading.systolic_bp}/{reading.diastolic_bp} <span className="text-charcoal-400 text-[11px]">mmHg</span>
                          </span>
                        ) : (
                          <span className="text-charcoal-400 italic text-[11px]">N/A (Optical only)</span>
                        )}
                      </td>

                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-brand-800 border border-purple-200/60">
                          {reading.source}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 whitespace-nowrap">
                        {reading.status === 'Normal' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Normal
                          </span>
                        ) : reading.status === 'Attention' ? (
                          <span className="inline-flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                            <AlertTriangle className="w-3.5 h-3.5" /> Attention
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/80">
                            <AlertCircle className="w-3.5 h-3.5" /> Critical
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
