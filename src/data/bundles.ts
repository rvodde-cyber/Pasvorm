export type BundleId = 'basis' | 'ability' | 'motivation' | 'opportunity' | 'ethiek'

export interface Bundle {
  id: BundleId
  label: string
  color: string
  description: string
}

export const bundles: Bundle[] = [
  { id: "basis", label: "Basisbundel", color: "#7FA6D1", description: "Wettelijke randvoorwaarden \u2014 zonder deze basis versterkt niets elkaar." },
  { id: "ability", label: "Ability-bundel", color: "#D08064", description: "Kunnen: wie je aantrekt en hoe je mensen inwerkt en ontwikkelt." },
  { id: "motivation", label: "Motivation-bundel", color: "#D9A85C", description: "Willen: gesprekscyclus, beloning, loopbaan en erkenning." },
  { id: "opportunity", label: "Opportunity-bundel", color: "#8FB897", description: "Bijdragen: overleg, autonomie, communicatie en teamontwikkeling." },
  { id: "ethiek", label: "Ethiek-bundel", color: "#9B84C4", description: "Moreel vakmanschap: gedragscode, dilemmatraining en meldcultuur." },
]

export const bundleById = Object.fromEntries(bundles.map((b) => [b.id, b])) as Record<BundleId, Bundle>
