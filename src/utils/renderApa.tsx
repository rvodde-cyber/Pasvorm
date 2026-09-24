import type { ReactNode } from 'react'

/** Zet *cursief* uit sources.json om naar <em>, zonder markdown-bibliotheek. */
export function renderApa(apa: string): ReactNode[] {
  const parts = apa.split(/(\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}
