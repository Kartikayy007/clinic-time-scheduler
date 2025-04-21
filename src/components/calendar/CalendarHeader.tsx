
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useAppointments } from '@/context/AppointmentContext';

const CalendarHeader = () => {
  const {
    currentDate,
    prevPeriod,
    nextPeriod,
    viewMode,
    setViewMode,
    setIsModalOpen,
    setSelectedAppointment,
    setModalMode,
    setSelectedTimeSlot
  } = useAppointments();

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setModalMode('create');
    setSelectedTimeSlot(new Date());
    setIsModalOpen(true);
  };

  const getHeaderText = () => {
    if (viewMode === 'day') {
      return format(currentDate, 'MMMM d, yyyy');
    } else if (viewMode === 'week') {
      return `This week: ${format(currentDate, 'MMMM d')} - ${format(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6),
        'MMMM d'
      )}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateAppointment}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Appointment
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium">{getHeaderText()}</h2>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={prevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
          <Button
            variant={viewMode === 'day' ? 'default' : 'ghost'}
            size="sm"
            className={`${viewMode === 'day' ? '' : 'text-muted-foreground'}`}
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'ghost'}
            size="sm"
            className={`${viewMode === 'week' ? '' : 'text-muted-foreground'}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'ghost'}
            size="sm"
            className={`${viewMode === 'month' ? '' : 'text-muted-foreground'}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
