import { Link } from 'react-router-dom'
import { useScanState } from '../hooks/useScanState'
import { StepCore } from './steps/StepCore'
import { StepCvf } from './steps/StepCvf'
import { StepFuture } from './steps/StepFuture'
import { StepInstruments } from './steps/StepInstruments'
import { StepIntro } from './steps/StepIntro'
import { StepPhase } from './steps/StepPhase'
import { StepResults } from './steps/StepResults'

const LITERATURE =
  'Greiner (1972); Cameron & Quinn (CVF); Boselie et al. (2005); Lepak & Snell (1999); Appelbaum et al. (2000, AMO).'

export function Scan() {
  const scan = useScanState()

  const progress = ((scan.stepIndex + 1) / scan.totalSteps) * 100

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="border-b border-line bg-bg2">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="font-heading text-sm font-bold text-muted hover:text-ink">
            ← Pasvorm
          </Link>
          <span className="text-xs text-muted">
            Stap {scan.stepIndex + 1} / {scan.totalSteps}
          </span>
        </div>
        <div className="h-1 bg-bg">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8">
        {scan.step === 'intro' && <StepIntro scan={scan} />}
        {scan.step === 'phase' && <StepPhase scan={scan} />}
        {scan.step === 'cvf' && <StepCvf scan={scan} />}
        {scan.step === 'future' && <StepFuture scan={scan} />}
        {scan.step === 'core' && <StepCore scan={scan} />}
        {scan.step === 'instruments' && <StepInstruments scan={scan} />}
        {scan.step === 'results' && <StepResults scan={scan} />}
      </main>

      <footer className="border-t border-line bg-bg2 px-5 py-3 text-center text-[11px] text-muted">
        {LITERATURE}
      </footer>
    </div>
  )
}
