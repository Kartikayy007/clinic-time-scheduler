
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, setHours, setMinutes } from 'date-fns';

export type AppointmentType = 'emergency' | 'examination' | 'consultation' | 'checkup' | 'sick-visit';

export interface Appointment {
  id: string;
  title: string;
  doctorName?: string;
  patientName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: AppointmentType;
  notes?: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  currentDate: Date;
  viewMode: 'day' | 'week' | 'month';
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  setCurrentDate: (date: Date) => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
  setViewMode: (mode: 'day' | 'week' | 'month') => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedAppointment: Appointment | null;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  selectedTimeSlot: Date | null;
  setSelectedTimeSlot: (time: Date | null) => void;
  modalMode: 'create' | 'edit' | 'view';
  setModalMode: (mode: 'create' | 'edit' | 'view') => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Sample data for initial state
const sampleAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Annual Checkup',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: new Date(2025, 3, 22),
    startTime: setHours(setMinutes(new Date(2025, 3, 22), 0), 10),
    endTime: setHours(setMinutes(new Date(2025, 3, 22), 30), 10),
    type: 'checkup',
    notes: 'Regular annual health examination'
  },
  {
    id: '2',
    title: 'Fever Consultation',
    patientName: 'Emily Smith',
    doctorName: 'Dr. Michael Chang',
    date: new Date(2025, 3, 23),
    startTime: setHours(setMinutes(new Date(2025, 3, 23), 0), 14),
    endTime: setHours(setMinutes(new Date(2025, 3, 23), 45), 14),
    type: 'consultation',
    notes: 'Patient complaining of high fever for 2 days'
  },
  {
    id: '3',
    title: 'Emergency Visit',
    patientName: 'Robert Brown',
    doctorName: 'Dr. Lisa Garcia',
    date: new Date(2025, 3, 21),
    startTime: setHours(setMinutes(new Date(2025, 3, 21), 0), 9),
    endTime: setHours(setMinutes(new Date(2025, 3, 21), 45), 9),
    type: 'emergency',
    notes: 'Severe chest pain'
  },
  {
    id: '4',
    title: 'Physical Examination',
    patientName: 'Anna Wilson',
    doctorName: 'Dr. James Lee',
    date: new Date(2025, 3, 24),
    startTime: setHours(setMinutes(new Date(2025, 3, 24), 0), 11),
    endTime: setHours(setMinutes(new Date(2025, 3, 24), 30), 11),
    type: 'examination',
    notes: 'Pre-employment physical examination'
  },
  {
    id: '5',
    title: 'Cold Symptoms',
    patientName: 'David Miller',
    doctorName: 'Dr. Emma Wilson',
    date: new Date(2025, 3, 20),
    startTime: setHours(setMinutes(new Date(2025, 3, 20), 15), 15),
    endTime: setHours(setMinutes(new Date(2025, 3, 20), 45), 15),
    type: 'sick-visit',
    notes: 'Patient with cough and runny nose'
  }
];

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 3, 21)); // Set to April 21, 2025
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substring(2, 9),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((app) => app.id !== id));
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    }
  };

  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        currentDate,
        viewMode,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        setCurrentDate,
        nextPeriod,
        prevPeriod,
        setViewMode,
        isModalOpen,
        setIsModalOpen,
        selectedAppointment,
        setSelectedAppointment,
        selectedTimeSlot,
        setSelectedTimeSlot,
        modalMode,
        setModalMode,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
