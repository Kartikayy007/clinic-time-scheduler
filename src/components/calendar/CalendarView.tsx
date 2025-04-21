
import React from 'react';
import { useAppointments } from '@/context/AppointmentContext';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

const CalendarView = () => {
  const { viewMode } = useAppointments();

  return (
    <div>
      {viewMode === 'day' && <DayView />}
      {viewMode === 'week' && <WeekView />}
      {viewMode === 'month' && <MonthView />}
    </div>
  );
};

export default CalendarView;
