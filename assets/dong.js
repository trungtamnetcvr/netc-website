/* Hiệu ứng chuyển động nhẹ: hiện dần khi cuộn, đếm số, thanh tiến độ, nút lên đầu trang. Không dùng thư viện. */
(function(){
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  var nav=document.querySelector('nav.main');
  var bar=document.createElement('div');bar.className='prog';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  var top=document.createElement('button');top.type='button';top.className='totop';
  var en=document.documentElement.lang==='en';
  top.setAttribute('aria-label',en?'Back to top':'Lên đầu trang');
  top.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  top.addEventListener('click',function(){window.scrollTo({top:0,behavior:calm?'auto':'smooth'})});
  document.body.appendChild(top);
  var tick=false;
  function onScroll(){
    if(tick)return;tick=true;
    requestAnimationFrame(function(){
      var y=window.pageYOffset,h=document.documentElement.scrollHeight-window.innerHeight;
      bar.style.transform='scaleX('+(h>0?Math.min(y/h,1):0)+')';
      if(nav)nav.classList.toggle('stuck',y>8);
      top.classList.toggle('on',y>600);
      tick=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var hi=document.querySelector('.hero2 .himg');
  if(!calm&&hi){
    window.addEventListener('scroll',function(){
      requestAnimationFrame(function(){var y=window.pageYOffset;if(y<900)hi.style.transform='translateY('+(y*.08).toFixed(1)+'px)'});
    },{passive:true});
  }
  if(!calm&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    [].slice.call(document.querySelectorAll('.itile')).forEach(function(c){
      c.classList.add('tilt');
      c.addEventListener('pointermove',function(e){
        var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        c.style.transform='perspective(800px) rotateY('+(x*6).toFixed(2)+'deg) rotateX('+(-y*6).toFixed(2)+'deg) translateY(-4px)';
      });
      c.addEventListener('pointerleave',function(){c.style.transform=''});
    });
  }
  if(calm||!('IntersectionObserver' in window))return;

  var sel='.sec>h2,.sec>.lead,.flow>div,.itile,.tile,.nitem,.leader,.person,.svc-item,.steps li,.stats3>div,.faq details,.cta-band .wrap,.prose>h2,.prose>p,.prose>.tw';
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      e.target.classList.add('in');io.unobserve(e.target);
      if(e.target.parentNode&&e.target.parentNode.classList.contains('stats3'))count(e.target.querySelector('b'));
    });
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  [].slice.call(document.querySelectorAll(sel)).forEach(function(el){
    if(el.closest('.hero2'))return;
    var sib=el.parentNode?[].indexOf.call(el.parentNode.children,el):0;
    el.style.setProperty('--d',Math.min(sib%6,5)*.07+'s');
    el.classList.add('rv');io.observe(el);
  });
  [].slice.call(document.querySelectorAll('.leaders .leader')).forEach(function(el,i){el.classList.add(i%2?'from-r':'from-l')});
  [].slice.call(document.querySelectorAll('.flow>div')).forEach(function(el){el.classList.add('rv')});

  function count(b){
    if(!b||!/^\d+$/.test(b.textContent.trim()))return;
    var to=+b.textContent,from=to>=1000?to-60:0,t0=null,dur=1300;
    b.setAttribute('aria-label',to);
    function step(t){
      if(t0===null)t0=t;
      var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);
      b.textContent=Math.round(from+(to-from)*e);
      if(p<1)requestAnimationFrame(step);
    }
    b.textContent=from;requestAnimationFrame(step);
  }
})();
