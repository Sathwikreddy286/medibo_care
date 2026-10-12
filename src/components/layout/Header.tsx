import React, { useState } from 'react';
import { Menu, Search, WifiOff, Sparkles, Volume2, VolumeX, Watch, Wifi } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const {
    activeTab, patient, hardware, watchState,
    connectSerial, disconnectSerial,
    settings, updateSettings, isCaregiverMode
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = (tab: string) => {
    const map: Record<string, { title: string; subtitle: string }> = {
      'dashboard':        { title: 'Dashboard',                  subtitle: `Overview for ${patient.name}` },
      'medication':       { title: 'Medication Inventory',       subtitle: 'Manage stock & refill reminders' },
      'schedule':         { title: 'Medication Schedule',        subtitle: 'Configure compartment timings & dosages' },
      'adherence':        { title: 'Adherence Analytics',        subtitle: 'Compliance trends & intake history' },
      'health-monitoring':{ title: 'Health Monitoring',          subtitle: 'Galaxy Watch 5 Pro vitals & telemetry' },
      'health-history':   { title: 'Health History',             subtitle: 'Detailed chronological vital records' },
      'alerts':           { title: 'Alerts & System Logs',       subtitle: 'Medication events & vitals surveillance' },
      'watch-connection': { title: 'Watch Connection',           subtitle: 'Samsung Galaxy Watch 5 Pro' },
      'device-status':    { title: 'Device Status & Serial Bus', subtitle: '8051, Arduino UNO & component telemetry' },
      'reports':          { title: 'Clinical & Compliance Reports', subtitle: 'Generate exportable CSV summaries' },
      'profile':          { title: 'Patient Profile',            subtitle: 'Personal information & emergency contacts' },
      'settings':         { title: 'System Settings',            subtitle: 'Thresholds, peripherals & configuration' },
    };
    return map[tab] ?? { title: 'MediBox Care', subtitle: 'Smart Healthcare Platform' };
  };

  const { title } = getPageTitle(activeTab);

  const getHour = () => new Date().getHours();
  const greeting = getHour() < 12 ? 'Good Morning' : getHour() < 17 ? 'Good Afternoon' : 'Good Evening';

  const isArduinoConnected = hardware.arduino_status === 'Connected';
  const isWatchSynced = watchState.status === 'Synced' || watchState.status === 'Connected';

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-charcoal-600 hover:text-charcoal-900 hover:bg-slate-100 shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-charcoal-900 tracking-tight truncate">{title}</h1>
            {isCaregiverMode && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-brand-100 text-brand-900 border border-brand-200 shrink-0">
                Caregiver View
              </span>
            )}
          </div>
          <p className="text-xs text-charcoal-500 hidden sm:block truncate">
            {greeting}, <span className="font-semibold text-charcoal-700">{patient.name}</span>
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Search — hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-44 lg:w-56 pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all text-charcoal-800 placeholder-charcoal-400"
          />
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => updateSettings({ enable_sound: !settings.enable_sound })}
          className={`p-2.5 rounded-xl border transition-colors ${
            settings.enable_sound ? 'bg-slate-50 border-slate-200 text-charcoal-600' : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}
          title={settings.enable_sound ? 'Sound On' : 'Sound Muted'}
          aria-label="Toggle sound"
        >
          {settings.enable_sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Demo Mode Toggle */}
        <button
          onClick={() => updateSettings({ demo_mode: !settings.demo_mode })}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
            settings.demo_mode
              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Toggle Demo / Live Mode"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{settings.demo_mode ? 'DEMO' : 'LIVE'}</span>
        </button>

        {/* Watch Status */}
        <div className="flex items-center">
          {isWatchSynced ? (
            <div className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Watch className="w-3 h-3 hidden sm:block" />
              <span className="hidden sm:inline">Watch</span>
              <span className="font-bold">Synced</span>
            </div>
          ) : (
            <div className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-charcoal-600 border border-slate-200 flex items-center gap-1.5">
              <Watch className="w-3 h-3 text-charcoal-400" />
              <span className="hidden sm:inline font-bold">Watch</span>
              <span className="text-charcoal-400">—</span>
            </div>
          )}
        </div>

        {/* Arduino Serial Status */}
        <div className="flex items-center">
          {isArduinoConnected ? (
            <button
              onClick={disconnectSerial}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors shadow-xs"
              title="Click to disconnect Serial port"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Arduino</span>
              <span className="font-bold">Online</span>
            </button>
          ) : (
            <button
              onClick={connectSerial}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-charcoal-700 border border-slate-200 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-200 flex items-center gap-1.5 transition-colors"
              title="Connect Arduino via Web Serial"
            >
              <WifiOff className="w-3 h-3 text-charcoal-400" />
              <span className="hidden sm:inline">Arduino</span>
            </button>
          )}
        </div>

        {/* Notification Bell */}
        <NotificationDropdown />
      </div>
    </header>
  );
};
