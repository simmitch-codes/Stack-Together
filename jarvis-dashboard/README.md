# J.A.R.V.I.S. Dashboard

An Iron Man–style HUD built with Next.js (App Router). One screen, everything that matters:

- **Live system telemetry** — CPU, RAM, disk, uptime, load, and network interface read from the machine running the server (`/api/system`, polled every 2 s via Node's `os` / `fs.statfs`).
- **Robinhood** — portfolio value, asset breakdown, buying power, XOVR position P/L, watchlists, and live market quotes (snapshot pulled through the Robinhood MCP connector).
- **Higgsfield** — plan + render credits via the Higgsfield MCP connector.
- **Google Drive** — recent files via the Drive MCP connector.
- **AI Market Intel** — heuristic ideas generated from the live portfolio/watchlist/quote data (demo output, not financial advice).
- **JARVIS chat** — interactive command line that answers questions about your portfolio, the market, the time, and more.
- **Module bays** — interactive placeholders (Voice, Smart Home, Calendar, Comms, Music, Security, Weather, Mark VII Suit) ready to be wired to future MCP connectors.

## Run it

```bash
cd jarvis-dashboard
npm install
npm run dev
```

Open http://localhost:3000 and enjoy the boot sequence.

## Refreshing connector data

The MCP snapshot lives in `lib/data.js` (timestamped via `SNAPSHOT_TIME`). Re-pull from the connectors and update that file — or wire the panels to live API routes as a next step.
