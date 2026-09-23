# Pasvorm

HR-professionaliseringsscan voor MKB-organisaties. React 18, Vite, TypeScript en Tailwind CSS. State blijft in de browser; geen database.

Wetenschappelijke basis: Greiner (1972), Cameron & Quinn (CVF), Boselie et al. (2005), Lepak & Snell (1999), Appelbaum et al. (2000, AMO).

## Lokaal draaien

```bash
npm install
npm run dev
```

De dev-server luistert op `http://127.0.0.1:43123`.

## Productiebuild

```bash
npm run build
npm run preview
```

## Deploy op Vercel

```bash
npm install -g vercel   # eenmalig
vercel deploy
```

`vercel.json` bevat SPA-fallback: alle routes (o.a. `/scan`) worden naar `index.html` gerouteerd.

## Structuur

- `src/components/Landing.tsx` — landingspagina (één viewport op tablet/desktop)
- `src/components/Scan.tsx` — scan-flow met voortgangsbalk
- `src/data/` — fasen, cultuur, bundels en 24 instrumenten
- `src/utils/recommendation.ts` — aanbevelingsalgoritme

## Opmerking prototype

Het bestand `/public/pasvorm-prototype.html` stond niet in de workspace bij de migratie. UI, kleuren en flow zijn gebouwd volgens de specificatie; upload het HTML-prototype als u copy en data 1:1 wilt afstemmen.
