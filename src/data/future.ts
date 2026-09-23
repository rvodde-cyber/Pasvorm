export type FutureId = 'groei' | 'gelijk' | 'afbouw' | 'anders'

export interface FutureOption {
  id: FutureId
  title: string
  description: string
  hasNote?: boolean
}

export const futureOptions: FutureOption[] = [
  { id: "groei", title: "Groei", description: "Uitbreiding van activiteiten, omzet en/of personeelsbestand." },
  { id: "gelijk", title: "Gelijk blijven", description: "Consolidatie van de huidige omvang en werkwijze." },
  { id: "afbouw", title: "Afbouw", description: "Krimp van activiteiten en/of personeelsbestand." },
  { id: "anders", title: "Iets anders", description: "Een fundamenteel andere richting.", hasNote: true },
]
