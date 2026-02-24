import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppointmentForm from './AppointmentForm';
import { Button } from '@/components/ui/button';
import { useDeleteAppointment } from '../hooks/useQueries';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Appointment } from '../backend';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
}

export default function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
}: AppointmentDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteAppointment = useDeleteAppointment();

  const handleDelete = async () => {
    if (!appointment) return;

    try {
      await deleteAppointment.mutateAsync(appointment.id);
      toast.success('Appointment deleted successfully');
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {appointment ? 'Edit Appointment' : 'New Appointment'}
            </DialogTitle>
          </DialogHeader>

          <AppointmentForm appointment={appointment} onSuccess={handleSuccess} />

          {appointment && (
            <DialogFooter className="border-t pt-4">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteAppointment.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Appointment
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment
              "{appointment?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
