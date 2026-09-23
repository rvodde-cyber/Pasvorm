import { Link } from 'react-router-dom'
import { bundleById } from '../../data/bundles'
import { cultureById } from '../../data/cvf'
import { phases } from '../../data/phases'
import type { ScanState } from '../../hooks/useScanState'
import { recommendationHeadline } from '../../utils/recommendation'

export function StepResults({ scan }: { scan: ScanState }) {
  const rec = scan.recommendation
  const phase = phases.find((p) => p.id === scan.phaseId)
  const culture = scan.cultureId ? cultureById[scan.cultureId] : null

  if (!rec || !phase || !culture) {
    return (
      <p className="text-muted">
        Onvolledige scan.{' '}
        <button type="button" className="text-primary underline" onClick={() => scan.goToStep('intro')}>
          Opnieuw starten
        </button>
      </p>
    )
  }

  const bundle = bundleById[rec.priorityBundle]

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-ink">Uw indicatieve vervolgstap</h2>
        <p className="mt-2 text-sm text-muted">
          Fase {phase.id} ({phase.title}) · Cultuur: {culture.label}
        </p>
      </div>

      <article className="rounded-xl border border-accent/40 bg-surface p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">
          {recommendationHeadline(rec)}
        </p>
        <h3 className="mt-2 font-heading text-xl font-bold text-ink">{rec.instrument.name}</h3>
        <p className="mt-2 text-muted">{rec.instrument.description}</p>
        <p className="mt-4 rounded-lg bg-bg2 p-3 text-sm text-ink">
          Introduceer of versterk dit instrument{' '}
          <strong className="font-semibold text-accent">{rec.vorm}</strong>.
        </p>
        {rec.conflict && (
          <p className="mt-3 rounded-lg border border-market/40 bg-market/10 p-3 text-sm text-ink">
            <span className="font-semibold">Aandachtspunt:</span> {rec.conflict}
          </p>
        )}
      </article>

      {rec.vervolg.length > 0 && (
        <section>
          <h3 className="font-heading text-lg font-bold text-ink">Logisch vervolg</h3>
          <ul className="mt-3 space-y-2">
            {rec.vervolg.map((v) => (
              <li key={v.id} className="rounded-lg border border-line bg-bg2 px-4 py-3 text-sm">
                <span className="font-semibold text-ink">{v.name}</span>
                <span className="text-muted"> — {v.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-muted">
        Prioriteitsbundel voor uw fase:{' '}
        <span style={{ color: bundle.color }}>{bundle.label}</span>
      </p>

      <div className="rounded-xl border border-ethiek/35 bg-ethiek/10 p-4">
        <p className="font-heading text-sm font-bold text-ethiek">Ethische overweging</p>
        <p className="mt-2 text-sm text-ink/90">
          Betrek medewerkersvertegenwoordiging en leidinggevenden voordat u beleid wijzigt. Pasvorm
          weegt geen individuele situaties mee — gebruik het advies om vragen te stellen, niet om
          besluiten te rechtvaardigen zonder dialoog.
        </p>
        <p className="mt-3 text-xs font-semibold text-muted">
          Indicatief advies — geen extern HR- of arbeidsrechtelijk advies
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={scan.reset}
          className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-surface"
        >
          Scan opnieuw
        </button>
        <Link
          to="/"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-ink hover:brightness-110"
        >
          Terug naar start
        </Link>
      </div>
    </div>
  )
}
