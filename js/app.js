document.addEventListener('DOMContentLoaded', () => {
  // Navbar toggle
  const navToggle = document.querySelectorAll('.nav-toggle');
  navToggle.forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.querySelector('.main-nav');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.style.display = nav.style.display==='flex'?'':'flex';
      nav.style.flexDirection='column'; nav.style.gap='8px'; nav.style.padding='12px';
    });
  });

  // Intersection reveal
  const revealEls = document.querySelectorAll('.card,.stat-card,.child-card,.gallery-item,.donation-card');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
    });
  },{threshold:0.12});
  revealEls.forEach(el=>io.observe(el));

  // Stats counters
  const counters = document.querySelectorAll('.stat-value');
  counters.forEach(el=>{
    const target=parseInt(el.dataset.target||el.textContent.replace(/\D/g,''),10)||0;
    if(!target)return;
    const run=()=>{
      const duration=1400,start=performance.now();
      const step=(t)=>{
        const progress=Math.min((t-start)/duration,1);
        el.textContent=Math.floor(progress*target).toLocaleString();
        if(progress<1)requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){run();cObserver.unobserve(entry.target);}});
    },{threshold:0.2});
    cObserver.observe(el);
  });

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const field=document.getElementById(btn.dataset.target);
      if(field.select){field.select();field.setSelectionRange(0,99999);}
      navigator.clipboard.writeText(field.value||field.textContent);
      btn.innerHTML='✔ Copied';
      setTimeout(()=>{btn.innerHTML='<span>📋</span> Copy';},1500);
    });
  });

  // Modal
  const modal=document.getElementById('videoModal');
  const videoEl=document.getElementById('childVideo');
  document.querySelectorAll('.watch-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const src=btn.dataset.video;
      if(!src)return;
      videoEl.src=src; videoEl.setAttribute('preload','metadata');
      modal.style.display='flex';
      setTimeout(()=>videoEl.play().catch(()=>{}),200);
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn=>{
    btn.addEventListener('click',()=>{
      videoEl.pause(); videoEl.currentTime=0; videoEl.src='';
      modal.style.display='none';
    });
  });
  if(modal) modal.addEventListener('click',e=>{if(e.target===modal){videoEl.pause(); videoEl.currentTime=0; videoEl.src=''; modal.style.display='none';}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && modal && modal.style.display==='flex'){videoEl.pause();videoEl.currentTime=0;videoEl.src='';modal.style.display='none';}});
});
