import { content } from '../../../content'
import type { ScanSessionApi } from '../../../hooks/useScanSession'

export function StepOrganisatie({ scan }: { scan: ScanSessionApi }) {
  const cfg = content.ui.steps[0]
  const fields = cfg.fields!

  return (
    <div className="space-y-5">
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{fields.orgName.label}</span>
        <span className="block text-xs text-muted">{fields.orgName.hint}</span>
        <input
          type="text"
          value={scan.session.orgName}
          onChange={(e) => scan.setPartial({ orgName: e.target.value })}
          placeholder={fields.orgName.placeholder}
          className="w-full rounded-lg border border-line bg-bg2 px-3 py-2.5 text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{fields.size.label}</span>
        <span className="block text-xs text-muted">{fields.size.hint}</span>
        <input
          type="number"
          min={1}
          step={1}
          value={scan.session.size}
          onChange={(e) => {
            const v = e.target.value
            scan.setPartial({ size: v === '' ? '' : parseInt(v, 10) })
          }}
          placeholder={fields.size.placeholder}
          className="w-full rounded-lg border border-line bg-bg2 px-3 py-2.5 text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </label>
      <button
        type="button"
        onClick={scan.fillExample}
        className="text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {content.ui.nav.example}
      </button>
    </div>
  )
}
