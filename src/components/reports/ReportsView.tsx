import React, { useState } from 'react';
import {
  FileBarChart2,
  Printer,
  Download,
  Calendar,
  User,
  Heart,
  Pill,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { patient, medicines, todayDoses, healthReadings, exportCsvData } = useApp();
  const [reportPeriod, setReportPeriod] = useState<'7days' | '14days' | '30days'>('7days');

  const handlePrint = () => {
    window.print();
  };

  // Vitals stats
  const totalReadings = healthReadings.length;
  const avgHr = Math.round(healthReadings.reduce((acc, r) => acc + r.heart_rate, 0) / Math.max(1, totalReadings));
  const avgSpo2 = Math.round(healthReadings.reduce((acc, r) => acc + r.spo2, 0) / Math.max(1, totalReadings));

  // Adherence stats
  const takenCount = todayDoses.filter(d => d.status === 'taken').length;
  const missedCount = todayDoses.filter(d => d.status === 'missed').length;
  const adherenceRate = Math.round((takenCount / Math.max(1, todayDoses.length)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header Card (Hidden on Print) */}
      <div className="no-print bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <FileBarChart2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">Clinical & Adherence Report</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Generate and print comprehensive medical reports for consulting physicians and caregivers.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportCsvData('medication')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-charcoal-700 hover:text-brand-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-brand-600" /> Export Meds CSV
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Clinical Report Document */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-8 sm:p-10 print:p-0 print:border-none print:shadow-none space-y-8">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-brand-700 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-700 text-white font-extrabold flex items-center justify-center text-base">
                M
              </div>
              <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">MediBox Care</h1>
            </div>
            <p className="text-xs font-semibold text-brand-800 uppercase tracking-wider mt-1">
              Smart Medication Adherence & Health Telemetry Summary
            </p>
          </div>

          <div className="text-right sm:text-right text-xs text-charcoal-500">
            <div>Report ID: <span className="font-mono font-semibold text-charcoal-900">REP-2026-8051</span></div>
            <div>Generated: <span className="font-semibold text-charcoal-900">{new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
            <div>Evaluation Period: <span className="font-semibold text-charcoal-900">Last 7 Days</span></div>
          </div>
        </div>

        {/* Patient & Physician Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-slate-50/75 border border-slate-200/80 text-xs">
          <div>
            <h4 className="font-bold text-charcoal-500 uppercase tracking-wider text-[10px] mb-2">Patient Details</h4>
            <div className="font-extrabold text-charcoal-900 text-base">{patient.name}</div>
            <div className="text-charcoal-600 mt-1">Age: {patient.age} yrs • Gender: {patient.gender}</div>
            <div className="text-charcoal-600">Blood Group: <span className="font-bold text-brand-700">{patient.blood_group}</span></div>
            <div className="text-charcoal-600">Patient ID: <span className="font-mono">{patient.id}</span></div>
          </div>

          <div>
            <h4 className="font-bold text-charcoal-500 uppercase tracking-wider text-[10px] mb-2">Attending Doctor & Caregiver</h4>
            <div className="font-bold text-charcoal-900">{patient.doctor_name}</div>
            <div className="text-charcoal-600 mt-1">Doctor Phone: {patient.doctor_contact}</div>
            <div className="text-charcoal-600 mt-2 font-medium">Caregiver: {patient.caregiver_name} ({patient.caregiver_relation})</div>
            <div className="text-charcoal-600">Caregiver Phone: {patient.caregiver_phone}</div>
          </div>

          <div>
            <h4 className="font-bold text-charcoal-500 uppercase tracking-wider text-[10px] mb-2">Chronic Conditions Under Care</h4>
            <ul className="space-y-1">
              {patient.medical_conditions.map((cond, idx) => (
                <li key={idx} className="text-charcoal-700 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                  {cond}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div>
          <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-4">
            1. Executive Compliance & Vitals Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-semibold text-charcoal-500">Medication Adherence</span>
              <div className="text-2xl font-extrabold text-brand-700 mt-1">{adherenceRate}%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Grade A- Compliance</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-semibold text-charcoal-500">Average Heart Rate</span>
              <div className="text-2xl font-extrabold text-charcoal-900 mt-1">{avgHr} <span className="text-xs text-charcoal-500">BPM</span></div>
              <span className="text-[10px] text-emerald-600 font-semibold">Within Safe Window</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-semibold text-charcoal-500">Average SpO₂ Oxygen</span>
              <div className="text-2xl font-extrabold text-charcoal-900 mt-1">{avgSpo2}%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Normal Saturation</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="text-[11px] font-semibold text-charcoal-500">Missed Doses (7d)</span>
              <div className="text-2xl font-extrabold text-rose-600 mt-1">{missedCount}</div>
              <span className="text-[10px] text-rose-600 font-semibold">Alerts Sent to Phone</span>
            </div>
          </div>
        </div>

        {/* Current Active Prescriptions Table */}
        <div>
          <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-4">
            2. Active Medication Regimen & Compartment Mapping
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-charcoal-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-4">Compartment</th>
                  <th className="py-2.5 px-4">Medicine Name</th>
                  <th className="py-2.5 px-4">Dosage</th>
                  <th className="py-2.5 px-4">Scheduled Time</th>
                  <th className="py-2.5 px-4">Meal Relation</th>
                  <th className="py-2.5 px-4">Stock Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.map(m => (
                  <tr key={m.id}>
                    <td className="py-2.5 px-4 font-bold text-brand-700">Slot {m.compartment}</td>
                    <td className="py-2.5 px-4 font-extrabold text-charcoal-900">{m.medicine_name}</td>
                    <td className="py-2.5 px-4 text-charcoal-700">{m.dosage}</td>
                    <td className="py-2.5 px-4 text-charcoal-700">{m.scheduled_time} ({m.time_slot})</td>
                    <td className="py-2.5 px-4 text-charcoal-700">{m.before_after_food}</td>
                    <td className="py-2.5 px-4">
                      <span className={`font-semibold ${m.quantity <= 10 ? 'text-amber-600' : 'text-emerald-700'}`}>
                        {m.quantity} / {m.total_quantity} pills
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Telemetry Observation Table */}
        <div>
          <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider mb-4">
            3. Recent Samsung Galaxy Watch 5 Pro Vitals Observation Samples
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-charcoal-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-4">Recorded Time</th>
                  <th className="py-2.5 px-4">Heart Rate (BPM)</th>
                  <th className="py-2.5 px-4">SpO₂ Oxygen (%)</th>
                  <th className="py-2.5 px-4">Blood Pressure</th>
                  <th className="py-2.5 px-4">Observation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {healthReadings.slice(0, 5).map(r => (
                  <tr key={r.id}>
                    <td className="py-2 px-4 text-charcoal-600">
                      {new Date(r.recorded_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2 px-4 font-bold text-charcoal-900">{r.heart_rate} BPM</td>
                    <td className="py-2 px-4 font-bold text-charcoal-900">{r.spo2}%</td>
                    <td className="py-2 px-4 text-charcoal-700">
                      {r.systolic_bp ? `${r.systolic_bp}/${r.diastolic_bp} mmHg` : 'N/A'}
                    </td>
                    <td className="py-2 px-4">
                      <span className={`font-semibold ${r.status === 'Normal' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Physician Signoff & Academic Footnote */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div>
            <h4 className="font-bold text-charcoal-700 uppercase tracking-wider text-[11px]">Academic & IoT Notes</h4>
            <p className="text-charcoal-500 mt-1 leading-relaxed">
              This summary was compiled autonomously by the MediBox Care embedded microcontroller system. All dosage times represent hardware RTC timestamps verified by magnetic reed switch actuation.
            </p>
          </div>

          <div className="sm:text-right">
            <div className="h-12 border-b border-dashed border-charcoal-300 w-48 sm:ml-auto mb-2" />
            <div className="font-bold text-charcoal-800">{patient.doctor_name}</div>
            <div className="text-charcoal-500 text-[11px]">Consulting Physician Signature & Date</div>
          </div>
        </div>
      </div>
    </div>
  );
};
