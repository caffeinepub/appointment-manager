import { useState } from 'react';
import { useGetAllAppointments } from '../hooks/useQueries';
import { timeToDate, getMonthDays, isSameDay, isToday } from '../utils/dateHelpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import AppointmentDialog from './AppointmentDialog';
import type { Appointment } from '../backend';

export default function CalendarView() {
  const { data: appointments, isLoading } = useGetAllAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDays = getMonthDays(year, month);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments?.filter((apt) => isSameDay(timeToDate(apt.date), date)) || [];
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-foreground">Calendar</h2>
        <p className="text-muted-foreground mt-1">View appointments by date</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-md lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
              {monthDays.map((date, index) => {
                const dayAppointments = getAppointmentsForDate(date);
                const isCurrentMonth = date.getMonth() === month;
                const isTodayDate = isToday(date);
                const isSelected = selectedDate && isSameDay(date, selectedDate);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`
                      relative aspect-square p-2 rounded-lg text-sm transition-colors
                      ${!isCurrentMonth ? 'text-muted-foreground/40' : 'text-foreground'}
                      ${isTodayDate ? 'bg-sageGreen text-white font-semibold' : ''}
                      ${isSelected && !isTodayDate ? 'bg-warmBeige border-2 border-sageGreen' : ''}
                      ${!isTodayDate && !isSelected ? 'hover:bg-warmCream' : ''}
                    `}
                  >
                    <span>{date.getDate()}</span>
                    {dayAppointments.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayAppointments.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 w-1 rounded-full ${
                              isTodayDate ? 'bg-white' : 'bg-mutedTeal'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-muted-foreground text-center py-8">
                Click on a date to view appointments
              </p>
            ) : selectedDateAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No appointments on this date
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDateAppointments.map((apt) => {
                  const date = timeToDate(apt.date);
                  return (
                    <div
                      key={apt.id.toString()}
                      onClick={() => handleAppointmentClick(apt)}
                      className="p-3 rounded-lg bg-warmCream hover:bg-warmBeige transition-colors cursor-pointer border border-border"
                    >
                      <h4 className="font-semibold text-foreground text-sm">{apt.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
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
      </div>

      <AppointmentDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        appointment={selectedAppointment}
      />
    </div>
  );
}
