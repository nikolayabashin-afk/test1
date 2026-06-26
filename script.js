const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function setCompany(){
  $$('[data-company]').forEach(el => el.textContent = COMPANY.name);
  $$('[data-phone]').forEach(el => el.textContent = COMPANY.phone);
  $$('[data-email]').forEach(el => { el.textContent = COMPANY.email; el.href = `mailto:${COMPANY.email}`; });
  $$('[data-address]').forEach(el => el.textContent = COMPANY.address);
}

function nav(){
  const btn = $('.nav-toggle'); const menu = $('.nav-links');
  if(btn && menu) btn.addEventListener('click', () => menu.classList.toggle('open'));
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => { if(a.getAttribute('href') === path) a.classList.add('active'); });
}

function reveal(){
  const els = $$('.reveal');
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
  }), {threshold:.12});
  els.forEach(e => io.observe(e));
}

function icon(type){
  const map = {scan:'M4 7h16M4 17h16M8 3v18M16 3v18', beam:'M12 2v20M4 6l16 12M20 6L4 18', lab:'M9 2h6M10 2v6l-5 9a3 3 0 0 0 3 5h8a3 3 0 0 0 3-5l-5-9V2'};
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${map[type]||map.scan}"/></svg>`;
}

function renderHome(){
  const dir = $('#directions');
  if(dir) dir.innerHTML = directions.map(d => `<a class="direction-card reveal" href="${d.href}">${icon(d.icon)}<span>${d.title}</span><p>${d.text}</p><b>Перейти →</b></a>`).join('');
  const p = $('#projectPreview');
  if(p) p.innerHTML = projects.slice(0,3).map(x => `<article class="project-card reveal"><small>${x.city}</small><h3>${x.title}</h3><p>${x.text}</p><span>${x.meta}</span></article>`).join('');
  const n = $('#newsPreview');
  if(n) n.innerHTML = news.map(x => `<article class="news-card reveal"><time>${x.date}</time><h3>${x.title}</h3><p>${x.text}</p></article>`).join('');
}

function basket(){
  const get = () => JSON.parse(localStorage.getItem('quoteItems') || '[]');
  const set = items => localStorage.setItem('quoteItems', JSON.stringify(items));
  const count = $('#basketCount');
  const updateCount = () => { if(count) count.textContent = get().reduce((a,b)=>a+b.qty,0); };
  updateCount();
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if(!btn) return;
    const id = btn.dataset.add; const item = products.find(p=>p.id===id); if(!item) return;
    const items = get(); const found = items.find(x=>x.id===id);
    found ? found.qty++ : items.push({id, qty:1, name:item.name});
    set(items); updateCount(); btn.textContent = 'Добавлено'; setTimeout(()=>btn.textContent='Добавить в подбор',900);
  });
  const panel = $('#basketPanel');
  if(panel){
    const render = () => {
      const items = get();
      panel.innerHTML = items.length ? items.map(i => `<div class="basket-row"><span>${i.name}</span><button data-dec="${i.id}">−</button><b>${i.qty}</b><button data-inc="${i.id}">+</button><button data-remove="${i.id}">×</button></div>`).join('') + '<a class="btn primary wide" href="contacts.html?quote=1">Запросить КП</a>' : '<p class="muted">Подбор пока пуст. Добавьте интересующие позиции из каталога.</p>';
    };
    panel.addEventListener('click', e => {
      const items = get(); const id = e.target.dataset.inc || e.target.dataset.dec || e.target.dataset.remove; if(!id) return;
      const it = items.find(x=>x.id===id); if(!it) return;
      if(e.target.dataset.inc) it.qty++;
      if(e.target.dataset.dec) it.qty = Math.max(1, it.qty-1);
      if(e.target.dataset.remove) items.splice(items.indexOf(it),1);
      set(items); updateCount(); render();
    });
    render();
  }
}

function renderCatalog(){
  const list = $('#productGrid'); if(!list) return;
  const draw = cat => {
    const arr = cat === 'all' ? products : products.filter(p=>p.category===cat);
    list.innerHTML = arr.map(p => `<article class="product-card reveal" id="${p.id}"><span>${p.tag}</span><h3>${p.name}</h3><p>${p.desc}</p><button class="btn ghost" data-add="${p.id}">Добавить в подбор</button></article>`).join('');
    reveal();
  };
  draw('all');
  $$('.filter-btn').forEach(b => b.addEventListener('click', ()=>{$$('.filter-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); draw(b.dataset.filter);}));
}

function renderProjects(){
  const grid = $('#projectsGrid'); if(grid) grid.innerHTML = projects.map(p=>`<article class="project-card reveal"><small>${p.city}</small><h3>${p.title}</h3><p>${p.text}</p><span>${p.meta}</span></article>`).join('');
}

function contactQuote(){
  const form = $('#contactForm'); if(!form) return;
  if(new URLSearchParams(location.search).get('quote')){
    const items = JSON.parse(localStorage.getItem('quoteItems') || '[]');
    const msg = $('#message');
    if(msg && items.length) msg.value = 'Здравствуйте! Прошу подготовить КП по следующим позициям:\n\n' + items.map(i=>`• ${i.name} — ${i.qty} шт.`).join('\n') + '\n\nКонтактные данные и детали проекта:';
  }
  form.addEventListener('submit', e => { e.preventDefault(); $('#formStatus').textContent = 'Демо-форма: подключите обработчик на backend / CRM / почту.'; });
}

function init(){ setCompany(); nav(); renderHome(); renderCatalog(); renderProjects(); basket(); contactQuote(); reveal(); }
document.addEventListener('DOMContentLoaded', init);
