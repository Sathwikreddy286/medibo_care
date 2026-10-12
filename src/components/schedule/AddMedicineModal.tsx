import React, { useState, useEffect } from 'react';
import { Medicine } from '../../types';
import { Modal } from '../common/Modal';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: Omit<Medicine, 'id'>) => void;
  editingMedicine?: Medicine | null;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMedicine
}) => {
  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    patient_id: 'PAT-8051-01',
    medicine_name: '',
    dosage: '1 tablet',
    scheduled_time: '08:00 AM',
    time_slot: 'Morning',
    frequency: 'Once daily',
    quantity: 30,
    total_quantity: 30,
    daily_dose: 1,
    compartment: 1,
    before_after_food: 'After Food',
    reminder_duration_mins: 45,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    paused: false,
    category: 'General',
    color_tag: '#7E22CE'
  });

  useEffect(() => {
    if (editingMedicine) {
      setFormData({
        patient_id: editingMedicine.patient_id,
        medicine_name: editingMedicine.medicine_name,
        dosage: editingMedicine.dosage,
        scheduled_time: editingMedicine.scheduled_time,
        time_slot: editingMedicine.time_slot,
        frequency: editingMedicine.frequency,
        quantity: editingMedicine.quantity,
        total_quantity: editingMedicine.total_quantity,
        daily_dose: editingMedicine.daily_dose,
        compartment: editingMedicine.compartment,
        before_after_food: editingMedicine.before_after_food,
        reminder_duration_mins: editingMedicine.reminder_duration_mins,
        start_date: editingMedicine.start_date,
        end_date: editingMedicine.end_date,
        paused: editingMedicine.paused,
        category: editingMedicine.category,
        color_tag: editingMedicine.color_tag || '#7E22CE'
      });
    } else {
      setFormData({
        patient_id: 'PAT-8051-01',
        medicine_name: '',
        dosage: '1 tablet',
        scheduled_time: '08:00 AM',
        time_slot: 'Morning',
        frequency: 'Once daily',
        quantity: 30,
        total_quantity: 30,
        daily_dose: 1,
        compartment: 1,
        before_after_food: 'After Food',
        reminder_duration_mins: 45,
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        paused: false,
        category: 'General',
        color_tag: '#7E22CE'
      });
    }
  }, [editingMedicine, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicine_name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingMedicine ? 'Edit Medicine Schedule' : 'Add New Medicine Schedule'}
      subtitle="Define dose timings, physical compartment slot, and food relation."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name and Dosage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amoxicillin, Atorvastatin"
              value={formData.medicine_name}
              onChange={e => setFormData({ ...formData, medicine_name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Dosage Specification *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 500 mg, 1 capsule"
              value={formData.dosage}
              onChange={e => setFormData({ ...formData, dosage: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Time, Slot, and Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Time Slot
            </label>
            <select
              value={formData.time_slot}
              onChange={e => setFormData({ ...formData, time_slot: e.target.value as any })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Scheduled Time *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 08:00 AM"
              value={formData.scheduled_time}
              onChange={e => setFormData({ ...formData, scheduled_time: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={e => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="As needed (SOS)">As needed (SOS)</option>
            </select>
          </div>
        </div>

        {/* Compartment, Food, Reminder Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Compartment Number (8051 Servo)
            </label>
            <select
              value={formData.compartment}
              onChange={e => setFormData({ ...formData, compartment: parseInt(e.target.value) })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-semibold"
            >
              <option value={1}>Compartment #1</option>
              <option value={2}>Compartment #2</option>
              <option value={3}>Compartment #3</option>
              <option value={4}>Compartment #4</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Food Relationship
            </label>
            <select
              value={formData.before_after_food}
              onChange={e => setFormData({ ...formData, before_after_food: e.target.value as any })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="Before Food">Before Food</option>
              <option value="After Food">After Food</option>
              <option value="With Food">With Food</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Reminder Window (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="180"
              value={formData.reminder_duration_mins}
              onChange={e => setFormData({ ...formData, reminder_duration_mins: parseInt(e.target.value) || 30 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Quantities & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Initial Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={e => {
                const val = parseInt(e.target.value) || 1;
                setFormData({ ...formData, quantity: val, total_quantity: Math.max(val, formData.total_quantity) });
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Daily Dose (Pills)
            </label>
            <input
              type="number"
              min="1"
              value={formData.daily_dose}
              onChange={e => setFormData({ ...formData, daily_dose: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={e => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={e => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-charcoal-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-xs transition-colors"
          >
            {editingMedicine ? 'Update Schedule' : 'Save & Sync Schedule'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
