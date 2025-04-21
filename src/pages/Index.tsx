import React, { useState } from 'react';
import { AppointmentProvider } from '@/context/AppointmentContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Layout from '@/components/layout/Layout';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarView from '@/components/calendar/CalendarView';
import AppointmentModal from '@/components/calendar/AppointmentModal';
import { Calendar, Clock, User, FileText, MessageSquare, Plus, Pencil, Trash2 } from 'lucide-react';
import OverviewStatsCard from "@/components/OverviewStatsCard";
import { useAppointments } from '@/context/AppointmentContext';
import { format, isAfter, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';

const TAB_OVERVIEW = "overview";
const TAB_APPOINTMENTS = "appointments";
const TAB_DOCTORS = "doctors";
const TAB_PATHOLOGY = "pathology";
const TAB_CHATS = "chats";
const TAB_SETTINGS = "settings";

const OverviewContent = () => {
  const { appointments, setIsModalOpen, setModalMode, setSelectedAppointment, setSelectedTimeSlot } = useAppointments();

  const doctors = [
    "Dr. Priya Sharma",
    "Dr. John Singh",
    "Dr. Meera Patel",
    "Dr. Sarah Johnson",
    "Dr. Michael Chang",
    "Dr. Lisa Garcia",
    "Dr. James Lee",
    "Dr. Emma Wilson",
    // ...add more for demo
  ];
  const pathologyResults = 4; // For demo, you could show recent ones in a list!
  const newChats = 2; // For demo
  const now = new Date();
  const upcomingAppointments = appointments
    .filter(a =>
      isAfter(a.startTime, now) ||
      (isSameDay(a.startTime, now) && a.endTime > now)
    )
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const handleBook = () => {
    setSelectedAppointment(null);
    setModalMode('create');
    setSelectedTimeSlot(new Date());
    setIsModalOpen(true);
  };
  const handleEdit = () => {
    if (upcomingAppointments[0]) {
      setSelectedAppointment(upcomingAppointments[0]);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };
  const handleDelete = () => {
    if (upcomingAppointments[0]) {
      setSelectedAppointment(upcomingAppointments[0]);
      setModalMode('view'); // Open in view mode for delete (or prompt in dialog)
      setIsModalOpen(true);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary to-muted/40 bg-clip-text text-transparent animate-fade-in">Welcome to HealthSync!</h2>
      <p className="text-muted-foreground mb-4 animate-fade-in">This is your personalized dashboard. Book and manage your medical appointments with ease.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 mb-8">
        <OverviewStatsCard icon={<Clock />} title="Upcoming Appointments" value={upcomingAppointments.length} colorClass="from-[#F2FCE2] to-[#E5DEFF]" delay={100}/>
        <OverviewStatsCard icon={<User />} title="Doctors Available" value={doctors.length} colorClass="from-[#D3E4FD] to-[#FFDEE2]" delay={250}/>
        <OverviewStatsCard icon={<FileText />} title="Pathology Results" value={pathologyResults} colorClass="from-[#FEF7CD] to-[#FDE1D3]" delay={400}/>
        <OverviewStatsCard icon={<MessageSquare />} title="New Chats" value={newChats} colorClass="from-[#FEC6A1] to-[#D6BCFA]" delay={550}/>
      </div>
      <div className="rounded-lg border bg-card shadow p-5 mt-2 animate-fade-in flex flex-col md:flex-row gap-5">
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 animate-fade-in">
            <Calendar className="text-primary" /> Next Appointments
          </h3>
          {upcomingAppointments.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 animate-fade-in">No upcoming appointments.</div>
          ) : (
            <ul className="space-y-3">
              {upcomingAppointments.slice(0,2).map(a => (
                <li
                  key={a.id}
                  className="rounded p-3 bg-muted flex flex-col sm:flex-row sm:items-center animate-scale-in shadow-sm gap-1 sm:gap-4"
                >
                  <div className="flex-1">
                    <div className="font-medium text-primary">{a.title}</div>
                    <div className="text-muted-foreground text-xs">
                      {format(a.startTime, "MMM d, yyyy")}, {format(a.startTime, "HH:mm")} - {format(a.endTime, "HH:mm")}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      Patient: {a.patientName} {a.doctorName && <span>&bull; Doctor: {a.doctorName}</span>}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="ml-0 sm:ml-2 mt-2 sm:mt-0 animate-fade-in"
                    onClick={() => {
                      setSelectedAppointment(a);
                      setModalMode('view');
                      setIsModalOpen(true);
                    }}
                  >
                    View
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col justify-between border-t md:border-l md:border-t-0 pt-5 md:pl-8 md:pt-0 w-full md:w-60 animate-scale-in">
          <h4 className="font-semibold mb-2 animate-fade-in flex gap-1 items-center"><Plus className="h-4 w-4" /> Appointment Quick Actions</h4>
          <div className="flex gap-2 flex-col">
            <Button
              type="button"
              onClick={handleBook}
              className="animate-scale-in text-white bg-gradient-to-r from-primary via-secondary to-[#8B5CF6] hover:from-primary/90 hover:scale-105 transition-transform shadow"
            >
              <Plus className="h-4 w-4 mr-1" /> Book New
            </Button>
            <Button
              type="button"
              disabled={upcomingAppointments.length === 0}
              onClick={handleEdit}
              className="animate-scale-in bg-muted hover:bg-muted/90 text-primary border transition-shadow"
            >
              <Pencil className="h-4 w-4 mr-1" /> Edit Next
            </Button>
            <Button
              type="button"
              disabled={upcomingAppointments.length === 0}
              onClick={handleDelete}
              className="animate-scale-in bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-shadow"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Cancel Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
