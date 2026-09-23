export interface GreinerPhase {
  id: number
  title: string
  description: string
}

export const phases: GreinerPhase[] = [
  { id: 1, title: "Persoonlijke sturing", description: "De organisatie draait op de informele sturing van de oprichter(s)/directie; weinig vaste procedures." },
  { id: 2, title: "Richting geven", description: "Er zijn functieomschrijvingen en een managementlaag; sturing verloopt via duidelijke instructies vanuit het management." },
  { id: 3, title: "Delegeren", description: "Leidinggevenden op lagere niveaus krijgen ruimte om zelfstandig te beslissen; management stuurt op resultaten." },
  { id: 4, title: "Co\u00f6rdineren", description: "Organisatiebrede systemen en procedures; formele planning en control staan centraal." },
  { id: 5, title: "Samenwerken", description: "De organisatie stuurt op teamwork, flexibele structuren en gezamenlijke probleemoplossing over afdelingen heen." },
]
