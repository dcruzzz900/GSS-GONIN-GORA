(function(){
  var $=function(s,r){return (r||document).querySelector(s)};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

  /* theme + menu */
  var root=document.documentElement,saved=store('theme');
  if(saved)root.setAttribute('data-theme',saved);
  $('#theme').onclick=function(){
    var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme:dark)').matches);
    var n=dark?'light':'dark';root.setAttribute('data-theme',n);store('theme',n);
  };
  var nav=$('#nav'),menu=$('#menu');
  menu.onclick=function(){var o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o)};
  nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');menu.setAttribute('aria-expanded',false)}});

  /* live school day */
  var base=(function(){
    var a=[];
    [[8*60,10*60,'Morning shift',12*60+30],[13*60,15*60,'Afternoon shift',17*60+30]].forEach(function(s){
      var t,n=1;if(s[0]===13*60)a.push([12*60+30,'Shift changeover']);
      for(t=s[0];t<s[1];t+=30)a.push([t,s[2]+' \u00b7 Period '+(n++)]);
      a.push([s[1],s[2].split(' ')[0]+' break']);
      for(t=s[1]+30;t<s[3];t+=30)a.push([t,s[2]+' \u00b7 Period '+(n++)]);
    });
    a.push([17*60+30,'Closing']);
    return a;
  })();
  var day=[];
  function plan(wd){
    var sess={1:'General assembly',2:'Gender assembly',3:'Assembly',4:'House assembly'},w=sess[wd]?wd:1,mw=(w===1||w===3);
    var pre=[[7*60+30,sess[w]]];if(mw)pre.push([7*60+50,'Staff briefing']);
    var mid=[[12*60+30,mw?'Shift changeover':sess[w]]];if(mw){mid.push([12*60+40,sess[w]]);mid.push([12*60+50,'Staff briefing'])}
    var a=pre.slice();
    base.forEach(function(e){if(e[0]===12*60+30&&e[1]==='Shift changeover'){a=a.concat(mid)}else a.push(e)});
    return a;
  }
  function pad(n){return n<10?'0'+n:n}
  function hm(m){return pad(Math.floor(m/60))+':'+pad(m%60)}
  function tick(){
    var d=new Date(),m=d.getHours()*60+d.getMinutes(),wd=d.getDay();day=plan(wd);
    $('#clock').textContent=d.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})+' · '+hm(m);
    var now=$('#now'),bar=$('#bar'),nx=$('#next'),lf=$('#left');
    if(wd===0||wd>=5){now.textContent='The school is closed';bar.style.width='0';nx.textContent='School resumes Monday at 7:30';lf.textContent='';return}
    if(m<day[0][0]){now.textContent='Doors open soon';bar.style.width='0';nx.textContent='Next: '+day[0][1]+' at '+hm(day[0][0]);lf.textContent=(day[0][0]-m)+' min';return}
    if(m>=day[day.length-1][0]){now.textContent='School day complete';bar.style.width='100%';nx.textContent=(wd===4?'School resumes Monday at 7:30':'See you tomorrow at 7:30');lf.textContent='';return}
    var i=0;while(i<day.length-1&&m>=day[i+1][0])i++;
    var s=day[i][0],e=day[i+1][0];
    now.textContent=day[i][1];bar.style.width=Math.round((m-s)/(e-s)*100)+'%';
    nx.textContent='Next: '+day[i+1][1]+' at '+hm(e);lf.textContent=(e-m)+' min left';
  }
  tick();setInterval(tick,30000);

  /* counters */
  var io=new IntersectionObserver(function(es){es.forEach(function(en){
    if(!en.isTarget&&!en.isIntersecting)return;
    var el=en.target;io.unobserve(el);el.classList.add('in');
    var b=el.querySelector('b'),to=+b.dataset.to,suf=b.dataset.suf||'',t0=performance.now();
    (function step(t){var p=Math.min((t-t0)/1200,1);b.textContent=Math.round(to*p)+suf;if(p<1)requestAnimationFrame(step)})(t0);
  })},{threshold:.4});
  document.querySelectorAll('.stat').forEach(function(s){io.observe(s)});

  /* programs */
  var progs=[
    {n:'Science',ages:'SS1 to SS3',pts:['Mathematics and English Language','Physics, Chemistry and Biology','Digital Technology and Livestock Farming','Practical laboratory work'],txt:'For students aiming at medicine, engineering, technology and the sciences.'},
    {n:'Arts',ages:'SS1 to SS3',pts:['Literature in English and Government','History and Religious Studies','Languages','Civic Education and debating'],txt:'For students aiming at law, languages, education, media and the humanities.'},
    {n:'Commercial',ages:'SS1 to SS3',pts:['Accounting and Commerce','Economics and Business Studies','Mathematics and English','Entrepreneurship skills'],txt:'For students aiming at business, finance, accounting and enterprise.'},
    {n:'Student life',ages:'Clubs and activities',pts:['Sports and inter-house competitions','Debating and literary clubs','Scouts and community service','Prefects and student leadership'],txt:'Activities that build character, teamwork and confidence outside lessons. Subject lists above are typical examples; the school will confirm its own.'}
  ];
  var tabs=$('#tabs'),panel=$('#panel');
  progs.forEach(function(p,i){
    var b=document.createElement('button');b.className='tab';b.role='tab';b.textContent=p.n;
    b.onclick=function(){show(i)};tabs.appendChild(b);
  });
  function show(i){
    var p=progs[i];
    tabs.querySelectorAll('.tab').forEach(function(b,j){b.setAttribute('aria-selected',j===i)});
    panel.innerHTML='<div><h3>'+p.n+'</h3><p><strong>'+p.ages+'</strong></p><p>'+p.txt+'</p></div><ul>'+p.pts.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>';
  }
  show(0);

  /* news */
  var news=[
    {c:'Achievements',d:'2026-10-30',t:'Female students win first position at STEMpreneurship',x:'Our female students emerged first at the STEMpreneurship programme organised by Junior Achievement Nigeria (JAN).'},
    {c:'Achievements',d:'2026-10-29',t:'Female students place second at MUPSA',x:'Our female students emerged second at the Make The Most Under-Privileged Smile Again (MUPSA) programme.'},
    {c:'Community',d:'2026-10-14',t:'Admission into SS1 is open',x:'Use the form on this page to start an application for the new session.'},
    {c:'Sports',d:'2026-10-09',t:'Inter-house sports preparations begin',x:'Students should join their house teams through their class teachers.'},
    {c:'Community',d:'2026-10-02',t:'Parents’ meeting this term',x:'Parents and guardians are invited to meet teachers and the school leadership.'},
    {c:'Academics',d:'2026-09-24',t:'Examination timetable published',x:'Class teachers will share the timetable with every student.'},
    {c:'Arts',d:'2026-09-18',t:'Literary and debating club resumes',x:'New members are welcome from every class.'},
    {c:'Community',d:'2026-09-05',t:'School clean-up and tree planting day',x:'Students and staff work together to care for the school grounds.'}
  ];
  var cats=['All'].concat(news.map(function(n){return n.c}).filter(function(c,i,a){return a.indexOf(c)===i}));
  var cur='All',fl=$('#filters'),q=$('#search');
  cats.forEach(function(c){
    var b=document.createElement('button');b.className='chip';b.textContent=c;b.setAttribute('aria-pressed',c==='All');
    b.onclick=function(){cur=c;fl.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===b)});render()};
    fl.insertBefore(b,q);
  });
  q.oninput=render;
  function render(){
    var s=q.value.trim().toLowerCase();
    var list=news.filter(function(n){return (cur==='All'||n.c===cur)&&(!s||(n.t+' '+n.x).toLowerCase().indexOf(s)>-1)});
    $('#cards').innerHTML=list.length?list.map(function(n){
      return '<article class="card">'+(n.img?'<img class="nimg" alt="'+n.t+'" src="'+n.img+'">':'')+'<span class="tag">'+n.c+'</span><h3>'+n.t+'</h3><p>'+n.x+'</p><time datetime="'+n.d+'">'+new Date(n.d+'T00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})+'</time></article>';
    }).join(''):'<p class="empty">No stories match. Clear the search or pick another topic.</p>';
  }
  render();

  /* events (always upcoming, relative to today) */
  var evs=[[7,'Open day','Visit classrooms and meet staff.'],[16,'Parents’ meeting','Meet your child’s teachers.'],[30,'Inter-house sports','Houses compete in track and field.'],[45,'Entrance screening','For new SS1 applicants.']];
  var el=$('#evlist');
  el.innerHTML=evs.map(function(e){
    var d=new Date();d.setDate(d.getDate()+e[0]);
    return '<div class="ev"><div class="date">'+d.getDate()+'<small>'+d.toLocaleDateString(undefined,{month:'short'})+'</small></div><div><h3>'+e[1]+'</h3><p>'+e[2]+'</p></div><div class="count">in '+e[0]+' days</div></div>';
  }).join('');

  /* gallery: set img to a photo to replace the placeholder art */
  var shots=[
    {c:'Campus',t:'School building',x:'The school classroom blocks and compound.',e:'🏫',img:'images/gallery-school-building.jpg'},
    {c:'Classrooms',t:'Mathematics lesson',x:'A mathematics lesson on areas of plane figures.',e:'📚',img:'images/gallery-mathematics-lesson.jpg'},
    {c:'Science labs',t:'Science laboratory',x:'Add a photo of the laboratory.',e:'🔬',img:''},
    {c:'Sports',t:'Sports',x:'Students playing football on the school field.',e:'⚽',img:'images/gallery-sports.jpg'},
    {c:'Events',t:'School assembly',x:'Students gathered for the school assembly.',e:'🎓',img:'images/gallery-school-assembly.jpg'},
    {c:'Classrooms',t:'Library',x:'Add a photo of the library.',e:'📖',img:''},
    {c:'Events',t:'Cultural day',x:'Add a photo of cultural activities.',e:'🥁',img:''},
    {c:'Sports',t:'Inter-house sports',x:'Add a photo from sports day.',e:'🏃',img:''},
    {c:'Science labs',t:'Computer room',x:'Add a photo of the computer room.',e:'💻',img:''}
  ];
  var GP={vp:'images/gallery-vice-principal-academics.jpg',sma:'images/gallery-senior-master-academics.jpg',dm:'images/gallery-discipline-master.jpg',hum:'images/gallery-head-of-humanities.jpg',st1:'images/gallery-stempreneurship-presentation.jpg',st2:'images/gallery-stempreneurship-first-position.jpg',mup:'images/gallery-mupsa-second-position.jpg',gco:'images/gallery-guidance-counsellor.jpg',cl3:'images/gallery-classroom-lesson.jpg',pr:'images/gallery-principal.jpg',sm:'images/gallery-senior-mistress-admin.jpg',hod:'images/gallery-head-of-sciences.jpg',wel:'images/gallery-welfare-officer.jpg',exam:'images/gallery-exams-officer.jpg'};
  news[0].img=GP.st2;news[1].img=GP.mup;render();
  shots.unshift(
    {c:'Events',t:'STEMpreneurship, first position',x:'Our female students at the STEMpreneurship programme organised by Junior Achievement Nigeria (JAN). They emerged first.',e:'',img:GP.st2},
    {c:'Events',t:'STEMpreneurship presentation',x:'From the STEMpreneurship programme organised by Junior Achievement Nigeria (JAN).',e:'',img:GP.st1},
    {c:'Events',t:'MUPSA, second position',x:'Our female students at the Make The Most Under-Privileged Smile Again (MUPSA) programme. They emerged second.',e:'',img:GP.mup}
  );
  shots.push(
    {c:'Classrooms',t:'Classroom lesson',x:'A teacher taking a lesson in class.',e:'',img:GP.cl3},
    {c:'Staff',t:'Mrs Stella Dalun Kwasau',x:'Guidance and Counselling Officer.',e:'',img:GP.gco},
    {c:'Staff',t:'Mr Samson Mallam',x:'Head of Humanities.',e:'',img:GP.hum},
    {c:'Staff',t:'Mr Yari Zachariah',x:'Vice Principal Academics.',e:'',img:GP.vp},
    {c:'Staff',t:'Mr Michael Tobias Dunka',x:'Senior Master (Academics).',e:'',img:GP.sma},
    {c:'Staff',t:'Mr James Augustine Enemona',x:'Discipline Master.',e:'',img:GP.dm},
    {c:'Staff',t:'Principal',x:'Mr Elias Mathias, Principal.',e:'',img:GP.pr},
    {c:'Staff',t:'Mrs Magdaline Boniface',x:'Senior Mistress (Administration).',e:'',img:GP.sm},
    {c:'Staff',t:'Mrs Florence Christopher',x:'Head of Sciences.',e:'',img:GP.hod},
    {c:'Staff',t:'Mrs Patience John Emmanuel',x:'Welfare Officer.',e:'',img:GP.wel},
    {c:'Staff',t:'Mr Naallah Samuel Jock',x:'Exams Officer.',e:'',img:GP.exam}
  );
  var hues=[['#f2c14e','#f7e2a8'],['#9ad5c4','#cfeee5'],['#d7f0e4','#eefaf4'],['#fde9a9','#fff6d6']];
  var gcats=['All','Campus','Classrooms','Science labs','Sports','Events','Staff'],gcur='All',gl=[],gi=0,gf=$('#gfilters'),lb=$('#lb');
  function gbg(i){var h=hues[i%4];return 'background:linear-gradient(135deg,'+h[0]+','+h[1]+')'}
  function gart(s){return s.img?'<img src="'+s.img+'" alt="'+s.t+'">':'<span aria-hidden="true">'+s.e+'</span>'}
  gcats.forEach(function(c){
    var b=document.createElement('button');b.className='chip';b.textContent=c;b.setAttribute('aria-pressed',c==='All');
    b.onclick=function(){gcur=c;gf.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===b)});drawGal()};
    gf.appendChild(b);
  });
  function drawGal(){
    gl=shots.filter(function(s){return gcur==='All'||s.c===gcur});
    $('#gal').innerHTML=gl.map(function(s,i){return '<button class="shot" data-i="'+i+'"><div class="art" style="'+gbg(i)+'">'+gart(s)+'</div><div class="cap"><b>'+s.t+'</b><span>'+s.c+'</span></div></button>'}).join('');
  }
  function lbShow(i){
    gi=(i+gl.length)%gl.length;var s=gl[gi];
    $('#lbart').innerHTML='<div class="art" style="'+gbg(gi)+'">'+gart(s)+'</div>';
    $('#lbcap').innerHTML='<b>'+s.t+'</b><p>'+s.x+'</p>';
  }
  $('#gal').addEventListener('click',function(e){var b=e.target.closest('.shot');if(!b)return;lbShow(+b.dataset.i);lb.hidden=false;$('#lbc').focus()});
  $('#lbp').onclick=function(){lbShow(gi-1)};$('#lbn').onclick=function(){lbShow(gi+1)};
  $('#lbc').onclick=function(){lb.hidden=true};
  lb.addEventListener('click',function(e){if(e.target===lb)lb.hidden=true});
  document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')lb.hidden=true;if(e.key==='ArrowLeft')lbShow(gi-1);if(e.key==='ArrowRight')lbShow(gi+1)});
  drawGal();

  /* calendar: add term dates as 'YYYY-MM-DD' in s (start) and e (end) */
  var CUR=2,TERMS=[{n:'First term',s:'',e:''},{n:'Second term',s:'',e:''},{n:'Third term',s:'',e:''}];
  function fdate(x){return new Date(x+'T00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}
  var today0=new Date();
  $('#terms').innerHTML=TERMS.map(function(t,i){
    var st=i<CUR-1?'Completed':(i===CUR-1?'Current term':'Upcoming'),txt='Dates to be announced';
    if(t.s&&t.e){var a=new Date(t.s+'T00:00'),b=new Date(t.e+'T23:59');txt=fdate(t.s)+' to '+fdate(t.e);st=today0<a?'Upcoming':(today0>b?'Ended':'Current term')}
    return '<div class="term">'+(st?'<span class="badge2">'+st+'</span>':'')+'<h3>'+t.n+'</h3><p>'+txt+'</p></div>';
  }).join('');
  var SESSION='2026/2027';
  $('.live small').textContent='Our school day, live \u00b7 '+SESSION+' session, '+TERMS[CUR-1].n.toLowerCase();
  $('#calnote').textContent=SESSION+' academic session. We are currently in the '+TERMS[CUR-1].n.toLowerCase()+'. Choose a view below.';
  var DN={1:'Monday',2:'Tuesday',3:'Wednesday',4:'Thursday'};
  function pre(wd,lo,hi){return plan(wd).filter(function(e){return e[0]>=lo&&e[0]<hi&&!/Period|break/.test(e[1])}).map(function(e){return hm(e[0])+' '+e[1]}).join('<br>')}
  $('#weekbody').innerHTML=[1,2,3,4].map(function(w){return '<tr><th scope="row">'+DN[w]+'</th><td>'+pre(w,450,480)+'</td><td>'+pre(w,750,780)+'</td></tr>'}).join('');
  var calf=$('#calf');
  [['Terms','terms'],['Weekly timetable','week']].forEach(function(v,i){
    var b=document.createElement('button');b.className='chip';b.textContent=v[0];b.setAttribute('aria-pressed',i===0);
    b.onclick=function(){calf.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('#terms').hidden=v[1]!=='terms';$('#week').hidden=v[1]!=='week'};
    calf.appendChild(b);
  });

  /* classes */
  var yrs=['SS1','SS2','SS3'],arms=[['Science 1','Science'],['Science 2','Science'],['Art 1','Art'],['Art 2','Art'],['Commercial','Commercial']],cp='All',cf=$('#cfilters');
  ['All','Science','Art','Commercial'].forEach(function(c){
    var b=document.createElement('button');b.className='chip';b.textContent=c;b.setAttribute('aria-pressed',c==='All');
    b.onclick=function(){cp=c;cf.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===b)});drawClasses()};
    cf.appendChild(b);
  });
  function drawClasses(){
    $('#yrs').innerHTML=yrs.map(function(y){
      return '<div class="yr"><h3>'+y+'<small>5 classes</small></h3><div class="arms">'+arms.map(function(a){return '<span class="arm'+(cp!=='All'&&a[1]!==cp?' dim':'')+'">'+y+' '+a[0]+'</span>'}).join('')+'</div></div>';
    }).join('');
  }
  drawClasses();

  /* hero slider */
  var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var ico=function(e){return '<div class="hs-ico" aria-hidden="true">'+e+'</div>'};
  var PRINCIPAL='images/principal-square.jpg';
  [].forEach.call(document.querySelectorAll('img.pp'),function(i){i.src=PRINCIPAL});
  var PRINCIPAL_WIDE='images/principal-wide-hero.jpg';
  var SCHOOL_IMG='images/hero-school-building.jpg',CLASS_IMG='images/hero-classroom.jpg',SPORT_IMG='images/hero-sports.jpg',ASSEMBLY_IMG=((shots.filter(function(s){return s.t==='School assembly'})[0])||{}).img||'';
  var hsl=[
    {c:'pslide',k:'Welcome to',t:'Government Secondary School Gonin-Gora',p:'Providing quality education, building character and shaping a brighter future.',b:'Learn More',h:'#about',bg:'background:var(--hero-a)',a:'<img class="hs-bg" alt="School building" style="object-position:50% 50%" src="'+SCHOOL_IMG+'">'},
    {c:'pslide',k:'Mission and vision',t:'Quality, affordable and inclusive education',p:'We develop responsible, confident and productive citizens, and aim to be a leading school known for academic excellence and moral values.',b:'Read more',h:'#about',bg:'background:linear-gradient(120deg,var(--hero-a),var(--hero-b))',a:'<img class="hs-bg" alt="" style="object-position:50% 30%" src="'+ASSEMBLY_IMG+'">'},
    {c:'pslide',k:'Our principal',t:'Together we build a better tomorrow.',p:'Mr Elias Mathias, Principal',b:'Meet our staff',h:'#staff',bg:'background:linear-gradient(60deg,var(--hero-a),var(--hero-b))',a:'<img class="hs-bg" alt="Principal" src="'+PRINCIPAL_WIDE+'">'},
    {c:'pslide',k:'Academic activities',t:'Science, Arts and Commercial pathways',p:'Students in SS1 to SS3 prepare for their examinations with dedicated teachers.',b:'See pathways',h:'#programs',bg:'background:linear-gradient(150deg,var(--hero-b),var(--hero-a))',a:'<img class="hs-bg" alt="" style="object-position:62% 50%" src="'+CLASS_IMG+'">'},
    {c:'pslide',k:'School facilities',t:'Laboratories, library and sports field',p:'A learning environment built to support every student.',b:'View gallery',h:'#gallery',bg:'background:linear-gradient(120deg,var(--hero-b),var(--hero-a))',a:'<img class="hs-bg" alt="" style="object-position:70% 50%" src="'+SPORT_IMG+'">'}
  ];
  var hi=0,hhold=false,hs=$('#hs'),htr=$('#hstrack'),hdt=$('#hdots');
  htr.innerHTML=hsl.map(function(s,i){return '<div class="hs-slide '+(s.c||'')+'" style="'+s.bg+'" role="group" aria-roledescription="slide" aria-label="'+(i+1)+' of '+hsl.length+'">'+s.a+'<div class="wrap"><div class="hs-copy"><small>'+s.k+'</small>'+(i?'<h2>':'<h1>')+s.t+(i?'</h2>':'</h1>')+'<p>'+s.p+'</p><a class="btn green" href="'+s.h+'">'+s.b+' \u2192</a></div></div></div>'}).join('');
  hsl.forEach(function(_,i){var b=document.createElement('button');b.setAttribute('aria-label','Show slide '+(i+1));b.onclick=function(){hgo(i)};hdt.appendChild(b)});
  function hgo(i){
    hi=(i+hsl.length)%hsl.length;htr.style.transform='translateX(-'+hi*100+'%)';
    [].forEach.call(hdt.children,function(b,j){b.setAttribute('aria-current',j===hi)});
    [].forEach.call(htr.children,function(el,j){el.setAttribute('aria-hidden',j!==hi);el.querySelector('a').tabIndex=j===hi?0:-1});
  }
  $('#hprev').onclick=function(){hgo(hi-1)};$('#hnext').onclick=function(){hgo(hi+1)};
  ['mouseenter','focusin'].forEach(function(ev){hs.addEventListener(ev,function(){hhold=true})});
  ['mouseleave','focusout'].forEach(function(ev){hs.addEventListener(ev,function(){hhold=false})});
  var sx=null;
  hs.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;hhold=true},{passive:true});
  hs.addEventListener('touchend',function(e){if(sx!==null){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)hgo(hi+(dx<0?1:-1))}sx=null;hhold=false});
  hs.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')hgo(hi-1);if(e.key==='ArrowRight')hgo(hi+1)});
  hgo(0);
  if(!rm)setInterval(function(){if(!hhold&&!document.hidden)hgo(hi+1)},6000);

  /* gallery slider */
  var gt=$('#gal'),gd=$('#gdots'),gh=false,gper=4,gw=0;
  function gmark(){var p=Math.round(gt.scrollLeft/((gper*gw)||1));[].forEach.call(gd.children,function(b,i){b.setAttribute('aria-current',i===p)})}
  function gsync(){
    var f=gt.firstElementChild;gd.innerHTML='';if(!f)return;
    gw=f.offsetWidth+16;gper=Math.max(1,Math.round(gt.clientWidth/gw));
    for(var i=0;i<Math.ceil(gl.length/gper);i++){(function(i){var b=document.createElement('button');b.setAttribute('aria-label','Go to photos '+(i+1));b.onclick=function(){gt.scrollTo({left:i*gper*gw,behavior:'smooth'})};gd.appendChild(b)})(i)}
    gmark();
  }
  function gmove(d){
    var max=gt.scrollWidth-gt.clientWidth;
    if(d>0&&gt.scrollLeft>=max-4)gt.scrollTo({left:0,behavior:'smooth'});
    else if(d<0&&gt.scrollLeft<=4)gt.scrollTo({left:max,behavior:'smooth'});
    else gt.scrollBy({left:d*gper*gw,behavior:'smooth'});
  }
  gt.addEventListener('scroll',gmark,{passive:true});
  $('#gprev').onclick=function(){gmove(-1)};$('#gnext').onclick=function(){gmove(1)};
  ['mouseenter','focusin','touchstart'].forEach(function(ev){$('#gslider').addEventListener(ev,function(){gh=true},{passive:true})});
  ['mouseleave','focusout','touchend'].forEach(function(ev){$('#gslider').addEventListener(ev,function(){gh=false})});
  var _dg=drawGal;drawGal=function(){_dg();gt.scrollLeft=0;gsync()};
  drawGal();window.addEventListener('resize',gsync);
  if(!rm)setInterval(function(){if(!gh&&!document.hidden&&lb.hidden)gmove(1)},4500);

  /* nav highlight, back to top, top search */
  var nl=[].slice.call(document.querySelectorAll('nav>ul>li>a')),nid=nl.map(function(a){return a.getAttribute('href').slice(1)}),tt=$('#totop');
  function spy(){
    var y=window.scrollY+130,best=0,bt=-1;
    nid.forEach(function(id,i){var el=document.getElementById(id);if(!el)return;var t=el.getBoundingClientRect().top+window.scrollY;if(t<=y&&t>bt){bt=t;best=i}});
    nl.forEach(function(a,i){a.classList.toggle('cur',i===best)});
    tt.classList.toggle('show',window.scrollY>500);
  }
  window.addEventListener('scroll',spy,{passive:true});spy();
  tt.onclick=function(){window.scrollTo({top:0,behavior:'smooth'})};
  $('#tsearch').addEventListener('submit',function(e){
    e.preventDefault();q.value=this.elements[0].value;cur='All';
    fl.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x.textContent==='All')});
    render();document.getElementById('news').scrollIntoView({behavior:'smooth'});
  });

  /* organogram */
  var odesc=$('#odesc'),onodes=document.querySelectorAll('.node');
  onodes.forEach(function(n){
    n.setAttribute('aria-pressed','false');
    n.addEventListener('click',function(){
      onodes.forEach(function(x){x.setAttribute('aria-pressed',x===n)});
      odesc.textContent=n.textContent+': '+n.dataset.d;
    });
  });

  /* staff */
  var PH={vp:'images/avatar-vice-principal-academics.jpg',sma:'images/avatar-senior-master-academics.jpg',dm:'images/avatar-discipline-master.jpg',pr:PRINCIPAL,hum:'images/avatar-head-of-humanities.jpg',gco:'images/avatar-guidance-counsellor.jpg',sm:'images/avatar-senior-mistress-admin.jpg',hod:'images/avatar-head-of-sciences.jpg',wel:'images/avatar-welfare-officer.jpg',exam:'images/avatar-exams-officer.jpg'};
  var staff=[
    {n:'Mr Elias Mathias',r:'Principal',d:'Leadership',b:'Head of the school. Add a short welcome message here.',ph:'pr'},
    {n:'Mr Yari Zachariah',r:'Vice Principal Academics',d:'Leadership',b:'Oversees teaching, the curriculum, examinations and academic standards. Add a short introduction here.',ph:'vp'},
    {n:'Vice Principal Administration',r:'Staff and school operations',d:'Leadership',b:'Add the name and a short introduction here.'},
    {n:'Mr Michael Tobias Dunka',r:'Senior Master (Academics)',d:'Leadership',b:'Add a short introduction here.',ph:'sma'},
    {n:'Mrs Magdaline Boniface',r:'Senior Mistress (Administration)',d:'Leadership',b:'Add a short introduction here.',ph:'sm'},
    {n:'Mr James Augustine Enemona',r:'Discipline Master',d:'Leadership',b:'Handles student conduct and discipline. Add a short introduction here.',ph:'dm'},
    {n:'Mrs Patience John Emmanuel',r:'Welfare Officer',d:'Leadership',b:'Looks after student welfare. Add a short introduction here.',ph:'wel'},
    {n:'Aaron Monday Dachet',r:'Labour Master',d:'Leadership',b:'Looks after the school environment and student labour. Add a short introduction here.'},
    {n:'Games Master',r:'Sports and games',d:'Leadership',b:'Add the name and a short introduction here.'},
    {n:'SS1 Master',r:'Year group master, SS1',d:'Leadership',b:'Add the name and a short introduction here.'},
    {n:'SS2 Master',r:'Year group master, SS2',d:'Leadership',b:'Add the name and a short introduction here.'},
    {n:'SS3 Master',r:'Year group master, SS3',d:'Leadership',b:'Add the name and a short introduction here.'},
    {n:'Mrs Florence Christopher',r:'Head of Sciences',d:'Departments',b:'Head of the Sciences department. Add a short introduction here.',ph:'hod'},
    {n:'Mr Samson Mallam',r:'Head of Humanities',d:'Departments',b:'Head of the Humanities department. Add a short introduction here.',ph:'hum'},
    {n:'Mr Audu Joel',r:'Head of Vocational and Technology',d:'Departments',b:'Head of the Vocational and Technology department. Add a short introduction here.'},
    {n:'Head of Languages',r:'English and languages',d:'Departments',b:'Add the name and a short introduction here.'},
    {n:'Mrs Stella Dalun Kwasau',r:'Guidance and Counselling Officer',d:'Departments',b:'Looks after student welfare and counselling. Add a short introduction here.',ph:'gco'},
    {n:'Mr Naallah Samuel Jock',r:'Exams Officer',d:'Departments',b:'Handles internal and external examinations. Add a short introduction here.',ph:'exam'}
  ];
  var depts=['All'].concat(staff.map(function(s){return s.d}).filter(function(c,i,a){return a.indexOf(c)===i}));
  var tint=['#f2c14e','#9ad5c4','#bfe8d6','#fde9a9'],sd='All',sf=$('#sfilters');
  depts.forEach(function(c){
    var b=document.createElement('button');b.className='chip';b.textContent=c;b.setAttribute('aria-pressed',c==='All');
    b.onclick=function(){sd=c;sf.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===b)});drawStaff()};
    sf.appendChild(b);
  });
  function drawStaff(){
    $('#stafflist').innerHTML=staff.filter(function(s){return sd==='All'||s.d===sd}).map(function(s,i){
      var ini=s.n.split(' ').map(function(w){return w[0]}).join('');
      return '<button class="person" aria-expanded="false">'+(s.ph?'<img class="av" alt="'+s.n+'" src="'+PH[s.ph]+'">':'<div class="av" style="background:'+tint[i%tint.length]+'">'+ini+'</div>')+'<h3>'+s.n+'</h3><div class="role">'+s.r+'</div><p class="bio">'+s.b+'</p></button>';
    }).join('');
  }
  $('#stafflist').addEventListener('click',function(e){
    var p=e.target.closest('.person');if(!p)return;
    p.setAttribute('aria-expanded',p.getAttribute('aria-expanded')!=='true');
  });
  drawStaff();

  /* admissions form */
  var SCHOOL_EMAIL='info@gssgonigora.edu.ng',SCHOOL_WA='2348031234567';
  var f=$('#form'),KEY='crestview-draft';
  try{var dr=JSON.parse(store(KEY)||'{}');Object.keys(dr).forEach(function(k){if(f.elements[k])f.elements[k].value=dr[k]})}catch(e){}
  f.addEventListener('input',function(){
    var o={};['parent','email','age','level','msg'].forEach(function(k){o[k]=f.elements[k].value});store(KEY,JSON.stringify(o));
  });
  function bad(name,msg){f.elements[name].parentNode.querySelector('.err').textContent=msg;return !!msg}
  f.addEventListener('submit',function(e){
    e.preventDefault();var v=f.elements,n=0;
    n+=bad('parent',v.parent.value.trim().length<2?'Enter your full name.':'');
    n+=bad('email',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.value)?'':'Enter a valid email address.');
    var a=+v.age.value;n+=bad('age',a>=13&&a<=22?'':'Enter an age between 13 and 22.');
    n+=bad('level',v.level.value?'':'Choose a class.');
    if(n)return;
    var d=$('#done');d.hidden=false;var first=v.parent.value.trim().split(' ')[0],who=v.parent.value.trim();
    var msg='Application for admission\n\nParent or guardian: '+who+'\nEmail: '+v.email.value.trim()+'\nChild age: '+v.age.value+'\nClass: '+v.level.value+'\nPathway: '+(v.path.value||'Not sure yet')+'\nMessage: '+(v.msg.value.trim()||'-');
    d.textContent='';
    var p=document.createElement('p');p.style.margin='0 0 8px';p.textContent='Thank you, '+first+'. Your application is ready. Send it to the school office with one of the buttons below.';
    var a1=document.createElement('a');a1.className='btn';a1.textContent='Send by email';a1.href='mailto:'+SCHOOL_EMAIL+'?subject='+encodeURIComponent('Admission application: '+who)+'&body='+encodeURIComponent(msg);
    var a2=document.createElement('a');a2.className='btn';a2.textContent='Send on WhatsApp';a2.target='_blank';a2.rel='noopener';a2.href='https://wa.me/'+SCHOOL_WA+'?text='+encodeURIComponent(msg);
    d.appendChild(p);d.appendChild(a1);d.appendChild(a2);
    try{fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()}).then(function(r){if(r.ok)p.textContent='Thank you, '+first+'. Your application has been received by the school office. You can also send a copy by email or WhatsApp.'}).catch(function(){})}catch(e){}
    f.reset();store(KEY,'{}');
  });
})();
