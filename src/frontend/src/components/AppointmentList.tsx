import { useState, useMemo } from 'react';
import { useGetAllAppointments } from '../hooks/useQueries';
import { timeToDate, formatDateTime } from '../utils/dateHelpers';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Clock, Bell, BellOff } from 'lucide-react';
import AppointmentDialog from './AppointmentDialog';
import type { Appointment } from '../backend';

export default function AppointmentList() {
  const { data: appointments, isLoading } = useGetAllAppointments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    let filtered = [...appointments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.title.toLowerCase().includes(query) ||
          apt.description.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => Number(a.date - b.date));

    return filtered;
  }, [appointments, searchQuery]);

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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-foreground">All Appointments</h2>
        <p className="text-muted-foreground mt-1">Browse and search your appointments</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-16">
            <p className="text-muted-foreground text-center">
              {searchQuery
                ? 'No appointments found matching your search'
                : 'No appointments scheduled yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((apt) => {
            const date = timeToDate(apt.date);
            const isPast = date < new Date();

            return (
              <Card
                key={apt.id.toString()}
                className={`shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                  isPast ? 'opacity-60' : ''
                }`}
                onClick={() => handleAppointmentClick(apt)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {apt.title}
                      </h3>
                      {apt.description && (
                        <p className="text-muted-foreground text-sm mb-3">
                          {apt.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 text-sageGreen" />
                          {formatDateTime(date)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 text-mutedTeal" />
                          {Number(apt.duration)} minutes
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {apt.alarmEnabled ? (
                            <>
                              <Bell className="h-4 w-4 text-mutedTeal" />
                              Alarm: {apt.alarmOffset ? Number(apt.alarmOffset) : 0} min before
                            </>
                          ) : (
                            <>
                              <BellOff className="h-4 w-4" />
                              No alarm
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAppointmentClick(apt);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AppointmentDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        appointment={selectedAppointment}
      />
    </div>
  );
}
