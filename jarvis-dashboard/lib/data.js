// Live snapshot pulled from connected MCP connectors (Robinhood, Higgsfield,
// Google Drive) at build time. Refresh by re-running the connector pull.
export const SNAPSHOT_TIME = '2026-06-10T22:38:00Z';

export const robinhood = {
  accounts: [
    {
      masked: '••••8620',
      type: 'Individual · Margin',
      isDefault: true,
      totalValue: 13.54,
      equityValue: 9.6,
      cryptoValue: 0.21,
      cash: 3.72,
      buyingPower: 3.72,
      optionLevel: 'Level 3',
    },
    {
      masked: '••••2712',
      type: 'Cash · "Agentic"',
      isDefault: false,
      totalValue: 0,
      equityValue: 0,
      cryptoValue: 0,
      cash: 0,
      buyingPower: 0,
      optionLevel: '—',
    },
  ],
  positions: [
    {
      symbol: 'XOVR',
      name: 'ERShares Private-Public Crossover ETF',
      quantity: 0.489002,
      avgCost: 20.45,
      lastPrice: 19.55,
      value: 9.56,
      pnl: -0.44,
      pnlPct: -4.4,
    },
  ],
  watchlists: [
    {
      name: 'My First List',
      emoji: '⚡',
      items: ['TPG', 'SNAP', 'AAPL', 'TSLA', 'NFLX', 'META', 'MSFT', 'DIS', 'GPRO', 'SBUX', 'F', 'BABA', 'BAC', 'GE', 'BRK.B', 'BRK.A', 'AMZN', 'WMT'],
    },
    {
      name: 'Cryptos to Watch',
      emoji: '👾',
      items: ['TECL', 'QQQM', 'BTC-USD'],
    },
    { name: 'Options Watchlist', emoji: '💡', items: [] },
  ],
};

// Real-time quotes vs. prior close (after-hours, 2026-06-10)
export const market = [
  { symbol: 'SPY', price: 724.2, changePct: -1.74 },
  { symbol: 'QQQ', price: 691.33, changePct: -2.33 },
  { symbol: 'NVDA', price: 199.96, changePct: -3.95 },
  { symbol: 'AAPL', price: 291.44, changePct: 0.31 },
  { symbol: 'TSLA', price: 380.05, changePct: -4.19 },
  { symbol: 'MSFT', price: 397.67, changePct: -1.42 },
  { symbol: 'AMD', price: 444.78, changePct: -6.46 },
  { symbol: 'PLTR', price: 128.96, changePct: -2.36 },
  { symbol: 'GOOGL', price: 355.01, changePct: -2.54 },
  { symbol: 'AMZN', price: 237.01, changePct: -2.94 },
  { symbol: 'XOVR', price: 19.55, changePct: -1.61 },
];

// Heuristic ideas generated from live portfolio + watchlist + quote data.
// Demo output — not financial advice.
export const insights = [
  {
    tag: 'DIP WATCH',
    text: 'Broad risk-off session: NVDA -3.95%, AMD -6.46%, TSLA -4.19%. Both NVDA-adjacent names sit on your radar — semis are today’s deepest discount.',
  },
  {
    tag: 'LONE GREEN',
    text: 'AAPL (+0.31%) is the only green ticker on the board and it’s already in ⚡ My First List. Relative strength on a red day is worth tracking.',
  },
  {
    tag: 'CRYPTO',
    text: 'BTC-USD is on your 👾 Cryptos to Watch list alongside leveraged-tech TECL and QQQM. Equity drawdowns historically spill into crypto with a lag.',
  },
  {
    tag: 'POSITION',
    text: 'XOVR is -4.4% against your $20.45 cost basis. Buying power available: $3.72 — sir, I recommend a deposit before attempting heroics.',
  },
];

export const higgsfield = {
  plan: 'Free',
  credits: 10,
  capabilities: ['Image Gen', 'Video Gen', 'Upscale', 'Motion Control', 'Virality Predictor'],
};

export const drive = {
  recent: [
    { title: 'Untitled document', kind: 'Google Doc', when: 'May 22', shared: true },
    { title: '008_764091.pdf', kind: 'PDF · 237 KB', when: 'May 31', shared: false },
    { title: 'Untitled document.docx', kind: 'Word · 21 KB', when: 'May 22', shared: false },
    { title: 'DSC07689.jpeg', kind: 'Photo · 6.2 MB', when: 'Mar 30', shared: true },
    { title: 'Prom San', kind: 'Folder', when: 'Mar 30', shared: true },
    { title: 'DSC06217.jpeg', kind: 'Photo · 5.7 MB', when: 'Oct 21', shared: true },
  ],
};

// Modules wired for future MCP integrations — interactive placeholders.
export const placeholderModules = [
  { id: 'voice', label: 'Voice Control', icon: '🎙', status: 'STANDBY' },
  { id: 'home', label: 'Smart Home', icon: '🏠', status: 'OFFLINE' },
  { id: 'calendar', label: 'Calendar', icon: '📅', status: 'LINK PENDING' },
  { id: 'mail', label: 'Comms / Mail', icon: '📡', status: 'LINK PENDING' },
  { id: 'music', label: 'Music', icon: '🎵', status: 'OFFLINE' },
  { id: 'security', label: 'Security Grid', icon: '🛡', status: 'ARMED' },
  { id: 'weather', label: 'Weather', icon: '⛅', status: 'STANDBY' },
  { id: 'suit', label: 'Mark VII Suit', icon: '🤖', status: 'IN FABRICATION' },
];
