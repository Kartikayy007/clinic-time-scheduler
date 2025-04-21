
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppointments, AppointmentType } from '@/context/AppointmentContext';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const appointmentTypes: { value: AppointmentType; label: string; }[] = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'examination', label: 'Examination' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'checkup', label: 'Routine Checkup' },
  { value: 'sick-visit', label: 'Sick Visit' },
];

const sampleDoctors = [
  { value: 'dr-smith', name: 'Dr. Smith' },
  { value: 'dr-johnson', name: 'Dr. Johnson' },
  { value: 'dr-williams', name: 'Dr. Williams' },
  { value: 'dr-brown', name: 'Dr. Brown' },
  { value: 'dr-jones', name: 'Dr. Jones' },
];

const times = Array.from({ length: 20 }).map((_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return { value: `${hour}:${minute}`, label: `${hour}:${minute}` };
});

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  patientName: z.string().min(2, { message: 'Patient name is required' }),
  doctorName: z.string().optional(),
  date: z.date({ required_error: 'Please select a date' }),
  startTime: z.string({ required_error: 'Please select a start time' }),
  endTime: z.string({ required_error: 'Please select an end time' }),
  type: z.enum(['emergency', 'examination', 'consultation', 'checkup', 'sick-visit'], {
    required_error: 'Please select an appointment type',
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AppointmentModal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    selectedAppointment,
    modalMode,
    setModalMode,
    selectedTimeSlot,
  } = useAppointments();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      patientName: '',
      doctorName: undefined,
      date: new Date(),
      startTime: '9:00',
      endTime: '9:30',
      type: 'checkup',
      notes: '',
    },
  });

  useEffect(() => {
    if (selectedTimeSlot) {
      form.setValue('date', selectedTimeSlot);
      form.setValue('startTime', format(selectedTimeSlot, 'HH:mm'));
      
      // Calculate end time (30 mins later)
      const endHour = selectedTimeSlot.getHours();
      const endMinute = selectedTimeSlot.getMinutes() + 30;
      const adjustedHour = endMinute >= 60 ? endHour + 1 : endHour;
      const adjustedMinute = endMinute >= 60 ? endMinute - 60 : endMinute;
      form.setValue('endTime', `${adjustedHour.toString().padStart(2, '0')}:${adjustedMinute.toString().padStart(2, '0')}`);
    }
    
    if (selectedAppointment && (modalMode === 'edit' || modalMode === 'view')) {
      form.reset({
        title: selectedAppointment.title,
        patientName: selectedAppointment.patientName,
        doctorName: selectedAppointment.doctorName,
        date: selectedAppointment.date,
        startTime: format(selectedAppointment.startTime, 'HH:mm'),
        endTime: format(selectedAppointment.endTime, 'HH:mm'),
        type: selectedAppointment.type,
        notes: selectedAppointment.notes || '',
      });
    } else {
      form.reset({
        title: '',
        patientName: '',
        doctorName: undefined,
        date: selectedTimeSlot || new Date(),
        startTime: selectedTimeSlot ? format(selectedTimeSlot, 'HH:mm') : '9:00',
        endTime: selectedTimeSlot ? format(new Date(selectedTimeSlot.getTime() + 30 * 60000), 'HH:mm') : '9:30',
        type: 'checkup',
        notes: '',
      });
    }
  }, [selectedAppointment, modalMode, selectedTimeSlot, form]);

  const onSubmit = (values: FormValues) => {
    const [startHour, startMinute] = values.startTime.split(':').map(Number);
    const [endHour, endMinute] = values.endTime.split(':').map(Number);
    
    const appointmentDate = new Date(values.date);
    const startTime = new Date(appointmentDate);
    startTime.setHours(startHour, startMinute, 0);
    
    const endTime = new Date(appointmentDate);
    endTime.setHours(endHour, endMinute, 0);
    
    if (modalMode === 'edit' && selectedAppointment) {
      updateAppointment({
        ...selectedAppointment,
        title: values.title,
        patientName: values.patientName,
        doctorName: values.doctorName,
        date: appointmentDate,
        startTime,
        endTime,
        type: values.type as AppointmentType,
        notes: values.notes,
      });
      toast.success('Appointment updated successfully!');
    } else {
      addAppointment({
        title: values.title,
        patientName: values.patientName,
        doctorName: values.doctorName,
        date: appointmentDate,
        startTime,
        endTime,
        type: values.type as AppointmentType,
        notes: values.notes,
      });
      toast.success('Appointment created successfully!');
    }
    
    setIsModalOpen(false);
  };
  
  const handleDelete = () => {
    if (selectedAppointment) {
      deleteAppointment(selectedAppointment.id);
      toast.success('Appointment deleted successfully!');
      setIsModalOpen(false);
    }
  };
  
  const handleEdit = () => {
    setModalMode('edit');
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {modalMode === 'create' ? 'New Appointment' : modalMode === 'edit' ? 'Edit Appointment' : 'Appointment Details'}
          </DialogTitle>
          <DialogDescription>
            {modalMode === 'view' ? 'View appointment details below.' : 'Fill in the appointment details below.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Appointment title"
                      {...field}
                      disabled={modalMode === 'view'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Patient name"
                        {...field}
                        disabled={modalMode === 'view'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={modalMode === 'view'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleDoctors.map((doctor) => (
                          <SelectItem key={doctor.value} value={doctor.name}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={modalMode === 'view'}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={modalMode === 'view'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={modalMode === 'view'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {times.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={modalMode === 'view'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {times.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes"
                      className="resize-none"
                      {...field}
                      disabled={modalMode === 'view'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0">
              {modalMode === 'view' ? (
                <>
                  <Button type="button" variant="secondary" onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button type="button" variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                  <Button type="button" onClick={() => setIsModalOpen(false)}>
                    Close
                  </Button>
                </>
              ) : (
                <>
                  {modalMode === 'edit' && (
                    <Button type="button" variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  )}
                  <Button type="submit">
                    {modalMode === 'create' ? 'Create' : 'Save Changes'}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
