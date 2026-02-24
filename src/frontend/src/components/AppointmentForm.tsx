import { useState, useEffect } from 'react';
import { useCreateAppointment, useUpdateAppointment } from '../hooks/useQueries';
import { dateToTime, timeToDate } from '../utils/dateHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { Appointment } from '../backend';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSuccess?: () => void;
}

export default function AppointmentForm({ appointment, onSuccess }: AppointmentFormProps) {
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmOffset, setAlarmOffset] = useState('15');

  useEffect(() => {
    if (appointment) {
      const appointmentDate = timeToDate(appointment.date);
      setTitle(appointment.title);
      setDescription(appointment.description);
      setDate(appointmentDate.toISOString().split('T')[0]);
      setTime(
        appointmentDate.toTimeString().slice(0, 5)
      );
      setDuration(appointment.duration.toString());
      setAlarmEnabled(appointment.alarmEnabled);
      setAlarmOffset(appointment.alarmOffset?.toString() || '15');
    } else {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 60);
      setDate(now.toISOString().split('T')[0]);
      setTime(now.toTimeString().slice(0, 5));
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!date || !time) {
      toast.error('Please select date and time');
      return;
    }

    try {
      const dateTime = new Date(`${date}T${time}`);
      const appointmentData = {
        title: title.trim(),
        description: description.trim(),
        date: dateToTime(dateTime),
        duration: BigInt(duration),
        alarmEnabled,
        alarmOffset: alarmEnabled ? BigInt(alarmOffset) : null,
      };

      if (appointment) {
        await updateAppointment.mutateAsync({
          id: appointment.id,
          ...appointmentData,
        });
        toast.success('Appointment updated successfully');
      } else {
        await createAppointment.mutateAsync(appointmentData);
        toast.success('Appointment created successfully');
      }

      onSuccess?.();
    } catch (error) {
      toast.error(appointment ? 'Failed to update appointment' : 'Failed to create appointment');
    }
  };

  const isLoading = createAppointment.isPending || updateAppointment.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting with team"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about the appointment..."
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes) *</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger id="duration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1.5 hours</SelectItem>
            <SelectItem value="120">2 hours</SelectItem>
            <SelectItem value="180">3 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 p-4 rounded-lg bg-warmCream border border-border">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="alarm"
            checked={alarmEnabled}
            onCheckedChange={(checked) => setAlarmEnabled(checked as boolean)}
          />
          <Label htmlFor="alarm" className="cursor-pointer">
            Enable alarm notification
          </Label>
        </div>

        {alarmEnabled && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="alarmOffset">Notify me before</Label>
            <Select value={alarmOffset} onValueChange={setAlarmOffset}>
              <SelectTrigger id="alarmOffset">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="1440">1 day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-sageGreen hover:bg-sageGreen/90 text-white"
        >
          {isLoading ? 'Saving...' : appointment ? 'Update Appointment' : 'Create Appointment'}
        </Button>
      </div>
    </form>
  );
}
