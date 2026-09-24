# Sprint 3B — Herstel na regiecontrole

Regie: Claude · Opdrachtgever: Richard · 24-09-2026
Werk volgens `.cursorrules`. Alleen deze punten; verder niets wijzigen.

## Aanleiding
De regie controleerde `55dd3ca`: lint, typecheck, build en 70 tests zijn groen. Het printvoorbeeld van T1 (Chromium, A4) telt **5 pagina's**, niet ≤ 4. Er zijn nog drie inhoudelijke fouten.

## 1. `reason: 'legal'` geldt voor elke bundel
De afwijking uit Sprint 3 vervalt. De regie-definitie was leidend; de goudtabel liet de reason alleen onvermeld.
- `fit.ts`: `reason = legalShort ? 'legal' : 'shortfall'` bij krap, voor **alle** bundels.
- Waarom: bij T1 zegt de prioriteit "wettelijk verplicht" over de meldregeling, terwijl de ethiekbundel "blijft achter bij uw fase" zegt. Het rapport spreekt zichzelf dan tegen.
- `cumulativeRequirements`: neem per instrument het **maximum** over de fasen in plaats van `Object.assign`. Dat verandert niets aan de huidige uitkomsten, maar het maakt de regel robuust.
- `tests/fit.test.ts`: ethiek krijgt `reason: 'legal'` bij **T1, T2 en T8**. Alle andere waarden blijven gelijk.
- `tests/report.test.tsx`: bij T1 toont de ethiekbundel de tekst `fit.reasons.legal`.

## 2. Bronnenlijst alfabetisch volgens APA
- `collectReportSourceIds` sorteert nu op id. Daardoor staat Voddé vóór Rest.
- Sorteer op de `apa`-tekst: `a.apa.localeCompare(b.apa, 'nl', { sensitivity: 'base' })`. Gebruik geen opmaaktekens (`*`) bij het vergelijken.
- Test: de volgorde in de gerenderde bronnenlijst is gelijk aan dezelfde lijst, gesorteerd volgens deze regel.

## 3. Printversie ≤ 4 pagina's
- De link "Lettertypelicenties" in het rapport krijgt `no-print`. Nu staat hij alleen op pagina 5.
- E2E: in printmedia is die link niet zichtbaar.
- E2E: maak `page.pdf({ format: 'A4', printBackground: true })` van het T1-rapport en controleer **≤ 4 pagina's**. Tel de pagina's met `pdf-lib` (devDependency) via `PDFDocument.load(buf).getPageCount()`.

## 4. `.gitignore`
Voeg toe: `*.tsbuildinfo`, `test-results/`, `playwright-report/`. Haal `tsconfig.test.tsbuildinfo` uit de index als hij gevolgd wordt.

## Klaar als
- lint, typecheck, test, build en test:e2e zijn groen.
- STATUS.md heeft een sectie "Sprint 3B", met de afwijking uit Sprint 3 gemarkeerd als opgelost.
- Er is één commit `Sprint 3B: herstel na regiecontrole`, gepusht.
