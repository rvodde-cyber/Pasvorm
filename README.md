# Pasvorm

HR-professionaliseringsscan voor MKB-organisaties (React 18, Vite, TypeScript, Tailwind).

## Setup & run

```bash
npm install
npm run dev
npm run build
vercel deploy
```

- **Lokaal:** `npm run dev` → `http://127.0.0.1:43123`
- **Productie:** `vercel deploy --prod` na koppeling met Vercel (of via GitHub → Vercel import)

## Deep links

`vercel.json` stuurt alle routes (inclusief `/scan`) naar `index.html`, zodat React Router direct op `/scan` werkt.

## Referentie

Het HTML-prototype: [`public/pasvorm-prototype.html`](public/pasvorm-prototype.html)
