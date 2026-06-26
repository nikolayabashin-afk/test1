(function () {
  'use strict';

  const data = window.siteData || {};
  const storageKey = 'medcoreQuoteBasket';

  const icons = {
    scan: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9V6.5A2.5 2.5 0 0 1 6.5 4H9M15 4h2.5A2.5 2.5 0 0 1 20 6.5V9M20 15v2.5a2.5 2.5 0 0 1-2.5 2.5H15M9 20H6.5A2.5 2.5 0 0 1 4 17.5V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 12h10M12 7v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    therapy: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-4.3 7-10.3A5.7 5.7 0 0 0 12 5a5.7 5.7 0 0 0-7 5.7C5 16.7 12 21 12 21Z" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v6M9 11h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    lab: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 3h6M10 3v5.2l-4.8 8.3A3 3 0 0 0 7.8 21h8.4a3 3 0 0 0 2.6-4.5L14 8.2V3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 15h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    service: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.5 6.5 17.5 4l2.5 2.5-2.5 3a5 5 0 0 1-6.4 6.4l-4.2 4.2a2 2 0 0 1-2.8-2.8l4.2-4.2a5 5 0 0 1 6.2-6.6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };

  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function qsa(selector, scope) { return Array.from((scope || document).querySelectorAll(selector)); }
  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  function initHeader() {
    const header = qs('.site-header');
    const toggle = qs('[data-menu-toggle]');
    const navLinks = qsa('.main-nav a');
    const current = document.body.dataset.page;

    if (current) {
      navLinks.forEach((link) => {
        if (link.dataset.page === current) link.classList.add('active');
      });
    }
    function syncHeader() {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 16);
    }
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });

    if (toggle) {
      toggle.addEventListener('click', () => {
        document.body.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(document.body.classList.contains('menu-open')));
      });
    }
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initReveals() {
    const targets = qsa('.reveal, [data-stagger]');
    if (!targets.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    targets.forEach((target) => observer.observe(target));
  }

  function initCounters() {
    const counters = qsa('[data-count]');
    if (!counters.length) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = (node) => {
      const end = Number(node.dataset.count || '0');
      const suffix = node.dataset.suffix || '';
      const duration = prefersReduced ? 0 : 1100;
      const startTime = performance.now();
      function tick(now) {
        const progress = duration ? Math.min((now - startTime) / duration, 1) : 1;
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = Math.round(end * eased).toLocaleString('ru-RU') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .35 });
    counters.forEach((node) => observer.observe(node));
  }

  function renderCategories() {
    const target = qs('[data-render="categories"]');
    if (!target) return;
    target.innerHTML = '';
    (data.categories || []).forEach((item) => {
      const card = el('article', 'card reveal', `
        <div class="icon-box">${icons[item.icon] || icons.scan}</div>
        <div class="card-kicker">${escapeHtml(item.kicker)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="card-link" href="catalog.html#${escapeHtml(item.id)}">Перейти в каталог</a>
      `);
      target.appendChild(card);
    });
  }

  function renderProducts() {
    const target = qs('[data-render="products"]');
    if (!target) return;
    const products = data.products || [];
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('category') || 'all';
    function draw(category) {
      target.innerHTML = '';
      products
        .filter((product) => category === 'all' || product.category === category)
        .forEach((product) => {
          const card = el('article', 'card product-card reveal', `
            <span class="tag">${escapeHtml(product.tag)}</span>
            <h3>${escapeHtml(product.title)}</h3>
            <p>${escapeHtml(product.description)}</p>
            <button class="btn btn-secondary" type="button" data-add-product="${escapeHtml(product.id)}">Добавить в запрос</button>
          `);
          card.id = product.id;
          target.appendChild(card);
        });
      initReveals();
      bindAddButtons();
    }
    qsa('[data-filter]').forEach((button) => {
      button.classList.toggle('active', button.dataset.filter === initial);
      button.addEventListener('click', () => {
        qsa('[data-filter]').forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        draw(button.dataset.filter || 'all');
      });
    });
    draw(initial);
  }

  function renderProjects() {
    const target = qs('[data-render="projects"]');
    if (!target) return;
    target.innerHTML = '';
    (data.projects || []).forEach((item) => {
      const card = el('article', 'card reveal', `
        <div class="card-kicker">${escapeHtml(item.city)} · ${escapeHtml(item.type)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="card-link" href="contacts.html">Обсудить похожий проект</a>
      `);
      target.appendChild(card);
    });
  }

  function renderNews() {
    const target = qs('[data-render="news"]');
    if (!target) return;
    target.innerHTML = '';
    (data.news || []).forEach((item) => {
      const card = el('article', 'card reveal', `
        <div class="card-kicker">${escapeHtml(item.date)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
        <a class="card-link" href="contacts.html">Запросить материал</a>
      `);
      target.appendChild(card);
    });
  }

  function renderPartners() {
    const tracks = qsa('[data-render="partners"]');
    if (!tracks.length) return;
    const partners = (data.partners || []).concat(data.partners || []);
    tracks.forEach((target) => {
      target.innerHTML = partners.map((name) => `<div class="logo-pill">${escapeHtml(name)}</div>`).join('');
    });
  }

  function getBasket() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
    catch (error) { return []; }
  }
  function saveBasket(items) { localStorage.setItem(storageKey, JSON.stringify(items)); }
  function getProduct(id) { return (data.products || []).find((product) => product.id === id); }
  function addToBasket(productId) {
    const product = getProduct(productId);
    if (!product) return;
    const basket = getBasket();
    const existing = basket.find((item) => item.id === productId);
    if (existing) existing.qty += 1;
    else basket.push({ id: productId, qty: 1 });
    saveBasket(basket);
    renderBasket(true);
  }
  function removeFromBasket(productId) {
    const basket = getBasket().filter((item) => item.id !== productId);
    saveBasket(basket);
    renderBasket(true);
  }
  function basketMessage() {
    const basket = getBasket();
    if (!basket.length) return '';
    const lines = basket.map((item) => {
      const product = getProduct(item.id);
      return product ? `- ${product.title} — ${item.qty} шт.` : '';
    }).filter(Boolean);
    return `Здравствуйте. Прошу подготовить коммерческое предложение по следующим позициям:\n${lines.join('\n')}\n\nДополнительные требования к проекту:`;
  }
  function renderBasket(open) {
    const bar = qs('[data-quote-bar]');
    if (!bar) return;
    const basket = getBasket();
    const countNode = qs('[data-quote-count]', bar);
    const listNode = qs('[data-quote-items]', bar);
    const emptyNode = qs('[data-quote-empty]', bar);
    if (countNode) countNode.textContent = String(basket.reduce((sum, item) => sum + item.qty, 0));
    if (listNode) {
      listNode.innerHTML = basket.map((item) => {
        const product = getProduct(item.id);
        if (!product) return '';
        return `<div class="quote-item"><span>${escapeHtml(product.title)} × ${item.qty}</span><button type="button" aria-label="Удалить" data-remove-product="${escapeHtml(item.id)}">×</button></div>`;
      }).join('');
    }
    if (emptyNode) emptyNode.hidden = basket.length > 0;
    bar.classList.toggle('open', Boolean(open));
    qsa('[data-remove-product]', bar).forEach((button) => {
      button.addEventListener('click', () => removeFromBasket(button.dataset.removeProduct));
    });
  }
  function bindAddButtons() {
    qsa('[data-add-product]').forEach((button) => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => addToBasket(button.dataset.addProduct));
    });
  }
  function initBasket() {
    const bar = qs('[data-quote-bar]');
    if (!bar) return;
    const toggle = qs('[data-quote-toggle]', bar);
    const request = qs('[data-request-quote]', bar);
    if (toggle) toggle.addEventListener('click', () => bar.classList.toggle('open'));
    if (request) {
      request.addEventListener('click', () => {
        sessionStorage.setItem('medcoreQuoteMessage', basketMessage());
      });
    }
    renderBasket(false);
    bindAddButtons();
  }

  function initContactForm() {
    const textarea = qs('#message');
    if (textarea) {
      const stored = sessionStorage.getItem('medcoreQuoteMessage') || basketMessage();
      if (stored && !textarea.value.trim()) textarea.value = stored;
    }
    const form = qs('[data-contact-form]');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = qs('[data-form-status]', form);
      if (status) status.textContent = 'Демо-форма не отправляет данные. Подключите почту, CRM или backend перед запуском.';
      form.classList.add('submitted');
    });
  }

  function initParallax() {
    const items = qsa('[data-parallax]');
    if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    function update() {
      const y = window.scrollY;
      items.forEach((item) => {
        const speed = Number(item.dataset.parallax || '0.06');
        item.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    renderCategories();
    renderProducts();
    renderProjects();
    renderNews();
    renderPartners();
    initBasket();
    initContactForm();
    initCounters();
    initParallax();
    initReveals();
  });
})();
