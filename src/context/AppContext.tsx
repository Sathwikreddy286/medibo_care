import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Patient, Medicine, DoseLog, HealthReading, AlertItem,
  HardwareState, SettingsConfig, SerialPacketLog, DoseStatus,
  WatchState, StandardWatchHealthPayload, HealthDataSource
} from '../types';
import {
  INITIAL_PATIENT, INITIAL_MEDICINES, INITIAL_TODAY_DOSES,
  INITIAL_HEALTH_READINGS, INITIAL_ALERTS, INITIAL_SETTINGS
} from '../data/mockData';
import { serialService } from '../services/serialService';
import { watchService } from '../services/watchService';

interface CurrentVitals {
  heartRate: number;
  spo2: number;
  systolicBp: number;
  diastolicBp: number;
  lastUpdated: string;
  source: HealthDataSource;
  isLive: boolean;
  isDemo: boolean;
  status: 'Normal' | 'Attention' | 'Critical';
  secondsAgo: number;
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  patient: Patient;
  updatePatient: (updated: Partial<Patient>) => void;
  medicines: Medicine[];
  addMedicine: (med: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, med: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  togglePauseMedicine: (id: string) => void;
  refillMedicine: (id: string, addedCount: number) => void;
  todayDoses: DoseLog[];
  updateDoseStatus: (id: string, status: DoseStatus) => void;
  healthReadings: HealthReading[];
  addHealthReading: (reading: Omit<HealthReading, 'id'>) => void;
  currentVitals: CurrentVitals;
  hardware: HardwareState;
  watchState: WatchState;
  connectSerial: () => Promise<void>;
  disconnectSerial: () => Promise<void>;
  connectWatch: () => Promise<void>;
  disconnectWatch: () => void;
  syncWatch: () => Promise<void>;
  alerts: AlertItem[];
  addAlert: (alert: Omit<AlertItem, 'id'>) => void;
  acknowledgeAlert: (id: string) => void;
  markAllAlertsRead: () => void;
  unreadAlertCount: number;
  settings: SettingsConfig;
  updateSettings: (newSettings: Partial<SettingsConfig>) => void;
  simulateHardwareDispense: (compartment: number) => void;
  simulateToggleBoxLid: () => void;
  simulateIncomingSerialString: (raw: string) => void;
  exportCsvData: (type: 'health' | 'medication') => void;
  isCaregiverMode: boolean;
  toggleCaregiverMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [patient, setPatient] = useState<Patient>(INITIAL_PATIENT);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [todayDoses, setTodayDoses] = useState<DoseLog[]>(INITIAL_TODAY_DOSES);
  const [healthReadings, setHealthReadings] = useState<HealthReading[]>(INITIAL_HEALTH_READINGS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [settings, setSettings] = useState<SettingsConfig>(INITIAL_SETTINGS);
  const [lastHealthTimestamp, setLastHealthTimestamp] = useState<number>(Date.now() - 60000);

  const [currentVitals, setCurrentVitals] = useState<CurrentVitals>({
    heartRate: 78,
    spo2: 98,
    systolicBp: 120,
    diastolicBp: 80,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'Samsung Galaxy Watch 5 Pro',
    isLive: false,
    isDemo: true,
    status: 'Normal',
    secondsAgo: 60
  });

  const [hardware, setHardware] = useState<HardwareState>({
    arduino_status: 'Disconnected',
    controller_8051_status: 'Offline',
    rtc_ds3231_status: 'Offline',
    servo_status: 'Locked',
    reed_switch_status: 'Working',
    lcd_status: 'Offline',
    buzzer_status: 'Silent',
    leds_status: 'Offline',
    box_lid: 'Closed',
    last_seen: new Date().toISOString(),
    port_name: undefined,
    baud_rate: 115200,
    incoming_packets: [
      { id: '1', timestamp: '08:04:01', raw: '{"type":"medicine","medicine":"Amoxicillin","status":"TAKEN","scheduled_time":"08:00","timestamp":"2026-10-07T08:04:01"}', parsedType: 'Medicine Taken', direction: 'in' },
      { id: '2', timestamp: '08:04:00', raw: '{"type":"controller","device":"8051","status":"online"}', parsedType: '8051 Online', direction: 'in' },
      { id: '3', timestamp: '08:00:05', raw: '{"type":"heartbeat","device":"arduino","status":"online","timestamp":"2026-10-07T08:00:05"}', parsedType: 'Heartbeat', direction: 'in' },
      { id: '4', timestamp: '07:59:55', raw: 'BOX:CLOSED', parsedType: 'Reed Switch Triggered', direction: 'in' }
    ]
  });

  const [watchState, setWatchState] = useState<WatchState>(watchService.getState());

  // Subscribe to WatchService
  useEffect(() => {
    const unsubscribe = watchService.subscribe((state, latestReading) => {
      setWatchState(state);

      if (latestReading && latestReading.heart_rate !== undefined && latestReading.spo2 !== undefined) {
        const hr = latestReading.heart_rate!;
        const sp = latestReading.spo2!;
        const isElevated = hr > settings.heart_rate_max || hr < settings.heart_rate_min || sp < settings.spo2_min;
        const vitalsStatus: 'Normal' | 'Attention' | 'Critical' =
          sp < 90 || hr > 130 ? 'Critical' : isElevated ? 'Attention' : 'Normal';

        const now = new Date();
        setCurrentVitals({
          heartRate: hr,
          spo2: sp,
          systolicBp: 120,
          diastolicBp: 80,
          lastUpdated: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Samsung Galaxy Watch 5 Pro',
          isLive: true,
          isDemo: settings.demo_mode,
          status: vitalsStatus,
          secondsAgo: 0
        });
        setLastHealthTimestamp(now.getTime());

        const newReading: HealthReading = {
          id: 'HR-' + Date.now(),
          patient_id: patient.id,
          heart_rate: hr,
          spo2: sp,
          systolic_bp: undefined,
          diastolic_bp: undefined,
          recorded_at: latestReading.timestamp || now.toISOString(),
          source: 'Samsung Galaxy Watch 5 Pro',
          status: vitalsStatus
        };
        setHealthReadings(prev => [newReading, ...prev.slice(0, 99)]);

        if (isElevated && settings.enable_sound) {
          serialService.playAlertSound(980, 250, 2);
        }
      }
    });
    return () => unsubscribe();
  }, [settings.heart_rate_max, settings.heart_rate_min, settings.spo2_min, settings.demo_mode, settings.enable_sound, patient.id]);

  // Subscribe to Serial packets (medicine / device only — health from Watch)
  useEffect(() => {
    const unregister = serialService.registerCallback(packet => {
      const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const packetLog: SerialPacketLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timestampStr,
        raw: packet.raw,
        parsedType: packet.parsed.type.toUpperCase(),
        direction: packet.direction
      };

      setHardware(prev => ({
        ...prev,
        last_seen: new Date().toISOString(),
        incoming_packets: [packetLog, ...prev.incoming_packets.slice(0, 49)]
      }));

      const parsed = packet.parsed;

      if (parsed.type === 'medicine') {
        const slot = parsed.medicine?.toLowerCase() || '';
        const matchingDose = todayDoses.find(
          d => d.medicine_name.toLowerCase().includes(slot) || d.time_slot.toLowerCase() === slot
        );
        if (matchingDose) {
          const newStatus: DoseStatus = parsed.status === 'TAKEN' ? 'taken' : parsed.status === 'MISSED' ? 'missed' : 'delayed';
          updateDoseStatus(matchingDose.id, newStatus);
        }
      } else if (parsed.type === 'heartbeat') {
        setHardware(prev => ({
          ...prev,
          arduino_status: 'Connected',
          controller_8051_status: 'Active',
          lcd_status: 'Active',
          buzzer_status: 'Silent',
          leds_status: 'Active',
          rtc_ds3231_status: 'Working'
        }));
      } else if (parsed.type === 'controller') {
        setHardware(prev => ({
          ...prev,
          controller_8051_status: 'Active'
        }));
      } else if (parsed.type === 'box') {
        const boxState = (parsed as any).state as 'Open' | 'Closed';
        setHardware(prev => ({
          ...prev,
          box_lid: boxState,
          reed_switch_status: boxState === 'Open' ? 'Lid Open' : 'Lid Closed'
        }));
      }
    });

    return () => unregister();
  }, [todayDoses]);

  // Demo Mode: auto-generate watch readings every 5 seconds when demo_mode enabled
  useEffect(() => {
    if (!settings.demo_mode) return;

    const interval = setInterval(() => {
      const baseHr = 77;
      const delta = (Math.random() - 0.5) * 5;
      const newHr = Math.round(Math.min(95, Math.max(66, baseHr + delta)));
      const newSpo2 = Math.random() > 0.75 ? 97 : Math.random() > 0.4 ? 98 : 99;

      const isElevated = newHr > settings.heart_rate_max || newHr < settings.heart_rate_min || newSpo2 < settings.spo2_min;
      const vitalsStatus: 'Normal' | 'Attention' | 'Critical' = isElevated ? 'Attention' : 'Normal';

      const now = new Date();
      setCurrentVitals(prev => ({
        ...prev,
        heartRate: newHr,
        spo2: newSpo2,
        lastUpdated: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Samsung Galaxy Watch 5 Pro',
        isLive: true,
        isDemo: true,
        status: vitalsStatus,
        secondsAgo: 0
      }));
      setLastHealthTimestamp(now.getTime());
    }, 5000);

    return () => clearInterval(interval);
  }, [settings.demo_mode, settings.heart_rate_max, settings.heart_rate_min, settings.spo2_min]);

  // Update secondsAgo every second
  useEffect(() => {
    const ticker = setInterval(() => {
      const secs = Math.round((Date.now() - lastHealthTimestamp) / 1000);
      setCurrentVitals(prev => ({
        ...prev,
        secondsAgo: secs,
        isLive: secs < 30
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [lastHealthTimestamp]);

  // Patient Actions
  const updatePatient = (updated: Partial<Patient>) => setPatient(prev => ({ ...prev, ...updated }));

  // Medicine Actions
  const addMedicine = (med: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = { ...med, id: 'MED-' + Date.now() };
    setMedicines(prev => [...prev, newMed]);
  };

  const updateMedicine = (id: string, updated: Partial<Medicine>) =>
    setMedicines(prev => prev.map(m => (m.id === id ? { ...m, ...updated } : m)));

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    setTodayDoses(prev => prev.filter(d => d.medicine_id !== id));
  };

  const togglePauseMedicine = (id: string) =>
    setMedicines(prev => prev.map(m => (m.id === id ? { ...m, paused: !m.paused } : m)));

  const refillMedicine = (id: string, addedCount: number) => {
    setMedicines(prev =>
      prev.map(m => (m.id === id ? { ...m, quantity: m.quantity + addedCount } : m))
    );
  };

  // Dose Log Actions
  const updateDoseStatus = useCallback((id: string, status: DoseStatus) => {
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTodayDoses(prev =>
      prev.map(d => {
        if (d.id === id) {
          return {
            ...d,
            status,
            accessed_time: status === 'taken' ? nowTimeStr : undefined,
            delay_minutes: status === 'taken' ? (d.delay_minutes ?? 2) : 0
          };
        }
        return d;
      })
    );
    if (status === 'taken') {
      setTodayDoses(prev => {
        const target = prev.find(d => d.id === id);
        if (target) {
          setMedicines(pm =>
            pm.map(m =>
              m.id === target.medicine_id ? { ...m, quantity: Math.max(0, m.quantity - m.daily_dose) } : m
            )
          );
        }
        return prev;
      });
    }
  }, []);

  // Health Readings
  const addHealthReading = (reading: Omit<HealthReading, 'id'>) => {
    const item: HealthReading = { ...reading, id: 'HR-' + Date.now() };
    setHealthReadings(prev => [item, ...prev.slice(0, 99)]);
    setCurrentVitals({
      heartRate: reading.heart_rate,
      spo2: reading.spo2,
      systolicBp: reading.systolic_bp ?? 120,
      diastolicBp: reading.diastolic_bp ?? 80,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: reading.source,
      isLive: true,
      isDemo: reading.source === 'Demo Simulator',
      status: reading.status,
      secondsAgo: 0
    });
    setLastHealthTimestamp(Date.now());
  };

  // Alerts
  const addAlert = (alert: Omit<AlertItem, 'id'>) => {
    const newAlert: AlertItem = { ...alert, id: 'ALT-' + Date.now() };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const acknowledgeAlert = (id: string) =>
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, acknowledged: true, read_status: true } : a)));

  const markAllAlertsRead = () =>
    setAlerts(prev => prev.map(a => ({ ...a, read_status: true })));

  const unreadAlertCount = alerts.filter(a => !a.read_status).length;

  // Settings
  const updateSettings = (newSettings: Partial<SettingsConfig>) =>
    setSettings(prev => ({ ...prev, ...newSettings }));

  // Hardware — Serial
  const connectSerial = async () => {
    setHardware(prev => ({ ...prev, arduino_status: 'Connecting' }));
    const result = await serialService.connect(settings.baud_rate);
    if (result.success) {
      setHardware(prev => ({
        ...prev,
        arduino_status: 'Connected',
        controller_8051_status: 'Active',
        rtc_ds3231_status: 'Working',
        lcd_status: 'Active',
        leds_status: 'Active',
        port_name: result.portName || 'Web Serial Port'
      }));
      if (settings.demo_mode) {
        updateSettings({ demo_mode: false });
      }
    } else {
      setHardware(prev => ({ ...prev, arduino_status: 'Disconnected' }));
      window.alert(`Serial Connection: ${result.error}\n\nYou can continue using Demo Mode to explore the dashboard.`);
    }
  };

  const disconnectSerial = async () => {
    await serialService.disconnect();
    setHardware(prev => ({
      ...prev,
      arduino_status: 'Disconnected',
      controller_8051_status: 'Offline',
      rtc_ds3231_status: 'Offline',
      lcd_status: 'Offline',
      leds_status: 'Offline',
      port_name: undefined
    }));
  };

  // Watch Actions
  const connectWatch = async () => {
    await watchService.connect();
  };

  const disconnectWatch = () => {
    watchService.disconnect();
  };

  const syncWatch = async () => {
    await watchService.syncNow();
  };

  // Hardware Simulation
  const simulateHardwareDispense = (compartment: number) => {
    setHardware(prev => ({ ...prev, servo_status: 'Dispensing', buzzer_status: 'Beeping' }));
    if (settings.enable_sound) serialService.playAlertSound(880, 200, 2);
    setTimeout(() => {
      setHardware(prev => ({
        ...prev,
        servo_status: 'Ready',
        buzzer_status: 'Silent',
        incoming_packets: [
          {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            raw: JSON.stringify({ type: 'medicine', status: 'TAKEN', compartment }),
            parsedType: `Compartment ${compartment} Dispensed`,
            direction: 'in'
          },
          ...prev.incoming_packets.slice(0, 49)
        ]
      }));
    }, 1200);
  };

  const simulateToggleBoxLid = () => {
    const nextState = hardware.box_lid === 'Closed' ? 'Open' : 'Closed';
    setHardware(prev => ({
      ...prev,
      box_lid: nextState,
      reed_switch_status: nextState === 'Open' ? 'Lid Open' : 'Lid Closed',
      incoming_packets: [
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          raw: JSON.stringify({ type: 'box', state: nextState }),
          parsedType: `Reed Switch (${nextState})`,
          direction: 'in'
        },
        ...prev.incoming_packets.slice(0, 49)
      ]
    }));
  };

  const simulateIncomingSerialString = (raw: string) => {
    serialService.parseIncomingLine(raw);
  };

  // CSV Export
  const exportCsvData = (type: 'health' | 'medication') => {
    let csvContent = '';
    let filename = '';
    if (type === 'health') {
      filename = `MediBox_Health_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'ID,Date,Time,Heart Rate (BPM),SpO2 (%),Systolic BP,Diastolic BP,Source,Status\n';
      healthReadings.forEach(r => {
        const d = new Date(r.recorded_at);
        csvContent += `"${r.id}","${d.toLocaleDateString()}","${d.toLocaleTimeString()}",${r.heart_rate},${r.spo2},${r.systolic_bp ?? '--'},${r.diastolic_bp ?? '--'},"${r.source}","${r.status}"\n`;
      });
    } else {
      filename = `MediBox_Medication_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent = 'ID,Medicine,Dosage,Slot,Scheduled Time,Status,Delay (mins),Compartment,Notes\n';
      todayDoses.forEach(d => {
        csvContent += `"${d.id}","${d.medicine_name}","${d.dosage}","${d.time_slot}","${d.scheduled_time}","${d.status}",${d.delay_minutes ?? 0},${d.compartment},"${d.notes ?? ''}"\n`;
      });
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isCaregiverMode = settings.caregiver_view_active;
  const toggleCaregiverMode = () =>
    setSettings(prev => ({ ...prev, caregiver_view_active: !prev.caregiver_view_active }));

  return (
    <AppContext.Provider
      value={{
        activeTab, setActiveTab,
        patient, updatePatient,
        medicines, addMedicine, updateMedicine, deleteMedicine, togglePauseMedicine, refillMedicine,
        todayDoses, updateDoseStatus,
        healthReadings, addHealthReading,
        currentVitals,
        hardware, watchState,
        connectSerial, disconnectSerial,
        connectWatch, disconnectWatch, syncWatch,
        alerts, addAlert, acknowledgeAlert, markAllAlertsRead, unreadAlertCount,
        settings, updateSettings,
        simulateHardwareDispense, simulateToggleBoxLid, simulateIncomingSerialString,
        exportCsvData,
        isCaregiverMode, toggleCaregiverMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
