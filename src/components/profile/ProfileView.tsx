import React, { useState } from 'react';
import {
  UserRound,
  Edit2,
  Phone,
  PhoneCall,
  ShieldAlert,
  User,
  Heart,
  Activity,
  Calendar,
  Sparkles,
  Stethoscope,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

export const ProfileView: React.FC = () => {
  const { patient, updatePatient } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    blood_group: patient.blood_group,
    contact: patient.contact,
    emergency_contact: patient.emergency_contact,
    emergency_contact_name: patient.emergency_contact_name,
    doctor_name: patient.doctor_name,
    doctor_contact: patient.doctor_contact,
    caregiver_name: patient.caregiver_name,
    caregiver_relation: patient.caregiver_relation,
    caregiver_phone: patient.caregiver_phone
  });

  const handleOpenEdit = () => {
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      blood_group: patient.blood_group,
      contact: patient.contact,
      emergency_contact: patient.emergency_contact,
      emergency_contact_name: patient.emergency_contact_name,
      doctor_name: patient.doctor_name,
      doctor_contact: patient.doctor_contact,
      caregiver_name: patient.caregiver_name,
      caregiver_relation: patient.caregiver_relation,
      caregiver_phone: patient.caregiver_phone
    });
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient({
      ...formData,
      age: Number(formData.age)
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <UserRound className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">Patient & Caregiver Profile</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Emergency contacts, attending clinician contacts, and medical monitoring parameters.
          </p>
        </div>

        <button
          onClick={handleOpenEdit}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white hover:bg-brand-800 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Edit2 className="w-4 h-4" /> Edit Profile Details
        </button>
      </div>

      {/* Main Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Identity Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-black text-3xl flex items-center justify-center shadow-card ring-4 ring-purple-100">
            {patient.name.charAt(0)}
          </div>

          <h3 className="text-xl font-extrabold text-charcoal-900 mt-4">{patient.name}</h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60 mt-1">
            Registered Patient ID: {patient.id}
          </span>

          <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-charcoal-500">Age:</span>
              <span className="font-semibold text-charcoal-800">{patient.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Gender:</span>
              <span className="font-semibold text-charcoal-800">{patient.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Blood Group:</span>
              <span className="font-bold text-brand-700">{patient.blood_group}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Phone Number:</span>
              <a href={`tel:${patient.contact}`} className="font-semibold text-brand-700 hover:underline">
                {patient.contact}
              </a>
            </div>
          </div>

          <div className="w-full mt-6 pt-4 border-t border-slate-100">
            <a
              href={`tel:${patient.contact}`}
              className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-brand-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-600" /> Direct Dial Patient
            </a>
          </div>
        </div>

        {/* Clinical Emergency & Caregiver Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Emergency Alert Card */}
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 border border-rose-200/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-rose-700">
                  Primary Emergency Protocol
                </span>
                <h4 className="text-base font-bold text-charcoal-900 mt-0.5">
                  Emergency Contact: {patient.emergency_contact_name}
                </h4>
                <p className="text-xs text-charcoal-600 mt-1">
                  Automated dispatch triggers if 3 consecutive scheduled doses are missed or critical vitals are detected.
                </p>
              </div>
            </div>

            <a
              href={`tel:${patient.emergency_contact}`}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap flex items-center gap-2 self-start sm:self-auto"
            >
              <PhoneCall className="w-4 h-4" /> Call {patient.emergency_contact}
            </a>
          </div>

          {/* Primary Caregiver & Doctor Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Caregiver */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-brand-700 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Designated Caregiver</span>
                </div>
                <h4 className="text-base font-bold text-charcoal-900">{patient.caregiver_name}</h4>
                <p className="text-xs text-charcoal-500">{patient.caregiver_relation}</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-charcoal-500">Mobile:</span>
                    <a href={`tel:${patient.caregiver_phone}`} className="font-semibold text-brand-700 hover:underline">
                      {patient.caregiver_phone}
                    </a>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-charcoal-500">Telemetry Access:</span>
                    <span className="font-semibold text-emerald-600">Full Dashboard Mode</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${patient.caregiver_phone}`}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call Caregiver
              </a>
            </div>

            {/* Attending Physician */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-brand-700 mb-2">
                  <Stethoscope className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Consulting Physician</span>
                </div>
                <h4 className="text-base font-bold text-charcoal-900">{patient.doctor_name}</h4>
                <p className="text-xs text-charcoal-500">Department of Cardiology / Internal Medicine</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-charcoal-500">Clinic Phone:</span>
                    <a href={`tel:${patient.doctor_contact}`} className="font-semibold text-brand-700 hover:underline">
                      {patient.doctor_contact}
                    </a>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-charcoal-500">Prescription Status:</span>
                    <span className="font-semibold text-emerald-600">Active Regimen Verified</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${patient.doctor_contact}`}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call Doctor
              </a>
            </div>
          </div>

          {/* Chronic Medical Conditions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle">
            <h4 className="text-sm font-bold text-charcoal-900 mb-2">Medical Conditions & Monitoring Directives</h4>
            <div className="flex flex-wrap gap-2">
              {patient.medical_conditions.map((condition, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 text-brand-800 border border-purple-200/80"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient Information"
        subtitle="Update contact coordinates, caregiver, and emergency contacts"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Patient Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Blood Group</label>
              <input
                type="text"
                value={formData.blood_group}
                onChange={e => setFormData({ ...formData, blood_group: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Patient Phone</label>
              <input
                type="text"
                value={formData.contact}
                onChange={e => setFormData({ ...formData, contact: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Attending Doctor Name</label>
              <input
                type="text"
                value={formData.doctor_name}
                onChange={e => setFormData({ ...formData, doctor_name: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Doctor Phone</label>
              <input
                type="text"
                value={formData.doctor_contact}
                onChange={e => setFormData({ ...formData, doctor_contact: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Caregiver Name</label>
              <input
                type="text"
                value={formData.caregiver_name}
                onChange={e => setFormData({ ...formData, caregiver_name: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Caregiver Phone</label>
              <input
                type="text"
                value={formData.caregiver_phone}
                onChange={e => setFormData({ ...formData, caregiver_phone: e.target.value })}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-charcoal-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
