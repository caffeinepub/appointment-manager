import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Appointment } from '../backend';

export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAppointment(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Appointment | null>({
    queryKey: ['appointment', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getAppointment(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      date: bigint;
      duration: bigint;
      alarmEnabled: boolean;
      alarmOffset: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createAppointment(
        data.title,
        data.description,
        data.date,
        data.duration,
        data.alarmEnabled,
        data.alarmOffset
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      date: bigint;
      duration: bigint;
      alarmEnabled: boolean;
      alarmOffset: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateAppointment(
        data.id,
        data.title,
        data.description,
        data.date,
        data.duration,
        data.alarmEnabled,
        data.alarmOffset
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useDeleteAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteAppointment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
