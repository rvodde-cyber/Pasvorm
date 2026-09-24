import { content } from '../../content'
import type { InstrumentId, StageValue } from '../../engine/types'

const stageDefs = content.stages.stages
const cfg = content.ui.steps[5]

const stageSegmentClass: Record<StageValue, string> = {
  0: 'border-line bg-bg2 text-ink',
  1: 'border-accent/50 bg-accent/20 text-ink',
  2: 'border-accent/80 bg-accent/35 text-ink',
  3: 'border-accent bg-accent/55 text-accent-ink',
}

export function InstrumentStageRow({
  instrumentId,
  stage,
  onStage,
}: {
  instrumentId: InstrumentId
  stage: StageValue
  onStage: (v: StageValue) => void
}) {
  const inst = content.instruments.instruments.find((i) => i.id === instrumentId)!
  const legalBadge =
    inst.legal && inst.minSize === 0
      ? cfg.legalBadge
      : inst.legal && inst.minSize > 0
        ? cfg.legalFromBadge!.replace('{n}', String(inst.minSize))
        : null

  return (
    <div className="border-b border-line py-2 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-1">
        <p className="text-sm font-semibold text-ink">{inst.label}</p>
        {legalBadge && (
          <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{legalBadge}</span>
        )}
      </div>
      <div
        className="mt-1.5 flex gap-0.5 rounded-lg border border-line p-0.5"
        role="radiogroup"
        aria-label={inst.label}
      >
        {stageDefs.map((s) => {
          const selected = stage === s.value
          return (
            <label
              key={s.value}
              className={`flex-1 cursor-pointer rounded px-0.5 py-1 text-center text-[10px] leading-tight font-semibold sm:text-[11px] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-accent ${
                selected ? stageSegmentClass[s.value as StageValue] : 'text-muted'
              }`}
            >
              <input
                type="radio"
                name={`stage-${instrumentId}`}
                className="sr-only"
                checked={selected}
                onChange={() => onStage(s.value as StageValue)}
              />
              {s.label}
            </label>
          )
        })}
      </div>
    </div>
  )
}
