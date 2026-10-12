import React from 'react';
import {
  LayoutDashboard, Pill, CalendarDays, Activity, HeartPulse,
  History, BellRing, Cpu, FileBarChart2, UserRound, Settings,
  X, Watch, Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, patient, unreadAlertCount, isCaregiverMode, toggleCaregiverMode, watchState } = useApp();

  const navItems = [
    { id: 'dashboard',        label: 'Dashboard',        icon: LayoutDashboard },
    { id: 'medication',       label: 'Medication',        icon: Pill },
    { id: 'schedule',         label: 'Schedule',          icon: CalendarDays },
    { id: 'adherence',        label: 'Adherence',         icon: Activity },
    { id: 'health-monitoring',label: 'Health Monitoring', icon: HeartPulse },
    { id: 'health-history',   label: 'Health History',    icon: History },
    { id: 'alerts',           label: 'Alerts',            icon: BellRing, badge: unreadAlertCount > 0 ? unreadAlertCount : undefined },
    { id: 'watch-connection', label: 'Watch Connection',  icon: Watch },
    { id: 'device-status',   label: 'Device Status',     icon: Cpu },
    { id: 'reports',          label: 'Reports',           icon: FileBarChart2 },
    { id: 'profile',          label: 'Patient Profile',   icon: UserRound },
    { id: 'settings',         label: 'Settings',          icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const watchSynced = watchState.status === 'Synced' || watchState.status === 'Connected';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 sm:h-20 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-900 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-700/20">
              <Pill className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-charcoal-900">MediBox</span>
                <span className="font-bold text-xs px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">Care</span>
              </div>
              <p className="text-[10px] text-charcoal-400 font-medium">Smart Med + Health IoT</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isWatchItem = item.id === 'watch-connection';

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 border border-brand-200 font-semibold shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : isWatchItem && watchSynced ? 'text-emerald-500' : 'text-charcoal-400'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isWatchItem && (
                    <span className={`w-1.5 h-1.5 rounded-full ${watchSynced ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  )}
                  {item.badge !== undefined && (
                    <span className="px-1.5 text-[11px] font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Caregiver Toggle */}
        <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            onClick={toggleCaregiverMode}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              isCaregiverMode
                ? 'bg-brand-900 text-white border-brand-800'
                : 'bg-white text-charcoal-700 border-slate-200 hover:bg-brand-50 hover:text-brand-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              <span>{isCaregiverMode ? 'Caregiver Mode: Active' : 'Switch Caregiver View'}</span>
            </div>
            <span className="text-[10px] uppercase font-bold opacity-75">{isCaregiverMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Patient Info */}
        <div className="p-3 border-t border-slate-100 bg-white shrink-0">
          <div
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-bold flex items-center justify-center text-sm ring-2 ring-brand-100">
                {patient.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-charcoal-900 truncate">{patient.name}</p>
              <p className="text-[10px] text-charcoal-500 truncate">
                {isCaregiverMode ? `Caregiver: ${patient.caregiver_name}` : `Age ${patient.age} • ${patient.blood_group}`}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
