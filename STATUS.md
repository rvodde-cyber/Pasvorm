# Pasvorm — STATUS

## Sprint 3 — rapport en pdf

### Gedaan

- `bundleFit` in `baseline.json` + `src/engine/fit.ts`; `EvaluateResult.bundleFit`; goudtests `tests/fit.test.ts` (8 casussen).
- `ui.json`: `report` (vervangt `resultPlaceholder`); bronnen `REST86`, `KAP08`, MMV-APA bijgewerkt; `mmv.json` sourceIds uitgebreid.
- Rapport-UI `src/components/report/Report.tsx` op resultaatstap (`max-w-4xl`, `#rapport`); banner `rapport-meetlint.webp`; print via `window.print()`.
- Kleuren via CSS-variabelen (`tailwind.config.ts`, `index.css`); MMV-huisstijl; `@media print` (A4, contrast, page breaks).
- OFL-licenties in `public/licenses/`; link op landing en rapport.
- Tests: `tests/report.test.tsx`, axe rapport T1/T8, Playwright e2e contrast (`tests/e2e/`), `fonts-build` licenties; CI: `test:e2e` na build.
- Opdracht vastgelegd in `docs/regie/sprint-3.md`.

### Afwijkingen

- `bundleFit.reason` = `legal` alleen voor bundel `basis` (goudtabel); overige krap-bundels met wettelijk instrument krijgen `shortfall` als reason, status blijft `krap` via `legalShort`.

### Vragen aan regie

- (geen nieuwe)

### Handmatig (nog door opdrachtgever)

- Printvoorbeeld casus T1 in Chrome/Edge: A4, ≤ 4 pagina's, geen afgebroken kaarten; rapport op 360 px.

## Sprint 2B — herstel na regiecontrole (360 px + axe)

### Gedaan

- `bundles.json` in schema + `content/index`; bundelkoppen (label, subtitle, description) op de instrumentenstap; bundle-id’s gekoppeld aan `instruments.json`.
- Cultuur: startwaarde `ui.steps.cultuur.startValue` (0), status “Nog te verdelen: 100 punten”; invoer `aria-label` = beschrijvingstekst (geen kwadrantnamen in de stroom).
- Lettertypen via `@fontsource/libre-franklin` (700, 800) en `@fontsource/source-sans-3` (400, 600); geen `fonts.googleapis.com` / `fonts.gstatic.com` in de build (inclusief `public/pasvorm-prototype.html`).
- Instrumentenstap: compacte rij + segment-radiogroep per instrument (labels uit `stages.json`), accent-intensiteit per stadium; `InstrumentTile` / tik-cyclus verwijderd.
- Foutbeleid `ui.errorPolicy`: Volgende altijd actief; `role="alert"` pas na klik Volgende + focus eerste open veld; geen fout bij stapwissel.
- Groeifase: `aria-pressed`, toegankelijke naam met 1e/2e keus; badge boven de tekst.
- Bronnen: `renderApa` voor `*cursief*` → `<em>`.
- Tests: cultuur 0 + fout na Volgende, instrument-radiogroep/pijltjes, dist zonder Google Fonts, `renderApa`; axe (vitest-axe) per stap + resultaat + scan-shell (WCAG 2.2 AA). CI: build vóór test.
- `tsconfig.test.json` voor test-typecheck naast `tsconfig.app` (alleen `src` in app-build).

### Vragen aan regie

- (geen nieuwe)

## Sprint 2 — nieuwe vragenstroom op regelmotor v1.0

### Gedaan

- `ui.json` in schema + `index.ts` (validatie `exampleCaseId` ↔ testcases, `crisisOrder` ↔ alle crisis-id's).
- Nieuwe scanstate: `ScanInput` + `orgName` + `futureNote`; opslag `pasvorm:v2` (v1 wordt verwijderd bij laden).
- Zeven stappen + resultaatplaceholder op `/scan`; teksten uit `ui.json` en overige content; advies via `evaluate()`.
- `ProgressTape`, stapnavigatie met validatie/foutteksten uit UI, voorbeeldknop (casus `T1`).
- Componenttests `tests/scan-components.test.tsx`; engine-fixtures blijven groen.
- Oude `src/data/*`, `buildRecommendation` en `tests/recommendation.test.ts` verwijderd.

### Handmatige check (24 sep 2026)

- **360 px breed:** stap 0 en resultaat na voorbeeldknop leesbaar; voortgangsbalk en knoppen passen op smal scherm.
- **Toetsenbord:** focusring op knoppen/velden zichtbaar; radiogroepen en segmentknoppen 0–3 bedienbaar; bevestiging wissen met Escape getest in sprint 1B-herstel.
- **Invultijd volledige scan (handmatig, niet gestopt):** niet exact gemeten in deze sessie; voorbeeldknop → resultaat direct. Voor handmatige invulling blijft de richtlijn circa **10 minuten** (zoals in UI).

### Regie — beantwoord

- `rapport-meetlint.webp` → sprint 3.
- `/_bron` blijft in Git.

### Vragen aan regie

- (geen nieuwe)

## Sprint 1B — herstel na regiecontrole + afronding 1A

### Gedaan (herstel)

- **Fase f5:** `nextPhaseId` alleen via `phaseIdByOrder` bij `phase.transition`; anders dominante fase (geen crash meer bij f5 als eerste keus).
- **Cultuur gelijke stand:** `dominants[]` naast `dominant`; `tension` alleen als geen dominant in `expectedByPhase` staat; `form` = `dominants[0]`.
- **Regressietests** in `tests/engine.test.ts` (f5/f4, f5/f5, gelijke stand f3, tension f1).
- **Afronding 1A:** hero-bijschrift verwijderd; favicon `/favicon.svg`; bevestiging bij "Wis mijn antwoorden" (inline, focus Annuleren, Escape annuleert).

## Sprint 1B — inhoud als data + regelmotor v1.0

### Gedaan

- **Zod** geïnstalleerd. `src/content/schema.ts` met schema's voor alle 10 JSON-bestanden; `src/content/index.ts` importeert, valideert (foutmelding met bestandsnaam) en exporteert getypte content. Verwijzingscontrole op `instrumentId`, `sourceId`, `phaseId` en quadrant-id's.
- **Regelmotor** in `src/engine/`: `types.ts`, `phase.ts`, `culture.ts`, `rules.ts` (`evaluate`), pure functies zonder React. Logica R1–R7 volgens `rules.json` en sprintspecificatie (inclusief R1 onbeperkt, prioriteiten tot `maxPriorities`, sufficient zonder R2b, signalen in vaste volgorde).
- **Tests** `tests/engine.test.ts`: alle 8 casussen uit `tests/fixtures/testcases.json` (fixture-cultuurprofiel → alle drie dimensies); plus schema- en verwijzingstests. `tests/recommendation.test.ts` ongewijzigd actief (oude engine tot sprint 2).
- UI en `buildRecommendation` (`src/utils/recommendation.ts`) niet aangepast.

### Afwijkingen

- `tsconfig.app.json`: `resolveJsonModule` toegevoegd voor JSON-imports in `src/content`.
- Prioriteit-`sourceIds` in het resultaat: union van regel-`sourceIds` en instrument-`sourceIds` (deduplicated); de UI gebruikt dit nog niet.
- Referentie `docs/regie/referentie_regelmotor.py` niet in CI; testverwachtingen komen uit `tests/fixtures/testcases.json`.

## Sprint 1A — fundament onder de bestaande app

### Gedaan

- Remote gezet op `https://github.com/rvodde-cyber/Pasvorm.git`.
- `.cursorrules` in de hoofdmap met de werkafspraken van de regie.
- Tests: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`. Scripts `test` (`vitest run`) en `typecheck` (`tsc -b --noEmit`). Testconfiguratie in `vite.config.ts`, setup in `tests/setup.ts`.
- Vastleggingstests in `tests/recommendation.test.ts` voor `buildRecommendation` (huidig gedrag, niet verbeterd):
  - a. Voorbeeld schoonmaakbedrijf (200 mw) → `advies`, Werkoverleg op locatie; vervolg Interne communicatie, Erkenning & waardering; vorm procedure.
  - b. Taxibedrijf (400 mw, fase 1, hiërarchie, alleen wettelijke basis) → `advies`, Onboardingprogramma; vervolg Gesprekscyclus, Werving & selectiebeleid.
  - c. 30 mw zonder RI&E → `legal`, RI&E.
  - d. 30 mw zonder OR → OR niet geëist; ter controle van de drempel: bij 50 mw wél `legal`, OR.
  - e. Alle 24 instrumenten → `compleet`.
- Opslaan: scantoestand in `localStorage` onder `pasvorm:v1` (`src/utils/storage.ts`, alle toegang in try/catch). Bij laden wordt elk veld gecontroleerd; ongeldige data valt terug op een lege scan. Na verversen gaat de scan verder op dezelfde stap. Een lege scan verwijdert de sleutel.
- Knop "Wis mijn antwoorden" op de intro- en resultaatstap, met bevestiging (zie herstel sprint 1B).
- Beelden: `public/images/hero-meetlint.webp` (1600×1244, 188 kB) en `public/images/rapport-meetlint.webp` (1600×1244, 198 kB). Hero op de landingspagina met alt-tekst. Originele jpg's verplaatst naar `/_bron` (buiten `public`, dus niet in de build).
- Opgeruimd: `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `public/pasvorm-foto.jpg`.
- CI: `.github/workflows/ci.yml` — bij elke push lint, typecheck, test en build op Node 22.

### Afwijkingen

- De voorbeeldinvulling staat nu in `src/data/example.ts` (inhoud ongewijzigd), zodat de knop op de introstap en test a dezelfde gegevens gebruiken.
- `tsconfig.app.json` omvat nu ook `tests/`, zodat de tests meegetypecheckt worden.
- "Nieuwe scan starten" op de resultaatstap wist nu ook de opslag (zelfde `reset` als "Wis mijn antwoorden").
- De lege map `src/assets` kon lokaal niet verwijderd worden (geen rechten, waarschijnlijk OneDrive). Git bewaart geen lege mappen; in de repository bestaat hij niet.
- `rapport-meetlint.webp` is aangemaakt maar nog nergens gebruikt; er is geen plek voor opgegeven.

## Stack

- **React** 18.3.x, **Vite** 8.3, **TypeScript** ~6.0
- **Tailwind CSS** 4.3 (`@tailwindcss/vite`)
- **react-router-dom** 7.18
- **oxlint** (dev)
- **Vitest** 5, **Testing Library**, **jsdom** (dev)
- **Zod** (content-validatie)

## Mappenstructuur

```
pasvorm/
├── .github/workflows/   CI (lint, typecheck, test, build)
├── _bron/               Originele bronbeelden (niet in de build)
├── public/              Statische assets (prototype HTML, icons, images/)
├── src/components/      Landing, Scan, Modal
├── src/components/steps/  Scanstappen (intro t/m resultaat)
├── src/content/         JSON-inhoud regie + schema + laden
├── src/scan/            Scanstate, validatie, opslag v2
├── src/engine/          Regelmotor v1.0 (evaluate)
├── src/hooks/           useScanState (scantoestand + opslaan)
├── src/utils/           Cultuurprofiel, aanbevelingsalgoritme (legacy), localStorage
├── tests/               Vitest-tests + fixtures
├── docs/regie/          Referentie regelmotor (niet in CI)
└── (root)               vite/tailwind/tsconfig, vercel.json, README.md
```

## Werkende schermen en functies

- Landingspagina `/` — tegels + modals, CTA naar scan, responsive (foto verborgen op mobiel).
- Scan `/scan` — organisatie, groeifase + crisis, cultuur (100-punten), toekomst, personeel, instrumenten (stadia 0–3), MMV, Pasvorm-rapport (pdf via print).
- Deep link `/scan` via `vercel.json` SPA-rewrite.
- Voorbeeldknop (taxibedrijf T1) → direct resultaat.
- Opslag `localStorage` `pasvorm:v2`; wissen via bevestiging op intro/resultaat.

## Half af / bekende fouten

- GitHub-productie-deploy afhankelijk van Vercel-koppeling na push.
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
| Voorbeeldinvulling | Schoonmaakbedrijf, 200 mw | `src/data/example.ts` |

## Advieslogica

1. Ontbrekend wettelijk instrument (met `minSize` / org-grootte) → prioriteit `legal`.
2. Anders: bundel uit groeifase (1→ability, 2→opportunity, 3→motivation, 4→opportunity, 5→ability).
3. Ontbrekende instrumenten in die bundel; sorteer op aantal reinforces naar reeds aanwezige → anker.
4. Vervolg: tot 2 reinforces van anker die nog ontbreken.
5. Dominante CVF uit likert → adviesvorm (dialoog / procedure / resultaten / pilot).

**Bestand:** `src/utils/recommendation.ts` — **`buildRecommendation`**. Cultuur: `src/utils/culture.ts` — **`dominantCulture`**, **`cvfShares`**. Vastgelegd in `tests/recommendation.test.ts`.

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

Controles (ook in GitHub Actions):

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Deploy:

```bash
vercel deploy
```
