
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { useAppointments } from '@/context/AppointmentContext';
import { cn } from '@/lib/utils';

const MonthView = () => {
  const { currentDate, appointments, setIsModalOpen, setSelectedTimeSlot, setSelectedAppointment, setModalMode } = useAppointments();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  const handleDayClick = (date: Date) => {
    setSelectedTimeSlot(date);
    setSelectedAppointment(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (e: React.MouseEvent, appointmentId: string) => {
    e.stopPropagation();
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setModalMode('view');
      setIsModalOpen(true);
    }
  };

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, 'd');
      const cloneDay = new Date(day);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      
      // Get appointments for this day
      const dayAppointments = appointments.filter(appointment => 
        isSameDay(appointment.date, cloneDay)
      );
      
      days.push(
        <div
          key={day.toString()}
          className={cn(
            "border p-2 h-32 overflow-y-auto",
            !isCurrentMonth && "bg-gray-100 dark:bg-gray-800/50",
            isToday && "bg-blue-50 dark:bg-blue-900/20",
            "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors"
          )}
          onClick={() => handleDayClick(cloneDay)}
        >
          <div className="flex justify-between">
            <span className={cn(
              "text-sm font-medium",
              isToday && "bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center"
            )}>
              {formattedDate}
            </span>
            {dayAppointments.length > 0 && (
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                {dayAppointments.length}
              </span>
            )}
          </div>
          <div className="mt-2 space-y-1">
            {dayAppointments.slice(0, 3).map(appointment => (
              <div
                key={appointment.id}
                className={cn(
                  `appointment-${appointment.type}`,
                  "text-xs p-1 rounded-md cursor-pointer",
                  "truncate"
                )}
                onClick={(e) => handleAppointmentClick(e, appointment.id)}
              >
                <div className="font-medium">{appointment.title}</div>
                <div className="opacity-90">{format(appointment.startTime, 'HH:mm')}</div>
              </div>
            ))}
            {dayAppointments.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +{dayAppointments.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      
      day = addDays(day, 1);
    }
    
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    
    days = [];
  }

  return (
    <div className="bg-card rounded-md shadow">
      <div className="grid grid-cols-7 border-b text-center">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
          (dayName) => (
            <div key={dayName} className="p-2 border-r last:border-r-0 font-medium">
              {dayName}
            </div>
          )
        )}
      </div>
      <div>{rows}</div>
    </div>
  );
};

export default MonthView;
