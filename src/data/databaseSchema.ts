/**
 * MediBox Care - Backend Database Schema & DDL
 * Production PostgreSQL / SQLite and Document Store Schemas
 */

export const SQL_SCHEMA = `
-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(16) NOT NULL,
    contact VARCHAR(32) NOT NULL,
    emergency_contact VARCHAR(32) NOT NULL,
    emergency_contact_name VARCHAR(255),
    doctor_name VARCHAR(255),
    doctor_contact VARCHAR(32),
    caregiver_name VARCHAR(255),
    caregiver_phone VARCHAR(32),
    blood_group VARCHAR(8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Medicines Table (Per-patient medication schedule & inventory)
CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(128) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    daily_dose INTEGER NOT NULL DEFAULT 1,
    scheduled_time VARCHAR(32) NOT NULL,
    frequency VARCHAR(64) NOT NULL,
    compartment INTEGER CHECK (compartment BETWEEN 1 AND 4),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    category VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dose Logs Table (Real-time adherence records from 8051 / Reed switch)
CREATE TABLE IF NOT EXISTS dose_logs (
    id VARCHAR(64) PRIMARY KEY,
    medicine_id VARCHAR(64) REFERENCES medicines(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE CASCADE,
    scheduled_time VARCHAR(32) NOT NULL,
    accessed_time VARCHAR(32),
    status VARCHAR(32) NOT NULL CHECK (status IN ('taken', 'missed', 'delayed', 'upcoming')),
    delay_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Health Readings Table (Synchronized from Samsung Galaxy Watch 5 Pro)
CREATE TABLE IF NOT EXISTS health_readings (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE CASCADE,
    source VARCHAR(64) NOT NULL, -- 'samsung_galaxy_watch_5_pro', 'external_bp_device', 'manual_entry'
    heart_rate INTEGER NOT NULL,
    spo2 INTEGER NOT NULL,
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Devices Table (Hardware telemetry tracking)
CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE CASCADE,
    device_type VARCHAR(64) NOT NULL, -- 'arduino_uno', 'mcu_8051', 'samsung_galaxy_watch_5_pro', etc.
    device_name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL,
    last_seen TIMESTAMP WITH TIME ZONE NOT NULL,
    firmware_version VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    patient_id VARCHAR(64) REFERENCES patients(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL CHECK (type IN ('medication', 'health', 'device', 'inventory')),
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    message TEXT NOT NULL,
    action_required TEXT,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_health_readings_patient_recorded ON health_readings(patient_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_dose_logs_patient_date ON dose_logs(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_patient_unread ON alerts(patient_id, read_status);
`;
