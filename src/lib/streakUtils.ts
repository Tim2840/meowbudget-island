// Streak is calculated purely on client-side local date (YYYY-MM-DD).
// No timezone gymnastics needed — the device's date is the source of truth.

export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function updateStreak(
  lastRecordDate: string | null,
  currentStreak: number,
  longestStreak: number,
): { newStreak: number; newLongest: number; streakBroken: boolean } {
  const today = todayString();
  const yesterday = yesterdayString();

  if (lastRecordDate === today) {
    // Already recorded today, no change
    return { newStreak: currentStreak, newLongest: longestStreak, streakBroken: false };
  }

  if (lastRecordDate === yesterday) {
    // Continuing streak
    const newStreak = currentStreak + 1;
    return {
      newStreak,
      newLongest: Math.max(newStreak, longestStreak),
      streakBroken: false,
    };
  }

  // Streak broken (gap > 1 day, or first record)
  return { newStreak: 1, newLongest: Math.max(1, longestStreak), streakBroken: currentStreak > 0 };
}

export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  const d = new Date(date);
  // ISO week: Monday=0...Sunday=6
  const day = (d.getDay() + 6) % 7; // Mon=0, Tue=1, ..., Sun=6
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

export function getMonthRange(year: number, month: number): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

export function formatYearMonth(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
