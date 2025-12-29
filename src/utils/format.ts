const numberFormatter = new Intl.NumberFormat('fa-IR')
const dateFormatter = new Intl.DateTimeFormat('fa-IR', {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: 'short',
})
const relativeFormatter = new Intl.RelativeTimeFormat('fa-IR', { numeric: 'auto' })

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

export function formatBattery(value: number) {
  return `${formatNumber(Math.round(value))}٪`
}

export function formatDateTime(value: string) {
  return dateFormatter.format(new Date(value))
}

export function formatRelativeTime(value: string) {
  const now = Date.now()
  const diff = new Date(value).getTime() - now
  const seconds = Math.round(diff / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (Math.abs(seconds) < 60) return relativeFormatter.format(seconds, 'seconds')
  if (Math.abs(minutes) < 60) return relativeFormatter.format(minutes, 'minutes')
  if (Math.abs(hours) < 24) return relativeFormatter.format(hours, 'hours')
  return relativeFormatter.format(days, 'days')
}
