export const formatDate = (value?: string) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value));
};

export const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);
export const formatPercent = (value: number) => `${Math.round(value)}%`;
export const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
export const labelize = (value: string) => value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
export const uid = (prefix = 'id') => `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
export const isoNow = () => new Date().toISOString();
