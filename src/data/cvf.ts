export type CultureId = 'clan' | 'adhocracy' | 'market' | 'hierarchy'

export interface CvfCulture {
  id: CultureId
  label: string
  color: string
  description: string
  traits: string[]
}

export const cvfCultures: CvfCulture[] = [
  {
    id: 'clan',
    label: 'Clan',
    color: '#8FB897',
    description: 'Collegialiteit, mentoring en gedeelde waarden staan centraal.',
    traits: ['Teamgevoel', 'Participatie', 'Lange-termijn relaties'],
  },
  {
    id: 'adhocracy',
    label: 'Adhocratie',
    color: '#D9A85C',
    description: 'Innovatie, experimenteren en ondernemerschap domineren.',
    traits: ['Creativiteit', 'Flexibiliteit', 'Risico nemen'],
  },
  {
    id: 'market',
    label: 'Markt',
    color: '#D08064',
    description: 'Resultaten, klantfocus en competitie sturen gedrag.',
    traits: ['Doelstellingen', 'Prestatiedruk', 'Externe orientatie'],
  },
  {
    id: 'hierarchy',
    label: 'Hiërarchie',
    color: '#7FA6D1',
    description: 'Formele structuren, voorspelbaarheid en efficiëntie zijn leidend.',
    traits: ['Procedures', 'Stabiliteit', 'Duidelijke lijnen'],
  },
]

export const cultureById = Object.fromEntries(cvfCultures.map((c) => [c.id, c])) as Record<
  CultureId,
  CvfCulture
>
