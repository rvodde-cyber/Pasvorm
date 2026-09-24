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

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {content.phases.phases.map((p) => {
          const isFirst = scan.session.phaseFirst === p.id
          const isSecond = scan.session.phaseSecond === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPhase(p.id)}
              className={`relative rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                isFirst || isSecond ? 'border-accent bg-accent/10' : 'border-line bg-bg2 hover:border-accent/50'
              }`}
            >
              {(isFirst || isSecond) && (
                <span className="absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-ink">
                  {isFirst ? cfg.firstBadge : cfg.secondBadge}
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
                {content.phases.crisisAnswers.map((ans) => (
                  <label
                    key={ans.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
                  >
                    <input
                      type="radio"
                      name={name}
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
