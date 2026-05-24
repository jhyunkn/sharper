const fs = require('fs');

fs.mkdirSync('dist', { recursive: true });
let h = fs.readFileSync('index.html', 'utf8');

const readerTuning = String.raw`/* Museum specimen format */
.reader-head{padding:14px 24px!important;grid-template-columns:38px 1fr 38px!important}
.reader-title{font-size:9px!important;letter-spacing:.20em!important}
.reader-body{padding:30px 30px 118px!important}
.reader h1{font-size:33px!important;line-height:.98!important;margin:10px 0 0!important;letter-spacing:-.01em!important}
.reader h1.compact-title{font-size:28px!important;line-height:.96!important;max-width:300px!important}
.row-title.compact-title{font-size:27px!important;line-height:1!important}
.reader .lead{font-size:18px!important;line-height:1.46!important;margin:18px 0 0!important}
.rq{margin:28px 0!important;padding-left:18px!important;border-left-width:1.5px!important}
.rq blockquote{font-size:26px!important;line-height:1.12!important}
.rq .author{margin-top:20px!important;font-size:8px!important;letter-spacing:.14em!important;line-height:1.45!important}
.rq .author:before{width:24px!important}
.specimen-context{border-top:1px solid var(--soft);padding-top:18px;margin-top:22px}
.specimen-context .label,.deploy-block .label{font-family:var(--mono);font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);margin-bottom:12px}
.specimen-context p,.deploy-block p{font-family:var(--serif);font-style:italic;font-size:17px;line-height:1.45;color:var(--warm);margin:0}
.deploy-block{border-top:1px solid var(--soft);padding-top:20px;margin-top:24px}
.reader-section{margin-top:24px!important;padding-top:22px!important}
.reader-section p{font-size:18px!important;line-height:1.46!important;margin:14px 0!important}
/* Library as gallery */
.library{padding-left:34px!important;padding-right:34px!important}
.library .paths{margin-top:56px!important}
.library .row{grid-template-columns:24px minmax(0,1fr) 18px!important;gap:17px!important;padding:25px 0!important;border-bottom:1px solid rgba(26,23,20,.38)!important}
.library .heart{width:24px!important;height:22px!important;display:grid!important;place-items:center!important;align-self:start!important;margin-top:2px!important;font-size:12px!important;line-height:1!important;letter-spacing:-.09em!important;white-space:nowrap!important;color:var(--earth)!important;overflow:visible!important}
.library .lib-glyph{display:inline-flex!important;align-items:center!important;justify-content:center!important;font-family:var(--mono)!important;font-size:11px!important;line-height:1!important;letter-spacing:-.12em!important;transform:scale(.78)!important;transform-origin:center!important;white-space:nowrap!important;word-break:keep-all!important;min-width:24px!important;overflow:visible!important}
.library .row-meta{font-size:8px!important;letter-spacing:.24em!important;color:rgba(139,126,110,.82)!important}
.library .row-title{font-size:29px!important;line-height:1!important;margin-top:14px!important;letter-spacing:-.01em!important}
.library .row-title.compact-title{font-size:26px!important}
.library .row-blurb{font-size:16px!important;line-height:1.42!important;margin-top:10px!important;color:rgba(139,126,110,.92)!important}
.library .arrow{font-size:29px!important;line-height:1!important;align-self:center!important;color:rgba(26,23,20,.7)!important}
`;

const runtimePatch = String.raw`
<script>
(function(){
  var specimenData = {"manage-up": {"q": "Never outshine the master.", "author": "Robert Greene · The 48 Laws of Power · 1998", "context": "Historical context: Robert Greene’s The 48 Laws of Power opens with “Never Outshine the Master,” a rule drawn from court and patronage dynamics: people in power respond not only to results, but to how those results affect their authority, security, and public position.", "lesson": "Managing up is not flattery. It is the discipline of making your manager better informed, less exposed, and more able to act.", "move": "Before escalating, give three things: the decision needed, the constraint behind it, and your recommended next move."}, "lead-without-loud": {"q": "When the best leader’s work is done, the people say, “We did it ourselves.”", "author": "Laozi · Dao De Jing · Chapter 17", "context": "Historical context: The Dao De Jing is an early Chinese philosophical text associated with Laozi; Chapter 17 contrasts visible, coercive rule with a subtler form of leadership in which order emerges without theatrical control.", "lesson": "Quiet authority works by shaping conditions so clearly that others can move with confidence.", "move": "In the next meeting, speak last once. First, name what you heard; then make the next step simpler."}, "decision-right-size": {"q": "Some decisions are one-way doors; others are two-way doors.", "author": "Jeff Bezos · Amazon shareholder letter · 1997", "context": "Historical context: In Amazon’s 1997 shareholder letter, Jeff Bezos distinguished consequential, hard-to-reverse decisions from reversible ones, arguing that companies should not use the same slow process for every decision.", "lesson": "Strategic judgment begins by sizing the decision before trying to solve it.", "move": "Label today’s decision as reversible or irreversible. If reversible, move faster and review later."}, "open-the-room": {"q": "Rhetoric studies the available means of persuasion.", "author": "Aristotle · Rhetoric · 4th century BCE", "context": "Historical context: Aristotle’s Rhetoric analyzes persuasion through speaker, audience, and argument. A strong opening works because it tells listeners what kind of attention the room now requires.", "lesson": "Opening a room is not small talk. It is orientation: why we are here, what is at stake, and what kind of participation is needed.", "move": "Start your next meeting with one sentence of purpose, one sentence of stakes, and one sentence naming the decision or output."}, "art-of-recap": {"q": "A recap turns conversation into an executable record.", "author": "Barbara Minto · The Pyramid Principle · 1987", "context": "Historical context: Barbara Minto developed the Pyramid Principle at McKinsey as a method for structuring communication so that conclusions, reasons, and evidence are ordered clearly rather than buried in chronology.", "lesson": "A recap is not a transcript. It is compression that protects decisions from dissolving after the meeting ends.", "move": "End with: decision made, owner, deadline, unresolved question."}, "say-the-frame": {"q": "A frame tells people what kind of situation they are in.", "author": "Erving Goffman · Frame Analysis · 1974", "context": "Historical context: Sociologist Erving Goffman’s Frame Analysis studied how people organize experience by interpreting what is going on in a situation; that interpretation shapes what actions feel appropriate.", "lesson": "Before persuading, define the frame. People listen differently when they know whether the room is diagnosing, deciding, aligning, or imagining.", "move": "When a discussion scatters, pause and say: “I think the frame is…”"}, "defaults": {"q": "You do not rise to the level of your goals. You fall to the level of your systems.", "author": "James Clear · Atomic Habits · 2018", "context": "Historical context: Atomic Habits popularized behavior-design ideas for daily life, emphasizing that repeated actions are shaped less by willpower than by cues, friction, environment, and systems.", "lesson": "A good default makes the better action easier to start than the worse one.", "move": "Remove one bad cue and place one good cue where your hand naturally goes."}, "reward-prediction": {"q": "Dopamine neurons respond to the difference between expected and received reward.", "author": "Wolfram Schultz · dopamine reward prediction research · 1997", "context": "Historical context: Neuroscientist Wolfram Schultz and colleagues helped establish the reward prediction error model: dopamine activity changes when outcomes are better or worse than expected.", "lesson": "Motivation is not only pleasure. It is the brain updating its model of what is worth repeating.", "move": "After a difficult action, add a small positive finish so the loop ends better than expected."}, "attention-design": {"q": "My experience is what I agree to attend to.", "author": "William James · The Principles of Psychology · 1890", "context": "Historical context: Psychologist and philosopher William James argued that attention selects from the stream of consciousness; what we attend to becomes the practical shape of our lived experience.", "lesson": "Attention is not merely discipline. It is curation: what is placed near you becomes easier to become.", "move": "Move one distraction out of reach and put one meaningful object in sight."}, "wu-wei": {"q": "道常無為而無不為。", "author": "Laozi · Dao De Jing · Chapter 37", "context": "Historical context: Wu wei is a central Daoist idea often translated as non-forcing or effortless action; in the Dao De Jing, it describes action aligned with the grain of things rather than imposed by strain.", "lesson": "The most effective move is sometimes the one that removes interference.", "move": "Before forcing a stalled task, ask what friction can be removed instead."}, "amor-fati": {"q": "My formula for greatness in a human being is amor fati.", "author": "Friedrich Nietzsche · Ecce Homo · 1888", "context": "Historical context: Nietzsche used the phrase amor fati, or love of fate, to describe a stance of affirming necessity rather than wishing reality had arrived differently.", "lesson": "This is not passive acceptance. It is conversion: turning constraint into material.", "move": "Name one unwanted condition today and ask what it makes possible."}, "zhuangzi-usefulness": {"q": "人皆知有用之用，而莫知無用之用也。", "author": "Zhuangzi · 莊子 · c. 4th–3rd century BCE", "context": "Historical context: The Zhuangzi repeatedly questions narrow ideas of usefulness through stories where what appears useless survives, protects freedom, or reveals a deeper kind of value.", "lesson": "Not all value announces itself as productivity.", "move": "Protect one useless interval today: no output, no optimization, no justification."}};
  Object.keys(specimenData).forEach(function(id){
    var p = (typeof path === 'function') ? path(id) : null;
    if(p){ Object.assign(p, specimenData[id]); }
  });
  function glyphFor(p){
    if(isSaved(p.id)) return '♥';
    return (domains.find(function(d){return d[0]===p.d;})||[])[2] || '·';
  }
  renderLibrary = function(){
    var q=$('search').value.toLowerCase();
    $('filters').innerHTML=domains.map(function(d){return '<button type="button" class="'+(state.filter===d[0]?'on':'')+'" data-domain="'+d[0]+'">'+d[1]+'</button>';}).join('');
    Array.prototype.slice.call($('filters').querySelectorAll('button')).forEach(function(btn){btn.onclick=function(){state.filter=btn.dataset.domain;state.savedOnly=false;save();renderLibrary();};});
    $('savedToggle').className='saved-toggle '+(state.savedOnly?'on':'');
    $('savedToggle').innerHTML=state.savedOnly?'♥ Saved only':'♡ Show saved';
    $('savedToggle').onclick=function(){state.savedOnly=true;save();renderLibrary();};
    $('clearFilter').onclick=function(){state.savedOnly=false;state.filter='all';$('search').value='';save();renderLibrary();};
    var arr=paths.filter(function(p){return (state.filter==='all'||p.d===state.filter)&&(!state.savedOnly||isSaved(p.id))&&(!q||[p.t,p.b,p.q,p.author,domainName(p.d)].join(' ').toLowerCase().includes(q));});
    $('paths').innerHTML=arr.map(function(p){return '<article class="row"><button class="heart" onclick="toggleSave(\''+p.id+'\')"><span class="lib-glyph">'+glyphFor(p)+'</span></button><button onclick="openReader(\''+p.id+'\')" style="text-align:left;min-width:0"><div class="row-meta">'+p.m+' min · '+domainName(p.d)+'</div><div class="row-title '+(p.id==='manage-up'?'compact-title':'')+'">'+p.t+'</div><div class="row-blurb">'+p.b+'</div></button><button class="arrow" onclick="openReader(\''+p.id+'\')">→</button></article>';}).join('');
  };
  renderToday = function(){
    var pages=['intro'].concat(today).concat(['close']);
    var total=pages.length;
    $('bars').innerHTML=pages.map(function(_,i){return '<span class="'+(i===0?'active':'')+'"></span>';}).join('');
    $('count').textContent='1/'+total;
    $('snap').innerHTML=pages.map(function(x){
      if(x==='intro')return '<section class="today-page center"><div class="star">✦</div><div class="kicker ink">Daily specimens</div><h1>Good morning,<br>'+state.name.split(' ')[0]+'.</h1><p class="intro">Four small readings. Keep what sharpens the day.</p><div class="streak-line">Streak · Day 19</div></section>';
      if(x==='close')return '<section class="today-page center"><div class="star">✦</div><h1>That is today.</h1><p class="intro">Come back tomorrow. The same hour, if you can. The mind keeps what you return to.</p><div class="streak-line">Streak · Day 20 begins tomorrow</div></section>';
      var p=path(x),heart=state.todayHearts.includes(x);
      return '<section class="today-page"><div style="display:flex;justify-content:space-between"><div class="kicker">'+domainName(p.d)+' · daily wisdom</div><button onclick="toggleTodayHeart(\''+p.id+'\')" style="color:var(--earth);font-size:24px">'+(heart?'♥':'♡')+'</button></div><div class="quote-mark">“</div><blockquote class="quote">'+p.q+'</blockquote><div class="author">'+p.author+'</div><p class="blurb">'+p.b+'</p></section>';
    }).join('');
    $('snap').onscroll=function(e){var idx=Math.round(e.target.scrollTop/e.target.clientHeight);idx=Math.max(0,Math.min(total-1,idx));$('count').textContent=(idx+1)+'/'+total;Array.prototype.slice.call($('bars').children).forEach(function(b,i){b.classList.toggle('active',i<=idx);});};
  };
  openReader = function(id){
    window.current=id;
    var p=path(id);
    $('rmeta').textContent=domainName(p.d)+' · '+p.m+' min';
    $('rheart').textContent=isSaved(id)?'♥':'♡';
    var orig = p.orig ? '<button class="orig-btn" onclick="$(\'origText\').classList.toggle(\'on\')">Show original</button><div id="origText" class="orig-text">'+p.orig+'</div>' : '';
    var context = p.context ? '<div class="specimen-context"><div class="label">Historical context</div><p>'+p.context+'</p></div>' : '';
    var lesson = p.lesson ? '<div class="reader-section"><div class="kicker ink">What it teaches</div><p>'+p.lesson+'</p></div>' : '';
    var deploy = p.move ? '<div class="deploy-block"><div class="label">Deploy today</div><p>'+p.move+'</p></div>' : '';
    $('readerBody').innerHTML='<div class="kicker">Specimen</div><h1 class="'+(id==='manage-up'?'compact-title':'')+'">'+p.t+'</h1><p class="lead">'+p.b+'</p><div class="rq"><blockquote>"'+p.q+'"</blockquote><div class="author">'+p.author+'</div>'+orig+'</div>'+context+lesson+deploy;
    $('reader').classList.add('on');
  };
  renderToday(); renderLibrary(); renderSelf();
})();
</script>
`;

h = h.replace('</style>', readerTuning + '</style>');
h = h.replace('</body>', runtimePatch + '</body>');
fs.writeFileSync('dist/index.html', h);
