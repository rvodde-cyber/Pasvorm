export type BundleId = 'basis' | 'ability' | 'motivation' | 'opportunity' | 'ethiek'

export interface Bundle {
  id: BundleId
  label: string
  color: string
  description: string
}

export const bundles: Bundle[] = [
  {
    id: 'basis',
    label: 'Basis & compliance',
    color: '#7FA6D1',
    description:
      'Wettelijke verplichtingen en fundamentele HR-processen die elke werkgever moet regelen (AMO: randvoorwaarden).',
  },
  {
    id: 'ability',
    label: 'Ability — Bekwaamheid',
    color: '#8FB897',
    description:
      'Instrumenten die medewerkers in staat stellen goed werk te leveren: selectie, ontwikkeling, functies en prestatie.',
  },
  {
    id: 'motivation',
    label: 'Motivation — Motivatie',
    color: '#D08064',
    description:
      'Instrumenten die commitment en inzet versterken: beloning, erkenning, arbeidsvoorwaarden en betrokkenheid.',
  },
  {
    id: 'opportunity',
    label: 'Opportunity — Kansen',
    color: '#D9A85C',
    description:
      'Instrumenten die ruimte geven voor inspraak, mobiliteit, samenwerking en kennisdeling.',
  },
  {
    id: 'ethiek',
    label: 'Ethiek & vertrouwen',
    color: '#9B84C4',
    description:
      'Instrumenten voor integriteit, veilig gedrag, diversiteit en een cultuur waarin mensen zich gehoord voelen.',
  },
]

export const bundleById = Object.fromEntries(bundles.map((b) => [b.id, b])) as Record<
  BundleId,
  Bundle
>
