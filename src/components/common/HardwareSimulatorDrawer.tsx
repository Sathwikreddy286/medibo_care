import React, { useState } from 'react';
import {
  Sparkles, ChevronUp, RotateCw, DoorOpen,
  Heart, Wind, Volume2, X, Cpu, Watch
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { serialService } from '../../services/serialService';
import { watchService } from '../../services/watchService';

export const HardwareSimulatorDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    simulateHardwareDispense, simulateToggleBoxLid,
    simulateIncomingSerialString, hardware, addHealthReading, patient, syncWatch
  } = useApp();

  const handleSimulateWatchReading = (hr: number, spo2: number, status: 'Normal' | 'Attention' | 'Critical') => {
    addHealthReading({
      patient_id: patient.id,
      heart_rate: hr,
      spo2,
      systolic_bp: undefined,
      diastolic_bp: undefined,
      recorded_at: new Date().toISOString(),
      source: 'Demo Simulator',
      status
    });
  };

  const handleBuzzerSound = () => serialService.playAlertSound();

  const handleSimulateMedicineEvent = (slot: string, status: 'TAKEN' | 'MISSED') => {
    const raw = JSON.stringify({
      type: 'medicine',
      medicine: slot,
      status,
      scheduled_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString()
    });
    simulateIncomingSerialString(raw);
  };

  return (
    <div className="no-print fixed bottom-4 right-4 z-40 max-w-md w-full">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-900 text-white shadow-elevated border border-purple-400/30 hover:bg-brand-800 transition-all text-xs font-bold ring-2 ring-purple-500/20"
        >
          <Sparkles className="w-4 h-4 text-brand-300" />
          <span>ECE Hardware Simulation Bench</span>
          <ChevronUp className="w-4 h-4 text-brand-300" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated overflow-hidden">
          <div className="px-5 py-3.5 bg-gradient-to-r from-brand-900 to-brand-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-300" />
              <div>
                <h4 className="text-xs font-bold">Academic Hardware Testing Bench</h4>
                <p className="text-[10px] text-brand-200">Inject microcontroller and watch events for testing</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-brand-300 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[72vh] overflow-y-auto text-xs">
            {/* 1. Servo Dispense */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5 mb-2">
                <RotateCw className="w-3.5 h-3.5 text-brand-600" /> 1. SG90 Servo Compartment Dispense (8051 PWM)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(slot => (
                  <button
                    key={slot}
                    onClick={() => simulateHardwareDispense(slot)}
                    className="py-1.5 px-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-brand-800 border border-purple-200/80 font-bold text-center transition-colors"
                  >
                    Slot {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Reed Switch */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5 mb-2">
                <DoorOpen className="w-3.5 h-3.5 text-emerald-600" /> 2. Magnetic Reed Switch (Box Lid)
              </span>
              <button
                onClick={simulateToggleBoxLid}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-800 font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                Box Lid: <strong className="text-brand-700">{hardware.box_lid}</strong> (Click to Toggle)
              </button>
            </div>

            {/* 3. Simulate Watch Health Data */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5 mb-1">
                <Watch className="w-3.5 h-3.5 text-indigo-600" /> 3. Galaxy Watch 5 Pro Health Simulation
              </span>
              <p className="text-[10px] text-charcoal-400 mb-2">Injects demo health readings (marked as Demo Simulator source)</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSimulateWatchReading(76, 98, 'Normal')}
                  className="py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold transition-colors text-center"
                >
                  Normal<br/><span className="text-[10px]">76 BPM / 98%</span>
                </button>
                <button
                  onClick={() => handleSimulateWatchReading(115, 96, 'Attention')}
                  className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold transition-colors text-center"
                >
                  Elevated<br/><span className="text-[10px]">115 BPM</span>
                </button>
                <button
                  onClick={() => handleSimulateWatchReading(82, 88, 'Critical')}
                  className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-semibold transition-colors text-center"
                >
                  Low SpO₂<br/><span className="text-[10px]">SpO₂ 88%</span>
                </button>
              </div>
              <button
                onClick={() => syncWatch()}
                className="mt-2 w-full py-1.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Watch className="w-3 h-3" /> Simulate Watch Sync (API)
              </button>
            </div>

            {/* 4. Medicine Events */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5 mb-2">
                <Heart className="w-3.5 h-3.5 text-brand-600" /> 4. Medicine Events (Arduino JSON)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSimulateMedicineEvent('Amoxicillin', 'TAKEN')}
                  className="py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold transition-colors"
                >
                  TAKEN Event
                </button>
                <button
                  onClick={() => handleSimulateMedicineEvent('Atorvastatin', 'MISSED')}
                  className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-semibold transition-colors"
                >
                  MISSED Event
                </button>
              </div>
            </div>

            {/* 5. Audio */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5 mb-2">
                <Volume2 className="w-3.5 h-3.5 text-purple-600" /> 5. Piezo Buzzer Web Audio
              </span>
              <button
                onClick={handleBuzzerSound}
                className="w-full py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-brand-800 border border-purple-200 font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" /> Play Buzzer Chime
              </button>
            </div>

            <p className="text-[10px] text-charcoal-400 text-center italic pt-1">
              All simulated data is clearly marked DEMO. Never mixed with live hardware data without labels.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
