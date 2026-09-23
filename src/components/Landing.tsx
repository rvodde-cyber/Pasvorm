import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bundles } from '../data/bundles'
import { phases } from '../data/phases'
import { Modal } from './Modal'

const FOOT_LEFT =
  'Pasvorm · demoversie 0.2 · Greiner (1972) · Cameron & Quinn (2011) · Boselie et al. (2005) · Appelbaum et al. (2000)'

export function Landing() {
  const [modal, setModal] = useState<'fase' | 'cultuur' | 'bundels' | 'over' | null>(null)

  return (
    <div className="flex min-h-dvh flex-col bg-bg md:h-dvh md:max-h-dvh md:overflow-hidden">
      <header className="flex shrink-0 items-center justify-between px-5 pt-4 md:px-8 md:pt-[18px]">
        <div className="flex items-center gap-2.5">
          <div
            className="size-7 shrink-0 rounded-md bg-gradient-to-br from-accent to-primary"
            aria-hidden
          />
          <span className="font-heading text-[1.05rem] font-extrabold tracking-tight text-ink">
            Pasvorm
          </span>
        </div>
        <span className="text-xs text-muted">HR-professionaliseringsscan</span>
      </header>

      <main className="grid min-h-0 flex-1 md:grid-cols-2">
        <section className="flex flex-col justify-center px-5 py-6 md:overflow-y-auto md:px-8 md:py-7 lg:pl-8">
          <span className="mb-3.5 inline-flex w-fit items-center rounded-full border border-accent/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
            Voor directie & HR-verantwoordelijken
          </span>
          <h1 className="font-heading text-[clamp(1.7rem,2.6vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-ink">
            De juiste <em className="not-italic text-accent">pasvorm</em> tussen uw organisatie en uw
            HR-beleid
          </h1>
          <p className="mt-3 max-w-[42ch] text-[0.97rem] leading-relaxed text-muted">
            Meet in circa tien minuten of uw HR-instrumenten passen bij uw groeifase, cultuur en mensen —
            en welke stap de grootste hefboom biedt.
          </p>

          <div className="mt-5 flex gap-2">
            {(
              [
                { key: 'fase' as const, num: '01', label: 'Groeifase', sub: 'Greiner (1972)' },
                { key: 'cultuur' as const, num: '02', label: 'Cultuur', sub: 'Cameron & Quinn' },
                { key: 'bundels' as const, num: '03', label: 'Bundels', sub: 'AMO-model' },
              ] as const
            ).map((tile) => (
              <button
                key={tile.key}
                type="button"
                onClick={() => setModal(tile.key)}
                className="flex-1 rounded-[10px] border border-line bg-surface px-2.5 py-2 text-left transition hover:border-accent hover:bg-accent/[0.06]"
              >
                <span className="block text-[10px] font-bold uppercase tracking-wide text-accent">
                  {tile.num}
                </span>
                <span className="block text-[0.82rem] font-bold text-ink">{tile.label}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted">{tile.sub}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-[22px] py-3 text-base font-bold text-accent-ink transition hover:brightness-110"
            >
              Start de scan →
            </Link>
            <button
              type="button"
              onClick={() => setModal('over')}
              className="rounded-[10px] border border-line px-4 py-2.5 text-[0.87rem] font-semibold text-muted transition hover:border-accent hover:text-ink"
            >
              Hoe werkt het?
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-muted">
            {['Wetenschappelijk gefundeerd', '±10 minuten', 'Direct advies op maat'].map((t) => (
              <span key={t}>
                <span className="text-accent">✓ </span>
                {t}
              </span>
            ))}
          </div>
        </section>

        <aside className="relative hidden min-h-0 md:block">
          <img
            src="/pasvorm-foto.jpg"
            alt=""
            className="h-full w-full object-cover opacity-85"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg/50"
            aria-hidden
          />
          <p className="pointer-events-none absolute bottom-3.5 right-4 text-[11px] text-white/50">
            Illustratie MKB-organisatie
          </p>
        </aside>
      </main>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-2 text-[11px] text-muted md:px-8">
        <span>{FOOT_LEFT}</span>
      </footer>

      <Modal open={modal === 'fase'} onClose={() => setModal(null)} title="Waar staat uw organisatie?" eyebrow="01 — Groeifase">
        <div className="space-y-3 text-muted">
          <p>
            Greiner (1972) onderscheidt vijf groeifasen, elk met een eigen manier van sturen: van
            persoonlijke sturing door de directeur tot samenwerking in professionele teams.
          </p>
          <p>
            HR-instrumenten die passen bij de ene fase kunnen in een andere fase averechts werken.
            Pasvorm bepaalt in welke fase uw organisatie zich bevindt en welke bundel daar het beste
            bij past.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {phases.map((p) => (
              <li key={p.id}>
                Fase {p.id} — {p.title}
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      <Modal
        open={modal === 'cultuur'}
        onClose={() => setModal(null)}
        title="Hoe werkt uw organisatie van binnen?"
        eyebrow="02 — Cultuur"
      >
        <div className="space-y-3 text-muted">
          <p>
            Het Competing Values Framework (Cameron & Quinn, 2011) onderscheidt vier cultuurtypen:
            Familie, Adhocratie, Markt en Hiërarchie. Elke cultuur vraagt om een andere vorm van
            HR-instrumenten.
          </p>
          <p>
            Een werkoverleg in een familiecultuur werkt als persoonlijk gesprek; in een hiërarchische
            cultuur als vaste procedure met notulen. Pasvorm past het advies aan op de dominante cultuur.
          </p>
        </div>
      </Modal>

      <Modal
        open={modal === 'bundels'}
        onClose={() => setModal(null)}
        title="Instrumenten die elkaar versterken"
        eyebrow="03 — HR-bundels"
      >
        <div className="space-y-3 text-muted">
          <p>
            Gebaseerd op Boselie et al. (2005) en het AMO-model (Appelbaum et al., 2000): HR-instrumenten
            werken het best in samenhang. Pasvorm groepeert ze in vijf bundels.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {bundles.map((b) => (
              <li key={b.id}>
                <strong className="text-ink">{b.label.replace('-bundel', '')}</strong> — {b.description}
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      <Modal open={modal === 'over'} onClose={() => setModal(null)} title="Zes stappen, circa tien minuten" eyebrow="Hoe werkt het?">
        <div className="space-y-3 text-muted">
          <p>
            De scan stelt zes gerichte vragen: groeifase, cultuurprofiel (vier stellingen), toekomstvisie
            van de leiding, omvangrijkste personeelsgroep, en welke HR-instrumenten al aanwezig zijn.
          </p>
          <p>
            Het resultaat combineert deze antwoorden tot een HR-profiel met een{' '}
            <strong className="text-ink">concreet beginpunt</strong> — het ene instrument dat de grootste
            hefboom biedt — plus twee vervolgstappen die het versterken.
          </p>
          <p>
            Pasvorm is ontwikkeld vanuit het Model Moreel Vakmanschap en is bedoeld als startpunt voor
            gesprek, niet als eenzijdig oordeel.
          </p>
          <Link
            to="/scan"
            onClick={() => setModal(null)}
            className="mt-2 inline-flex rounded-[10px] bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink"
          >
            Start de scan →
          </Link>
        </div>
      </Modal>
    </div>
  )
}
