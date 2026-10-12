import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  Pill,
  Pause,
  Play,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Utensils,
  Box
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Medicine } from '../../types';
import { AddMedicineModal } from './AddMedicineModal';
import { DoseBadge } from '../common/Badge';

export const ScheduleView: React.FC = () => {
  const {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    togglePauseMedicine,
    todayDoses,
    updateDoseStatus,
    simulateHardwareDispense
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('All');

  const slots = ['All', 'Morning', 'Afternoon', 'Evening', 'Night'];

  const filteredMedicines = medicines.filter(m => {
    if (selectedSlot === 'All') return true;
    return m.time_slot === selectedSlot;
  });

  const handleEdit = (med: Medicine) => {
    setEditingMedicine(med);
    setIsAddModalOpen(true);
  };

  const handleSaveMedicine = (medData: Omit<Medicine, 'id'>) => {
    if (editingMedicine) {
      updateMedicine(editingMedicine.id, medData);
    } else {
      addMedicine(medData);
    }
    setEditingMedicine(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">Daily Medication Schedule</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Synchronized with DS3231 RTC on 8051. Automatically triggers buzzer reminders and compartment servo rotation.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMedicine(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Schedule Item
        </button>
      </div>

      {/* Time Slot Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {slots.map(slot => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSlot === slot
                ? 'bg-brand-700 text-white shadow-xs'
                : 'bg-white text-charcoal-600 hover:text-charcoal-900 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            {slot === 'All' ? 'All Day Routine' : `${slot} Slot`}
          </button>
        ))}
      </div>

      {/* Today's Active Execution Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-charcoal-900">Today's Dose Queue</h3>
            <p className="text-xs text-charcoal-500">Live hardware dispatch and user intake verification</p>
          </div>
          <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            {todayDoses.filter(d => d.status === 'taken').length} of {todayDoses.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todayDoses.map(dose => (
            <div
              key={dose.id}
              className={`p-4 rounded-xl border transition-all ${
                dose.status === 'taken'
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : dose.status === 'missed'
                  ? 'border-rose-200 bg-rose-50/30'
                  : dose.status === 'delayed'
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-slate-200 bg-white hover:border-brand-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-extrabold text-charcoal-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-600" /> {dose.scheduled_time}
                </span>
                <DoseBadge status={dose.status} size="sm" />
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-bold text-charcoal-900">{dose.medicine_name}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-charcoal-500">
                  <span>{dose.dosage}</span>
                  <span>•</span>
                  <span className="font-medium text-brand-700">Compartment {dose.compartment}</span>
                </div>
              </div>

              {dose.accessed_time && (
                <div className="mt-2 text-[11px] text-charcoal-500">
                  Accessed at: <span className="font-semibold text-charcoal-700">{dose.accessed_time}</span>
                </div>
              )}

              {/* Status Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                {dose.status !== 'taken' && (
                  <button
                    onClick={() => updateDoseStatus(dose.id, 'taken')}
                    className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                    title="Mark Taken"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Taken
                  </button>
                )}
                {dose.status === 'upcoming' && (
                  <button
                    onClick={() => updateDoseStatus(dose.id, 'missed')}
                    className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors"
                    title="Mark Missed"
                  >
                    Missed
                  </button>
                )}
                <button
                  onClick={() => simulateHardwareDispense(dose.compartment)}
                  className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-brand-800 border border-purple-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                  title="Simulate Hardware Dispense"
                >
                  <Box className="w-3 h-3" /> Dispense
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Medicines Catalog */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">Configured Medication Rules</h3>
            <p className="text-xs text-charcoal-500">Permanent schedule saved in microcontroller RTC memory</p>
          </div>
          <span className="text-xs font-semibold text-charcoal-500">
            Showing {filteredMedicines.length} of {medicines.length} routines
          </span>
        </div>

        {filteredMedicines.length === 0 ? (
          <div className="p-12 text-center">
            <Pill className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-charcoal-700">No schedules configured for this slot</h4>
            <p className="text-xs text-charcoal-400 mt-1">Click "Add Schedule Item" above to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMedicines.map(med => (
              <div
                key={med.id}
                className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  med.paused ? 'bg-slate-50/60 opacity-75' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0"
                    style={{ backgroundColor: med.color_tag || '#7E22CE' }}
                  >
                    C{med.compartment}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-charcoal-900">{med.medicine_name}</h4>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-charcoal-700">
                        {med.dosage}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
                        {med.category}
                      </span>
                      {med.paused && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Paused
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-charcoal-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-charcoal-700">
                        <Clock className="w-3.5 h-3.5 text-brand-600" />
                        {med.scheduled_time} ({med.time_slot})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-charcoal-400" />
                        {med.before_after_food}
                      </span>
                      <span>•</span>
                      <span>Reminder Window: {med.reminder_duration_mins} mins</span>
                      <span>•</span>
                      <span>{med.frequency}</span>
                    </div>

                    <div className="mt-2 text-xs text-charcoal-400">
                      Duration: {med.start_date} to {med.end_date} • Remaining: {med.quantity} / {med.total_quantity} pills
                    </div>
                  </div>
                </div>

                {/* Row Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => togglePauseMedicine(med.id)}
                    className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1 ${
                      med.paused
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'border-slate-200 text-charcoal-600 hover:bg-slate-100'
                    }`}
                    title={med.paused ? 'Resume routine' : 'Pause routine'}
                  >
                    {med.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    <span className="hidden sm:inline">{med.paused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    onClick={() => handleEdit(med)}
                    className="p-2 rounded-xl border border-slate-200 text-charcoal-600 hover:text-brand-700 hover:bg-brand-50 hover:border-brand-200 transition-colors"
                    title="Edit schedule"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete schedule for ${med.medicine_name}?`)) {
                        deleteMedicine(med.id);
                      }
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                    title="Delete schedule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMedicine(null);
        }}
        onSave={handleSaveMedicine}
        editingMedicine={editingMedicine}
      />
    </div>
  );
};
