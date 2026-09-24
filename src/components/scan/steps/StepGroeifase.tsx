import { content } from '../../../content'
import type { PhaseId } from '../../../engine/types'
import type { ScanSessionApi } from '../../../hooks/useScanSession'
import { togglePhaseChoice } from '../../../scan/phaseToggle'

export function StepGroeifase({ scan }: { scan: ScanSessionApi }) {
  const cfg = content.ui.steps[1]
  const crisisById = Object.fromEntries(content.phases.crisisSignals.map((c) => [c.id, c]))

  const onPhase = (id: PhaseId) => {
    const next = togglePhaseChoice(id, scan.session.phaseFirst, scan.session.phaseSecond)
    scan.setPartial(next)
  }

  const firstPhaseId = content.phases.phases[0]?.id

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {content.phases.phases.map((p) => {
          const isFirst = scan.session.phaseFirst === p.id
          const isSecond = scan.session.phaseSecond === p.id
          const pressed = isFirst || isSecond
          const badge = isFirst ? cfg.firstBadge : isSecond ? cfg.secondBadge : null
          const ariaLabel = badge ? `${badge}: ${p.vignette}` : p.vignette
          return (
            <button
              key={p.id}
              type="button"
              id={p.id === firstPhaseId ? 'scan-focus-phase' : undefined}
              data-scan-focus={p.id === firstPhaseId ? 'scan-focus-phase' : undefined}
              aria-pressed={pressed}
              aria-label={ariaLabel}
              onClick={() => onPhase(p.id)}
              className={`rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                pressed ? 'border-accent bg-accent/10' : 'border-line bg-bg2 hover:border-accent/50'
              }`}
            >
              {badge && (
                <span className="mb-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-ink">
                  {badge}
                </span>
              )}
              <p className="text-sm leading-relaxed text-ink">{p.vignette}</p>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-muted">{cfg.help}</p>

      <section className="space-y-4 border-t border-line pt-4">
        <h3 className="font-heading text-sm font-bold text-ink">{cfg.crisisTitle}</h3>
        {(cfg.crisisOrder ?? []).map((cid) => {
          const crisis = crisisById[cid]
          if (!crisis) return null
          const name = `crisis-${cid}`
          return (
            <fieldset key={cid} className="space-y-2">
              <legend className="text-sm text-ink">{crisis.statement}</legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={crisis.statement}>
                {content.phases.crisisAnswers.map((ans, ai) => (
                  <label
                    key={ans.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
                  >
                    <input
                      type="radio"
                      name={name}
                      id={ai === 0 ? `scan-focus-crisis-${cid}` : undefined}
                      data-scan-focus={ai === 0 ? `scan-focus-crisis-${cid}` : undefined}
                      checked={scan.session.crisis[crisis.id as keyof typeof scan.session.crisis] === ans.id}
                      onChange={() =>
                        scan.setPartial({
                          crisis: { ...scan.session.crisis, [crisis.id]: ans.id as 'ja' | 'deels' | 'nee' },
                        })
                      }
                      className="accent-accent"
                    />
                    <span className="text-sm text-ink">{ans.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )
        })}
      </section>
    </div>
  )
}
