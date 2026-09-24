import { content } from '../content'
import type { BundleId } from '../engine/types'

export const BUNDLE_ORDER: BundleId[] = content.bundles.bundles.map((b) => b.id)

export const SCAN_STEP_COUNT = 7
