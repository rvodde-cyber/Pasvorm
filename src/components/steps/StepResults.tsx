import { Link } from 'react-router-dom'
import { bundles } from '../../data/bundles'
import { coreOptions } from '../../data/core'
import { cvfItems } from '../../data/cvf'
import { futureOptions } from '../../data/future'
import type { ScanState } from '../../hooks/useScanState'
import {
  bundleStrength,
  cultureSharePercent,
  phaseById,
  recommendationBundleLabel,
} from '../../utils/recommendation'
import { cvfShares, dominantCulture } from '../../utils/culture'
import { ClearAnswersButton, StepLabel } from './StepNav'

function futureLabel(scan: ScanState): string {
  const f = futureOptions.find((o) => o.id === scan.futureId)
  if (!f) return '—'
  if (f.id === 'anders' && scan.futureNote) return `${f.title} — ${scan.futureNote}`
  return f.title
}

function coreLabel(scan: ScanState): string {
  return coreOptions.find((o) => o.id === scan.coreId)?.title ?? '—'
}

export function StepResults({ scan }: { scan: ScanState }) {
  const rec = scan.recommendation
  const phase = scan.phaseId != null ? phaseById(scan.phaseId) : null
  const dom = dominantCulture(scan.cvfScores)
  const shares = cvfShares(scan.cvfScores)
  const today = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  if (!rec || !phase) {
    return (
      <p className="text-muted">
        Onvolledige scan.{' '}
        <button type="button" className="text-primary underline" onClick={() => scan.goToStep('intro')}>
          Opnieuw starten
        </button>
      </p>
    )
  }

  return (
    <div className="scan-card space-y-6 pb-4">
      <StepLabel>Resultaat</StepLabel>
      <h2 className="font-heading text-2xl font-extrabold text-ink">
        {(scan.org || 'Deze organisatie') + ' — profiel en advies'}
      </h2>
      <p className="text-muted">
        Onderstaand profiel combineert groeifase, organisatiecultuur en HR-instrumentarium tot een
        indicatief advies, inclusief de eerstvolgende concrete stap.
      </p>
      <p className="text-xs text-muted">
        Ingevuld op {today}
        {scan.size ? ` · ${scan.size} medewerkers` : ''} · concept · Pasvorm demoversie 0.2
      </p>
      <p className="rounded-lg border border-line bg-bg2 px-3 py-2 text-xs text-muted">
        Indicatief advies op basis van een demoversie — geen extern HR- of arbeidsrechtelijk advies.
        Bespreek de uitkomst met leidinggevenden en medewerkers zelf.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { k: 'Groeifase (Greiner)', v: `${phase.id} — ${phase.title}` },
          {
            k: 'Dominante cultuur (CVF)',
            v: dom ? `${dom.label} · ${cultureSharePercent(scan.cvfScores, dom.id)}%` : '—',
          },
          { k: 'Toekomstvisie leiding', v: futureLabel(scan) },
          { k: 'Omvangrijkste personeelsgroep', v: coreLabel(scan) },
        ].map((tile) => (
          <div key={tile.k} className="rounded-lg border border-line bg-bg2 px-3 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">{tile.k}</p>
            <p className="mt-1 text-sm font-semibold text-ink">{tile.v}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-heading text-sm font-bold text-ink">Cultuurprofiel</h3>
        <ul className="mt-3 space-y-2">
          {cvfItems.map((item) => {
            const pct = Math.round(shares[item.id] * 100)
            return (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-muted">{item.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="w-10 text-right text-xs tabular-nums text-muted">{pct}%</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <h3 className="font-heading text-sm font-bold text-ink">Bundle-sterkte</h3>
        <ul className="mt-3 space-y-2">
          {bundles.map((b) => {
            const pct = bundleStrength(b.id, scan.present)
            return (
              <li key={b.id} className="flex items-center gap-3 text-sm">
                <span className="w-32 shrink-0 text-muted">{b.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: b.color }}
                  />
                </div>
                <span className="w-10 text-right text-xs tabular-nums text-muted">{pct}%</span>
              </li>
            )
          })}
        </ul>
      </div>

      {rec.type === 'compleet' && (
        <article className="rounded-xl border border-line bg-surface p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">Advies</p>
          <h3 className="mt-2 font-heading text-lg font-bold text-ink">
            Alle essentiële instrumenten zijn aanwezig
          </h3>
          <p className="mt-2 text-sm text-muted">
            De aanwezige HR-instrumenten dekken alle bundels. De vervolgstap is verdieping: van informeel
            naar structureel, en het bewust afstemmen van bundels op de groeifase (Boselie et al., 2005).
          </p>
        </article>
      )}

      {rec.type === 'legal' && rec.instrument && (
        <article className="rounded-xl border-l-4 border-primary bg-surface p-5 pl-4">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Wettelijke basis — begin hier</p>
          <h3 className="mt-2 font-heading text-xl font-bold text-ink">{rec.instrument.label}</h3>
          <p className="mt-2 text-sm text-muted">
            Dit instrument is wettelijk verplicht maar ontbreekt. De eerste prioriteit is altijd de
            juridische basisbundel: zonder deze basis versterkt geen enkel HR-instrument zijn potentieel.
          </p>
          <p className="mt-2 text-sm text-ink">Wat het doet: {rec.instrument.description}</p>
        </article>
      )}

      {rec.type === 'advies' && rec.instrument && (
        <>
          <article className="rounded-xl border-l-4 border-accent bg-surface p-5 pl-4">
            <p className="text-xs font-bold uppercase tracking-wide text-accent">Begin hier</p>
            <h3 className="mt-2 font-heading text-xl font-bold text-ink">{rec.instrument.label}</h3>
            <p className="mt-2 text-sm text-muted">
              Dit is het ankerinstrument in de {recommendationBundleLabel(rec)}, de bundel die het meest
              aansluit bij uw groeifase ({phase.title}). Het heeft de meeste verbindingen met wat al
              aanwezig is, waardoor de hefboomwerking het grootst is.
            </p>
            <p className="mt-2 text-sm text-ink">Wat het doet: {rec.instrument.description}</p>
            {rec.vorm && (
              <p className="mt-3 text-sm text-ink">
                Vorm het aan uw cultuur: richt dit instrument in{' '}
                <strong className="text-accent">{rec.vorm}</strong>.
              </p>
            )}
          </article>

          {rec.vervolg.length > 0 && (
            <section>
              <h3 className="font-heading text-sm font-bold text-ink">Dit versterkt het daarna</h3>
              <ul className="mt-3 space-y-2">
                {rec.vervolg.map((v) => (
                  <li key={v.id} className="rounded-lg border border-line bg-bg2 px-4 py-3 text-sm">
                    <strong className="text-ink">{v.label}</strong>
                    <span className="text-muted"> — {v.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <div className="rounded-xl border border-ethiek/35 border-l-4 border-l-ethiek bg-ethiek/10 p-4">
        <p className="font-heading text-sm font-bold text-ethiek">Ethische overweging</p>
        <p className="mt-2 text-sm text-ink/90">
          Passend HR-beleid is niet alleen een doelmatigheidsvraag maar ook een kwestie van zorgvuldig
          werkgeverschap. Vanuit het Model Moreel Vakmanschap (Zien–Voelen–Wegen–Handelen–Volhouden)
          verdient het aanbeveling dit advies te wegen samen met leidinggevenden én medewerkers zelf.
        </p>
      </div>

      <p className="text-[11px] leading-relaxed text-muted">
        Gebaseerd op: Boselie et al. (2005), MacDuffie (1995), Appelbaum et al. (2000), Greiner (1972),
        Cameron & Quinn (2011).
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={() => scan.goToStep('instruments')}
          className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-surface"
        >
          Terug naar vragen
        </button>
        <ClearAnswersButton onClear={scan.reset} />
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted hover:bg-surface"
          >
            Afdrukken / PDF
          </button>
          <button
            type="button"
            onClick={scan.reset}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink"
          >
            Nieuwe scan starten
          </button>
          <Link
            to="/"
            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-primary hover:bg-surface"
          >
            Terug naar start
          </Link>
        </div>
      </div>
    </div>
  )
}
