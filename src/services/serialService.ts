export interface ArduinoMedicineEvent {
  type: 'medicine';
  medicine: string;
  status: 'TAKEN' | 'MISSED' | 'OPENED' | 'DELAYED';
  scheduled_time?: string;
  timestamp: string;
  compartment?: number;
}

export interface ArduinoHeartbeatEvent {
  type: 'heartbeat';
  device: 'arduino';
  status: 'online' | 'ready';
  timestamp: string;
}

export interface Controller8051Event {
  type: 'controller';
  device: '8051';
  status: 'online' | 'active' | 'dispensing';
  compartment?: number;
}

export interface BoxEvent {
  type: 'box';
  state: 'Open' | 'Closed';
  timestamp?: string;
}

export type ArduinoSerialEvent =
  | ArduinoMedicineEvent
  | ArduinoHeartbeatEvent
  | Controller8051Event
  | BoxEvent
  | { type: 'unknown'; raw: string };

export type SerialPacketCallback = (packet: {
  raw: string;
  parsed: ArduinoSerialEvent;
  direction: 'in' | 'out';
}) => void;

class SerialService {
  private port: any = null;
  private reader: any = null;
  private keepReading = false;
  private callbacks: SerialPacketCallback[] = [];
  private audioContext: AudioContext | null = null;
  private currentBaudRate: number = 115200;

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public getBaudRate(): number {
    return this.currentBaudRate;
  }

  public setBaudRate(baud: number) {
    this.currentBaudRate = baud;
  }

  public registerCallback(cb: SerialPacketCallback) {
    this.callbacks.push(cb);
    return () => {
      this.callbacks = this.callbacks.filter(c => c !== cb);
    };
  }

  private notify(packet: { raw: string; parsed: ArduinoSerialEvent; direction: 'in' | 'out' }) {
    this.callbacks.forEach(cb => {
      try {
        cb(packet);
      } catch (err) {
        console.error('Error in SerialService callback:', err);
      }
    });
  }

  /**
   * Connect to Arduino UNO over USB via Web Serial API
   */
  public async connect(baudRate: number = this.currentBaudRate): Promise<{ success: boolean; portName?: string; error?: string }> {
    if (!this.isSupported()) {
      return {
        success: false,
        error: 'Web Serial API is not supported in this browser. Please use Google Chrome or Microsoft Edge.'
      };
    }

    try {
      this.currentBaudRate = baudRate;
      // @ts-ignore
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudRate: this.currentBaudRate });
      this.keepReading = true;
      this.readLoop();
      return { success: true, portName: 'Arduino UNO (COM Port)' };
    } catch (err: any) {
      console.warn('Web Serial connection cancelled or failed:', err);
      return { success: false, error: err.message || 'Connection cancelled by user.' };
    }
  }

  /**
   * Disconnect port gracefully
   */
  public async disconnect(): Promise<void> {
    this.keepReading = false;
    if (this.reader) {
      try {
        await this.reader.cancel();
      } catch (e) {
        // ignore
      }
      this.reader = null;
    }
    if (this.port) {
      try {
        await this.port.close();
      } catch (e) {
        // ignore
      }
      this.port = null;
    }
  }

  public isConnected(): boolean {
    return !!this.port && !!this.port.readable;
  }

  /**
   * Continuous stream reader loop
   */
  private async readLoop() {
    let buffer = '';
    while (this.port && this.keepReading && this.port.readable) {
      try {
        const textDecoder = new TextDecoderStream();
        // @ts-ignore
        const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
        this.reader = textDecoder.readable.getReader();

        while (true) {
          const { value, done } = await this.reader.read();
          if (done) break;
          if (value) {
            buffer += value;
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() || ''; // retain fragment
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed) {
                this.parseIncomingLine(trimmed);
              }
            }
          }
        }
      } catch (err) {
        console.warn('Serial read loop encountered error or port closed:', err);
        break;
      }
    }
  }

  /**
   * Parse single JSON line protocol from Arduino
   */
  public parseIncomingLine(line: string): ArduinoSerialEvent {
    let parsedEvent: ArduinoSerialEvent;

    // Check JSON formatted line
    if (line.startsWith('{') && line.endsWith('}')) {
      try {
        const json = JSON.parse(line);

        if (json.type === 'medicine') {
          parsedEvent = {
            type: 'medicine',
            medicine: json.medicine || 'Scheduled Dose',
            status: json.status || 'TAKEN',
            scheduled_time: json.scheduled_time,
            timestamp: json.timestamp || new Date().toISOString(),
            compartment: json.compartment
          };
          this.notify({ raw: line, parsed: parsedEvent, direction: 'in' });
          return parsedEvent;
        }

        if (json.type === 'heartbeat' && json.device === 'arduino') {
          parsedEvent = {
            type: 'heartbeat',
            device: 'arduino',
            status: json.status || 'online',
            timestamp: json.timestamp || new Date().toISOString()
          };
          this.notify({ raw: line, parsed: parsedEvent, direction: 'in' });
          return parsedEvent;
        }

        if (json.type === 'controller' && json.device === '8051') {
          parsedEvent = {
            type: 'controller',
            device: '8051',
            status: json.status || 'online',
            compartment: json.compartment
          };
          this.notify({ raw: line, parsed: parsedEvent, direction: 'in' });
          return parsedEvent;
        }

        if (json.type === 'box') {
          parsedEvent = {
            type: 'box',
            state: json.state === 'Open' ? 'Open' : 'Closed',
            timestamp: json.timestamp || new Date().toISOString()
          };
          this.notify({ raw: line, parsed: parsedEvent, direction: 'in' });
          return parsedEvent;
        }
      } catch (e) {
        // Fallback if malformed JSON
      }
    }

    // Legacy fallback string support for 8051 UART bridging
    if (line.startsWith('BOX:')) {
      const isOpen = line.toLowerCase().includes('open');
      parsedEvent = { type: 'box', state: isOpen ? 'Open' : 'Closed' };
      this.notify({ raw: line, parsed: parsedEvent, direction: 'in' });
      return parsedEvent;
    }

    parsedEvent = { type: 'unknown', raw: line };
    this.notify({ raw: line, parsed: parsedEvent, direction: 'in' });
    return parsedEvent;
  }

  /**
   * Send JSON string command over Web Serial
   */
  public async write(command: string): Promise<boolean> {
    if (!this.port || !this.port.writable) {
      this.notify({
        raw: command,
        parsed: { type: 'unknown', raw: command },
        direction: 'out'
      });
      return false;
    }

    try {
      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
      const writer = textEncoder.writable.getWriter();
      await writer.write(command + '\n');
      writer.releaseLock();

      this.notify({
        raw: command,
        parsed: { type: 'unknown', raw: command },
        direction: 'out'
      });
      return true;
    } catch (e) {
      console.warn('Web Serial write error:', e);
      return false;
    }
  }

  /**
   * Send Arduino Command Center Commands
   */
  public async sendCommand(cmd: 'TEST_BUZZER' | 'TEST_SERVO' | 'TEST_LCD' | 'READ_RTC' | 'GET_STATUS'): Promise<boolean> {
    const payload = JSON.stringify({ command: cmd });
    return this.write(payload);
  }

  /**
   * Buzzer audio synthesizer for browser feedback
   */
  public playAlertSound(freq = 880, durationMs = 300, beeps = 2) {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      let start = this.audioContext.currentTime;
      for (let i = 0; i < beeps; i++) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + durationMs / 1000);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(start);
        osc.stop(start + durationMs / 1000);
        start += (durationMs + 120) / 1000;
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const serialService = new SerialService();
