import React, { useState } from 'react';
import { Pill, AlertTriangle, Plus, RefreshCw, Box, Check, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

export const MedicationView: React.FC = () => {
  const { medicines, refillMedicine, setActiveTab, simulateHardwareDispense } = useApp();
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  const [refillAmount, setRefillAmount] = useState<number>(30);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState<boolean>(false);

  const selectedMed = medicines.find(m => m.id === selectedMedId);

  const handleOpenRefill = (id: string) => {
    setSelectedMedId(id);
    setIsRefillModalOpen(true);
  };

  const handleConfirmRefill = () => {
    if (selectedMedId) {
      refillMedicine(selectedMedId, refillAmount);
      setIsRefillModalOpen(false);
      setSelectedMedId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">Medicine Inventory & Compartments</h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Real-time pill counts, low stock alerts, and 8051 physical compartment assignments.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('schedule')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Medicine
        </button>
      </div>

      {/* Visual Box Compartment Grid (4 Slots) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-brand-700" />
            <h3 className="text-sm font-bold text-charcoal-900">Physical Box Compartments (8051 Servo Controlled)</h3>
          </div>
          <span className="text-xs text-charcoal-400">4-Chamber Carousel Layout</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(compNum => {
            const medInComp = medicines.find(m => m.compartment === compNum);
            const isLow = medInComp ? medInComp.quantity <= 7 : false;

            return (
              <div
                key={compNum}
                className={`p-4 rounded-xl border relative transition-all ${
                  medInComp
                    ? isLow
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-purple-50/30 border-purple-200/80 hover:border-brand-300'
                    : 'bg-slate-50 border-dashed border-slate-200 text-charcoal-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-white border border-slate-200 text-charcoal-800">
                    Slot #{compNum}
                  </span>
                  {medInComp && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isLow ? 'bg-amber-100 text-amber-800' : 'bg-brand-100 text-brand-800'
                      }`}
                    >
                      {medInComp.quantity} Left
                    </span>
                  )}
                </div>

                {medInComp ? (
                  <div>
                    <h4 className="font-bold text-sm text-charcoal-900 truncate">{medInComp.medicine_name}</h4>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      {medInComp.dosage} • {medInComp.time_slot} ({medInComp.scheduled_time})
                    </p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => simulateHardwareDispense(compNum)}
                        className="text-[11px] font-semibold text-brand-700 hover:text-brand-900 hover:underline"
                        title="Simulate servo motor rotation"
                      >
                        Test Dispense ⚙
                      </button>
                      <button
                        onClick={() => handleOpenRefill(medInComp.id)}
                        className="text-[11px] font-semibold text-charcoal-600 hover:text-brand-800"
                      >
                        + Refill
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs font-medium text-charcoal-400">Compartment Empty</p>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="mt-2 text-xs font-semibold text-brand-700 hover:underline"
                    >
                      Assign Medicine
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Medication Stock Table (Section 11) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-brand-700" />
            <h3 className="font-bold text-sm sm:text-base text-charcoal-900">Medicine Stock & Refill Status</h3>
          </div>
          <span className="text-xs text-charcoal-500 font-medium">Tracking {medicines.length} Formulations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-charcoal-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-6">Medicine</th>
                <th className="py-3.5 px-4 text-center">Compartment</th>
                <th className="py-3.5 px-4 text-right">Remaining Pills</th>
                <th className="py-3.5 px-4 text-center">Daily Dose</th>
                <th className="py-3.5 px-4 text-center">Days Left</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map(med => {
                const daysLeft = Math.floor(med.quantity / Math.max(1, med.daily_dose));
                const isLow = med.quantity <= 7;

                return (
                  <tr key={med.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: med.color_tag || '#7E22CE' }}
                        ></div>
                        <div>
                          <p className="font-bold text-charcoal-900">{med.medicine_name}</p>
                          <p className="text-xs text-charcoal-500">
                            {med.dosage} • {med.before_after_food}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-xs font-bold text-charcoal-700">
                        Slot #{med.compartment}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="font-extrabold text-charcoal-900 text-base">{med.quantity}</span>
                      <span className="text-xs text-charcoal-400"> / {med.total_quantity}</span>
                    </td>

                    <td className="py-4 px-4 text-center text-charcoal-700 font-medium">
                      {med.daily_dose} {med.daily_dose === 1 ? 'pill' : 'pills'}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span
                        className={`font-semibold ${
                          daysLeft <= 5 ? 'text-rose-600 font-bold' : daysLeft <= 10 ? 'text-amber-600' : 'text-charcoal-700'
                        }`}
                      >
                        ~{daysLeft} days
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" /> Available
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenRefill(med.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                          isLow
                            ? 'bg-brand-700 text-white border-brand-700 hover:bg-brand-800 shadow-xs'
                            : 'bg-white text-charcoal-700 border-slate-200 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-200'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3" />
                        Refill
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refill Modal */}
      <Modal
        isOpen={isRefillModalOpen}
        onClose={() => setIsRefillModalOpen(false)}
        title={`Refill Stock: ${selectedMed?.medicine_name}`}
        subtitle={`Current stock in Compartment #${selectedMed?.compartment}: ${selectedMed?.quantity} units`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-2">
              Select Quantity to Add
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setRefillAmount(cnt)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    refillAmount === cnt
                      ? 'bg-brand-700 text-white border-brand-700 shadow-xs'
                      : 'bg-white text-charcoal-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  +{cnt} Tablets
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Custom Pill Count
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={refillAmount}
              onChange={e => setRefillAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-charcoal-600">
            <strong>Resulting stock:</strong> {(selectedMed?.quantity || 0) + refillAmount} tablets. This will automatically clear any active low-stock alerts.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsRefillModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRefill}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-xs transition-colors"
            >
              Confirm Refill
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
