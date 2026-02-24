import { useEffect, useRef } from 'react';
import { useGetAllAppointments } from './useQueries';
import { timeToDate } from '../utils/dateHelpers';
import { toast } from 'sonner';

export function useAlarmNotifications() {
  const { data: appointments } = useGetAllAppointments();
  const firedAlarmsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!appointments || appointments.length === 0) return;

    const checkAlarms = () => {
      const now = new Date();

      appointments.forEach((appointment) => {
        if (!appointment.alarmEnabled || !appointment.alarmOffset) return;

        const appointmentDate = timeToDate(appointment.date);
        const alarmTime = new Date(
          appointmentDate.getTime() - Number(appointment.alarmOffset) * 60 * 1000
        );

        const alarmKey = `${appointment.id}-${appointment.date}`;

        if (
          now >= alarmTime &&
          now < appointmentDate &&
          !firedAlarmsRef.current.has(alarmKey)
        ) {
          firedAlarmsRef.current.add(alarmKey);

          toast(appointment.title, {
            description: appointmentDate.toLocaleString(),
            duration: 10000,
          });
        }
      });
    };

    const interval = setInterval(checkAlarms, 30000);
    checkAlarms();

    return () => clearInterval(interval);
  }, [appointments]);
}
