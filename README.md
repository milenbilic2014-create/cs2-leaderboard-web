# CS2 Leaderboard — React (Create React App)

React verzija existing leaderboard stranice iz `server.js`. Dizajn je 1:1 prenet
(Teko / Bai Jamjuree, tamna CS2 pozadina, zlatna/srebrna/bronzana rank značka,
animacije `+1.5` / `-1.0` i flash reda), a podaci se čitaju direktno iz
**Cloudflare D1** preko worker-a.

## Podaci

Podrazumevano se čita:

```
GET https://cs2-leaderboard.milenbilic2014.workers.dev/state
```

Odgovor ima isti oblik kao lokalni `/api/state`:

```json
{
  "players": {
    "7656119...": { "steamid": "...", "name": "...", "avatar": "...", "kills": 360, "deaths": 132, "wins": 12 }
  },
  "ranking": "points"
}
```

Bodovi se računaju kao u serveru: `kills * 1.5 - deaths * 1.0 + wins * 3.0`.
Worker već vraća `Access-Control-Allow-Origin: *`, pa browser može direktno da ga čita.

## Pokretanje

```bash
npm install
npm start          # http://localhost:3000
```

Ako je lokalni `server.js` već na portu 3000, React dev server će pitati da
koristi drugi port (npr. 3001) — to je u redu.

### Prebacivanje na lokalni server umesto D1

U `.env`:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_STATE_PATH=/api/state
REACT_APP_POLL_MS=3000
```

## Build

```bash
npm run build      # rezultat u build/
```

## Deploy na Vercel

**Varijanta 1 — iz ovog foldera:**

```bash
npx vercel        # prvi put: login + setup
npx vercel --prod
```

**Varijanta 2 — iz korena repo-a (`backend/`):**
u Vercel dashboard-u za projekat postavi **Root Directory** na `web`. Vercel
automatski prepoznaje CRA (`npm run build`, output `build`), a `vercel.json`
to još eksplicitno potvrđuje.

Ako želiš da menjaš API adresu bez rebuild-a, možeš je dodati i kao Vercel
Environment Variable (`REACT_APP_API_URL`) — CRA env promenljive se ubacuju u
build, pa je potreban redeploy posle izmene.

## TV režim

Na ekranima širine 900px i više (landscape) raspored se automatski prilagođava
televizoru: **20 redova staje na jedan ekran bez skrolovanja**, header je
kompaktan (CS2 i LEADERBOARD u istom redu), a sve veličine se skaliraju sa
visinom ekrana (1080p, 4K, browser sa trakama). Ako ima više od 20 igrača,
strane se same smenjuju svakih 12 sekundi, a trenutna strana piše u status liniji.

## Struktura

```
src/
  index.js                     ulaz (createRoot)
  App.js                       header + tabela + status linija
  App.css                      ceo dizajn (prenet iz server.js)
  index.css                    pozadina, reset, fontovi
  components/
    LeaderboardTable.js        tabela, rank značke, redovi, delta animacija
  hooks/
    useLeaderboard.js          polling, sortiranje, računanje delta
    useTvMode.js               detekcija TV/velikog ekrana (matchMedia)
  lib/
    api.js                     URL-ovi i fetch
    score.js                   bodovi i sortiranje
```

## Napomena

Create React App (`react-scripts`) više nije aktivno održavan. Ovaj projekat
radi kako je traženo, ali ako ga dalje razvijaš, Vite je preporučena zamena
(ista struktura, samo drugačiji `index.html`/build).
