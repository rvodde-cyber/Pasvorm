# Pasvorm — STATUS

## Stack

- **React** 18.3.x, **Vite** 8.3, **TypeScript** ~6.0
- **Tailwind CSS** 4.3 (`@tailwindcss/vite`)
- **react-router-dom** 7.18
- **oxlint** (dev)

## Mappenstructuur

```
pasvorm/
├── public/              Statische assets (foto, prototype HTML, icons, images/)
├── src/components/      Landing, Scan, Modal
├── src/components/steps/  Scanstappen (intro t/m resultaat)
├── src/data/            Bundels, instrumenten, fasen, CVF, toekomst, core-opties
├── src/hooks/           useScanState (sessiestate)
├── src/utils/           Cultuurprofiel en aanbevelingsalgoritme
└── (root)               vite/tailwind/tsconfig, vercel.json, README.md
```

## Werkende schermen en functies

- Landingspagina `/` — tegels + modals, CTA naar scan, responsive (foto verborgen op mobiel).
- Scan `/scan` — intro (org + omvang), groeifase, CVF-likert, toekomst, personeelsgroep, instrumenten, resultaat.
- Deep link `/scan` via `vercel.json` SPA-rewrite.
- Voorbeeldinvul op intro → direct resultaat.
- Geen server-side opslag; state alleen in de sessie.

## Half af / bekende fouten

- GitHub-productie-deploy afhankelijk van Vercel-koppeling na push.
- Meetlint / Firefly-afbeeldingen: map `public/images/` voorbereid; bestanden staan lokaal op PC, niet verplicht in UI.
- Tijdelijke Vercel-URL (anonieme deploy) kan verlopen.

## Inhoud

| Onderdeel | Detail | Bestand |
|-----------|--------|---------|
| Greiner-fasen | 5 fasen | `src/data/phases.ts` |
| CVF | 4 stellingen (likert 1–5) | `src/data/cvf.ts` |
| Toekomstvisie | 4 opties (+ notitie bij “anders”) | `src/data/future.ts` |
| Personeelsgroep | 4 opties (Lepak & Snell) | `src/data/core.ts` |
| HR-bundels | 5 bundels | `src/data/bundles.ts` |
| Instrumenten | 24 stuks (legal, minSize, reinforces) | `src/data/instruments.ts` |

## Advieslogica

1. Ontbrekend wettelijk instrument (met `minSize` / org-grootte) → prioriteit `legal`.
2. Anders: bundel uit groeifase (1→ability, 2→opportunity, 3→motivation, 4→opportunity, 5→ability).
3. Ontbrekende instrumenten in die bundel; sorteer op aantal reinforces naar reeds aanwezige → anker.
4. Vervolg: tot 2 reinforces van anker die nog ontbreken.
5. Dominante CVF uit likert → adviesvorm (dialoog / procedure / resultaten / pilot).

**Bestand:** `src/utils/recommendation.ts` — **`buildRecommendation`**. Cultuur: `src/utils/culture.ts` — **`dominantCulture`**, **`cvfShares`**.

## Bronnen in de app

- Footer landingspagina / scan: Greiner (1972), Cameron & Quinn (2011), Boselie et al. (2005), Lepak & Snell (1999), Appelbaum et al. (2000).
- Referentie-HTML: `public/pasvorm-prototype.html`.
- Resultaatscherm: disclaimer indicatief advies; ethiek-blok (Model Moreel Vakmanschap).

## Hoe te starten

```bash
npm install
npm run dev
```

Dev-server: `http://127.0.0.1:43123` (zie `vite.config.ts`).

```bash
npm run build
vercel deploy
```
