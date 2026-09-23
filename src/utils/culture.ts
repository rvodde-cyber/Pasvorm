import { cvfItems, type CultureId, type CvfItem } from '../data/cvf'

export type CvfScores = Record<CultureId, number | null>

export function cvfShares(scores: CvfScores): Record<CultureId, number> {
  const sum = cvfItems.reduce((acc, item) => acc + (scores[item.id] ?? 0), 0)
  const out = {} as Record<CultureId, number>
  cvfItems.forEach((item) => {
    out[item.id] = sum ? (scores[item.id] ?? 0) / sum : 0
  })
  return out
}

export function dominantCulture(scores: CvfScores): CvfItem | null {
  const shares = cvfShares(scores)
  let best: CvfItem | null = null
  let bestV = -1
  cvfItems.forEach((item) => {
    if (shares[item.id] > bestV) {
      bestV = shares[item.id]
      best = item
    }
  })
  return best
}

export function cvfAllAnswered(scores: CvfScores): boolean {
  return cvfItems.every((item) => scores[item.id] != null)
}
