import { vi } from 'vitest'
import { evaluate } from '../src/engine'
import type { ScanSessionApi } from '../src/hooks/useScanSession'
import { sessionToScanInput } from '../src/scan/types'
import type { ScanSession } from '../src/scan/types'
import { isStepValid } from '../src/scan/validation'

export function mockScan(session: ScanSession): ScanSessionApi {
  const setPartial = vi.fn((patch: Partial<ScanSession>) => {
    Object.assign(session, patch)
  })
  return {
    session,
    setPartial,
    goNext: vi.fn(),
    goBack: vi.fn(),
    goStep: vi.fn(),
    reset: vi.fn(),
    fillExample: vi.fn(),
    canProceed: isStepValid(session.step, session),
    result: session.step >= 7 ? evaluate(sessionToScanInput(session)) : null,
  }
}
