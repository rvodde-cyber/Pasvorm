export function reportDateLong(date = new Date()): string {
  return new Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' }).format(date)
}

export function reportDateIso(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDecimal(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`)
}
