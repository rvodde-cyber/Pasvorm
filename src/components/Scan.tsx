import { Link } from 'react-router-dom'
import { TOTAL_STEPS, useScanState } from '../hooks/useScanState'
import { StepCore } from './steps/StepCore'
import { StepCvf } from './steps/StepCvf'
import { StepFuture } from './steps/StepFuture'
import { StepInstruments } from './steps/StepInstruments'
import { StepIntro } from './steps/StepIntro'
import { StepPhase } from './steps/StepPhase'
import { StepResults } from './steps/StepResults'

const FOOT_NOTE =
  'Pasvorm — demoversie 0.2 (september 2026). Gebaseerd op Greiner (1972), Cameron & Quinn (2011), Lepak & Snell (1999), Boselie et al. (2005) en Appelbaum et al. (2000).'

export function Scan() {
  const scan = useScanState()
  const progress = Math.round((scan.stepIndex / TOTAL_STEPS) * 100)
  const orgBadge = scan.org.trim() || 'demo'

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-4 md:px-5">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="size-6 shrink-0 rounded-md bg-gradient-to-br from-accent to-primary"
              aria-hidden
            />
            <div>
              <p className="font-heading text-sm font-extrabold leading-none text-ink">Pasvorm</p>
              <p className="text-[10px] text-muted">HR-professionaliseringsscan · demoversie</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:bg-surface hover:text-ink"
            >
              ← Terug naar overzicht
            </Link>
            <span className="rounded-full border border-line bg-bg2 px-2.5 py-1 text-[11px] font-semibold text-muted">
              {orgBadge}
            </span>
          </div>
        </header>

        <div className="mb-4 h-1 overflow-hidden rounded-full bg-bg2">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <main>
          {scan.step === 'intro' && <StepIntro scan={scan} />}
          {scan.step === 'phase' && <StepPhase scan={scan} />}
          {scan.step === 'cvf' && <StepCvf scan={scan} />}
          {scan.step === 'future' && <StepFuture scan={scan} />}
          {scan.step === 'core' && <StepCore scan={scan} />}
          {scan.step === 'instruments' && <StepInstruments scan={scan} />}
          {scan.step === 'results' && <StepResults scan={scan} />}
        </main>

        <footer className="mt-8 border-t border-line pt-3 text-center text-[10px] leading-relaxed text-muted">
          {FOOT_NOTE}
        </footer>
      </div>
    </div>
  )
}
