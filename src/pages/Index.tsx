
import React from 'react';
import { AppointmentProvider } from '@/context/AppointmentContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Layout from '@/components/layout/Layout';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarView from '@/components/calendar/CalendarView';
import AppointmentModal from '@/components/calendar/AppointmentModal';

const Index = () => {
  return (
    <ThemeProvider>
      <AppointmentProvider>
        <Layout>
          <div className="max-w-7xl mx-auto">
            <CalendarHeader />
            <CalendarView />
            <AppointmentModal />
          </div>
        </Layout>
      </AppointmentProvider>
    </ThemeProvider>
  );
};

export default Index;
