export type CultureId = 'clan' | 'adhocracy' | 'market' | 'hierarchy'

export interface CvfItem {
  id: CultureId
  label: string
  color: string
  question: string
}

export const cvfItems: CvfItem[] = [
  { id: "clan", label: "Familie", color: "#8FB897", question: "Onze organisatie voelt als een hechte familie; loyaliteit en onderlinge betrokkenheid staan voorop." },
  { id: "adhocracy", label: "Adhocratie", color: "#D9A85C", question: "Onze organisatie is ondernemend en innovatief; mensen nemen graag risico's en proberen nieuwe dingen." },
  { id: "market", label: "Markt", color: "#D08064", question: "Onze organisatie is resultaatgericht; concurrentiepositie en het behalen van doelen staan voorop." },
  { id: "hierarchy", label: "Hi\u00ebrarchie", color: "#7FA6D1", question: "Onze organisatie is gestructureerd en beheerst; formele regels en procedures bepalen wat mensen doen." },
]

export const cultureById = Object.fromEntries(cvfItems.map((c) => [c.id, c])) as Record<CultureId, CvfItem>
