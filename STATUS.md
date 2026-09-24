# Pasvorm — projectstatus

Laatst bijgewerkt: 24 september 2026 (cloud-agent consolidatie).

## Herkomst

| Locatie | Rol |
|--------|-----|
| **Doelmap (jouw PC)** | `C:\Users\876409\OneDrive - Office 365 Fontys\Cursor projecten\pasvorm` — hier moet deze map 1:1 staan (via `git clone` / pull, geen handmatig herschrijven). |
| **Cloud-agent workspace** | `/workspace` — volledige React-app gebouwd en gepusht vanuit Cursor New Project / Pasvorm-scan agent. |
| **Cursor Git remote** | `origin` → `https://origin.cursor.com/git/richard-vodd/tmp-2ecb3cf99820c72e.git` (branch `main`). |
| **GitHub (door jou aangemaakt)** | `https://github.com/rvodde-cyber/Pasvorm` — bedoeld als definitieve remote; push vanaf PC nog uit te voeren. |
| **HTML-prototype** | Oorspronkelijk als `pasvorm-prototype.html` aangeleverd; opgeslagen als `public/pasvorm-prototype.html`. |
| **Vercel (tijdelijk)** | `https://temporary-sonic-oboe-k4fwugj.vercel.app` — anonieme deploy (ca. 60 min geldig tenzij geclaimd); geen vaste productie-URL gekoppeld aan GitHub. |

**Lokaal op PC:** verplaats de **twee Firefly-afbeeldingen (meetlint)** die al in je map `pasvorm` staan naar `public/images/` (ongewijzigd). In de cloud-workspace stonden die bestanden niet; alleen `public/images/` is voorbereid.

## Stack

| Onderdeel | Versie / keuze |
|-----------|----------------|
| Framework | React **18.3.x** + **Vite 8.3** |
| Taal | TypeScript **~6.0** |
| Styling | Tailwind CSS **4.3** (`@tailwindcss/vite`) |
| Routing | react-router-dom **7.18** |
| Lint | oxlint |
| Deploy-config | `vercel.json` (SPA rewrite) |

Belangrijkste scripts: `npm run dev` (poort **43123**, host `127.0.0.1`), `npm run build`, `npm run preview`.

## Mappenstructuur

```
pasvorm/
├── public/                 Statische assets (foto landingspagina, prototype HTML, icons)
│   └── images/             Meetlint / Firefly-afbeeldingen (lokaal op PC plaatsen)
├── src/
│   ├── components/         Landing, Scan-shell, Modal, stap-componenten
│   │   └── steps/          Intro, fase, CVF, toekomst, core, instrumenten, resultaat
│   ├── data/               Vaste inhoud: bundels, instrumenten, fasen, CVF, opties
│   ├── hooks/              useScanState — sessiestate scan
│   ├── utils/              Cultuurprofiel + aanbevelingsalgoritme
│   ├── App.tsx             Routes / en /scan
│   ├── main.tsx            React mount
│   └── index.css           Tailwind + basisstijlen
├── index.html              Shell + Google Fonts
├── vite.config.ts          Dev-server poort 43123
├── tailwind.config.ts      Pasvorm-kleuren en fonts
├── vercel.json             SPA fallback voor deep links
├── README.md               Install / dev / build / deploy
└── STATUS.md               Dit bestand
```

(Niet in repo: `node_modules/`, `dist/`, `.vercel/`, `.env*`.)

## Gebouwd en werkend

- **Landingspagina (`/`)** — één viewport desktop/tablet; tegels Groeifase / Cultuur / Bundels → modals; CTA naar scan; foto `public/pasvorm-foto.jpg` (uit prototype geëxtraheerd).
- **Scan (`/scan`)** — 7 stappen (intro + 6 inhoud + resultaat): org + omvang, Greiner-fase, CVF-likert (4× 1–5), toekomstvisie, Lepak & Snell-personeelsgroep, instrumenten-checklist per bundel, resultaatprofiel + advies.
- **Navigatie** — React Router (geen display-toggle); modals sluiten via overlay `onPointerDown`.
- **Voorbeeldinvul** — intro: direct naar resultaat (schoonmaakbedrijf-demo).
- **Deep link** — `/scan` via `vercel.json` rewrite.

## Half af / bekende fouten

- **GitHub `rvodde-cyber/Pasvorm`** — repo was leeg; code moet vanuit deze map naar GitHub gepusht worden.
- **Vercel productie** — alleen tijdelijke deploy zonder account-koppeling; permanente URL via GitHub-import + Vercel.
- **Meetlint / Firefly** — afbeeldingen staan op jouw PC, nog niet in cloud-repo; app verwijst er (nog) niet expliciet naar in React (alleen map `public/images/` klaar).
- **Cloud-agent** kan niet direct schrijven naar je OneDrive-pad; sync via Git.

## Inhoud

| Onderwerp | Aantal / detail | Bestand |
|-----------|-----------------|---------|
| Greiner-fasen | 5 (Persoonlijke sturing … Samenwerken) | `src/data/phases.ts` |
| CVF-stellingen | 4 (Familie, Adhocratie, Markt, Hiërarchie), likert 1–5 | `src/data/cvf.ts` |
| Toekomstvisie | 4 opties (+ vrije tekst bij “Iets anders”) | `src/data/future.ts` |
| Personeelsgroep | 4 opties (Lepak & Snell) | `src/data/core.ts` |
| HR-bundels | 5 (basis, ability, motivation, opportunity, ethiek) | `src/data/bundles.ts` |
| Instrumenten | 24 (legal/minSize/reinforces) | `src/data/instruments.ts` |

Scan-state: `src/hooks/useScanState.ts`.

## Advieslogica

1. Wettelijk verplicht instrument ontbreekt (rekening houdend met `minSize` en org-grootte) → type `legal`.
2. Anders: prioriteitsbundel uit groeifase (1→ability, 2→opportunity, 3→motivation, 4→opportunity, 5→ability).
3. Ontbrekende instrumenten in die bundel; sorteer op aantal `reinforces` naar reeds aanwezige instrumenten → anker.
4. Vervolg: max. 2 linked `reinforces` van anker die nog ontbreken.
5. Cultuurvorm: dominante CVF uit likert-scores → tekst “als dialoog…”, “als vaste procedure…”, etc.

Implementatie: **`src/utils/recommendation.ts`** — functie **`buildRecommendation`**. Dominante cultuur: **`src/utils/culture.ts`** — `dominantCulture`, `cvfShares`.

## Deployment

| Status | URL / actie |
|--------|-------------|
| Lokaal dev | `http://127.0.0.1:43123` |
| Tijdelijk online | `https://temporary-sonic-oboe-k4fwugj.vercel.app` (status onbekend na expiry) |
| Definitief | GitHub push → Vercel import project `Pasvorm`, build `dist` |

## Openstaande beslissingen of vragen

- GitHub remote `github` toevoegen en `main` pushen naar `rvodde-cyber/Pasvorm`.
- Vercel project permanent koppelen aan GitHub.
- Of meetlint-Firefly-afbeeldingen in de UI gebruikt moeten worden (nu alleen map `public/images/`).
- Definitieve productienaam / domein op Vercel.

## Verificatie (24 sep 2026, cloud)

```text
npm install   → OK (0 vulnerabilities)
npm run build → OK (Vite production build)
npm run dev   → OK (HTTP 200 op http://127.0.0.1:43123/)
```

**Sync naar OneDrive-map (op jouw PC):**

```powershell
cd "C:\Users\876409\OneDrive - Office 365 Fontys\Cursor projecten"
# Backup oude pasvorm indien nodig, daarna:
git clone https://github.com/rvodde-cyber/Pasvorm.git pasvorm-new
# Of: in bestaande pasvorm: git pull / remote toevoegen naar Cursor of GitHub
# Verplaats Firefly-bestanden naar pasvorm\public\images\
cd pasvorm
npm install
npm run dev
```
