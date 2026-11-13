import { addCivilDays, civilParts, odooWeekday, zonedTimeToUtc } from "@/lib/cdmx";

export type SlotWindow = {
  weekday: string;
  startHour: number;
  endHour: number;
};

export type BusyInterval = {
  start: Date;
  stop: Date;
};

export type TimeSlot = {
  start: Date;
  stop: Date;
};

export function generateSlots(options: {
  now: Date;
  timeZone: string;
  durationHours: number;
  minScheduleHours: number;
  maxScheduleDays: number;
  windows: SlotWindow[];
  busy: BusyInterval[];
}): TimeSlot[] {
  const durationMin = Math.round(options.durationHours * 60);
  if (durationMin <= 0 || options.maxScheduleDays <= 0) return [];
  const earliest = options.now.getTime() + options.minScheduleHours * 3_600_000;
  const today = civilParts(options.now, options.timeZone);
  const slots: TimeSlot[] = [];
  const seen = new Set<number>();

  for (let dayIndex = 0; dayIndex < options.maxScheduleDays; dayIndex += 1) {
    const day = addCivilDays(today.y, today.m, today.d, dayIndex);
    const weekday = odooWeekday(day.y, day.m, day.d);
    for (const window of options.windows) {
      if (window.weekday !== weekday) continue;
      const startMin = Math.round(window.startHour * 60);
      const endMin = Math.round(window.endHour * 60);
      for (let minute = startMin; minute + durationMin <= endMin; minute += durationMin) {
        const start = zonedTimeToUtc(
          day.y,
          day.m,
          day.d,
          Math.floor(minute / 60),
          minute % 60,
          options.timeZone,
        );
        const stop = new Date(start.getTime() + durationMin * 60_000);
        if (start.getTime() < earliest) continue;
        const overlaps = options.busy.some(
          (interval) => start < interval.stop && stop > interval.start,
        );
        if (overlaps || seen.has(start.getTime())) continue;
        seen.add(start.getTime());
        slots.push({ start, stop });
      }
    }
  }

  slots.sort((a, b) => a.start.getTime() - b.start.getTime());
  return slots;
}
