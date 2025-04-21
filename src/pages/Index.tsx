
import React, { useState } from 'react';
import { AppointmentProvider } from '@/context/AppointmentContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Layout from '@/components/layout/Layout';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarView from '@/components/calendar/CalendarView';
import AppointmentModal from '@/components/calendar/AppointmentModal';

const TAB_OVERVIEW = "overview";
const TAB_APPOINTMENTS = "appointments";
const TAB_DOCTORS = "doctors";
const TAB_PATHOLOGY = "pathology";
const TAB_CHATS = "chats";
const TAB_SETTINGS = "settings";

const OverviewContent = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-3">Welcome to HealthSync!</h2>
    <p className="text-muted-foreground mb-4">
      This is your dashboard overview. Book and manage your medical appointments easily.
    </p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div className="rounded-lg bg-card shadow p-4 flex flex-col items-center">
        <span className="text-3xl font-bold text-primary">7</span>
        <span className="text-muted-foreground">Upcoming Appointments</span>
      </div>
      <div className="rounded-lg bg-card shadow p-4 flex flex-col items-center">
        <span className="text-3xl font-bold text-primary">15</span>
        <span className="text-muted-foreground">Doctors Available</span>
      </div>
      <div className="rounded-lg bg-card shadow p-4 flex flex-col items-center">
        <span className="text-3xl font-bold text-primary">4</span>
        <span className="text-muted-foreground">Pathology Results</span>
      </div>
      <div className="rounded-lg bg-card shadow p-4 flex flex-col items-center">
        <span className="text-3xl font-bold text-primary">2</span>
        <span className="text-muted-foreground">New Chats</span>
      </div>
    </div>
  </div>
);

const DoctorsContent = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Doctors</h2>
    <p className="text-muted-foreground">
      List of doctors will appear here. (Demo content)
    </p>
    {/* List doctors */}
    <ul className="mt-4 space-y-2">
      <li className="p-3 rounded border bg-card">Dr. Priya Sharma (Cardiologist)</li>
      <li className="p-3 rounded border bg-card">Dr. John Singh (Dermatologist)</li>
      <li className="p-3 rounded border bg-card">Dr. Meera Patel (General Physician)</li>
    </ul>
  </div>
);

const PathologyContent = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Pathology Results</h2>
    <p className="text-muted-foreground">Recent pathology results will be listed here. (Demo content)</p>
    <ul className="mt-4 space-y-2">
      <li className="p-3 rounded border bg-card flex flex-col">
        <span className="font-bold">Blood Test</span>
        <span className="text-xs text-muted-foreground">Jul 10, 2024 • Normal</span>
      </li>
      <li className="p-3 rounded border bg-card flex flex-col">
        <span className="font-bold">X-Ray Chest</span>
        <span className="text-xs text-muted-foreground">Jun 27, 2024 • Needs Review</span>
      </li>
    </ul>
  </div>
);

const ChatsContent = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Chats</h2>
    <p className="text-muted-foreground">Your recent chat messages. (Demo content)</p>
    <ul className="mt-4 space-y-2">
      <li className="p-3 rounded border bg-card">
        <span className="font-bold">Dr. Priya Sharma:</span> Appointment on Monday?
      </li>
      <li className="p-3 rounded border bg-card">
        <span className="font-bold">Reception:</span> Your test results are available.
      </li>
    </ul>
  </div>
);

const SettingsContent = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Settings</h2>
    <p className="text-muted-foreground">This is the Settings screen. (Demo content)</p>
  </div>
);

const Index = () => {
  // Default to appointments tab (with calendar)
  const [selectedTab, setSelectedTab] = useState<string>(TAB_APPOINTMENTS);

  let content: React.ReactNode = null;

  switch (selectedTab) {
    case TAB_OVERVIEW:
      content = <OverviewContent />;
      break;
    case TAB_APPOINTMENTS:
      content = (
        <div className="max-w-7xl mx-auto">
          <CalendarHeader />
          <CalendarView />
          <AppointmentModal />
        </div>
      );
      break;
    case TAB_DOCTORS:
      content = <DoctorsContent />;
      break;
    case TAB_PATHOLOGY:
      content = <PathologyContent />;
      break;
    case TAB_CHATS:
      content = <ChatsContent />;
      break;
    case TAB_SETTINGS:
      content = <SettingsContent />;
      break;
    default:
      content = <OverviewContent />;
  }

  return (
    <ThemeProvider>
      <AppointmentProvider>
        <Layout selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
          {content}
        </Layout>
      </AppointmentProvider>
    </ThemeProvider>
  );
};

export default Index;
