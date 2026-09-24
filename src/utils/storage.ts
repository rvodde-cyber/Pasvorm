export const STORAGE_KEY = 'pasvorm:v1'

export function loadStored(): unknown {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveStored(value: unknown): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Opslag kan geblokkeerd of vol zijn; de scan werkt dan zonder opslaan verder.
  }
}

export function clearStored(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Zie saveStored.
  }
}
