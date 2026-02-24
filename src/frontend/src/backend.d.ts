import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Appointment {
    id: bigint;
    title: string;
    duration: bigint;
    date: Time;
    description: string;
    alarmOffset?: bigint;
    alarmEnabled: boolean;
}
export type Time = bigint;
export interface backendInterface {
    createAppointment(title: string, description: string, date: Time, duration: bigint, alarmEnabled: boolean, alarmOffset: bigint | null): Promise<bigint>;
    deleteAppointment(id: bigint): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAppointment(id: bigint): Promise<Appointment>;
    updateAppointment(id: bigint, title: string, description: string, date: Time, duration: bigint, alarmEnabled: boolean, alarmOffset: bigint | null): Promise<void>;
}
