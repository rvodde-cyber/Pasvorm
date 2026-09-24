import type { ScanSession } from './types'

export const STORAGE_KEY = 'pasvorm:v2'
const LEGACY_KEY = 'pasvorm:v1'

export function clearLegacyStorage(): void {
  try {
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    // ignore
  }
}

export function loadSession(): ScanSession | null {
  clearLegacyStorage()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ScanSession) : null
  } catch {
    return null
  }
}

export function saveSession(session: ScanSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
