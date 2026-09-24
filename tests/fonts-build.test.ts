import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, files)
    else files.push(p)
  }
  return files
}

describe('build zonder Google Fonts', () => {
  it('bevat geen fonts.googleapis.com of fonts.gstatic.com in dist', () => {
    const dist = join(process.cwd(), 'dist')
    const forbidden = ['fonts.googleapis.com', 'fonts.gstatic.com']
    for (const file of walk(dist)) {
      if (!/\.(js|css|html|map)$/.test(file)) continue
      const text = readFileSync(file, 'utf8')
      for (const needle of forbidden) {
        expect(text).not.toContain(needle)
      }
    }
  })
})
