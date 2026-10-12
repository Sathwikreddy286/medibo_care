import React, { useState } from 'react';
import {
  Cpu,
  Wifi,
  WifiOff,
  Clock,
  RotateCw,
  DoorOpen,
  Volume2,
  Terminal,
  Send,
  Trash2,
  Play,
  Pause,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { serialService } from '../../services/serialService';

export const DeviceStatusView: React.FC = () => {
  const {
    hardware,
    connectSerial,
    disconnectSerial,
    simulateHardwareDispense,
    simulateToggleBoxLid,
    simulateIncomingSerialString
  } = useApp();

  const [commandInput, setCommandInput] = useState('');
  const [terminalPaused, setTerminalPaused] = useState(false);
  const [localPackets, setLocalPackets] = useState(hardware.incoming_packets || []);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    // Send via serialService if connected, or simulate
    serialService.write(commandInput.trim());
    simulateIncomingSerialString(`ACK:${commandInput.trim()}`);
    setCommandInput('');
  };

  const handleTestBuzzer = () => {
    serialService.playAlertSound();
  };

  const isConnected = hardware.arduino_status === 'Connected';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-700">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-charcoal-900 tracking-tight">IoT Hardware & Serial Bus Telemetry</h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
            Communication bridge between 8051 Microcontroller, Arduino UNO, DS3231 RTC, and Web Serial API. Health data sourced from Samsung Galaxy Watch 5 Pro via Android Companion App.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isConnected ? (
            <button
              onClick={disconnectSerial}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-charcoal-700 text-xs font-semibold transition-colors"
            >
              <WifiOff className="w-4 h-4 text-charcoal-500" /> Disconnect Port
            </button>
          ) : (
            <button
              onClick={connectSerial}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Wifi className="w-4 h-4" /> Connect Arduino USB
            </button>
          )}
        </div>
      </div>

      {/* Hardware Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 8051 Microcontroller */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Master Controller</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900">8051 Microcontroller</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">AT89C51 / AT89S52 Architecture</p>

            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">Clock Frequency:</span>
                <span className="font-semibold text-charcoal-800">11.0592 MHz</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">State:</span>
                <span className="font-bold text-emerald-600">{hardware.controller_8051_status}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal-500">Interrupts:</span>
                <span className="font-semibold text-charcoal-800">INT0 (RTC Alarm) Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Arduino UNO Bridge */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Serial Bridge</span>
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Arduino UNO</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">USB-to-UART / Web Serial</p>

            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">Baud Rate:</span>
                <span className="font-semibold text-charcoal-800">{hardware.baud_rate} bps</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">Port Name:</span>
                <span className="font-semibold text-charcoal-800">{hardware.port_name || 'COM Port (Simulated)'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal-500">Web Serial API:</span>
                <span className="font-bold text-emerald-600">Supported</span>
              </div>
            </div>
          </div>
        </div>

        {/* Samsung Galaxy Watch 5 Pro */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Health Monitor</span>
              <span className={`w-2.5 h-2.5 rounded-full ${hardware.arduino_status === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            </div>
            <h3 className="text-base font-bold text-charcoal-900">Galaxy Watch 5 Pro</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">Samsung Health Sensor SDK v1.3</p>

            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">Heart Rate:</span>
                <span className="font-bold text-emerald-600">✓ Supported</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">SpO₂:</span>
                <span className="font-bold text-emerald-600">✓ Supported</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal-500">BP:</span>
                <span className="font-semibold text-charcoal-400">External Device</span>
              </div>
            </div>
          </div>
        </div>

        {/* DS3231 RTC Module */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Hardware Clock</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900">DS3231 High-Precision RTC</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">I2C Address: 0x68</p>

            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">RTC Status:</span>
                <span className="font-bold text-emerald-600">{hardware.rtc_ds3231_status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">Coin Cell Battery:</span>
                <span className="font-semibold text-charcoal-800">3.2V (CR2032 Good)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal-500">Sync Drift:</span>
                <span className="font-semibold text-charcoal-800">&lt; 0.5s / month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actuators & Physical Box Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Servo Motor Status & Controls */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Actuator</span>
              <RotateCw className="w-4 h-4 text-brand-600" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900">SG90 Dispenser Servo Motor</h4>
            <p className="text-xs text-charcoal-500 mt-1">
              Rotates to align corresponding medicine compartment slot.
            </p>

            <div className="mt-4 flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-charcoal-500">Position Status:</span>
              <span className="font-bold text-brand-700">{hardware.servo_status}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            {[1, 2, 3, 4].map(slot => (
              <button
                key={slot}
                onClick={() => simulateHardwareDispense(slot)}
                className="flex-1 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-brand-800 border border-purple-200 text-xs font-semibold transition-colors"
                title={`Rotate servo to Compartment ${slot}`}
              >
                Slot {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Reed Switch Lid Sensor */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Magnetic Sensor</span>
              <DoorOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900">Reed Switch (Lid Detector)</h4>
            <p className="text-xs text-charcoal-500 mt-1">
              Detects physical medicine box opening to log intake confirmation.
            </p>

            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-charcoal-500">Box Lid State:</span>
                <span
                  className={`font-bold ${
                    hardware.box_lid === 'Open' ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {hardware.box_lid}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal-500">Sensor Output:</span>
                <span className="font-semibold text-charcoal-800">
                  {hardware.box_lid === 'Open' ? 'HIGH (Magnet Separated)' : 'LOW (Magnet Engaged)'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={simulateToggleBoxLid}
              className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-charcoal-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <DoorOpen className="w-3.5 h-3.5" /> Toggle Lid State ({hardware.box_lid === 'Open' ? 'Close' : 'Open'})
            </button>
          </div>
        </div>

        {/* 16x2 LCD Preview & Buzzer */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Display & Audio</span>
              <Volume2 className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-sm font-bold text-charcoal-900">16×2 LCD Screen Preview</h4>
            <p className="text-xs text-charcoal-500 mt-1">
              HD44780 LCD display driver wired to 8051 Port 2.
            </p>

            {/* LCD Simulation Display Screen */}
            <div className="mt-3 p-2.5 rounded-lg bg-[#2E7D32] border-2 border-[#1B5E20] font-mono text-emerald-100 text-xs shadow-inner tracking-wider">
              <div className="overflow-hidden whitespace-nowrap">
                L1: MEDIBOX CARE 08:00
              </div>
              <div className="overflow-hidden whitespace-nowrap">
                L2: TAKE C1:AMOXICIL
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-charcoal-500">Piezo Buzzer:</span>
            <button
              onClick={handleTestBuzzer}
              className="px-2.5 py-1 rounded-lg bg-purple-50 text-brand-800 border border-purple-200 font-semibold hover:bg-purple-100 transition-colors flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3" /> Trigger Sound
            </button>
          </div>
        </div>
      </div>

      {/* Live Serial Monitor Terminal */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-700" />
            <h3 className="text-sm font-bold text-charcoal-900">Serial Packet Log Monitor (UART / USB)</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTerminalPaused(!terminalPaused)}
              className="p-1.5 rounded-lg border border-slate-200 text-charcoal-600 hover:bg-slate-100 text-xs font-medium flex items-center gap-1"
              title={terminalPaused ? 'Resume live autoscroll' : 'Pause terminal scroll'}
            >
              {terminalPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{terminalPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={() => {
                hardware.incoming_packets = [];
                setLocalPackets([]);
              }}
              className="p-1.5 rounded-lg border border-slate-200 text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 text-xs transition-colors"
              title="Clear terminal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-4 bg-charcoal-950 font-mono text-xs text-emerald-400 h-64 overflow-y-auto space-y-1.5">
          <div className="text-charcoal-500 text-[11px] pb-1 border-b border-charcoal-800">
            [SYS] Web Serial Listener initialized @ 115200 8-N-1. Listening on Arduino UNO CDC port...
          </div>

          {hardware.incoming_packets.length === 0 ? (
            <div className="text-charcoal-500 italic py-8 text-center">
              No packet traffic recorded yet. Connect hardware or click "Sample Pulse" / "Dispense" above.
            </div>
          ) : (
            hardware.incoming_packets.map(pkt => (
              <div key={pkt.id} className="flex items-start gap-2 hover:bg-charcoal-900/60 px-1 py-0.5 rounded">
                <span className="text-charcoal-500 shrink-0 select-none">[{pkt.timestamp}]</span>
                <span
                  className={`font-semibold shrink-0 select-none ${
                    pkt.direction === 'in' ? 'text-cyan-400' : 'text-amber-400'
                  }`}
                >
                  {pkt.direction === 'in' ? '&lt;-- RX:' : '--&gt; TX:'}
                </span>
                <span className="text-slate-200 break-all">{pkt.raw}</span>
              </div>
            ))
          )}
        </div>

        {/* Command Line Input */}
        <form onSubmit={handleSendCommand} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Send AT / Serial command to Arduino (e.g., DISPENSE:1, STATUS:PING, BUZZ:ON)..."
            value={commandInput}
            onChange={e => setCommandInput(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
