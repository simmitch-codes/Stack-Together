# J.A.R.V.I.S. Dashboard

An Iron Man–style HUD built with Next.js (App Router). One screen, everything that matters:

- **Live system telemetry** — CPU, RAM, disk, uptime, load, and network interface read from the machine running the server (`/api/system`, polled every 2 s via Node's `os` / `fs.statfs`).
- **Robinhood** — portfolio value, asset breakdown, buying power, XOVR position P/L, watchlists, and live market quotes (snapshot pulled through the Robinhood MCP connector).
- **Higgsfield** — plan + render credits via the Higgsfield MCP connector.
- **Google Drive** — recent files via the Drive MCP connector.
- **AI Market Intel** — heuristic ideas generated from the live portfolio/watchlist/quote data (demo output, not financial advice).
- **JARVIS chat** — a real AI butler powered by Claude (`claude-opus-4-8`) via `/api/jarvis`, with the dashboard's live data in its system prompt. Falls back to canned in-character replies when no API key is configured.
- **Module bays** — interactive placeholders (Voice, Smart Home, Calendar, Comms, Music, Security, Weather, Mark VII Suit) ready to be wired to future MCP connectors.

## Run it

```bash
cd jarvis-dashboard
npm install
npm run dev
```

Open http://localhost:3000 and enjoy the boot sequence.

### Enable the live AI chat

Create `jarvis-dashboard/.env.local` with your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Restart the dev server and the JARVIS chat answers with real intelligence — it knows your portfolio, the market board, your watchlists, Higgsfield credits, Drive files, and the host machine's vitals. Without a key, the chat stays in offline mode with scripted replies. The `/api/jarvis` route sanitizes the conversation history before every call (drops empty turns, enforces a leading user message) so malformed histories can never trigger `400 user messages must have non-empty content`.

## Refreshing connector data

The MCP snapshot lives in `lib/data.js` (timestamped via `SNAPSHOT_TIME`). Re-pull from the connectors and update that file — or wire the panels to live API routes as a next step.
