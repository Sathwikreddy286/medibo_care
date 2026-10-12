export type DoseStatus = 'taken' | 'missed' | 'delayed' | 'upcoming';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  emergency_contact: string;
  emergency_contact_name: string;
  blood_group: string;
  doctor_name: string;
  doctor_contact: string;
  caregiver_name: string;
  caregiver_relation: string;
  caregiver_phone: string;
  medical_conditions: string[];
}

export interface Medicine {
  id: string;
  patient_id: string;
  medicine_name: string;
  dosage: string; // e.g. "500 mg", "1 tablet"
  scheduled_time: string; // "08:00 AM", "01:00 PM", "08:00 PM"
  time_slot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  frequency: string; // "Once daily", "Twice daily", "Three times daily"
  quantity: number; // remaining pills
  total_quantity: number;
  daily_dose: number;
  compartment: number; // 1, 2, 3, 4
  before_after_food: 'Before Food' | 'After Food' | 'With Food';
  reminder_duration_mins: number; // window e.g. 30 mins
  start_date: string;
  end_date: string;
  paused: boolean;
  category: string;
  color_tag?: string;
}

export interface DoseLog {
  id: string;
  medicine_id: string;
  medicine_name: string;
  dosage: string;
  compartment: number;
  time_slot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  scheduled_time: string;
  scheduled_date: string; // YYYY-MM-DD
  accessed_time?: string;
  status: DoseStatus;
  delay_minutes?: number;
  notes?: string;
}

export type HealthDataSource =
  | 'Samsung Galaxy Watch 5 Pro'
  | 'Galaxy Watch 5 Pro'
  | 'External BP Device'
  | 'Manual Entry'
  | 'Demo Simulator';

export interface HealthReading {
  id: string;
  patient_id: string;
  heart_rate: number; // BPM
  spo2: number; // %
  systolic_bp?: number; // mmHg
  diastolic_bp?: number; // mmHg
  recorded_at: string; // ISO string
  source: HealthDataSource;
  status: 'Normal' | 'Attention' | 'Critical';
  unit?: {
    heart_rate: 'bpm';
    spo2: '%';
    bp?: 'mmHg';
  };
}

/**
 * Standard Samsung Galaxy Watch 5 Pro Health Data Payload
 * Received from Android Companion Application via REST API
 */
export interface StandardWatchHealthPayload {
  source: 'samsung_galaxy_watch_5_pro';
  type: 'health' | 'heart_rate' | 'spo2';
  heart_rate?: number;
  spo2?: number;
  value?: number;
  unit?: string;
  timestamp: string;
  device_info?: {
    model: 'Galaxy Watch 5 Pro (SM-R920/SM-R925)';
    wear_os_version: 'Wear OS 4.0 / One UI Watch 5';
    sensor_sdk_version: 'Samsung Health Sensor SDK v1.3';
    battery_level?: number;
  };
}

export type WatchConnectionStatus =
  | 'Not Connected'
  | 'Connecting'
  | 'Connected'
  | 'Syncing'
  | 'Synced'
  | 'Permission Required'
  | 'Connection Error'
  | 'Data Stale';

export interface WatchState {
  status: WatchConnectionStatus;
  device_name: string;
  model: string;
  last_sync_timestamp: string | null;
  last_sync_relative: string;
  heart_rate_synced: boolean;
  spo2_synced: boolean;
  battery_level: number;
  permissions: {
    heart_rate: boolean;
    spo2: boolean;
    blood_pressure: boolean;
  };
  companion_app_online: boolean;
  error_message?: string;
}

export interface AlertItem {
  id: string;
  patient_id: string;
  type: 'medication' | 'health' | 'device' | 'inventory';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
  read_status: boolean;
  acknowledged: boolean;
  action_required?: string;
}

export interface ActivityItem {
  id: string;
  icon: 'pill' | 'heart' | 'lungs' | 'alert' | 'device' | 'watch';
  title: string;
  description: string;
  timestamp: string;
  source: string;
  category: 'medication' | 'health' | 'device';
}

export interface HardwareState {
  arduino_status: 'Connected' | 'Disconnected' | 'Connecting';
  controller_8051_status: 'Active' | 'Idle' | 'Offline';
  rtc_ds3231_status: 'Working' | 'Syncing' | 'Error' | 'Offline';
  servo_status: 'Ready' | 'Dispensing' | 'Locked';
  reed_switch_status: 'Working' | 'Lid Open' | 'Lid Closed';
  lcd_status: 'Active' | 'Standby' | 'Offline';
  buzzer_status: 'Silent' | 'Beeping' | 'Muted';
  leds_status: 'Active' | 'Standby' | 'Offline';
  box_lid: 'Closed' | 'Open';
  last_seen: string;
  port_name?: string;
  baud_rate: number;
  incoming_packets: SerialPacketLog[];
}

export interface SerialPacketLog {
  id: string;
  timestamp: string;
  raw: string;
  parsedType: string;
  direction: 'in' | 'out';
}

export interface SettingsConfig {
  heart_rate_min: number;
  heart_rate_max: number;
  spo2_min: number;
  systolic_bp_max: number;
  diastolic_bp_max: number;
  reminder_window_mins: number;
  enable_sound: boolean;
  enable_browser_notifications: boolean;
  demo_mode: boolean;
  baud_rate: number;
  caregiver_view_active: boolean;
  api_endpoint: string;
}

export interface SafetyScoreFactor {
  label: string;
  impact: number;
  type: 'positive' | 'negative';
  description: string;
}
