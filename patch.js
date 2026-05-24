(function(){
  var names=['Aureus Socrates','Ludicus Seneca','Nebulosus Plato','Alatus Aristotle','Mellitus Marcus','Velutinus Cicero','Lunaris Epicurus','Sylvanus Heraclitus','Mirabilis Hypatia','Fabulosus Diogenes','Argenteus Plotinus','Serenus Spinoza','Curiosus Zeno','Nocturnus Nietzsche','Floridus Laozi','Ventulus Zhuangzi'];
  function slug(text){return text.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,18)||'sharper'}
  function dayStamp(offset){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+(offset||0));return d.toISOString().slice(0,10)}
  function daysBetween(a,b){return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000)}
  function ensureUsage(){
    var today=dayStamp(0), yesterday=dayStamp(-1);
    var hadPriorState=!!localStorage.sharper_beta;
    if(!Array.isArray(state.activeDays)||!state.activeDays.length){
      state.activeDays=hadPriorState?[yesterday,today]:[today];
    }
    if(state.activeDays.indexOf(today)<0)state.activeDays.push(today);
    state.activeDays=Array.from(new Set(state.activeDays)).sort();
    saveRaw();
  }
  function saveRaw(){localStorage.sharper_beta=JSON.stringify(state)}
  function streakCount(){
    ensureUsage();
    var set={};state.activeDays.forEach(function(d){set[d]=true});
    var count=0,cursor=dayStamp(0);
    while(set[cursor]){count++;var d=new Date(cursor+'T00:00:00');d.setDate(d.getDate()-1);cursor=d.toISOString().slice(0,10)}
    return count||1;
  }
  function enhanceSelf(){
    var identity=document.querySelector('.self .identity');
    if(!identity||document.getElementById('nameGen'))return;
    var button=document.createElement('button');
    button.id='nameGen';
    button.className='name-gen';
    button.type='button';
    button.textContent='Generate Latin name';
    button.onclick=function(){
      var next=names[Math.floor(Math.random()*names.length)];
      state.name=next;
      state.user=slug(next);
      save();
      renderSelf();
    };
    identity.appendChild(button);
  }
  function enhanceStreakUI(){
    var streak=streakCount();
    var stat=document.getElementById('streakStat');
    if(stat)stat.textContent=streak;
    var lines=document.querySelectorAll('.streak-line');
    Array.prototype.slice.call(lines).forEach(function(line,i){line.textContent=i===0?'Streak · Day '+streak:'Streak · Day '+(streak+1)+' begins tomorrow'});
    var days=document.getElementById('days');
    if(days){
      var set={};state.activeDays.forEach(function(d){set[d]=true});
      days.innerHTML=Array.from({length:21},function(_,i){
        var offset=i-20;
        var date=dayStamp(offset);
        if(i===20)return '<span class="todaydot"><i class="dot done"></i></span>';
        return '<i class="dot '+(set[date]?'done':'')+'"></i>';
      }).join('');
    }
  }
  function scrollTabTop(id){
    requestAnimationFrame(function(){
      var view=document.getElementById(id);
      if(view) view.scrollTo({top:0,left:0,behavior:'auto'});
      if(id==='today'){
        var snap=document.getElementById('snap');
        if(snap) snap.scrollTo({top:0,left:0,behavior:'auto'});
        var count=document.getElementById('count');
        if(count) count.textContent='1/6';
        var bars=document.getElementById('bars');
        if(bars) Array.prototype.slice.call(bars.children).forEach(function(b,i){b.classList.toggle('active',i===0);});
      }
    });
  }
  function installPullRefresh(){
    var phone=document.querySelector('.phone');
    if(!phone||document.getElementById('pullRefresh'))return;
    var indicator=document.createElement('div');
    indicator.id='pullRefresh';
    indicator.className='pull-refresh';
    indicator.innerHTML='<span class="pull-orb"></span><span class="pull-label">Pull to refresh</span>';
    phone.appendChild(indicator);
    var label=indicator.querySelector('.pull-label');
    var startY=0;
    var pull=0;
    var armed=false;
    var active=false;
    var threshold=74;
    var maxPull=118;
    function activeView(){return document.querySelector('.view.on')}
    function atTop(){var view=activeView();if(!view)return false;if(view.id==='today'){var snap=document.getElementById('snap');return !snap||snap.scrollTop<=0}return view.scrollTop<=0}
    function setPull(value){
      pull=Math.max(0,Math.min(maxPull,value));
      var lag=Math.round(pull*.38);
      var contentLag=Math.round(Math.min(46,pull*.34));
      indicator.style.setProperty('--pullLag',lag+'px');
      indicator.style.setProperty('--contentLag',contentLag+'px');
      indicator.style.setProperty('--pullFill',Math.round(Math.min(8,pull/threshold*8))+'px');
      phone.style.setProperty('--contentLag',contentLag+'px');
      indicator.classList.toggle('on',pull>8);
      indicator.classList.toggle('ready',pull>=threshold);
      label.textContent=pull>=threshold?'Release to refresh':'Pull to refresh';
    }
    function resetSoon(done){
      phone.classList.add('pull-settle');
      phone.classList.remove('pull-active');
      setPull(0);
      setTimeout(function(){indicator.className='pull-refresh';label.textContent='Pull to refresh';phone.classList.remove('pull-settle')},done?520:260);
    }
    function refreshFeedback(){
      indicator.className='pull-refresh on refreshing';
      label.textContent='Refreshing';
      phone.classList.add('pull-settle');
      phone.style.setProperty('--contentLag','28px');
      try{renderToday();renderLibrary();renderSelf()}catch(e){}
      setTimeout(function(){indicator.className='pull-refresh on done';label.textContent='Updated'},460);
      setTimeout(function(){resetSoon(true)},860);
    }
    phone.addEventListener('touchstart',function(e){
      if(e.touches.length!==1)return;
      startY=e.touches[0].clientY;
      active=atTop();
      armed=false;
    },{passive:true});
    phone.addEventListener('touchmove',function(e){
      if(!active||e.touches.length!==1)return;
      var dy=e.touches[0].clientY-startY;
      if(dy<=0){setPull(0);return}
      if(!atTop())return;
      armed=true;
      phone.classList.add('pull-active');
      phone.classList.remove('pull-settle');
      setPull(Math.pow(dy,.86)*1.12);
      if(dy>12)e.preventDefault();
    },{passive:false});
    phone.addEventListener('touchend',function(){
      if(!armed)return;
      var shouldRefresh=pull>=threshold;
      active=false;
      armed=false;
      if(shouldRefresh)refreshFeedback();else resetSoon(false);
    },{passive:true});
    phone.addEventListener('touchcancel',function(){active=false;armed=false;resetSoon(false)},{passive:true});
  }
  ensureUsage();
  var baseRenderSelf=renderSelf;
  renderSelf=function(){baseRenderSelf();enhanceSelf();enhanceStreakUI()};
  var baseRenderToday=renderToday;
  renderToday=function(){baseRenderToday();enhanceStreakUI()};
  var baseTab=tab;
  tab=function(id){
    baseTab(id);
    var phone=document.querySelector('.phone');
    if(phone)phone.classList.toggle('self-mode',id==='self');
    scrollTabTop(id);
    enhanceStreakUI();
  };
  renderToday();
  renderSelf();
  installPullRefresh();
})();