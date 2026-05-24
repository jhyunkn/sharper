(function(){
  var names=['Aureus Socrates','Ludicus Seneca','Nebulosus Plato','Alatus Aristotle','Mellitus Marcus','Velutinus Cicero','Lunaris Epicurus','Sylvanus Heraclitus','Mirabilis Hypatia','Fabulosus Diogenes','Argenteus Plotinus','Serenus Spinoza','Curiosus Zeno','Nocturnus Nietzsche','Floridus Laozi','Ventulus Zhuangzi'];
  function slug(text){return text.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,18)||'sharper'}
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
  var baseRenderSelf=renderSelf;
  renderSelf=function(){baseRenderSelf();enhanceSelf()};
  var baseTab=tab;
  tab=function(id){
    baseTab(id);
    var phone=document.querySelector('.phone');
    if(phone)phone.classList.toggle('self-mode',id==='self');
  };
  renderSelf();
  installPullRefresh();
})();