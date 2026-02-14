import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRate(ratePerMile: number): string {
  return `$${ratePerMile.toFixed(2)}/mi`
}

export function formatDistance(miles: number): string {
  return `${Math.round(miles)} mi`
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'h:mm a')
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d')
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'MMM d, h:mm a')
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

export function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return `${h}h ${m}m`
}

export function formatMargin(
  margin: number | null,
  percent: number | null,
): string {
  if (margin === null || percent === null) return '—'
  return `${formatCurrency(margin)} (${formatPercent(percent)})`
}

export function formatPhone(phone: string): string {
  return phone
}

export function formatMileage(miles: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(miles)) + ' mi'
}
