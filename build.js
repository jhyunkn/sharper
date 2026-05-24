const fs = require('fs');

fs.mkdirSync('dist', { recursive: true });
let h = fs.readFileSync('index.html', 'utf8');

// Self tab refinements.
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

// Library tab refinements.
h = h.replace(/\.search input\{[^}]*\}/, ".search input{width:100%;border:0;outline:0;background:transparent;font-family:var(--mono);font-size:10px!important;letter-spacing:.14em;text-transform:uppercase;color:var(--warm)}");
h = h.replace(/\.filters\{[^}]*\}/, ".filters{display:grid;grid-template-columns:repeat(4,1fr);column-gap:0;margin-top:24px;border-top:1px solid var(--ruleSoft);border-bottom:1px solid var(--ruleSoft);padding:12px 0 9px}");
h = h.replace(/\.filters button,\.saved-toggle\{[^}]*\}/, ".filters button,.saved-toggle{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:var(--warm)}.filters button{font-size:10px;letter-spacing:.14em;text-align:center;white-space:nowrap;color:rgba(26,23,20,.58);padding:0 0 6px;border-bottom:1px solid transparent;justify-self:center;min-width:0}");
h = h.replace(/\.saved-toggle\{[^}]*\}/, ".saved-toggle{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin:0;padding:7px 0 8px;font-size:10px!important;letter-spacing:.14em!important}");
h = h.replace('</style>', ".library-note{margin-top:24px;max-width:300px;font-family:var(--serif);font-style:italic;font-size:16px;line-height:1.5;color:var(--warm)}.filter-toggle{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--ruleSoft);border-radius:999px;overflow:hidden;margin-top:18px;height:34px}.filter-toggle .saved-toggle{border-radius:0}.filter-toggle .saved-toggle.on{background:rgba(164,80,47,.10);color:var(--earth)!important}.library .filters button,.library .saved-toggle{font-family:var(--mono)!important;font-size:10px!important;letter-spacing:.14em!important;text-transform:uppercase!important;line-height:1.2!important}.library .filters button.on{color:var(--earth)!important;border-bottom-color:var(--earth)}</style>");
h = h.replace("['leadership','Leadership','△']", "['leadership','Lead','△']");
h = h.replace("['communication','Communication','( )']", "['communication','Speak','( )']");
h = h.replace("<button id=\"savedToggle\" class=\"saved-toggle\">♡ Show saved</button><div id=\"paths\"", "<div class=\"filter-toggle\"><button id=\"showAll\" class=\"saved-toggle on\">Show all</button><button id=\"savedToggle\" class=\"saved-toggle\">Show saved</button></div><p class=\"library-note\">An accumulation of everyday specimen examination — the ideas you have inspected, saved, and returned to.</p><div id=\"paths\"");
h = h.replace(/\$\{p\.m\} min · 3 actions/g, "${p.m} min · ${domainName(p.d)}");
h = h.replace("$('savedToggle').onclick=()=>{state.savedOnly=!state.savedOnly;persist();renderLibrary()};", "$('showAll').onclick=()=>{state.savedOnly=false;state.filter='all';persist();renderLibrary()};$('savedToggle').onclick=()=>{state.savedOnly=true;persist();renderLibrary()};");
h = h.replace("$('savedToggle').innerHTML=state.savedOnly?'♥ Saved only':'♡ Show saved';", "$('savedToggle').innerHTML='Show saved';$('showAll').classList.toggle('on',!state.savedOnly&&state.filter==='all');$('savedToggle').classList.toggle('on',state.savedOnly);");
h = h.replace("domains.map(d=>`<button", "domains.filter(d=>d[0]!=='all').map(d=>`<button");

fs.writeFileSync('dist/index.html', h);
