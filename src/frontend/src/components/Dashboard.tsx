import { useState } from 'react';
import { useGetAllAppointments } from '../hooks/useQueries';
import { timeToDate, isToday, isUpcoming } from '../utils/dateHelpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock } from 'lucide-react';
import AppointmentDialog from './AppointmentDialog';
import StatisticsCards from './StatisticsCards';
import type { Appointment } from '../backend';

export default function Dashboard() {
  const { data: appointments, isLoading } = useGetAllAppointments();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const todayAppointments = appointments?.filter((apt) =>
    isToday(timeToDate(apt.date))
  ) || [];

  const upcomingAppointments = appointments?.filter((apt) =>
    isUpcoming(timeToDate(apt.date)) && !isToday(timeToDate(apt.date))
  ) || [];

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Manage your appointments and schedule</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-sageGreen hover:bg-sageGreen/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <StatisticsCards appointments={appointments || []} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sageGreen">
              <Calendar className="h-5 w-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No appointments scheduled for today
              </p>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => {
                  const date = timeToDate(apt.date);
                  return (
                    <div
                      key={apt.id.toString()}
                      onClick={() => handleAppointmentClick(apt)}
                      className="p-4 rounded-lg bg-warmCream hover:bg-warmBeige transition-colors cursor-pointer border border-border"
                    >
                      <h4 className="font-semibold text-foreground">{apt.title}</h4>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {date.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        <span>• {Number(apt.duration)} min</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-mutedTeal">
              <Clock className="h-5 w-5" />
              Upcoming (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No upcoming appointments
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 5).map((apt) => {
                  const date = timeToDate(apt.date);
                  return (
                    <div
                      key={apt.id.toString()}
                      onClick={() => handleAppointmentClick(apt)}
                      className="p-4 rounded-lg bg-warmCream hover:bg-warmBeige transition-colors cursor-pointer border border-border"
                    >
                      <h4 className="font-semibold text-foreground">{apt.title}</h4>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        <span>at</span>
                        {date.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AppointmentDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        appointment={selectedAppointment}
      />
    </div>
  );
}
