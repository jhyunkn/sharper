const fs = require('fs');

fs.mkdirSync('dist', { recursive: true });
let h = fs.readFileSync('index.html', 'utf8');

// Keep the Self tab improvements, but leave the Library tab in its prior simpler format.
h = h.replace(/\.authors \.author-row\{[^}]*\}/, ".authors .author-row{display:grid;grid-template-columns:32px minmax(0,1fr) 100px;gap:18px;align-items:center;border-bottom:1px solid var(--ruleSoft);padding:20px 0;text-align:left}");
h = h.replace(/\.aname\{[^}]*\}/, ".aname{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:8px;font-family:var(--serif);font-style:italic;font-size:22px}");
h = h.replace(/\.count\{[^}]*\}/, ".count{justify-self:end;border:1px solid var(--ruleSoft);border-radius:999px;padding:7px 10px;white-space:nowrap;text-align:right;font-family:var(--mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--warm)}");
h = h.replace(/\.settings\{[^}]*\}/, ".settings{width:40px;height:40px;border:1px solid var(--ruleSoft);border-radius:50%;background:rgba(247,243,235,.35);font-family:var(--serif);font-size:22px;font-style:italic;line-height:1;color:rgba(26,23,20,.75)}");
h = h.replace('onclick="openSettings()">⚙</button>', 'onclick="openSettings()">✦</button>');
h = h.replace(/\.sheet h2\{[^}]*\}/, ".sheet h2{font-family:var(--sans);font-weight:500;font-style:normal;font-size:30px;letter-spacing:-.035em;margin:8px 0 0}");
h = h.replace(/\.sheet\.on\{display:block\}/, ".sheet.on{display:block}.sheet .section{margin-top:30px;padding-top:24px}");
h = h.replace(/\.field\{[^}]*\}/, ".field{display:block;border-bottom:1px solid var(--ruleSoft);padding-bottom:10px;margin-top:16px}");
h = h.replace(/\.btns\{[^}]*\}/, ".btns{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}");
h = h.replace(/\.pill\{[^}]*\}/, ".pill{border:1px solid var(--rule);border-radius:999px;padding:12px 14px;font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:.16em}");
h = h.replace('Default avatar uses the first letter of your nickname. Photo upload is disabled in beta to keep the account system simple.', 'Avatar uses your nickname initial. Photo upload is disabled in beta.');
h = h.replace('Sharper is currently in beta. This version records a real local streak and minute count on this device. The full version is coming soon with cloud sync, account history, permanent archive, and paid subscription options.', 'Sharper is in beta. This preview records local streak and minutes on this device. Full version coming soon with cloud sync, account history, archive, and subscription options.');

fs.writeFileSync('dist/index.html', h);
