import type { Time } from '../backend';

export function timeToDate(time: Time): Date {
  const milliseconds = Number(time) / 1_000_000;
  return new Date(milliseconds);
}

export function dateToTime(date: Date): Time {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) {
    days.push(new Date(year, month, -startDay + i + 1));
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  const endDay = lastDay.getDay();
  for (let i = 1; i < 7 - endDay; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isUpcoming(date: Date, days: number = 7): boolean {
  const now = new Date();
  const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return date >= now && date <= future;
}
