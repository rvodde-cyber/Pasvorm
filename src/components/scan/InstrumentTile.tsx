import { content } from '../../content'
import type { InstrumentId, StageValue } from '../../engine/types'
import { nextStage } from '../../scan/stageCycle'

const stageDefs = content.stages.stages
const cfg = content.ui.steps[5]

export function InstrumentTile({
  instrumentId,
  stage,
  onStage,
}: {
  instrumentId: InstrumentId
  stage: StageValue
  onStage: (v: StageValue) => void
}) {
  const inst = content.instruments.instruments.find((i) => i.id === instrumentId)!
  const label = stageDefs.find((s) => s.value === stage)?.label ?? ''
  const intensity = stage === 0 ? 'opacity-40' : stage === 1 ? 'opacity-60' : stage === 2 ? 'opacity-80' : 'opacity-100'

  const legalBadge =
    inst.legal && inst.minSize === 0
      ? cfg.legalBadge
      : inst.legal && inst.minSize > 0
        ? cfg.legalFromBadge!.replace('{n}', String(inst.minSize))
        : null

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onStage(nextStage(stage))}
        className={`w-full rounded-xl border border-line bg-bg2 p-3 text-left transition hover:border-accent/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${intensity}`}
      >
        <p className="text-sm font-semibold text-ink">{inst.label}</p>
        {legalBadge && (
          <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wide text-primary">
            {legalBadge}
          </span>
        )}
        <p className="mt-2 text-xs text-muted">{label}</p>
      </button>
      <div
        className="flex gap-1"
        role="group"
        aria-label={`${inst.label} niveau`}
      >
        {stageDefs.map((s) => (
          <button
            key={s.value}
            type="button"
            aria-pressed={stage === s.value}
            onClick={() => onStage(s.value as StageValue)}
            className={`flex-1 rounded border px-1 py-1 text-[10px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              stage === s.value ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted'
            }`}
          >
            {s.value}
          </button>
        ))}
      </div>
    </div>
  )
}
