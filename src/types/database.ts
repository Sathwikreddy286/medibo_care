/**
 * MediBox Care - Database Data Models
 * Backend database schemas for Patient Medication & Health Monitoring System
 */

export interface DatabasePatient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  emergency_contact: string;
  emergency_contact_name?: string;
  doctor_name?: string;
  doctor_contact?: string;
  caregiver_name?: string;
  caregiver_phone?: string;
  blood_group?: string;
  created_at: string;
}

export interface DatabaseMedicine {
  id: string;
  patient_id: string;
  medicine_name: string;
  dosage: string;
  quantity: number;
  scheduled_time: string;
  frequency: string;
  compartment: number;
  start_date: string;
  end_date: string;
  daily_dose: number;
  category: string;
  created_at: string;
}

export interface DatabaseDoseLog {
  id: string;
  medicine_id: string;
  patient_id: string;
  scheduled_time: string;
  accessed_time: string | null;
  status: 'taken' | 'missed' | 'delayed' | 'upcoming';
  delay_minutes: number;
  notes?: string;
  created_at: string;
}

export interface DatabaseHealthReading {
  id: string;
  patient_id: string;
  source: 'samsung_galaxy_watch_5_pro' | 'external_bp_device' | 'manual_entry' | 'demo_data';
  heart_rate: number;
  spo2: number;
  systolic_bp?: number | null;
  diastolic_bp?: number | null;
  recorded_at: string;
  created_at: string;
}

export interface DatabaseDevice {
  id: string;
  patient_id: string;
  device_type: 'arduino_uno' | 'mcu_8051' | 'samsung_galaxy_watch_5_pro' | 'rtc_ds3231' | 'servo_actuator' | 'reed_switch' | 'lcd_display' | 'buzzer';
  device_name: string;
  status: 'online' | 'offline' | 'warning' | 'synced';
  last_seen: string;
  firmware_version?: string;
  connection_metadata?: Record<string, any>;
  created_at: string;
}

export interface DatabaseAlert {
  id: string;
  patient_id: string;
  type: 'medication' | 'health' | 'device' | 'inventory';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  action_required?: string;
  read_status: boolean;
  created_at: string;
}
