const TZ = 'America/Detroit';

function makeFormatter(options) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...options });
}

const dateTimeFmt = makeFormatter({
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const timeFmt = makeFormatter({
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const longDateFmt = makeFormatter({
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

function toDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function formatSessionDateTimeET(dateStr, startTime) {
  if (!dateStr || !startTime) return '';
  const d = toDate(`${dateStr}T${startTime}:00`);
  if (!d) return '';
  return `${dateTimeFmt.format(d)} ET`;
}

export function formatTimeET(dateStr, startTime) {
  if (!dateStr || !startTime) return '';
  const d = toDate(`${dateStr}T${startTime}:00`);
  if (!d) return '';
  return `${timeFmt.format(d)} ET`;
}

export function formatLongDateET(dateStr) {
  if (!dateStr) return '';
  const d = toDate(`${dateStr}T00:00:00`);
  if (!d) return '';
  return longDateFmt.format(d);
}

export function formatDateTimeET(date) {
  const d = toDate(date);
  if (!d) return '';
  return `${dateTimeFmt.format(d)} ET`;
}
