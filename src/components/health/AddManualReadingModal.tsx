import React, { useState } from 'react';
import { HealthReading, HealthDataSource } from '../../types';
import { Modal } from '../common/Modal';

interface AddManualReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reading: Omit<HealthReading, 'id'>) => void;
}

export const AddManualReadingModal: React.FC<AddManualReadingModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [heartRate, setHeartRate] = useState<number>(78);
  const [spo2, setSpo2] = useState<number>(98);
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [source, setSource] = useState<HealthDataSource>('External BP Device');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      patient_id: 'PAT-8051-01',
      heart_rate: heartRate,
      spo2,
      systolic_bp: systolic,
      diastolic_bp: diastolic,
      recorded_at: new Date().toISOString(),
      source,
      status: heartRate > 100 || spo2 < 94 || systolic > 140 ? 'Attention' : 'Normal'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Health & Blood Pressure Reading"
      subtitle="Enter readings from external cuff device or sensor calibration test."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 mb-1">
            Data Source Device
          </label>
          <select
            value={source}
            onChange={e => setSource(e.target.value as HealthDataSource)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="External BP Device">External BP Cuff Module</option>
            <option value="Samsung Galaxy Watch 5 Pro">Samsung Galaxy Watch 5 Pro</option>
            <option value="Manual Entry">Manual Clinical Reading</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Systolic BP (mmHg)
            </label>
            <input
              type="number"
              min="70"
              max="220"
              value={systolic}
              onChange={e => setSystolic(parseInt(e.target.value) || 120)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Diastolic BP (mmHg)
            </label>
            <input
              type="number"
              min="40"
              max="140"
              value={diastolic}
              onChange={e => setDiastolic(parseInt(e.target.value) || 80)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Heart Rate (BPM)
            </label>
            <input
              type="number"
              min="40"
              max="200"
              value={heartRate}
              onChange={e => setHeartRate(parseInt(e.target.value) || 75)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              SpO₂ Oxygen (%)
            </label>
            <input
              type="number"
              min="70"
              max="100"
              value={spo2}
              onChange={e => setSpo2(parseInt(e.target.value) || 98)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-charcoal-600">
          <strong>Hardware separation:</strong> Pulse & SpO₂ sync from Samsung Galaxy Watch 5 Pro. Blood pressure readings are recorded via external cuff or clinical input.
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-xs"
          >
            Record Reading
          </button>
        </div>
      </form>
    </Modal>
  );
};
