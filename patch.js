(function(){
  var names=['Field Cartographer','Signal Gardener','Archive Fox','Quiet Compiler','Clay Oracle','Moss Debugger','Obsidian Listener','Cedar Operator','Ochre Analyst','Stone Compiler','Umber Cartographer','Mineral Scribe'];
  function slug(text){return text.toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,18)||'sharper'}
  function enhanceSelf(){
    var identity=document.querySelector('.self .identity');
    if(!identity||document.getElementById('nameGen'))return;
    var button=document.createElement('button');
    button.id='nameGen';
    button.className='name-gen';
    button.type='button';
    button.textContent='Generate field name';
    button.onclick=function(){
      var next=names[Math.floor(Math.random()*names.length)];
      state.name=next;
      state.user=slug(next);
      save();
      renderSelf();
    };
    identity.appendChild(button);
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
})();
