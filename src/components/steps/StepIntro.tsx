import type { ScanState } from '../../hooks/useScanState'

export function StepIntro({ scan }: { scan: ScanState }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-extrabold text-ink">Welkom bij de scan</h2>
        <p className="mt-3 text-muted leading-relaxed">
          Pasvorm brengt groeifase, cultuur en HR-instrumenten samen. Het resultaat is bedoeld als{' '}
          <span className="text-ink">startpunt voor gesprek</span> met MT, OR of HR — geen
          eenzijdig oordeel over uw organisatie.
        </p>
      </div>

      <div className="rounded-xl border border-ethiek/35 bg-ethiek/10 p-4">
        <p className="font-heading text-sm font-bold text-ethiek">Ethische component</p>
        <p className="mt-2 text-sm text-ink/90">
          Uw antwoorden blijven in deze sessie; er wordt niets opgeslagen. Betrek stakeholders voordat
          u maatregelen implementeert.
        </p>
      </div>

      <button
        type="button"
        onClick={scan.goNext}
        className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-ink hover:brightness-110"
      >
        Begin →
      </button>
    </div>
  )
}
