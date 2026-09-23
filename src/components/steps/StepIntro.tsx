import type { ScanState } from '../../hooks/useScanState'
import { StepLabel } from './StepNav'

export function StepIntro({ scan }: { scan: ScanState }) {
  return (
    <div className="scan-card space-y-5">
      <StepLabel>Stap 0 van 6 · Introductie</StepLabel>
      <h2 className="font-heading text-2xl font-extrabold text-ink">Welkom bij de Pasvorm-scan</h2>
      <p className="text-muted leading-relaxed">
        Deze scan brengt in kaart welke HR-instrumenten passen bij uw organisatie, gegeven de groeifase,
        de cultuur en twee aanvullende contextvragen. Invullen duurt circa tien minuten.
      </p>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Naam organisatie</span>
        <input
          type="text"
          value={scan.org}
          onChange={(e) => scan.setOrg(e.target.value)}
          placeholder="Bijv. Schoonmaakbedrijf BV"
          className="w-full rounded-lg border border-line bg-bg2 px-3 py-2.5 text-ink outline-none ring-primary focus:ring-1"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          Aantal medewerkers (indicatief)
        </span>
        <input
          type="number"
          min={1}
          value={scan.size}
          onChange={(e) => scan.setSize(e.target.value)}
          placeholder="Bijv. 200"
          className="w-full rounded-lg border border-line bg-bg2 px-3 py-2.5 text-ink outline-none ring-primary focus:ring-1"
        />
      </label>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={scan.goNext}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-ink hover:brightness-110"
        >
          Start scan
        </button>
      </div>

      <div className="border-t border-line pt-4">
        <button
          type="button"
          onClick={scan.fillExample}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Vul voorbeeld in (schoonmaakbedrijf, 200 mw) → direct naar resultaat
        </button>
      </div>
    </div>
  )
}
