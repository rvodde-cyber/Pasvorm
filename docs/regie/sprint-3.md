# Sprint 3 — Rapport en pdf

Regie: Claude · Opdrachtgever: Richard · 24-09-2026
Werk volgens `.cursorrules`. Alleen deze sprint. Alle teksten staan hieronder; verzin niets.

## Doel
De resultaatstap wordt een volwaardig rapport: samenvatting, pasvorm per bundel, cultuurprofiel, moreel handelingsvermogen, advies, verantwoording en bronnen. Het rapport is als pdf te bewaren via het printvenster, zonder extra bibliotheek.

## 1. Engine — pasvorm per bundel (`src/engine/fit.ts`, puur, geen React)

**Content** — voeg toe aan `baseline.json` (+ Zod-schema):
```json
"bundleFit": { "shortfallThreshold": 0.5, "looseThreshold": 1.5, "looseExcludes": ["basis"] }
```

**Definities** (fase = `phase.dominant`, dus de eerste keus):
- `expected(i)` = max van: (a) cumulatieve eis uit `baseline.requirements` t/m die fase, (b) `stages.legalMinimumStage` als `legal` én (`minSize === 0` of `size >= minSize`). Anders 0.
- `measured(b)` = gemiddelde stage van alle instrumenten in bundel b (ontbrekend = 0). Gelijk aan bestaande `bundleScores`.
- `expectedMean(b)` = gemiddelde `expected(i)` over alle instrumenten in b.
- `shortfall(b)` = gemiddelde van `max(0, expected − stage)` over instrumenten in b met `expected > 0`; 0 als die er niet zijn.
- `legalShort(b)` = een instrument in b met `legal`, `expected > 0` en `stage < legalMinimumStage`.
- Status: `krap` als `legalShort` of `shortfall >= shortfallThreshold`; anders `ruim` als b niet in `looseExcludes` staat en `measured − expectedMean >= looseThreshold`; anders `past`.
- Reason: `legal` (voorrang) of `shortfall` bij krap; `ruim` bij ruim; geen bij past.
- Vergelijk met ongeronde waarden. Rond alleen voor de output af: `Math.round(x * 10) / 10`.

**Type** — voeg aan `EvaluateResult` toe:
```ts
bundleFit: Record<BundleId, { measured: number; expected: number; status: 'krap' | 'past' | 'ruim'; reason?: 'legal' | 'shortfall' | 'ruim' }>
```

**Goudwaarden** (`tests/fit.test.ts`, gemeten/passend status, uit `testcases.json`):

| Casus | basis | ability | motivation | opportunity | ethiek |
|---|---|---|---|---|---|
| T1 | 3.0/2.0 past | 0.0/0.2 krap | 0.0/0.2 krap | 0.0/0.3 krap | 0.0/0.5 krap |
| T2 | 3.0/2.0 past | 0.0/1.2 krap | 0.0/0.6 krap | 0.0/0.5 krap | 0.0/1.0 krap |
| T3 | 1.7/1.7 krap (legal) | 0.8/0.2 past | 0.2/0.2 past | 0.3/0.3 past | 0.0/0.0 past |
| T4 | 3.0/1.7 past | 1.4/1.2 past | 0.8/0.6 past | 0.8/0.5 past | 0.8/0.5 past |
| T5 | 3.0/1.7 past | 1.2/1.2 past | 0.8/0.6 past | 0.8/0.5 past | 0.8/0.5 past |
| T6 | 3.0/2.0 past | 3.0/2.0 past | 3.0/2.0 past | 3.0/1.5 ruim | 3.0/1.8 past |
| T7 | 3.0/1.7 past | 1.4/1.2 past | 0.8/0.6 past | 0.8/0.5 past | 1.0/0.5 past |
| T8 | 0.0/2.0 krap (legal) | 0.0/0.2 krap | 0.0/0.2 krap | 0.0/0.3 krap | 0.0/0.5 krap |

Bestaande engine-tests blijven ongewijzigd groen.

## 2. Teksten — `ui.json`
Vervang `resultPlaceholder` door `report` (schema bijwerken, alle verwijzingen aanpassen):
```json
"report": {
  "title": "Uw Pasvorm-rapport",
  "meta": "{org} · {size} medewerkers · {date}",
  "orgFallback": "Uw organisatie",
  "intro": "Dit rapport laat zien hoe uw HR-instrumentarium past bij de groeifase, de cultuur en de mensen van uw organisatie. Er bestaat geen universeel goed HR-beleid. Het gaat om de pasvorm.",
  "privacy": "Uw antwoorden blijven in deze browser. Pasvorm verstuurt en bewaart niets op een server.",
  "actions": { "print": "Download als pdf", "printHint": "Kies in het printvenster voor 'Opslaan als pdf'." },
  "summary": {
    "title": "In één oogopslag",
    "phase": "Groeifase", "culture": "Cultuur", "future": "Richting komende jaren",
    "workforce": "Grootste personeelsgroep", "nextStep": "Eerstvolgende stap",
    "transition": "{phase}, in overgang naar {nextPhase}",
    "flat": "Geen uitgesproken cultuur",
    "sufficientStep": "Houd uw huidige instrumentarium op peil. Structureel is niets nodig."
  },
  "fit": {
    "title": "De pasvorm per bundel",
    "intro": "De balk toont hoe ver uw instrumenten gemiddeld zijn ontwikkeld, van 0 (niet aanwezig) tot 3 (structureel). Het streepje toont wat bij uw groeifase en omvang past.",
    "measured": "Gemeten", "expected": "Passend",
    "status": { "krap": "Te krap", "past": "Past", "ruim": "Ruim" },
    "reasons": {
      "legal": "Een wettelijk verplicht instrument staat nog niet op papier.",
      "shortfall": "Een of meer instrumenten blijven achter bij wat uw fase vraagt.",
      "ruim": "Ruim is geen fout. U onderhoudt mogelijk meer dan uw fase nu vraagt."
    }
  },
  "culture": {
    "title": "Uw cultuurprofiel",
    "intro": "Zo verdeelde u de punten, gemiddeld over leiderschap, bindmiddel en succes.",
    "dominant": "Dominant",
    "hints": {
      "clan": "Samenwerking, betrokkenheid en vertrouwen",
      "adhocracy": "Vernieuwing, ondernemen en experiment",
      "market": "Resultaat, doelen en concurrentie",
      "hierarchy": "Beheersing, regels en voorspelbaarheid"
    }
  },
  "mmv": {
    "title": "Moreel handelingsvermogen",
    "intro": "Welke ruimte schept uw organisatie voor moreel handelen? Van 1 (helemaal niet) tot 5 (helemaal wel), voor vijf stappen: zien, voelen, wegen, handelen en volhouden.",
    "low": "Aandachtspunt"
  },
  "prioritiesTitle": "Uw prioriteiten",
  "temporaryTitle": "Tijdelijk inzetten of inhuren",
  "workforceTitle": "Accent voor uw personeelsgroep",
  "signalsTitle": "Signalen voor het gesprek",
  "ethicsTitle": "Morele kanttekeningen",
  "method": {
    "title": "Over deze scan",
    "paragraphs": [
      "Pasvorm gaat uit van best fit: HR-beleid werkt pas als het past bij fase, cultuur en mensen (Baird & Meshoulam, 1988; Boselie et al., 2005).",
      "De groeifase volgt Greiner (1998). De cultuur volgt het Competing Values Framework (Cameron & Quinn, 2011). De bundels volgen het AMO-model (Appelbaum et al., 2000).",
      "Het moreel handelingsvermogen meet de voorwaarden die uw organisatie schept voor moreel handelen, niet het handelen van individuele medewerkers.",
      "De scan volgt daarvoor de vijf fasen van het Model Moreel Vakmanschap (Voddé, 2026), ontwikkeld binnen het Lectoraat Ethisch Werken. Het model bouwt voort op het vier-componentenmodel van Rest (1986).",
      "De vertaling naar de organisatie sluit aan bij het model voor ethische cultuur van Kaptein (2008).",
      "Deze scan is indicatief en wordt nog gevalideerd. Bespreek de uitkomst met collega's voordat u besluit."
    ],
    "sourceIds": ["BM88", "BOS05", "GRE98", "CQ11", "APP00", "MMV", "REST86", "KAP08"]
  },
  "sourcesTitle": "Bronnen",
  "fontLicenses": "Lettertypelicenties",
  "printFooter": "Pasvorm · Lectoraat Ethisch Werken, Fontys Hogeschool HRM en Psychologie · {date}"
}
```
Labels voor fase, toekomst en personeelsgroep komen uit `phases.json` en `context.json`. Datum: `Intl.DateTimeFormat('nl-NL', { dateStyle: 'long' })`. Getallen met decimale komma (`nl-NL`).

## 2b. Bronnen voor de ethische as
Voeg toe aan `sources.json` (type `wetenschap`):
```json
{ "id": "REST86", "type": "wetenschap", "apa": "Rest, J. R. (1986). *Moral development: Advances in research and theory*. Praeger." },
{ "id": "KAP08", "type": "wetenschap", "apa": "Kaptein, M. (2008). Developing and testing a measure for the ethical culture of organizations: The corporate ethical virtues model. *Journal of Organizational Behavior, 29*(7), 923–947. https://doi.org/10.1002/job.520" }
```
- `mmv.json`: `sourceIds` wordt `["MMV", "REST86", "KAP08"]`.
- Vervang de MMV-vermelding (verwijder `todo`):
```json
{ "id": "MMV", "type": "model", "apa": "Voddé, R. (2026, 16 juni). *Het Model Moreel Vakmanschap*. Community Moreel Vakmanschap. https://moreelvakmanschap.nl/model" }
```
- **Naamregel:** de naam "Model Moreel Vakmanschap" staat alleen in "Over deze scan" en in de bronnenlijst. In de vragenstroom en in de MMV-grafiek staan alleen de fasenamen.

## 3. Rapport-UI (`src/components/report/`)
- `Report.tsx` vervangt `StepResultaat`. Kaart op de resultaatstap wordt breder (`max-w-4xl`). Wrapper `<article id="rapport">`.
- **Volgorde:** kop (titel, meta, intro, privacy, `rapport-meetlint.webp` als banner, `alt=""`, hoogte ± 160 px, `object-cover`) → samenvatting → pasvorm per bundel → prioriteiten (bestaande kaarten, ethieknoot inline) → tijdelijk → personeelsgroep (`workforceNote`) → cultuurprofiel → moreel handelingsvermogen → signalen → morele kanttekeningen → over deze scan → bronnen → disclaimer → printFooter.
- **Samenvatting:** `<dl>` met vijf regels. Eerstvolgende stap = label + `firstStep` van `priorities[0]`; zonder prioriteiten `sufficientStep`. Cultuur = label dominant, of `flat`.
- **Grafieken:** HTML/CSS-balken, geen chartbibliotheek, geen spinnenweb. Per rij een `<li>` met zichtbare tekst (label, waarden, status). De balk zelf is `aria-hidden`. Informatie nooit alleen via kleur.
  - Bundel: schaal 0–3, gevulde balk = gemeten, verticaal streepje = passend, statuslabel + reden. Bundelnaam = `label` + `subtitle` uit `bundles.json`.
  - Cultuur: vier balken 0–100 %, in kwadrantkleur, met label, hint en afgerond percentage; dominant(en) krijgen het label "Dominant".
  - MMV: vijf balken 1–5 in MMV-kleur, met fasenaam, stelling en score; score ≤ `mmv.lowThreshold` krijgt "Aandachtspunt".
- **Bronnen:** unie van prioriteit-bronnen, regelbronnen en `method.sourceIds`; gesorteerd; via `renderApa`.
- **Knoppen** (niet in print): "Download als pdf" + hint, en de bestaande knoppen voor nieuwe scan en wissen.

## 4. Kleuren en print
- Zet alle kleuren in `tailwind.config.ts` om naar CSS-variabelen (`var(--c-…)`) en definieer ze in `index.css` onder `:root`. Schermwaarden blijven gelijk, behalve MMV.
- **MMV volgens huisstijl** (was verkeerd): zien `#5B8FD4`, voelen `#D9A441`, wegen `#D97BA6`, handelen `#3FA7A0`, volhouden `#E07A5F`.
- **`@media print`**: `@page { size: A4; margin: 16mm; }`. Tokens: bg/bg2/surface `#FFFFFF`/`#F6F7F9`/`#FFFFFF`, ink `#14202F`, muted `#4A5868`, line `#D9DEE5`, accent `#8A6420`, ethiek `#6B4FA0`. MMV-print: `#2F6DB5`, `#A8741A`, `#B8457A`, `#1F7F79`, `#C0533A`.
- Balken in print: `print-color-adjust: exact` en een rand van 1 px in ink.
- Verberg in print: alles buiten `#rapport`, banner, knoppen, ProgressTape en nav. Geen schaduwen. `break-inside: avoid` op `li`, kaarten en figuren; `break-after: avoid` op koppen.
- Bij klikken op "Download als pdf": zet `document.title` op `Pasvorm-rapport – {org} – {yyyy-mm-dd}`, roep `window.print()` aan en herstel de titel bij `afterprint`.

## 5. Fontlicenties
Kopieer de OFL-licenties uit `node_modules/@fontsource/libre-franklin` en `@fontsource/source-sans-3` naar `public/licenses/`. Link ernaar in de footer van landing en rapport met de tekst `fontLicenses`.

## 6. Tests
- `tests/fit.test.ts`: tabel hierboven, alle 8 casussen.
- `tests/report.test.tsx`:
  - T1–T8 renderen zonder fout.
  - T1: eerstvolgende stap = "Meldregeling en meldcultuur".
  - T4: `sufficientStep` en de sufficient-tekst.
  - T3: basis met reden `legal`.
  - T6: opportunity "Ruim" met ruim-reden.
  - Alle `method.sourceIds` staan in de bronnenlijst; privacytekst aanwezig.
  - De MMV-bron in de bronnenlijst bevat `https://moreelvakmanschap.nl/model`.
  - De MMV-sectie en de scanstappen bevatten de tekst "Model Moreel Vakmanschap" niet; "Over deze scan" en de bronnenlijst wel.
  - Printknop: `window.print` gemockt, titel gezet en na `afterprint` hersteld.
- vitest-axe op het rapport voor T1 en T8.
- **E2E-contrast** (`@playwright/test` + `@axe-core/playwright`, `tests/e2e/`, script `test:e2e`, `webServer: npm run preview -- --port 4173 --strictPort`):
  - axe met tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`, inclusief `color-contrast`.
  - Pagina's: `/`, eerste scanstap, en het rapport na de voorbeeldknop.
  - Het rapport ook met `page.emulateMedia({ media: 'print' })`.
  - Nul overtredingen.
- `fonts-build`-test uitbreiden: `dist/licenses/` bevat beide licenties.
- CI: na build `npx playwright install --with-deps chromium` en `npm run test:e2e`.

## 7. Klaar als
- lint, typecheck, test, build en test:e2e zijn groen.
- Handmatig: printvoorbeeld in Chrome en Edge, A4, T1 ≤ 4 pagina's, geen afgebroken kaarten. Rapport leesbaar op 360 px.
- STATUS.md heeft een sectie "Sprint 3" met afwijkingen en vragen.
- Eén commit `Sprint 3: rapport en pdf` en een push.

## Buiten scope
Geen login, opslag op een server, analytics of pdf-bibliotheek. Gebruik voor de MMV-bron alleen `https://moreelvakmanschap.nl/model`, niet de homepage of het Vercel-adres.
