import { content } from '../../content'
import type { EvaluateResult } from '../../engine/types'

export function collectReportSourceIds(result: EvaluateResult): string[] {
  const ids = new Set<string>()
  for (const p of result.priorities) {
    for (const id of p.sourceIds) ids.add(id)
  }
  for (const rule of content.rules.rules) {
    for (const id of rule.sourceIds) ids.add(id)
  }
  for (const id of content.ui.report.method.sourceIds) ids.add(id)
  return [...ids].sort()
}
