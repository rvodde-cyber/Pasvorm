import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { content } from '../content'
import { useScanSession } from '../hooks/useScanSession'
import { focusFirstInvalid, isStepValid } from '../scan/validation'
import { ProgressTape } from './ProgressTape'
import { ClearAnswersButton, ScanStepNav } from './scan/ScanNav'
import { StepCultuur } from './scan/steps/StepCultuur'
import { StepGroeifase } from './scan/steps/StepGroeifase'
import { StepInstrumenten } from './scan/steps/StepInstrumenten'
import { StepMoreel } from './scan/steps/StepMoreel'
import { StepOrganisatie } from './scan/steps/StepOrganisatie'
import { StepPersoneel } from './scan/steps/StepPersoneel'
import { StepResultaat } from './scan/steps/StepResultaat'
import { StepToekomst } from './scan/steps/StepToekomst'

export function Scan() {
  const scan = useScanSession()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [invalidAttemptStep, setInvalidAttemptStep] = useState<number | null>(null)
  const step = scan.session.step
  const showError = invalidAttemptStep === step && !isStepValid(step, scan.session)
  const isResult = step >= 7
  const stepCfg = isResult ? null : content.ui.steps[step]
  const tapeStep = Math.min(step, 6)

  useEffect(() => {
    titleRef.current?.focus()
  }, [step])

  const advance = () => {
    if (step === 6) scan.goStep(7)
    else scan.goNext()
  }

  const handleNext = () => {
    if (!isStepValid(step, scan.session)) {
      setInvalidAttemptStep(step)
      focusFirstInvalid(step, scan.session)
      return
    }
    setInvalidAttemptStep(null)
    advance()
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-4 md:px-5">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:bg-surface hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            ←
          </Link>
          <p className="text-xs text-muted">{content.ui.nav.savedHint}</p>
        </header>

        {!isResult && <ProgressTape currentStep={tapeStep} />}

        <main className="scan-card">
          <h2
            ref={titleRef}
            tabIndex={-1}
            className="mb-2 font-heading text-2xl font-extrabold text-ink outline-none"
          >
            {isResult ? content.ui.resultPlaceholder.title : stepCfg?.title}
          </h2>
          {!isResult && stepCfg?.intro && (
            <p className="mb-5 text-muted leading-relaxed">{stepCfg.intro}</p>
          )}

          {step === 0 && <StepOrganisatie scan={scan} />}
          {step === 1 && <StepGroeifase scan={scan} />}
          {step === 2 && <StepCultuur scan={scan} />}
          {step === 3 && <StepToekomst scan={scan} />}
          {step === 4 && <StepPersoneel scan={scan} />}
          {step === 5 && <StepInstrumenten scan={scan} />}
          {step === 6 && <StepMoreel scan={scan} />}
          {isResult && scan.result && <StepResultaat result={scan.result} />}

          {!isResult && (
            <ScanStepNav
              step={step}
              session={scan.session}
              showError={showError}
              onBack={scan.goBack}
              onNext={handleNext}
              nextLabel={step === 6 ? content.ui.nav.toResult : undefined}
            />
          )}

          <div className="mt-6 border-t border-line pt-4">
            <ClearAnswersButton onClear={scan.reset} />
          </div>
        </main>
      </div>
    </div>
  )
}
