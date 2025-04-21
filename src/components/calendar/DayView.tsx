
import React from 'react';
import { format, isSameDay, isWithinInterval, setHours, setMinutes } from 'date-fns';
import { useAppointments, Appointment } from '@/context/AppointmentContext';
import { cn } from '@/lib/utils';

const DayView = () => {
  const { currentDate, appointments, setIsModalOpen, setSelectedAppointment, setModalMode, setSelectedTimeSlot } = useAppointments();
  
  const timeSlots = Array.from({ length: 19 }).map((_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? 0 : 30;
    return { hour, minute };
  });

  const handleTimeSlotClick = (hour: number, minute: number) => {
    const selectedTime = setMinutes(setHours(new Date(currentDate), hour), minute);
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
  
  // Filter appointments for the current day
  const getAppointmentsForSlot = (hour: number, minute: number) => {
    const slotStart = setMinutes(setHours(new Date(currentDate), hour), minute);
    const slotEnd = setMinutes(setHours(new Date(currentDate), hour), minute + 30);
    
    return appointments.filter(appointment => 
      isSameDay(appointment.date, currentDate) && (
        isWithinInterval(appointment.startTime, {
          start: slotStart,
          end: slotEnd
        }) || 
        isWithinInterval(appointment.endTime, {
          start: slotStart,
          end: slotEnd
        }) ||
        (appointment.startTime <= slotStart && appointment.endTime >= slotEnd)
      )
    );
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-md shadow">
      <div className="grid grid-cols-1 border-b">
        <div className="p-4 text-center">
          <p className="font-medium">{format(currentDate, 'EEEE').toUpperCase()}</p>
          <p className="mt-1 bg-primary text-primary-foreground rounded-full w-8 h-8 mx-auto flex items-center justify-center">
            {format(currentDate, 'd')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[80px_1fr] border-t">
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

        <div>
          {timeSlots.map((slot, index) => {
            const slotAppointments = getAppointmentsForSlot(slot.hour, slot.minute);
            
            return (
              <div 
                key={index}
                className={cn(
                  "h-16 border-b last:border-b-0 relative",
                  "cursor-pointer hover:bg-muted/50 transition-colors"
                )}
                onClick={() => handleTimeSlotClick(slot.hour, slot.minute)}
              >
                {slotAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className={cn(
                      `appointment-${appointment.type} rounded-md p-2 absolute z-10 overflow-hidden`,
                      "left-0 right-0 mx-2"
                    )}
                    style={{
                      top: '0',
                      height: '90%',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAppointmentClick(appointment);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium truncate">{appointment.title}</div>
                      <div className="text-xs opacity-90">
                        {format(appointment.startTime, 'HH:mm')}
                      </div>
                    </div>
                    <div className="text-sm mt-1 truncate">{appointment.patientName}</div>
                    {appointment.doctorName && (
                      <div className="text-xs mt-0.5 truncate">with {appointment.doctorName}</div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
