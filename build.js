const fs = require('fs');
fs.mkdirSync('dist', { recursive: true });
let h = fs.readFileSync('index.html', 'utf8');

// Core style refinements requested in the latest review.
h = h.replace(/\.search input\{[^}]*\}/, ".search input{width:100%;border:0;outline:0;background:transparent;font-family:var(--serif);font-style:italic;font-size:17px!important;line-height:1.35;letter-spacing:0;text-transform:none;color:var(--ink)}.search input::placeholder{color:var(--warm)}");
h = h.replace(/\.authors \.author-row\{[^}]*\}/, ".authors .author-row{display:grid;grid-template-columns:32px minmax(0,1fr) 100px;gap:18px;align-items:center;border-bottom:1px solid var(--ruleSoft);padding:20px 0;text-align:left}");
h = h.replace(/\.aname\{[^}]*\}/, ".aname{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:8px;font-family:var(--serif);font-style:italic;font-size:22px}");
h = h.replace(/\.count\{[^}]*\}/, ".count{justify-self:end;border:1px solid var(--ruleSoft);border-radius:999px;padding:7px 10px;white-space:nowrap;text-align:right;font-family:var(--mono);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--warm)}");
h = h.replace(/\.settings\{[^}]*\}/, ".settings{width:40px;height:40px;border:1px solid var(--ruleSoft);border-radius:50%;background:rgba(247,243,235,.35);font-family:var(--serif);font-size:22px;font-style:italic;line-height:1;color:rgba(26,23,20,.75)}");
h = h.replace(/\.sheet h2\{[^}]*\}/, ".sheet h2{font-family:var(--sans);font-weight:500;font-style:normal;font-size:30px;letter-spacing:-.035em;margin:8px 0 0}");
h = h.replace(/\.sheet\.on\{display:block\}/, ".sheet.on{display:block}.sheet .section{margin-top:30px;padding-top:24px}");
h = h.replace(/\.field\{[^}]*\}/, ".field{display:block;border-bottom:1px solid var(--ruleSoft);padding-bottom:10px;margin-top:16px}");
h = h.replace(/\.btns\{[^}]*\}/, ".btns{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}");
h = h.replace(/\.pill\{[^}]*\}/, ".pill{border:1px solid var(--rule);border-radius:999px;padding:12px 14px;font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:.16em}");
h = h.replace(/\.today-page\{[^}]*\}/, ".today-page{min-height:720px;scroll-snap-align:start;display:flex;flex-direction:column;justify-content:center;padding:48px 36px 84px}");
h = h.replace(/\.quote\{[^}]*\}/, ".quote{font-family:var(--serif);font-size:29px;line-height:1.12;margin-top:24px}");
h = h.replace(/\.quote-mark\{[^}]*\}/, ".quote-mark{font-family:var(--serif);font-size:70px;line-height:.34;color:var(--earth);margin-top:34px}");
h = h.replace(/\.author\{[^}]*\}/, ".author{display:flex;gap:12px;align-items:center;margin-top:26px;font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase}");
h = h.replace(/\.blurb\{[^}]*\}/, ".blurb{font-family:var(--serif);font-style:italic;font-size:17px;line-height:1.45;color:var(--warm);margin-top:30px;max-width:305px}");
h = h.replace(/\.paths\{[^}]*\}/, ".paths{margin-top:28px;display:grid;gap:14px}");
h = h.replace(/\.row\{[^}]*\}/, ".row{display:grid;grid-template-columns:1fr 36px;gap:14px;border:1px solid var(--ruleSoft);border-radius:18px;background:rgba(247,243,235,.38);padding:17px 16px;text-align:left;box-shadow:0 12px 34px rgba(26,23,20,.035)}");
h = h.replace(/\.row-meta\{[^}]*\}/, ".row-meta{font-family:var(--mono);font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--warm)}");
h = h.replace(/\.row-blurb\{[^}]*\}/, ".row-blurb{font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.45;color:var(--warm);margin-top:8px}");
h = h.replace('</style>', ".today-card{margin:auto 0;border:1px solid var(--ruleSoft);border-radius:22px;background:rgba(247,243,235,.36);padding:28px 24px;box-shadow:0 18px 44px rgba(26,23,20,.045)}.row-open{grid-column:1/3;display:flex;justify-content:space-between;border-top:1px solid var(--ruleSoft);padding-top:12px;margin-top:2px;font-family:var(--mono);font-size:8.5px;text-transform:uppercase;letter-spacing:.18em;color:var(--warm)}.lib-title{margin-top:28px;font-family:var(--serif);font-style:italic;font-weight:400;font-size:43px;line-height:.92;letter-spacing:-.02em}.lib-intro{margin-top:18px;max-width:300px;font-family:var(--serif);font-style:italic;font-size:17px;line-height:1.45;color:var(--warm)}</style>");

// HTML text and control refinements.
h = h.replace('onclick="openSettings()">⚙</button>', 'onclick="openSettings()">✦</button>');
h = h.replace('<div class="kicker ink">Four domains, one mind</div><div class="rule"></div></div><label class="search">', '<div class="kicker ink">Library</div><div class="rule"></div></div><h1 class="lib-title">A cabinet of saved wisdom.</h1><p class="lib-intro">Search, filter, and return to the ideas you chose to keep.</p><label class="search">');
h = h.replace('</label><div id="filters" class="filters"></div>', '</label><button id="authorClear" style="display:none" class="saved-toggle on"></button><div id="filters" class="filters"></div>');
h = h.replace('Default avatar uses the first letter of your nickname. Photo upload is disabled in beta to keep the account system simple.', 'Avatar uses your nickname initial. Photo upload is disabled in beta.');
h = h.replace('Sharper is currently in beta. This version records a real local streak and minute count on this device. The full version is coming soon with cloud sync, account history, permanent archive, and paid subscription options.', 'Sharper is in beta. This preview records local streak and minutes on this device. Full version coming soon with cloud sync, account history, archive, and subscription options.');

// JS behavior refinements: author drilldown, library filter, card wrapping.
h = h.replace("return`<section class='today-page'><div style='display:flex;justify-content:space-between'><div class='kicker'>${domainName(p.d)} · ${p.m} min</div><button onclick='toggleTodayHeart(\\\"${p.id}\\\")' style='color:var(--earth);font-size:24px'>${heart?'♥':'♡'}</button></div><div class='quote-mark'>“</div><blockquote class='quote'>${p.q}</blockquote><div class='author'>${p.author}</div><p class='blurb'>${p.b}</p></section>`", "return`<section class='today-page'><article class='today-card'><div style='display:flex;justify-content:space-between;align-items:center'><div class='kicker'>${domainName(p.d)} · ${p.m} min</div><button onclick='toggleTodayHeart(\\\"${p.id}\\\")' style='color:var(--earth);font-size:24px'>${heart?'♥':'♡'}</button></div><div class='quote-mark'>“</div><blockquote class='quote'>${p.q}</blockquote><div class='author'>${p.author}</div><p class='blurb'>${p.b}</p></article></section>`");
h = h.replace("let q=$('search').value.toLowerCase();", "let input=$('search');if(state.authorFilter){state.savedOnly=true;input.value=state.authorFilter;$('authorClear').style.display='inline-flex';$('authorClear').innerHTML='Showing saved by '+state.authorFilter+' · clear';$('authorClear').onclick=()=>{state.authorFilter=null;input.value='';persist();renderLibrary()}}else{$('authorClear').style.display='none'}let q=input.value.toLowerCase();");
h = h.replace("$('authors').innerHTML=rows.map((r,i)=>`<button class='author-row'><span class='idx'>0${i+1}</span><span class='aname'>${r[0]}</span><span class='count'>${r[1]} saved →</span></button>`).join('')", "$('authors').innerHTML=rows.map((r,i)=>`<button class='author-row' onclick='showAuthor(\\\"${r[0]}\\\")'><span class='idx'>0${i+1}</span><span class='aname'>${r[0]}</span><span class='count'>${r[1]} saved →</span></button>`).join('')");
h = h.replace("function openReader(id){", "function showAuthor(a){state.authorFilter=a;state.tab='library';persist();tab('library');renderLibrary()}function openReader(id){");
h = h.replace("$('search').oninput=renderLibrary;", "$('search').oninput=()=>{state.authorFilter=null;renderLibrary()};");

fs.writeFileSync('dist/index.html', h);
