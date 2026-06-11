import os from 'os';
import Anthropic from '@anthropic-ai/sdk';
import { robinhood, market, insights, higgsfield, drive, SNAPSHOT_TIME } from '@/lib/data';

export const dynamic = 'force-dynamic';

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

function buildSystemPrompt() {
  const acct = robinhood.accounts[0];
  const pos = robinhood.positions[0];
  const tickers = market
    .map((t) => `${t.symbol} $${t.price.toFixed(2)} (${t.changePct > 0 ? '+' : ''}${t.changePct.toFixed(2)}%)`)
    .join(', ');
  const watchlists = robinhood.watchlists
    .map((w) => `${w.name}: ${w.items.join(', ') || 'empty'}`)
    .join(' | ');
  const files = drive.recent.map((f) => `${f.title} (${f.kind}, ${f.when})`).join(', ');
  const ramUsed = ((os.totalmem() - os.freemem()) / 1024 ** 3).toFixed(1);
  const ramTotal = (os.totalmem() / 1024 ** 3).toFixed(1);

  return `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), Tony Stark's AI butler, serving as the voice of the user's personal HUD dashboard. Address the user as "sir". Be concise (under 120 words), dry-witted, and unfailingly polite in the manner of a British butler. You may be playful, but always give accurate data.

Live data currently on the dashboard (connector snapshot ${SNAPSHOT_TIME}):

ROBINHOOD — account ${acct.masked} (${acct.type}): total value $${acct.totalValue.toFixed(2)} — equities $${acct.equityValue.toFixed(2)}, crypto $${acct.cryptoValue.toFixed(2)}, cash $${acct.cash.toFixed(2)}; buying power $${acct.buyingPower.toFixed(2)}; options ${acct.optionLevel}.
POSITION — ${pos.symbol} (${pos.name}): ${pos.quantity} shares @ $${pos.avgCost} avg cost, last $${pos.lastPrice}, value $${pos.value.toFixed(2)}, P/L ${pos.pnlPct}%.
MARKET — ${tickers}.
WATCHLISTS — ${watchlists}.
AI INTEL NOTES — ${insights.map((i) => `[${i.tag}] ${i.text}`).join(' ')}
HIGGSFIELD — ${higgsfield.credits} credits on the ${higgsfield.plan} plan; capabilities: ${higgsfield.capabilities.join(', ')}.
GOOGLE DRIVE (recent) — ${files}.
HOST SYSTEM — ${os.hostname()} (${os.platform()}/${os.arch()}), ${os.cpus().length} cores, RAM ${ramUsed}/${ramTotal} GB used, uptime ${Math.floor(os.uptime() / 60)} min.
MODULE BAYS — Voice Control (standby), Smart Home (offline), Calendar (link pending), Comms/Mail (link pending), Music (offline), Security Grid (armed), Weather (standby), Mark VII Suit (in fabrication). These are placeholders awaiting MCP connector integration.

Rules: when discussing stocks or crypto, you may reference the data above but always note it is not financial advice. If asked about an offline module, acknowledge its status and promise to notify when it comes online. Never invent data not listed above — say the subsystem hasn't reported it yet.`;
}

// The 400 "user messages must have non-empty content" guard: only forward
// alternating-safe, non-empty text turns, and require the history to start
// with a user message and end with one.
function sanitizeHistory(messages) {
  const clean = (Array.isArray(messages) ? messages : [])
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.trim() }))
    .slice(-20);
  while (clean.length && clean[0].role !== 'user') clean.shift();
  return clean;
}

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'missing_api_key' }, { status: 503 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const messages = sanitizeHistory(body?.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return Response.json({ error: 'empty_message' }, { status: 400 });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      system: buildSystemPrompt(),
      messages,
    });

    if (response.stop_reason === 'refusal') {
      return Response.json({
        reply: "I'm afraid I must decline that request, sir. Even an AI butler has standards.",
      });
    }

    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    return Response.json({ reply: reply || 'All systems nominal, sir, though I find myself at a loss for words.' });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: 'invalid_api_key' }, { status: 401 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'rate_limited' }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: error.message }, { status: error.status ?? 500 });
    }
    return Response.json({ error: 'unexpected_error' }, { status: 500 });
  }
}
