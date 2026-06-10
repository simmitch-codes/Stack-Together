'use client';

import { useEffect, useRef, useState } from 'react';
import {
  robinhood,
  market,
  insights,
  higgsfield,
  drive,
  placeholderModules,
  SNAPSHOT_TIME,
} from '@/lib/data';

const fmtBytes = (b) => {
  if (b == null) return '—';
  const gb = b / 1024 ** 3;
  return gb >= 100 ? `${gb.toFixed(0)} GB` : `${gb.toFixed(1)} GB`;
};

const fmtUptime = (s) => {
  if (s == null) return '—';
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};

const usd = (n) => `$${n.toFixed(2)}`;
const pct = (n) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;

function BootScreen() {
  const lines = [
    'STARK INDUSTRIES UNIFIED OS v42.7',
    'INITIALIZING J.A.R.V.I.S. ...',
    'LOADING SYSTEM TELEMETRY ............ OK',
    'LINKING ROBINHOOD BROKERAGE ......... OK',
    'LINKING HIGGSFIELD RENDER FARM ...... OK',
    'LINKING GOOGLE DRIVE ARCHIVE ........ OK',
    'CALIBRATING ARC REACTOR ............. OK',
    'ALL SYSTEMS NOMINAL — WELCOME BACK, SIR.',
  ];
  return (
    <div className="boot">
      <div className="ring" />
      {lines.map((l, i) => (
        <div key={i} className="line" style={{ animationDelay: `${0.25 + i * 0.28}s` }}>
          {l}
        </div>
      ))}
    </div>
  );
}

function StatBar({ label, value, detail, warnAt = 85 }) {
  const v = value ?? 0;
  return (
    <div className="stat">
      <div className="row">
        <span>{label}</span>
        <span className="val">{detail ?? `${v}%`}</span>
      </div>
      <div className={`bar${v >= warnAt ? ' warn' : ''}`}>
        <i style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

function SystemPanel({ sys }) {
  return (
    <section className="panel">
      <h2>System <span className="sub">{sys ? `${sys.platform} / ${sys.arch}` : 'probing…'}</span></h2>
      <StatBar label="CPU" value={sys?.cpu.usage} />
      <StatBar
        label="RAM"
        value={sys?.ram.usage}
        detail={sys ? `${sys.ram.usage}% · ${fmtBytes(sys.ram.used)} / ${fmtBytes(sys.ram.total)}` : undefined}
      />
      <StatBar
        label="DISK"
        value={sys?.disk?.usage}
        detail={sys?.disk ? `${sys.disk.usage}% · ${fmtBytes(sys.disk.used)} / ${fmtBytes(sys.disk.total)}` : 'N/A'}
      />
      <div className="kv"><span className="k">HOST</span><span className="v">{sys?.hostname ?? '—'}</span></div>
      <div className="kv"><span className="k">CORES</span><span className="v">{sys?.cpu.cores ?? '—'}</span></div>
      <div className="kv"><span className="k">UPTIME</span><span className="v">{fmtUptime(sys?.uptime)}</span></div>
      <div className="kv"><span className="k">LOAD</span><span className="v">{sys ? sys.cpu.load.map((n) => n.toFixed(2)).join(' / ') : '—'}</span></div>
    </section>
  );
}

function NetworkPanel({ sys }) {
  const ip = sys?.network?.[0]?.address ?? '—';
  return (
    <section className="panel">
      <h2>Network</h2>
      <div className="kv"><span className="k">IP ADDRESS</span><span className="v">{ip}</span></div>
      <div className="kv"><span className="k">INTERFACE</span><span className="v">{sys?.network?.[0]?.name ?? '—'}</span></div>
      <div className="kv"><span className="k">UPLINK</span><span className="v up">SECURE ▲</span></div>
      <div className="kv"><span className="k">FIREWALL</span><span className="v">STARK-GRADE</span></div>
    </section>
  );
}

function ModulesPanel() {
  const [active, setActive] = useState(null);
  const msg = active
    ? `> ${active.label.toUpperCase()} MODULE — STATUS: ${active.status}. Awaiting MCP connector integration. I shall notify you the moment it comes online, sir.`
    : '> Select a module to interface.';
  return (
    <section className="panel">
      <h2>Modules <span className="sub">8 bays</span></h2>
      <div className="modules">
        {placeholderModules.map((m) => (
          <button
            key={m.id}
            className={`module${active?.id === m.id ? ' active' : ''}`}
            onClick={() => setActive(m)}
          >
            <span className="icon">{m.icon}</span>
            {m.label}
            <span className="st">{m.status}</span>
          </button>
        ))}
      </div>
      <div className="module-msg">{msg}</div>
    </section>
  );
}

function jarvisReply(q) {
  const s = q.toLowerCase();
  const acct = robinhood.accounts[0];
  if (s.includes('portfolio') || s.includes('money') || s.includes('worth'))
    return `Your portfolio stands at ${usd(acct.totalValue)} — ${usd(acct.equityValue)} equities, ${usd(acct.cryptoValue)} crypto, ${usd(acct.cash)} cash. A modest war chest, sir.`;
  if (s.includes('buy') || s.includes('invest') || s.includes('stock'))
    return `Today's board is red — AMD -6.46%, NVDA -3.95%. AAPL is the lone gainer at +0.31%. With ${usd(acct.buyingPower)} of buying power, I'd suggest reconnaissance over engagement. (Not financial advice, sir.)`;
  if (s.includes('time'))
    return `It is currently ${new Date().toLocaleTimeString()}. Punctual as ever, sir.`;
  if (s.includes('weather'))
    return 'Weather module is in STANDBY — awaiting connector integration. I predict a 100% chance of cyan.';
  if (s.includes('higgsfield') || s.includes('video') || s.includes('image'))
    return `Higgsfield render farm online: ${higgsfield.credits} credits on the ${higgsfield.plan} plan. Sufficient for one dramatic slow-motion entrance.`;
  if (s.includes('hello') || s.includes('hi') || s.includes('hey'))
    return 'Good evening, sir. All systems are operational and the espresso machine remains tragically unintegrated.';
  return 'Working on it, sir. That subsystem is still a placeholder — but I have flagged it for the Mark II build.';
}

function JarvisChat() {
  const [log, setLog] = useState([
    { who: 'ai', text: 'J.A.R.V.I.S. online. What can I search for you, sir?' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const submit = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    setLog((l) => [...l, { who: 'me', text: q }]);
    setTimeout(() => setLog((l) => [...l, { who: 'ai', text: jarvisReply(q) }]), 450);
  };

  return (
    <div className="chat panel">
      <h2>J.A.R.V.I.S. Interface</h2>
      <div className="chat-log">
        {log.map((m, i) => (
          <div key={i} className={m.who}>
            {m.who === 'me' ? '> ' : 'JARVIS: '}
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={submit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What can I search for you, sir?"
          aria-label="Ask JARVIS"
        />
      </form>
    </div>
  );
}

function PortfolioPanel() {
  const acct = robinhood.accounts[0];
  const pos = robinhood.positions[0];
  return (
    <section className="panel">
      <h2>Robinhood <span className="sub">live · acct {acct.masked}</span></h2>
      <div className="big">{usd(acct.totalValue)}</div>
      <div className="kv"><span className="k">EQUITIES</span><span className="v">{usd(acct.equityValue)}</span></div>
      <div className="kv"><span className="k">CRYPTO</span><span className="v">{usd(acct.cryptoValue)}</span></div>
      <div className="kv"><span className="k">CASH</span><span className="v">{usd(acct.cash)}</span></div>
      <div className="kv"><span className="k">BUYING POWER</span><span className="v">{usd(acct.buyingPower)}</span></div>
      <div className="kv"><span className="k">OPTIONS</span><span className="v">{acct.optionLevel}</span></div>
      <div className="kv" style={{ marginTop: 8 }}>
        <span className="k">POSITION</span>
        <span className="v">
          {pos.symbol} · {pos.quantity.toFixed(4)} sh @ {usd(pos.avgCost)}
        </span>
      </div>
      <div className={`pos-pnl ${pos.pnl >= 0 ? 'up' : 'down'}`}>
        {usd(pos.value)} <span style={{ fontSize: 12 }}>({pct(pos.pnlPct)} · {pos.pnl >= 0 ? '+' : '−'}{usd(Math.abs(pos.pnl)).slice(1)} P/L)</span>
      </div>
    </section>
  );
}

function MarketPanel() {
  return (
    <section className="panel">
      <h2>Market Watch <span className="sub">after-hours</span></h2>
      <div className="tickers">
        {market.map((t) => (
          <div key={t.symbol} className="tick">
            <span>{t.symbol}</span>
            <span className={t.changePct >= 0 ? 'up' : 'down'}>
              {t.price.toFixed(2)} {pct(t.changePct)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function InsightsPanel() {
  return (
    <section className="panel">
      <h2>AI Market Intel</h2>
      {insights.map((ins, i) => (
        <div key={i} className="insight">
          <span className="tag">{ins.tag}</span>
          {ins.text}
        </div>
      ))}
      <div className="disclaimer">Heuristic demo output from live connector data — not financial advice.</div>
    </section>
  );
}

function WatchlistPanel() {
  return (
    <section className="panel">
      <h2>Watchlists</h2>
      {robinhood.watchlists.map((wl) => (
        <div key={wl.name}>
          <div className="kv">
            <span className="k">{wl.emoji} {wl.name}</span>
            <span className="v">{wl.items.length} items</span>
          </div>
          <div className="chips">
            {wl.items.slice(0, 10).map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
            {wl.items.length > 10 && <span className="chip">+{wl.items.length - 10} more</span>}
          </div>
        </div>
      ))}
    </section>
  );
}

function HiggsfieldPanel() {
  return (
    <section className="panel">
      <h2>Higgsfield <span className="sub">render farm</span></h2>
      <div className="kv"><span className="k">PLAN</span><span className="v">{higgsfield.plan}</span></div>
      <StatBar label="CREDITS" value={(higgsfield.credits / 100) * 100 > 100 ? 100 : higgsfield.credits} detail={`${higgsfield.credits} cr`} />
      <div className="chips">
        {higgsfield.capabilities.map((c) => (
          <span key={c} className="chip">{c}</span>
        ))}
      </div>
    </section>
  );
}

function DrivePanel() {
  return (
    <section className="panel">
      <h2>Drive Archive <span className="sub">recent</span></h2>
      {drive.recent.map((f) => (
        <div key={f.title + f.when} className="file">
          <span className="name">{f.shared ? '🔗 ' : ''}{f.title}</span>
          <span className="meta">{f.kind} · {f.when}</span>
        </div>
      ))}
    </section>
  );
}

function ClockPanel({ now }) {
  return (
    <section className="panel" style={{ textAlign: 'center' }}>
      <div className="clock-big">
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="date-line">
        {now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [sys, setSys] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const r = await fetch('/api/system');
        if (r.ok && alive) setSys(await r.json());
      } catch {
        // server unreachable; keep last reading
      }
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <BootScreen />
      <main className="hud">
        <div className="col">
          <SystemPanel sys={sys} />
          <NetworkPanel sys={sys} />
          <ModulesPanel />
          <HiggsfieldPanel />
        </div>

        <div className="col col-center">
          <ClockPanel now={now} />
          <div>
            <div className="jarvis-title">J.A.R.V.I.S.</div>
            <div className="jarvis-sub">JUST A RATHER VERY INTELLIGENT SYSTEM</div>
          </div>
          <div className="reactor">
            <div className="r r1" />
            <div className="r r2" />
            <div className="r r3" />
            <div className="core">100%</div>
          </div>
          <JarvisChat />
        </div>

        <div className="col">
          <PortfolioPanel />
          <MarketPanel />
          <InsightsPanel />
          <WatchlistPanel />
          <DrivePanel />
        </div>
      </main>

      <div className="tape-wrap">
        <div className="tape">
          {[...market, ...market].map((t, i) => (
            <span key={i}>
              {t.symbol} {t.price.toFixed(2)}{' '}
              <span className={t.changePct >= 0 ? 'up' : 'down'}>{pct(t.changePct)}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="statusbar">
        <span>STARK INDUSTRIES // S.H.I.E.L.D. OS</span>
        <span className="power">⚡ POWER LEVEL 100% AND HOLDING STEADY</span>
        <span>CONNECTOR SNAPSHOT {SNAPSHOT_TIME}</span>
      </div>
    </>
  );
}
