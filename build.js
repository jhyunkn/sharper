const fs = require('fs');

fs.mkdirSync('dist', { recursive: true });
let h = fs.readFileSync('index.html', 'utf8');

const css = String.raw`
html,body,#app,.screen,.tab,.library{max-width:100%!important;overflow-x:hidden!important;touch-action:pan-y!important}
*{box-sizing:border-box!important}
.top-progress{position:sticky!important;top:40px!important;z-index:20!important;margin:0 28px!important;border:1px solid var(--ruleSoft)!important;border-radius:999px!important;background:rgba(239,234,224,.86)!important;backdrop-filter:blur(14px)!important;padding:12px 20px!important}
.snap{height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;scroll-snap-type:y proximity!important;-webkit-overflow-scrolling:touch!important;scroll-behavior:smooth!important;overscroll-behavior-y:contain!important;touch-action:pan-y!important}
.lib-head{display:none!important}
.library{padding-top:calc(32px + env(safe-area-inset-top))!important}
.library .search{margin-top:0!important;max-width:100%!important;overflow:hidden!important}
.library .search input{width:100%!important;border:0!important;outline:0!important;background:transparent!important;font-family:var(--mono)!important;font-size:10px!important;letter-spacing:.14em!important;text-transform:uppercase!important;color:var(--warm)!important}
.library .filters{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;align-items:end!important;justify-content:stretch!important;gap:6px!important;width:100%!important;max-width:100%!important;margin-top:20px!important;border-top:1px solid var(--ruleSoft)!important;border-bottom:1px solid var(--ruleSoft)!important;padding:12px 0 8px!important;overflow:hidden!important;text-align:left!important}
.library .filters button{min-width:0!important;width:100%!important;max-width:100%!important;display:block!important;font-family:var(--mono)!important;font-size:8px!important;letter-spacing:.08em!important;text-transform:uppercase!important;text-align:left!important;white-space:normal!important;line-height:1.15!important;color:rgba(26,23,20,.58)!important;padding:0 0 5px!important;border-bottom:1px solid transparent!important;overflow-wrap:anywhere!important}
.library .filters button.on{color:var(--earth)!important;border-bottom-color:var(--earth)!important}
.filter-actions{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:24px!important;margin-top:8px!important;text-align:left!important;max-width:100%!important;overflow:hidden!important}
.saved-toggle{display:inline-flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;margin:0!important;padding:0 0 5px!important;font-family:var(--mono)!important;font-size:9px!important;letter-spacing:.11em!important;text-transform:uppercase!important;color:rgba(26,23,20,.58)!important;border-bottom:1px solid transparent!important;text-align:left!important}
.filter-actions .saved-toggle.on{color:var(--earth)!important;border-bottom-color:var(--earth)!important}
.library-note{margin-top:18px!important;max-width:310px!important;font-family:var(--serif)!important;font-style:italic!important;font-size:16px!important;line-height:1.45!important;color:var(--warm)!important}
#paths,.row,.row>*{max-width:100%!important;overflow-x:hidden!important}
.row{grid-template-columns:28px minmax(0,1fr) 24px!important}
.row-title,.row-blurb,.row-meta{min-width:0!important;overflow-wrap:anywhere!important}
.reader-section:first-of-type{padding-bottom:36px!important}
.reader-section:first-of-type p{font-size:22px!important;line-height:1.62!important;margin:22px 0!important}
.orig-btn{margin-top:22px!important;border-bottom:1px solid var(--earth)!important;font-family:var(--mono)!important;font-size:9px!important;text-transform:uppercase!important;letter-spacing:.16em!important;color:var(--earth)!important;padding-bottom:5px!important}
.orig-text{display:none!important;margin-top:18px!important;font-family:var(--serif)!important;font-size:22px!important;line-height:1.45!important;color:var(--ink)!important}
.orig-text.on{display:block!important}
.authors .author-row{cursor:pointer!important}
`;
h = h.replace('</style>', css + '</style>');

const runtime = String.raw`
<script>
(function(){
  var $ = function(id){ return document.getElementById(id); };
  function setDomain(id,label){ var d = domains.find(function(x){return x[0]===id}); if(d) d[1]=label; }
  setDomain('leadership','Leadership');
  setDomain('communication','Communicate');

  var extras = [
    {id:'decision-right-size',d:'leadership',t:'Right-Size the Decision',b:'Not every choice deserves the same amount of weight.',m:4,q:'The essence of strategy is choosing what not to do.',author:'Michael Porter',read:['A leader protects attention by sizing decisions correctly.','Classify the decision before solving it: reversible, irreversible, high-signal, or noise. Spend effort in proportion to consequence.']},
    {id:'say-the-frame',d:'communication',t:'Say the Frame',b:'Before persuading, name the shape of the conversation.',m:3,q:'If you wish to converse with me, define your terms.',author:'Voltaire',read:['A frame tells people how to listen.','When a conversation feels scattered, pause and name the frame: are we deciding, diagnosing, aligning, or generating options?']},
    {id:'reward-prediction',d:'psychology',t:'Reward Prediction Error',b:'Motivation spikes when reality beats expectation.',m:5,q:'The brain is a prediction machine.',author:'Andy Clark',read:['Dopamine is less about pleasure than update.','Create a small positive surprise after the hard action. The brain returns to loops that feel slightly better than expected.']},
    {id:'attention-design',d:'psychology',t:'Design the Attention Field',b:'Your environment decides what becomes effortless.',m:4,q:'Attention is the beginning of devotion.',author:'Mary Oliver',read:['Attention is not only discipline. It is placement.','Remove one competing cue and place one deliberate cue in the center of the environment.']},
    {id:'amor-fati',d:'philosophy',t:'Amor Fati',b:'Use what happens as material, not interruption.',m:5,q:'My formula for greatness in a human being is amor fati.',author:'Friedrich Nietzsche · Ecce Homo',read:['This is not passive acceptance. It is conversion.','When a constraint appears, ask what form it wants to become. Treat it as material before treating it as damage.']},
    {id:'zhuangzi-usefulness',d:'philosophy',t:'The Use of Uselessness',b:'Some things survive because they refuse obvious utility.',m:5,q:'Everyone knows the use of the useful, but no one knows the use of the useless.',author:'Zhuangzi · 莊子',read:['Not all value announces itself as productivity.','Protect one useless interval today: no output, no optimization, no justification.']}
  ];
  extras.forEach(function(p){ if(!paths.some(function(x){return x.id===p.id})) paths.push(p); });

  var dailyWisdomIds = ['manage-up','open-the-room','defaults','wu-wei'];
  todayIds.splice(0,todayIds.length,dailyWisdomIds[0],dailyWisdomIds[1],dailyWisdomIds[2],dailyWisdomIds[3]);

  window.sourceText = function(p){
    var map = {
      'open-the-room':'Plato · Republic · c. 375 BCE',
      'art-of-recap':'Voltaire · Philosophical Dictionary · 1764',
      'say-the-frame':'Voltaire · Philosophical Dictionary · 1764',
      'manage-up':'Thomas Mann · The Magic Mountain · 1924',
      'lead-without-loud':'Rumi · Masnavi · c. 1273',
      'decision-right-size':'Michael Porter · What Is Strategy? · 1996',
      'defaults':'James Clear · Atomic Habits · 2018',
      'reward-prediction':'Andy Clark · Surfing Uncertainty · 2016',
      'attention-design':'Mary Oliver · Upstream · 2016',
      'wu-wei':'Laozi · 道德經 · c. 400 BCE',
      'amor-fati':'Friedrich Nietzsche · Ecce Homo · 1888',
      'zhuangzi-usefulness':'Zhuangzi · 莊子 · c. 300 BCE'
    };
    return map[p.id] || p.author;
  };

  window.originalText = function(id){
    return {'wu-wei':'道常無為而無不為。','zhuangzi-usefulness':'人皆知有用之用，而莫知無用之用也。','amor-fati':'Meine Formel für die Größe am Menschen ist amor fati.'}[id] || '';
  };
  window.toggleOriginal = function(){ var el=$('origText'); if(el) el.classList.toggle('on'); };
  window.openAuthorSaved = function(author){ state.savedOnly=true; state.filter='all'; persist(); tab('library'); setTimeout(function(){ $('search').value=author; renderLibrary(); },0); };

  var oldSaved = $('savedToggle');
  if(oldSaved && !document.querySelector('.filter-actions')){
    oldSaved.outerHTML = '<div class="filter-actions"><button id="savedToggle" class="saved-toggle">Show saved</button><button id="clearFilter" class="saved-toggle">Clear</button></div><p class="library-note">An accumulation of daily specimens — saved, unsaved, sorted, and returned to.</p>';
  }

  window.renderToday = function(){
    var ids = dailyWisdomIds.slice(0,4);
    var total = ids.length;
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    $('bars').innerHTML = ids.map(function(_,i){ return '<span class="'+(i===0?'active':'')+'"></span>'; }).join('');
    $('count').textContent = '1/' + total;
    $('snap').innerHTML = ids.map(function(id,idx){
      var p = path(id);
      var heart = state.todayHearts.includes(id);
      var greeting = idx===0 ? '<div class="kicker ink">'+greet+', '+state.name.split(' ')[0]+'</div>' : '';
      return '<section class="today-page">'+greeting+'<div style="display:flex;justify-content:space-between;margin-top:'+(idx===0?'32px':'0')+'"><div class="kicker">'+domainName(p.d)+' · daily wisdom</div><button onclick="toggleTodayHeart(&quot;'+p.id+'&quot;)" style="color:var(--earth);font-size:24px">'+(heart?'♥':'♡')+'</button></div><div class="quote-mark">“</div><blockquote class="quote">'+p.q+'</blockquote><div class="author">'+sourceText(p)+'</div><p class="blurb">'+p.b+'</p></section>';
    }).join('');
    $('snap').onscroll = function(e){
      var idx = Math.round(e.target.scrollTop / e.target.clientHeight);
      if(idx < 0) idx = 0;
      if(idx > total - 1) idx = total - 1;
      $('count').textContent = (idx+1) + '/' + total;
      Array.prototype.slice.call($('bars').children).forEach(function(b,i){ b.classList.toggle('active',i<=idx); });
    };
  };

  function applyFilter(domainId){
    state.filter = domainId;
    state.savedOnly = false;
    persist();
    renderLibrary();
  }
  window.applyFilter = applyFilter;

  window.renderLibrary = function(){
    var domainList = domains.filter(function(d){return d[0] !== 'all'});
    $('filters').innerHTML = domainList.map(function(d){ return '<button type="button" class="'+(state.filter===d[0]?'on':'')+'" data-domain="'+d[0]+'">'+d[1]+'</button>'; }).join('');
    Array.prototype.slice.call($('filters').querySelectorAll('button')).forEach(function(btn){
      btn.addEventListener('click', function(e){ e.preventDefault(); applyFilter(btn.getAttribute('data-domain')); });
    });
    var st=$('savedToggle');
    if(st){ st.innerHTML='Show saved'; st.classList.toggle('on',state.savedOnly); st.onclick=function(){ state.savedOnly=true; persist(); renderLibrary(); }; }
    var clear=$('clearFilter');
    if(clear){ clear.onclick=function(){ state.savedOnly=false; state.filter='all'; $('search').value=''; persist(); renderLibrary(); }; }
    var q=$('search').value.toLowerCase();
    var arr=paths.filter(function(p){ return (state.filter==='all'||p.d===state.filter) && (!state.savedOnly||isSaved(p.id)) && (!q||[p.t,p.b,p.q,sourceText(p),p.author,domainName(p.d)].join(' ').toLowerCase().includes(q)); });
    $('paths').innerHTML=arr.map(function(p){ return '<article class="row"><button style="color:var(--earth)" onclick="toggleSave(&quot;'+p.id+'&quot;)">'+(isSaved(p.id)?'♥':domains.find(function(d){return d[0]===p.d})[2])+'</button><button onclick="openReader(&quot;'+p.id+'&quot;)" style="text-align:left"><div class="row-meta">'+p.m+' min · '+domainName(p.d)+'</div><div class="row-title">'+p.t+'</div><div class="row-blurb">'+p.b+'</div></button><button onclick="openReader(&quot;'+p.id+'&quot;)">→</button></article>'; }).join('');
  };

  window.openReader = function(id){
    current=id; var p=path(id); $('rmeta').textContent=domainName(p.d)+' · '+p.m+' min'; $('rheart').textContent=isSaved(id)?'♥':'♡';
    var original=originalText(id);
    $('readerBody').innerHTML='<div class="kicker">Specimen</div><h1>'+p.t+'</h1><p class="lead">'+p.b+'</p><div class="rq"><blockquote>"'+p.q+'"</blockquote><div class="author">'+sourceText(p)+'</div>'+(original?'<button class="orig-btn" onclick="toggleOriginal()">Show original</button><div id="origText" class="orig-text">'+original+'</div>':'')+'</div><div class="reader-section"><div class="kicker ink">Dive deeper</div>'+p.read.map(function(x){return '<p>'+x+'</p>';}).join('')+'<div class="feedback"><button onclick="vote(&quot;useful&quot;)" class="'+(state.votes[id]==='useful'?'on':'')+'">↑ More like this</button><button onclick="vote(&quot;less&quot;)" class="'+(state.votes[id]==='less'?'on':'')+'">↓ Less like this</button></div></div>';
    $('reader').classList.add('on'); recordRead(p.m); renderToday();
  };

  window.renderSelf = function(){
    $('nickname').textContent=state.name; $('username').textContent='@'+state.user; $('avatarLetter').textContent=state.name[0].toUpperCase(); $('streak').textContent=streak(); $('minutes').textContent=totalMinutes(); $('ideas').textContent=state.saved.length;
    $('days').innerHTML=last21().map(function(d,i){ return i===20?'<span class="todaydot"><i class="dot '+(d.minutes?'done':'')+'"></i></span>':'<i class="dot '+(d.minutes?'done':'')+'"></i>'; }).join('');
    var counts={}; state.saved.forEach(function(id){ var p=path(id); if(p){ var a=sourceText(p).split(' · ')[0]; counts[a]=(counts[a]||0)+1; } });
    var rows=Object.entries(counts).sort(function(a,b){return b[1]-a[1]}).slice(0,5);
    $('authors').innerHTML=rows.map(function(r,i){ return '<button class="author-row" onclick="openAuthorSaved(&quot;'+r[0].replace(/"/g,'&quot;')+'&quot;)"><span class="idx">0'+(i+1)+'</span><span class="aname">'+r[0]+'</span><span class="count">'+r[1]+' saved →</span></button>'; }).join('');
  };

  renderToday(); renderLibrary(); renderSelf();
})();
</script>
`;
h = h.replace('</body>', runtime + '</body>');

fs.writeFileSync('dist/index.html', h);
