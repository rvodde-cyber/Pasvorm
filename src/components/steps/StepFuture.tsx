import type { ScanState } from '../../hooks/useScanState'
import { StepNav } from './StepPhase'

const options = [
  {
    id: 'professionaliseren',
    title: 'Professionaliseren',
    text: 'Meer structuur, duidelijke HR-processen en compliance.',
  },
  {
    id: 'groei',
    title: 'Groei versnellen',
    text: 'Instroom, ontwikkeling en prestaties beter sturen.',
  },
  {
    id: 'binding',
    title: 'Binding versterken',
    text: 'Betrokkenheid, cultuur en leiderschap ontwikkelen.',
  },
  {
    id: 'innovatie',
    title: 'Innovatie & flexibiliteit',
    text: 'Experimenteren, leren en samenwerking over silo’s.',
  },
]

export function StepFuture({ scan }: { scan: ScanState }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-ink">Toekomstfocus</h2>
        <p className="mt-2 text-muted">Wat is de belangrijkste HR-beweging de komende 12–24 maanden?</p>
      </div>

      <ul className="space-y-3">
        {options.map((o) => {
          const selected = scan.futureFocus === o.id
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => scan.setFutureFocus(o.id)}
                className={`w-full rounded-xl border px-4 py-4 text-left transition ${
                  selected
                    ? 'border-accent bg-accent/10 ring-1 ring-accent'
                    : 'border-line bg-surface hover:border-accent/40'
                }`}
              >
                <span className="font-heading font-bold text-ink">{o.title}</span>
                <p className="mt-1 text-sm text-muted">{o.text}</p>
              </button>
            </li>
          )
        })}
      </ul>

      <StepNav scan={scan} canNext={scan.futureFocus != null} />
    </div>
  )
}
