import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bundles } from '../data/bundles'
import { cvfCultures } from '../data/cvf'
import { phases } from '../data/phases'
import { Modal } from './Modal'

const LITERATURE =
  'Greiner (1972); Cameron & Quinn (Competing Values Framework); Boselie et al. (2005); Lepak & Snell (1999); Appelbaum et al. (2000, AMO).'

export function Landing() {
  const [modal, setModal] = useState<'phase' | 'culture' | 'bundles' | 'how' | null>(null)

  return (
    <div className="flex min-h-dvh flex-col bg-bg md:h-dvh md:max-h-dvh md:overflow-hidden">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-6 md:min-h-0 md:py-8 lg:px-8">
        <header className="mb-6 shrink-0 md:mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Pasvorm</p>
          <h1 className="font-heading text-3xl font-extrabold leading-tight text-ink md:text-4xl lg:text-[2.5rem]">
            HR-professionaliseringsscan voor het MKB
          </h1>
        </header>

        <div className="grid flex-1 gap-8 md:min-h-0 md:grid-cols-2 md:items-center md:gap-10 lg:gap-14">
          <section className="flex flex-col justify-center md:min-h-0 md:overflow-y-auto md:pr-2">
            <p className="mb-5 max-w-xl text-base leading-relaxed text-muted md:mb-4 md:text-[1.05rem]">
              Pasvorm helpt ondernemers en HR-professionals om te zien waar de organisatie staat in
              groei, cultuur en HR-instrumenten — en welke stap logisch is als{' '}
              <span className="text-ink">startpunt voor het gesprek</span>, niet als eenzijdig
              oordeel.
            </p>

            <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3 md:mb-5">
              {(
                [
                  { key: 'phase' as const, label: 'Groeifase', sub: 'Greiner' },
                  { key: 'culture' as const, label: 'Cultuur', sub: 'CVF' },
                  { key: 'bundles' as const, label: 'Bundels', sub: 'AMO / HR' },
                ] as const
              ).map((tile) => (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => setModal(tile.key)}
                  className="rounded-lg border border-line bg-bg2 px-3 py-3 text-left transition hover:border-primary/40 hover:bg-surface"
                >
                  <span className="block font-heading text-sm font-bold text-ink">{tile.label}</span>
                  <span className="text-xs text-muted">{tile.sub}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/scan"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 font-semibold text-accent-ink shadow-lg shadow-accent/20 transition hover:brightness-110"
              >
                Start de scan →
              </Link>
              <button
                type="button"
                onClick={() => setModal('how')}
                className="inline-flex items-center justify-center rounded-lg border border-line px-5 py-3 font-semibold text-primary transition hover:bg-surface"
              >
                Hoe werkt het?
              </button>
            </div>
          </section>

          <aside className="relative hidden min-h-0 md:block">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-line lg:min-h-0 lg:max-h-[min(520px,70dvh)]">
              <img
                src="/pasvorm-foto.jpg"
                alt="Team in overleg — illustratie MKB-organisatie"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
              <p className="pointer-events-none absolute bottom-4 left-4 right-4 text-sm text-ink/90">
                Wetenschappelijk onderbouwd, praktisch toepasbaar in het MKB.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="shrink-0 border-t border-line bg-bg2 px-5 py-3 text-center text-[11px] leading-snug text-muted md:py-2">
        {LITERATURE}
      </footer>

      <Modal open={modal === 'phase'} onClose={() => setModal(null)} title="Groeifases (Greiner)" wide>
        <ul className="space-y-4">
          {phases.map((p) => (
            <li key={p.id} className="border-b border-line pb-3 last:border-0">
              <p className="font-heading font-bold text-ink">
                Fase {p.id}: {p.title}
              </p>
              <p className="mt-1 text-ink/90">{p.description}</p>
              <p className="mt-1 text-xs italic">{p.signal}</p>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={modal === 'culture'} onClose={() => setModal(null)} title="Cultuur (CVF)" wide>
        <ul className="space-y-4">
          {cvfCultures.map((c) => (
            <li key={c.id} className="border-b border-line pb-3 last:border-0">
              <p className="font-heading font-bold" style={{ color: c.color }}>
                {c.label}
              </p>
              <p className="mt-1 text-ink/90">{c.description}</p>
              <p className="mt-2 text-xs text-muted">{c.traits.join(' · ')}</p>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={modal === 'bundles'} onClose={() => setModal(null)} title="HR-bundels" wide>
        <ul className="space-y-4">
          {bundles.map((b) => (
            <li key={b.id} className="border-b border-line pb-3 last:border-0">
              <p className="font-heading font-bold" style={{ color: b.color }}>
                {b.label}
              </p>
              <p className="mt-1 text-ink/90">{b.description}</p>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={modal === 'how'} onClose={() => setModal(null)} title="Hoe werkt Pasvorm?" wide>
        <div className="space-y-3 text-ink/90">
          <p>
            In circa 10 minuten doorloopt u zeven stappen: groeifase, cultuur, toekomstfocus, kernkeuze
            en welke HR-instrumenten al aanwezig zijn.
          </p>
          <p>
            Op basis daarvan krijgt u een{' '}
            <strong className="font-semibold text-ink">indicatief advies</strong> — één
            aanbevolen vervolgstap plus suggesties, afgestemd op fase, cultuur en AMO-logica.
          </p>
          <p className="rounded-lg border border-ethiek/30 bg-ethiek/10 p-3 text-sm">
            Pasvorm is een startpunt voor dialoog in uw organisatie. Het vervangt geen extern HR- of
            arbeidsrechtelijk advies.
          </p>
        </div>
      </Modal>
    </div>
  )
}
