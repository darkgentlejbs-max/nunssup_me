import { Appointment, TimeBlock, ShopConfig } from '../types';

export const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토'];

// Convert Date object to local "YYYY-MM-DD" string (timezone-safe, no UTC offset bug)
export const formatLocalDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Get today's local date string "YYYY-MM-DD"
export const getTodayString = (): string => {
  return formatLocalDate(new Date());
};

// Shift date by N days
export const shiftDate = (dateStr: string, days: number): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  return formatLocalDate(date);
};

// Shift month by N months (always returns 1st day of target month)
export const shiftMonth = (dateStr: string, offsetMonths: number): string => {
  const [y, m] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1 + offsetMonths, 1);
  return formatLocalDate(targetDate);
};

// Parse "HH:mm" to minutes from midnight
export const timeToMinutes = (timeStr: string): number => {
  const [hours, mins] = timeStr.split(':').map(Number);
  return hours * 60 + mins;
};

// Convert minutes from midnight to "HH:mm"
export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Check if a given date string (YYYY-MM-DD) is closed
export const isDateClosed = (dateStr: string, shopConfig: ShopConfig): { isClosed: boolean; reason?: string } => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();

  if ((shopConfig.closedDays || []).includes(dayOfWeek)) {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return { isClosed: true, reason: `정기 휴무일 (${dayNames[dayOfWeek]}요일)` };
  }
  return { isClosed: false };
};

// Get opening hours for a given date
export const getHoursForDate = (dateStr: string, shopConfig: ShopConfig): { start: string; end: string } => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();

  if (shopConfig.dayHours && shopConfig.dayHours[dayOfWeek]) {
    return shopConfig.dayHours[dayOfWeek];
  }

  // Fallback for legacy configs if migration failed
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    return shopConfig.weekendHours;
  }
  return shopConfig.weekdayHours;
};

// Generate available time slots for a given date and service duration
export const getAvailableTimeSlots = (
  dateStr: string,
  serviceDurationMinutes: number,
  appointments: Appointment[],
  timeBlocks: TimeBlock[],
  shopConfig: ShopConfig
): { time: string; available: boolean; reason?: string }[] => {
  const closedCheck = isDateClosed(dateStr, shopConfig);
  if (closedCheck.isClosed) {
    return [];
  }

  const { start, end } = getHoursForDate(dateStr, shopConfig);
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  const interval = shopConfig.slotIntervalMinutes || 30;

  const dayAppointments = appointments.filter(
    (a) => a.date === dateStr && a.status !== 'cancelled'
  );
  const dayBlocks = timeBlocks.filter((b) => b.date === dateStr);

  // Calculate current time in minutes if today (to block past slots)
  const todayStr = formatLocalDate(new Date());
  const isToday = dateStr === todayStr;
  const now = new Date();
  // Add 30 min buffer so customers can't book a slot that's about to start
  const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : 0;

  const slots: { time: string; available: boolean; reason?: string }[] = [];

  for (let current = startMin; current + serviceDurationMinutes <= endMin; current += interval) {
    const timeStr = minutesToTime(current);
    const serviceEnd = current + serviceDurationMinutes;

    // Check if slot has already passed (for today's date)
    if (isToday && current < currentMinutes) {
      slots.push({ time: timeStr, available: false, reason: '지난 시간' });
      continue;
    }

    // Check conflict with appointments
    let hasConflict = false;
    let conflictReason = '';

    for (const apt of dayAppointments) {
      const aptStart = timeToMinutes(apt.time);
      const aptEnd = aptStart + apt.durationMinutes;

      // Check overlap: (StartA < EndB) and (EndA > StartB)
      if (current < aptEnd && serviceEnd > aptStart) {
        hasConflict = true;
        conflictReason = '예약 마감';
        break;
      }
    }

    // Check conflict with time blocks
    if (!hasConflict) {
      for (const block of dayBlocks) {
        const blockStart = timeToMinutes(block.startTime);
        const blockEnd = timeToMinutes(block.endTime);

        if (current < blockEnd && serviceEnd > blockStart) {
          hasConflict = true;
          conflictReason = block.reason || '일정 차단';
          break;
        }
      }
    }

    slots.push({
      time: timeStr,
      available: !hasConflict,
      reason: hasConflict ? conflictReason : undefined,
    });
  }

  return slots;
};

// Format date to Korean "YYYY년 M월 D일 (요일)"
export const formatKoreanDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayStr = DAYS_KR[dateObj.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dayStr})`;
};

// Format date to short "M/D (요일)"
export const formatShortDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayStr = DAYS_KR[dateObj.getDay()];
  return `${m}/${d}(${dayStr})`;
};

// Get dates for current week starting from Monday or specified date
export const getWeekDates = (baseDate: Date): string[] => {
  const current = new Date(baseDate);
  const day = current.getDay();
  // Adjust to Monday (1)
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.setDate(diff));

  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    week.push(formatLocalDate(nextDay));
  }
  return week;
};

export interface MonthGridCell {
  dateStr: string;
  dayNum: number;
  isCurrentMonth: boolean;
  dayOfWeek: number;
}

// Generate 35-42 days grid for monthly calendar view (Timezone-safe)
export const getMonthGrid = (dateStr: string): MonthGridCell[] => {
  const [year, month] = dateStr.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const totalDays = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday

  const days: MonthGridCell[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 2, dayNum);
    days.push({
      dateStr: formatLocalDate(prevDate),
      dayNum,
      isCurrentMonth: false,
      dayOfWeek: prevDate.getDay(),
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(year, month - 1, d);
    days.push({
      dateStr: formatLocalDate(curDate),
      dayNum: d,
      isCurrentMonth: true,
      dayOfWeek: curDate.getDay(),
    });
  }

  // Next month leading days to complete full grid
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month, i);
      days.push({
        dateStr: formatLocalDate(nextDate),
        dayNum: i,
        isCurrentMonth: false,
        dayOfWeek: nextDate.getDay(),
      });
    }
  }

  return days;
};

// Formats the shopConfig dayHours into a grouped string like "월-수 10:00~19:00 | 목-토 10:00~21:00"
export const getOperatingHoursGroups = (shopConfig: ShopConfig): { label: string; start: string; end: string }[] => {
  if (!shopConfig.dayHours) {
    return [
      { label: '월 - 목', start: shopConfig.weekdayHours?.start || '10:30', end: shopConfig.weekdayHours?.end || '19:00' },
      { label: '금 - 토', start: shopConfig.weekendHours?.start || '10:30', end: shopConfig.weekendHours?.end || '21:00' }
    ];
  }

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const groups: { start: string, end: string, days: number[] }[] = [];

  for (let i = 1; i <= 7; i++) {
    const dayIdx = i % 7;
    if ((shopConfig.closedDays || []).includes(dayIdx)) continue;
    
    const hours = shopConfig.dayHours[dayIdx];
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup && lastGroup.start === hours.start && lastGroup.end === hours.end) {
      lastGroup.days.push(dayIdx);
    } else {
      groups.push({ start: hours.start, end: hours.end, days: [dayIdx] });
    }
  }

  return groups.map(g => {
    let label = '';
    if (g.days.length === 1) {
      label = days[g.days[0]];
    } else {
      let isConsecutive = true;
      for (let i = 1; i < g.days.length; i++) {
        let prev = g.days[i-1] === 0 ? 7 : g.days[i-1];
        let curr = g.days[i] === 0 ? 7 : g.days[i];
        if (curr - prev !== 1) isConsecutive = false;
      }
      if (isConsecutive) {
        label = `${days[g.days[0]]} - ${days[g.days[g.days.length-1]]}`;
      } else {
        label = g.days.map(d => days[d]).join(', ');
      }
    }
    return { label, start: g.start, end: g.end };
  });
};
