const dateFmt = new Intl.DateTimeFormat('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });

// Accepts 'YYYY-MM-DD' or a full ISO timestamp (only the date part is used).
export const formatDate = (iso) => (iso ? dateFmt.format(new Date(String(iso).slice(0, 10) + 'T00:00:00')) : '');

export const formatTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

export const money = (n) => `$${Number(n || 0).toFixed(2)}`;

export const kmText = (n) => `${Number(n || 0).toLocaleString('en-SG')} km`;

// Local date as YYYY-MM-DD, offset by a number of days from today.
export const isoFromToday = (days = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

// Wording for the health score. The score itself comes from the backend.
export function healthLabel(score) {
  if (score >= 80) return { word: 'Great', message: 'Your vehicle is in great condition!', tone: 'good' };
  if (score >= 60) return { word: 'Fair', message: 'A few parts need attention soon.', tone: 'warn' };
  return { word: 'Needs attention', message: 'Book a service as soon as you can.', tone: 'bad' };
}
