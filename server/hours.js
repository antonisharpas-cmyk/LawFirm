// Office opening hours, used to decide whether live chat shows the team as online or away.
// Times are checked in the office's own time zone (Cyprus), whatever the server's time zone is.

export const OFFICE_TIME_ZONE = 'Europe/Nicosia';

function officeNow(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: OFFICE_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      hourCycle: 'h23'
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  const weekday = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[parts.weekday];
  return {
    weekday,
    ymd: `${parts.year}-${parts.month}-${parts.day}`,
    md: `${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute)
  };
}

const toMinutes = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || '').trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

// Closed dates: one per line, either YYYY-MM-DD (a single date) or MM-DD (every year).
export function closedDates(settings) {
  return String(settings.office_closed_dates || '')
    .split(/[\n,]+/)
    .map((l) => l.replace(/#.*/, '').trim())
    .filter(Boolean)
    .map((l) => l.split(/\s+/)[0]);
}

export function isOfficeOpen(settings, date = new Date()) {
  const now = officeNow(date);
  const days = String(settings.office_days || '')
    .split(',')
    .map((d) => Number(d.trim()))
    .filter(Boolean);
  if (!days.includes(now.weekday)) return false;
  const closed = closedDates(settings);
  if (closed.includes(now.ymd) || closed.includes(now.md)) return false;
  const open = toMinutes(settings.office_open);
  const close = toMinutes(settings.office_close);
  if (open === null || close === null) return false;
  return now.minutes >= open && now.minutes < close;
}
