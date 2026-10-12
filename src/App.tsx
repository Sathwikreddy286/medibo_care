import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { MedicationView } from './components/medication/MedicationView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { AdherenceView } from './components/adherence/AdherenceView';
import { HealthMonitoringView } from './components/health/HealthMonitoringView';
import { HealthHistoryView } from './components/health/HealthHistoryView';
import { AlertsView } from './components/alerts/AlertsView';
import { WatchConnectionView } from './components/device/WatchConnectionView';
import { DeviceStatusView } from './components/device/DeviceStatusView';
import { ReportsView } from './components/reports/ReportsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { HardwareSimulatorDrawer } from './components/common/HardwareSimulatorDrawer';

export const App: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':        return <DashboardView />;
      case 'medication':       return <MedicationView />;
      case 'schedule':         return <ScheduleView />;
      case 'adherence':        return <AdherenceView />;
      case 'health-monitoring':return <HealthMonitoringView />;
      case 'health-history':   return <HealthHistoryView />;
      case 'alerts':           return <AlertsView />;
      case 'watch-connection': return <WatchConnectionView />;
      case 'device-status':    return <DeviceStatusView />;
      case 'reports':          return <ReportsView />;
      case 'profile':          return <ProfileView />;
      case 'settings':         return <SettingsView />;
      default:                 return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFE] text-charcoal-900 flex font-sans">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto pb-28">
          {renderActiveView()}
        </main>

        {/* Footer */}
        <footer className="no-print border-t border-slate-200/80 bg-white py-3 px-6 text-center text-[11px] text-charcoal-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              <strong>MediBox Care</strong> • Academic ECE / Microcontroller Prototype (8051 + Arduino UNO + Galaxy Watch 5 Pro)
            </span>
            <span>
              MediBox Care is an academic prototype. Health readings are for monitoring and wellness purposes only — not for medical diagnosis or treatment.
            </span>
          </div>
        </footer>

        <HardwareSimulatorDrawer />
      </div>
    </div>
  );
};

export default App;
