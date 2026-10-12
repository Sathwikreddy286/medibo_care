# MediBox Care - Android Companion Application
## Samsung Galaxy Watch 5 Pro Integration Module

This Android companion application bridges the **Samsung Galaxy Watch 5 Pro (Wear OS 4 / One UI Watch 5)** to the **MediBox Care Cloud Backend & Dashboard**.

---

## 1. System Architecture

```text
┌─────────────────────────────────┐
│   Samsung Galaxy Watch 5 Pro    │
│   • Heart Rate (PPG Sensor)     │
│   • SpO₂ (Optical Sensor)       │
│   • Wear OS / Samsung Health    │
└────────────────┬────────────────┘
                 │ Samsung Health Sensor SDK / Wear OS Health Services
                 ▼
┌─────────────────────────────────┐
│  Android Companion Application   │
│  (com.medibox.care)             │
│  • SamsungHealthDataClient      │
│  • SamsungHealthSensorManager   │
│  • HealthBackgroundSyncService  │
│  • Encrypted Token Store        │
└────────────────┬────────────────┘
                 │ HTTPS REST API (/api/health/readings)
                 ▼
┌─────────────────────────────────┐
│     MediBox Care Backend        │
│     (Node.js / Express / DB)    │
└────────────────┬────────────────┘
                 │ WebSocket / Polling
                 ▼
┌─────────────────────────────────┐
│     MediBox Care Dashboard      │
│     (React / TypeScript SaaS)   │
└─────────────────────────────────┘
```

---

## 2. Samsung Health Official SDKs Utilized

1. **Samsung Health Sensor SDK (v1.3.x)**:
   - Targets Samsung BioActive Sensor on Galaxy Watch 4, 5, 5 Pro, 6.
   - Provides low-latency access to `HealthTrackerType.HEART_RATE` and `HealthTrackerType.SPO2`.
   - Requires runtime `android.permission.BODY_SENSORS` and user consent.

2. **Samsung Health Data SDK**:
   - Reads historical resting pulse, sleep SpO₂, and blood pressure records.
   - Respects user privacy and consent dialogs.

3. **Android WorkManager / Foreground Service**:
   - Runs periodic background synchronization to ensure fresh vitals every 60 seconds without draining battery.

---

## 3. Directory Layout

```text
mobile/
├── README.md
├── settings.gradle.kts
└── app/
    ├── build.gradle.kts
    └── src/main/
        ├── AndroidManifest.xml
        └── java/com/medibox/care/
            ├── model/
            │   └── HealthPayloads.kt
            ├── wear/
            │   └── SamsungHealthSensorManager.kt
            ├── samsunghealth/
            │   └── SamsungHealthDataClient.kt
            ├── service/
            │   └── HealthBackgroundSyncService.kt
            ├── api/
            │   └── MediBoxBackendApi.kt
            └── ui/
                └── MainActivity.kt
```

---

## 4. REST API Synchronization Payload

```json
{
  "patient_id": "PAT-8051-01",
  "source": "samsung_galaxy_watch_5_pro",
  "type": "health",
  "heart_rate": 78,
  "spo2": 98,
  "timestamp": "2026-10-07T08:30:00Z",
  "device_info": {
    "model": "Galaxy Watch 5 Pro (SM-R920/SM-R925)",
    "wear_os_version": "Wear OS 4.0 / One UI Watch 5",
    "sensor_sdk_version": "Samsung Health Sensor SDK v1.3",
    "battery_level": 84
  }
}
```

---

## 5. Medical Disclaimer

> Samsung Health SDK and MediBox Care are intended solely for fitness, wellness, and research purposes. Readings are not intended to replace medical diagnosis, monitoring, or clinical advice.
