
import React from 'react';
import { format, addDays, isSameDay, isWithinInterval, startOfDay, endOfDay, setHours, setMinutes } from 'date-fns';
import { useAppointments, Appointment } from '@/context/AppointmentContext';
import { cn } from '@/lib/utils';

const WeekView = () => {
  const { currentDate, appointments, setIsModalOpen, setSelectedAppointment, setModalMode, setSelectedTimeSlot } = useAppointments();
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentDate, i));
  
  const timeSlots = Array.from({ length: 19 }).map((_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? 0 : 30;
    return { hour, minute };
  });

  const handleTimeSlotClick = (day: Date, hour: number, minute: number) => {
    const selectedTime = setMinutes(setHours(new Date(day), hour), minute);
    setSelectedTimeSlot(selectedTime);
    setSelectedAppointment(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalMode('view');
    setIsModalOpen(true);
  };
  
  const getAppointmentsForSlot = (day: Date, hour: number, minute: number) => {
    const slotStart = setMinutes(setHours(new Date(day), hour), minute);
    const slotEnd = setMinutes(setHours(new Date(day), hour), minute + 30);
    
    return appointments.filter(appointment => {
      return isWithinInterval(appointment.startTime, {
        start: slotStart,
        end: slotEnd
      }) || 
      isWithinInterval(appointment.endTime, {
        start: slotStart,
        end: slotEnd
      }) ||
      (appointment.startTime <= slotStart && appointment.endTime >= slotEnd);
    });
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-md shadow">
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 border-r"></div>
        {weekDays.map((day) => (
          <div key={day.toString()} className="p-4 text-center border-r last:border-r-0">
            <p className="font-medium">{format(day, 'EEEE').toUpperCase()}</p>
            <p className={cn(
              "mt-1 rounded-full w-8 h-8 mx-auto flex items-center justify-center",
              isSameDay(day, new Date()) && "bg-primary text-primary-foreground"
            )}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8">
        <div className="border-r">
          {timeSlots.map((slot, index) => (
            <div 
              key={index}
              className="h-16 border-b last:border-b-0 px-2 flex items-center justify-end"
            >
              <span className="text-xs text-muted-foreground">
                {formatTime(slot.hour, slot.minute)}
              </span>
            </div>
          ))}
        </div>

        {weekDays.map((day) => (
          <div key={day.toString()} className="border-r last:border-r-0">
            {timeSlots.map((slot, index) => {
              const slotAppointments = getAppointmentsForSlot(day, slot.hour, slot.minute);
              
              return (
                <div 
                  key={index}
                  className={cn(
                    "h-16 border-b last:border-b-0 relative",
                    "cursor-pointer hover:bg-muted/50 transition-colors"
                  )}
                  onClick={() => handleTimeSlotClick(day, slot.hour, slot.minute)}
                >
                  {slotAppointments.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className={cn(
                        `appointment-${appointment.type} rounded-md p-1 absolute z-10 overflow-hidden`,
                        "left-0 right-0 mx-1"
                      )}
                      style={{
                        top: '0',
                        height: '90%',
                        zIndex: 10
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppointmentClick(appointment);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-xs font-bold truncate">{appointment.title}</div>
                        <div className="text-xs opacity-90">
                          {format(appointment.startTime, 'HH:mm')}
                        </div>
                      </div>
                      <div className="text-xs truncate mt-0.5">{appointment.patientName}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
