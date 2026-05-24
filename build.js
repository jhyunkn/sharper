const fs = require('fs');

fs.mkdirSync('dist', { recursive: true });
let h = fs.readFileSync('index.html', 'utf8');

const readerTuning = String.raw`
/* Specimen card density tuning only */
.reader-head{padding:14px 24px!important;grid-template-columns:38px 1fr 38px!important}
.reader-title{font-size:9px!important;letter-spacing:.20em!important}
.reader-body{padding:30px 30px 118px!important}
.reader h1{font-size:34px!important;line-height:.98!important;margin:10px 0 0!important;letter-spacing:-.01em!important}
.reader h1.compact-title{font-size:29px!important;line-height:.96!important;max-width:300px!important}
.row-title.compact-title{font-size:27px!important;line-height:1!important}
.reader .lead{font-size:18px!important;line-height:1.46!important;margin:18px 0 0!important}
.rq{margin:30px 0!important;padding-left:18px!important;border-left-width:1.5px!important}
.rq blockquote{font-size:27px!important;line-height:1.12!important}
.rq .author{margin-top:22px!important;font-size:8px!important;letter-spacing:.14em!important;line-height:1.45!important}
.rq .author:before{width:24px!important}
.context-block{border-top:1px solid var(--soft);padding-top:18px;margin-top:22px;font-family:var(--serif);font-style:italic;font-size:17px;line-height:1.45;color:var(--warm)}
.reader-section{margin-top:26px!important;padding-top:24px!important}
.reader-section p{font-size:18px!important;line-height:1.46!important;margin:16px 0!important}
.orig-btn{margin-top:16px!important;font-size:8px!important;letter-spacing:.14em!important;padding-bottom:4px!important}
.orig-text{margin-top:14px!important;font-size:20px!important;line-height:1.35!important}
`;

const runtimePatch = String.raw`
<script>
(function(){
  var manage = (typeof path === 'function') ? path('manage-up') : null;
  if(manage){
    manage.q = 'Hans Castorp enters the sanatorium for a short visit and remains there far longer than planned.';
    manage.author = 'Thomas Mann · The Magic Mountain · 1924';
    manage.context = 'Historical context: Thomas Mann published The Magic Mountain in 1924; the novel follows the young engineer Hans Castorp in a high-altitude sanatorium in Davos, Switzerland, in the years before World War I, where his planned short visit becomes a prolonged stay shaped by illness, time, and ideological debate.';
    manage.read = ['Your manager needs fewer unknowns and clearer tradeoffs.','Most upward friction is a UX problem in disguise. Give your manager the decision, the constraint, and the risk.'];
  }
  renderLibrary = function(){
    let q=$('search').value.toLowerCase();
    $('filters').innerHTML=domains.map(d=>`<button type="button" class="${state.filter===d[0]?'on':''}" data-domain="${d[0]}">${d[1]}</button>`).join('');
    [...$('filters').querySelectorAll('button')].forEach(btn=>btn.onclick=()=>{state.filter=btn.dataset.domain;state.savedOnly=false;save();renderLibrary()});
    $('savedToggle').className='saved-toggle '+(state.savedOnly?'on':'');
    $('savedToggle').innerHTML=state.savedOnly?'♥ Saved only':'♡ Show saved';
    $('savedToggle').onclick=()=>{state.savedOnly=true;save();renderLibrary()};
    $('clearFilter').onclick=()=>{state.savedOnly=false;state.filter='all';$('search').value='';save();renderLibrary()};
    let arr=paths.filter(p=>(state.filter==='all'||p.d===state.filter)&&(!state.savedOnly||isSaved(p.id))&&(!q||[p.t,p.b,p.q,p.author,domainName(p.d)].join(' ').toLowerCase().includes(q)));
    $('paths').innerHTML=arr.map(p=>`<article class="row"><button class="heart" onclick="toggleSave('${p.id}')">${isSaved(p.id)?'♥':(domains.find(d=>d[0]===p.d)||[])[2]}</button><button onclick="openReader('${p.id}')" style="text-align:left;min-width:0"><div class="row-meta">${p.m} min · ${domainName(p.d)}</div><div class="row-title ${p.id==='manage-up'?'compact-title':''}">${p.t}</div><div class="row-blurb">${p.b}</div></button><button class="arrow" onclick="openReader('${p.id}')">→</button></article>`).join('');
  };
  openReader = function(id){
    window.current=id;
    let p=path(id);
    $('rmeta').textContent=domainName(p.d)+' · '+p.m+' min';
    $('rheart').textContent=isSaved(id)?'♥':'♡';
    $('readerBody').innerHTML=`<div class="kicker">Specimen</div><h1 class="${id==='manage-up'?'compact-title':''}">${p.t}</h1><p class="lead">${p.b}</p><div class="rq"><blockquote>"${p.q}"</blockquote><div class="author">${p.author}</div>${p.orig?`<button class="orig-btn" onclick="$('origText').classList.toggle('on')">Show original</button><div id="origText" class="orig-text">${p.orig}</div>`:''}</div>${p.context?`<div class="context-block">${p.context}</div>`:''}<div class="reader-section"><div class="kicker ink">Dive deeper</div>${p.read.map(x=>'<p>'+x+'</p>').join('')}</div>`;
    $('reader').classList.add('on');
  };
  renderLibrary();
})();
</script>
`;

h = h.replace('</style>', readerTuning + '</style>');
h = h.replace('</body>', runtimePatch + '</body>');
fs.writeFileSync('dist/index.html', h);
