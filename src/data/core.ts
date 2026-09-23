export type CoreId = 'uitvoerend' | 'vakmanschap' | 'schaars' | 'gemengd'

export interface CoreOption {
  id: CoreId
  title: string
  description: string
}

export const coreOptions: CoreOption[] = [
  { id: "uitvoerend", title: "Overwegend uitvoerend en praktisch geschoold", description: "Relatief goed vervangbaar op de arbeidsmarkt." },
  { id: "vakmanschap", title: "Overwegend middelbaar geschoold vakmanschap", description: "Redelijk vervangbaar, met opleidingstijd." },
  { id: "schaars", title: "Overwegend hoogopgeleid en schaars", description: "Moeilijk vervangbaar (bijv. specialisten, technici, juristen)." },
  { id: "gemengd", title: "Sterk gemengd", description: "Geen duidelijk dominant type." },
]
