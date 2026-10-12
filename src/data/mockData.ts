import { Patient, Medicine, DoseLog, HealthReading, AlertItem, SettingsConfig } from '../types';

export const INITIAL_PATIENT: Patient = {
  id: 'PAT-8051-01',
  name: 'Sathwik',
  age: 22,
  gender: 'Male',
  contact: '+91 94401 23456',
  emergency_contact: '+91 98765 43210',
  emergency_contact_name: 'Dr. R. Sharma (Consultant)',
  blood_group: 'O+',
  doctor_name: 'Dr. R. Sharma, MD',
  doctor_contact: '+91 98765 43210',
  caregiver_name: 'Anita',
  caregiver_relation: 'Mother / Primary Caregiver',
  caregiver_phone: '+91 94401 98765',
  medical_conditions: ['Post-surgery medication routine', 'Cardiac vitals observation', 'Mild hypertension surveillance']
};

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'MED-01',
    patient_id: 'PAT-8051-01',
    medicine_name: 'Amoxicillin',
    dosage: '500 mg',
    scheduled_time: '08:00 AM',
    time_slot: 'Morning',
    frequency: 'Once daily',
    quantity: 18,
    total_quantity: 30,
    daily_dose: 1,
    compartment: 1,
    before_after_food: 'After Food',
    reminder_duration_mins: 45,
    start_date: '2026-10-01',
    end_date: '2026-10-30',
    paused: false,
    category: 'Antibiotic',
    color_tag: '#7E22CE'
  },
  {
    id: 'MED-02',
    patient_id: 'PAT-8051-01',
    medicine_name: 'Atorvastatin',
    dosage: '20 mg',
    scheduled_time: '01:00 PM',
    time_slot: 'Afternoon',
    frequency: 'Once daily',
    quantity: 5,
    total_quantity: 30,
    daily_dose: 1,
    compartment: 2,
    before_after_food: 'After Food',
    reminder_duration_mins: 30,
    start_date: '2026-09-15',
    end_date: '2026-10-25',
    paused: false,
    category: 'Cardiovascular',
    color_tag: '#9333EA'
  },
  {
    id: 'MED-03',
    patient_id: 'PAT-8051-01',
    medicine_name: 'Metformin',
    dosage: '500 mg',
    scheduled_time: '08:00 PM',
    time_slot: 'Evening',
    frequency: 'Once daily',
    quantity: 28,
    total_quantity: 30,
    daily_dose: 1,
    compartment: 3,
    before_after_food: 'Before Food',
    reminder_duration_mins: 60,
    start_date: '2026-10-01',
    end_date: '2026-11-01',
    paused: false,
    category: 'Metabolic',
    color_tag: '#A855F7'
  },
  {
    id: 'MED-04',
    patient_id: 'PAT-8051-01',
    medicine_name: 'Multivitamin Complex',
    dosage: '1 capsule',
    scheduled_time: '08:00 AM',
    time_slot: 'Morning',
    frequency: 'Once daily',
    quantity: 24,
    total_quantity: 30,
    daily_dose: 1,
    compartment: 4,
    before_after_food: 'With Food',
    reminder_duration_mins: 30,
    start_date: '2026-10-01',
    end_date: '2026-10-31',
    paused: false,
    category: 'Supplement',
    color_tag: '#6B21A8'
  }
];

export const INITIAL_TODAY_DOSES: DoseLog[] = [
  {
    id: 'DOSE-101',
    medicine_id: 'MED-01',
    medicine_name: 'Amoxicillin',
    dosage: '500 mg (1 tablet)',
    compartment: 1,
    time_slot: 'Morning',
    scheduled_time: '08:00 AM',
    scheduled_date: '2026-10-07',
    accessed_time: '08:04 AM',
    status: 'taken',
    delay_minutes: 4,
    notes: 'Reed switch triggered & box opened on schedule'
  },
  {
    id: 'DOSE-102',
    medicine_id: 'MED-04',
    medicine_name: 'Multivitamin Complex',
    dosage: '1 capsule',
    compartment: 4,
    time_slot: 'Morning',
    scheduled_time: '08:00 AM',
    scheduled_date: '2026-10-07',
    accessed_time: '08:05 AM',
    status: 'taken',
    delay_minutes: 5,
    notes: 'Taken with breakfast'
  },
  {
    id: 'DOSE-103',
    medicine_id: 'MED-02',
    medicine_name: 'Atorvastatin',
    dosage: '20 mg (1 tablet)',
    compartment: 2,
    time_slot: 'Afternoon',
    scheduled_time: '01:00 PM',
    scheduled_date: '2026-10-07',
    status: 'missed',
    delay_minutes: 0,
    notes: 'Buzzer sounded for 30 mins; box was not opened'
  },
  {
    id: 'DOSE-104',
    medicine_id: 'MED-03',
    medicine_name: 'Metformin',
    dosage: '500 mg (1 tablet)',
    compartment: 3,
    time_slot: 'Evening',
    scheduled_time: '08:00 PM',
    scheduled_date: '2026-10-07',
    status: 'upcoming',
    notes: 'Next scheduled dose for tonight'
  }
];

export const INITIAL_HEALTH_READINGS: HealthReading[] = [
  {
    id: 'HR-201',
    patient_id: 'PAT-8051-01',
    heart_rate: 78,
    spo2: 98,
    systolic_bp: 120,
    diastolic_bp: 80,
    recorded_at: '2026-10-07T10:42:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-202',
    patient_id: 'PAT-8051-01',
    heart_rate: 80,
    spo2: 97,
    systolic_bp: 118,
    diastolic_bp: 78,
    recorded_at: '2026-10-07T10:30:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-203',
    patient_id: 'PAT-8051-01',
    heart_rate: 76,
    spo2: 98,
    systolic_bp: 121,
    diastolic_bp: 79,
    recorded_at: '2026-10-07T09:15:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-204',
    patient_id: 'PAT-8051-01',
    heart_rate: 82,
    spo2: 99,
    systolic_bp: 122,
    diastolic_bp: 81,
    recorded_at: '2026-10-07T08:00:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-205',
    patient_id: 'PAT-8051-01',
    heart_rate: 74,
    spo2: 98,
    systolic_bp: 119,
    diastolic_bp: 79,
    recorded_at: '2026-10-06T20:30:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-206',
    patient_id: 'PAT-8051-01',
    heart_rate: 77,
    spo2: 97,
    systolic_bp: 120,
    diastolic_bp: 80,
    recorded_at: '2026-10-06T14:15:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-207',
    patient_id: 'PAT-8051-01',
    heart_rate: 79,
    spo2: 98,
    systolic_bp: 122,
    diastolic_bp: 82,
    recorded_at: '2026-10-06T08:05:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-208',
    patient_id: 'PAT-8051-01',
    heart_rate: 75,
    spo2: 99,
    systolic_bp: 118,
    diastolic_bp: 78,
    recorded_at: '2026-10-05T18:00:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-209',
    patient_id: 'PAT-8051-01',
    heart_rate: 81,
    spo2: 97,
    systolic_bp: 124,
    diastolic_bp: 83,
    recorded_at: '2026-10-05T08:10:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  },
  {
    id: 'HR-210',
    patient_id: 'PAT-8051-01',
    heart_rate: 76,
    spo2: 98,
    systolic_bp: 120,
    diastolic_bp: 80,
    recorded_at: '2026-10-04T12:00:00',
    source: 'Samsung Galaxy Watch 5 Pro',
    status: 'Normal'
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-01',
    patient_id: 'PAT-8051-01',
    type: 'medication',
    title: 'Missed Dose Detected',
    message: 'Afternoon medicine (Atorvastatin 20mg) was not accessed within the configured reminder window.',
    severity: 'warning',
    created_at: '2026-10-07T13:45:00',
    read_status: false,
    acknowledged: false,
    action_required: 'Check with patient if dose was taken manually.'
  },
  {
    id: 'ALT-02',
    patient_id: 'PAT-8051-01',
    type: 'inventory',
    title: 'Low Medicine Stock',
    message: 'Atorvastatin 20mg has only 5 tablets remaining. Refill reminder active.',
    severity: 'warning',
    created_at: '2026-10-07T09:00:00',
    read_status: false,
    acknowledged: false,
    action_required: 'Pharmacy prescription refill needed within 3 days.'
  },
  {
    id: 'ALT-03',
    patient_id: 'PAT-8051-01',
    type: 'health',
    title: 'Health Data Synchronized',
    message: 'Galaxy Watch 5 Pro synced successfully: Heart Rate 78 BPM, SpO₂ 98%. Both within safe baseline.',
    severity: 'info',
    created_at: '2026-10-07T10:42:00',
    read_status: true,
    acknowledged: true
  },
  {
    id: 'ALT-04',
    patient_id: 'PAT-8051-01',
    type: 'device',
    title: 'Hardware Link Online',
    message: 'Arduino UNO and 8051 Microcontroller communications synchronized via serial bus.',
    severity: 'info',
    created_at: '2026-10-07T07:30:00',
    read_status: true,
    acknowledged: true
  },
  {
    id: 'ALT-05',
    patient_id: 'PAT-8051-01',
    type: 'device',
    title: 'Watch Not Connected',
    message: 'Samsung Galaxy Watch 5 Pro is not currently connected. Open MediBox Care Companion App on your phone.',
    severity: 'warning',
    created_at: '2026-10-07T06:00:00',
    read_status: false,
    acknowledged: false,
    action_required: 'Open companion app and ensure Bluetooth is enabled.'
  }
];

export const INITIAL_SETTINGS: SettingsConfig = {
  heart_rate_min: 55,
  heart_rate_max: 100,
  spo2_min: 94,
  systolic_bp_max: 135,
  diastolic_bp_max: 85,
  reminder_window_mins: 45,
  enable_sound: true,
  enable_browser_notifications: true,
  demo_mode: true,
  baud_rate: 115200,
  caregiver_view_active: false,
  api_endpoint: ''
};
