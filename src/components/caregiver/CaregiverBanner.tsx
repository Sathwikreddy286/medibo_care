import React from 'react';
import { Users, Phone, ShieldCheck, HeartPulse, Pill, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CaregiverBanner: React.FC = () => {
  const { patient, todayDoses, currentVitals, hardware, alerts } = useApp();

  const takenCount = todayDoses.filter(d => d.status === 'taken').length;
  const missedCount = todayDoses.filter(d => d.status === 'missed').length;
  const activeAlertCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white rounded-2xl p-6 shadow-elevated mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Users className="w-6 h-6 text-brand-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-brand-200">
                Caregiver Monitoring Mode
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Active Telemetry
              </span>
            </div>
            <h3 className="text-lg font-bold">
              Monitoring Patient: {patient.name} ({patient.age} yrs, {patient.blood_group})
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${patient.contact}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-sm transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Call Patient
          </a>
          <a
            href={`tel:${patient.emergency_contact}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-semibold transition-colors shadow-sm"
          >
            Emergency Contact
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-2">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-brand-200 text-xs font-medium">
            <Pill className="w-3.5 h-3.5" /> Medication Today
          </div>
          <div className="mt-2 text-xl font-bold">
            {takenCount} <span className="text-xs font-normal text-brand-200">taken</span> / {missedCount}{' '}
            <span className="text-xs font-normal text-rose-300">missed</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-brand-200 text-xs font-medium">
            <HeartPulse className="w-3.5 h-3.5" /> Vitals Telemetry
          </div>
          <div className="mt-2 text-xl font-bold">
            {currentVitals.heartRate} <span className="text-xs font-normal text-brand-200">BPM</span> •{' '}
            {currentVitals.spo2}% <span className="text-xs font-normal text-brand-200">SpO₂</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-brand-200 text-xs font-medium">
            <Cpu className="w-3.5 h-3.5" /> Hardware & Watch
          </div>
          <div className="mt-2 text-sm font-bold flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${hardware.arduino_status === 'Connected' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className={hardware.arduino_status === 'Connected' ? 'text-emerald-300' : 'text-slate-300'}>
              {hardware.arduino_status === 'Connected' ? 'Hardware Online' : 'Hardware Disconnected'}
            </span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-brand-200 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Pending Alerts
          </div>
          <div className="mt-2 text-xl font-bold flex items-center gap-2">
            <span>{activeAlertCount} Active</span>
            {activeAlertCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold">
                Attention
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
