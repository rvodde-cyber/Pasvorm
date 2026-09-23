export interface GreinerPhase {
  id: number
  title: string
  subtitle: string
  description: string
  signal: string
}

export const phases: GreinerPhase[] = [
  {
    id: 1,
    title: 'Creativiteit',
    subtitle: 'Greiner fase 1',
    description:
      'Het bedrijf groeit door ondernemerschap en informele samenwerking. Rollen overlappen; processen zijn nog weinig gestandaardiseerd.',
    signal: 'Sterke founders, weinig structuur, veel improvisatie.',
  },
  {
    id: 2,
    title: 'Richting',
    subtitle: 'Greiner fase 2',
    description:
      'Groei vraag om leiderschap, planning en duidelijke verantwoordelijkheden. Beleid en procedures worden belangrijker.',
    signal: 'Behoefte aan sturing, functies en heldere besluitvorming.',
  },
  {
    id: 3,
    title: 'Delegatie',
    subtitle: 'Greiner fase 3',
    description:
      'Managers krijgen mandaat; middenkader groeit. Controle verschuift van directie naar afdelingen en teams.',
    signal: 'Decentralisatie, behoefte aan managementontwikkeling.',
  },
  {
    id: 4,
    title: 'Coördinatie',
    subtitle: 'Greiner fase 4',
    description:
      'Complexiteit vraagt om coördinatie tussen afdelingen, gedeelde systemen en formele planningscycli.',
    signal: 'Silovorming, behoefte aan integratie en overlegstructuren.',
  },
  {
    id: 5,
    title: 'Samenwerking',
    subtitle: 'Greiner fase 5',
    description:
      'Organisatie investeert in teamgericht werken, gedeelde cultuur en flexibiliteit. HR ondersteunt vernieuwing en leren.',
    signal: 'Focus op samenwerking, innovatie en continue verbetering.',
  },
]
