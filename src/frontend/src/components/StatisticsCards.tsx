import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { timeToDate, isUpcoming } from '../utils/dateHelpers';
import type { Appointment } from '../backend';

interface StatisticsCardsProps {
  appointments: Appointment[];
}

export default function StatisticsCards({ appointments }: StatisticsCardsProps) {
  const totalAppointments = appointments.length;
  const upcomingCount = appointments.filter((apt) =>
    isUpcoming(timeToDate(apt.date))
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-md border-l-4 border-l-sageGreen">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Appointments
          </CardTitle>
          <Calendar className="h-5 w-5 text-sageGreen" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{totalAppointments}</div>
          <p className="text-xs text-muted-foreground mt-1">
            All scheduled appointments
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md border-l-4 border-l-mutedTeal">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Upcoming (7 Days)
          </CardTitle>
          <Clock className="h-5 w-5 text-mutedTeal" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{upcomingCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            In the next week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
