import { StandardWatchHealthPayload, HealthReading } from '../types';

/**
 * MediBox Care - Backend REST API Client Layer
 * Communicates with MediBox Care Cloud Backend
 * Base URL can be configured via VITE_API_BASE_URL environment variable
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * POST /api/health/readings
   * Ingest health reading from Samsung Galaxy Watch 5 Pro companion app
   */
  public async postHealthReading(payload: StandardWatchHealthPayload): Promise<ApiResponse<HealthReading>> {
    // In production with live backend:
    // const res = await fetch(`${this.baseUrl}/health/readings`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // return res.json();

    // Simulated robust response adhering to contract
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        id: `HR-${Date.now()}`,
        patient_id: 'PAT-8051-01',
        heart_rate: payload.heart_rate ?? payload.value ?? 78,
        spo2: payload.spo2 ?? 98,
        source: 'Samsung Galaxy Watch 5 Pro',
        status: (payload.heart_rate && payload.heart_rate > 100) ? 'Attention' : 'Normal',
        recorded_at: payload.timestamp || new Date().toISOString()
      }
    };
  }

  /**
   * POST /api/devices/watch/sync
   * Trigger health data sync with Companion App / Wear OS Health Services
   */
  public async syncWatch(): Promise<ApiResponse<{ last_sync: string; hr: number; spo2: number }>> {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        last_sync: new Date().toISOString(),
        hr: 76 + Math.floor(Math.random() * 6),
        spo2: 98
      }
    };
  }

  /**
   * POST /api/devices/watch/connect
   * Authorize and bind Samsung Galaxy Watch 5 Pro
   */
  public async connectWatch(deviceId: string): Promise<ApiResponse<{ device: string; status: string }>> {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        device: deviceId,
        status: 'Connected'
      }
    };
  }

  /**
   * GET /api/devices/status
   * Retrieve aggregate hardware and device statuses
   */
  public async getDevicesStatus(): Promise<ApiResponse<any>> {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        watch: { model: 'Samsung Galaxy Watch 5 Pro', sync: 'active' },
        arduino: { port: 'WebSerial', status: 'ready' }
      }
    };
  }
}

export const apiClient = new ApiClient();
