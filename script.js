
const DATA = window.OLDTECH_DATA || { categories: [], products: [] };

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const params = new URLSearchParams(location.search);
const CART_KEY = "oldtech_cart_v2";
const LANG_KEY = "oldtech_lang";

let currentLang = localStorage.getItem(LANG_KEY) || "ru";

const UI = {
  ru: {
    home:"Главная", catalog:"Каталог", about:"О компании", contacts:"Контакты", quote:"Оставить заявку",
    heroEyebrow:"Премиальная демонстрация продукта", heroTitle:"Медицинское оборудование и расходные материалы",
    heroLead:"Подберите нужные позиции, добавьте артикулы в корзину и отправьте быстрый запрос на КП.",
    scrollHint:"Прокрутите вниз", exploreCatalog:"Перейти в каталог", requestQuote:"Запросить КП",
    mriTitle:"MRI scanner exploded view", mriText:"Прокрутите вниз: аппарат плавно раскрывается в exploded view. Прокрутка вверх собирает его обратно.",
    compact:"Каталог", cards:"карточек", articles:"артикулов", directions:"направлений",
    filters:"Фильтры", search:"Поиск по названию, производителю или артикулу", found:"Найдено", productCards:"карточек", articleRows:"артикулов",
    sortName:"Сортировка: по названию", sortArticle:"Сортировка: по артикулу", nothing:"Ничего не найдено. Попробуйте убрать часть фильтров.",
    price:"Цена по запросу", add:"В корзину", details:"Подробнее", basket:"Корзина", basketEmpty:"Корзина пустая",
    goQuote:"Оставить заявку", clear:"Очистить", remove:"Удалить", qty:"Кол-во", added:"Добавлено в корзину",
    purpose:"Назначение", catSub:"Раздел / подраздел", back:"Вернуться в раздел", docs:"Документация",
    reg:"Регистрационное удостоверение", instruction:"Инструкция / паспорт изделия", certs:"Сертификаты и декларации",
    variants:"Варианты / артикулы", name:"Наименование", note:"Примечание", subsection:"Подраздел", quantity:"Количество",
    contactTitle:"Отправьте запрос на подбор или КП", contactLead:"Выбранные товары из корзины автоматически добавятся в сообщение.",
    whatSend:"Что можно отправить", whatSendText:"ТЗ, артикулы, список оборудования, ссылку на закупку или описание клинической задачи.",
    nameField:"Ваше имя", company:"Компания", email:"Email", phone:"Телефон", selectCategory:"Выберите раздел", message:"Опишите задачу или вставьте артикулы",
    send:"Отправить запрос", quotePrefix:"Здравствуйте, хочу запросить КП на следующие позиции:", comment:"Комментарий:",
    categoriesTitle:"Разделы продукции", categoriesLead:"Кликайте по разделам и быстрым фильтрам. Добавляйте позиции в корзину и отправляйте запрос на КП.",
    aboutTitle:"Каталог и подбор медицинских изделий для B2B-задач", aboutLead:"Компактная демонстрационная версия сайта: вся номенклатура хранится в одном data-файле, а страницы формируются динамически.",
    catalogTitle:"Разделы медицинской продукции", catalogLead:"Выберите раздел, чтобы перейти к фильтрам, карточкам товаров и подробным страницам.",
    disclaimer:"Демонстрационная версия сайта. Перед публикацией замените демо-данные, email, телефон, юридические сведения, изображения и документы на реальные."
  },
  en: {
    home:"Home", catalog:"Catalog", about:"About", contacts:"Contacts", quote:"Request quote",
    heroEyebrow:"Premium product presentation", heroTitle:"Medical equipment and consumables",
    heroLead:"Find the right items, add article numbers to the basket and send a fast quote request.",
    scrollHint:"Scroll down", exploreCatalog:"Explore catalog", requestQuote:"Request quote",
    mriTitle:"MRI scanner exploded view", mriText:"Scroll down: the scanner smoothly opens into an exploded view. Scroll back up to assemble it again.",
    compact:"Catalog", cards:"cards", articles:"articles", directions:"directions",
    filters:"Filters", search:"Search by name, manufacturer or article", found:"Found", productCards:"cards", articleRows:"articles",
    sortName:"Sort: name", sortArticle:"Sort: article", nothing:"Nothing found. Try removing some filters.",
    price:"Price on request", add:"Add to basket", details:"Details", basket:"Basket", basketEmpty:"Basket is empty",
    goQuote:"Request quote", clear:"Clear", remove:"Remove", qty:"Qty", added:"Added to basket",
    purpose:"Purpose", catSub:"Category / subsection", back:"Back to section", docs:"Documentation",
    reg:"Registration certificate", instruction:"Instructions / product passport", certs:"Certificates and declarations",
    variants:"Variants / articles", name:"Name", note:"Note", subsection:"Subsection", quantity:"Quantity",
    contactTitle:"Send a selection or quote request", contactLead:"Items selected in the basket are automatically added to the message.",
    whatSend:"What you can send", whatSendText:"Technical requirements, articles, equipment lists, procurement links or a description of the clinical task.",
    nameField:"Your name", company:"Company", email:"Email", phone:"Phone", selectCategory:"Select category", message:"Describe the task or paste article numbers",
    send:"Send request", quotePrefix:"Hello, I would like to request a quote for the following items:", comment:"Comment:",
    categoriesTitle:"Product directions", categoriesLead:"Click categories and quick filters. Add items to the basket and send a quote request.",
    aboutTitle:"Medical B2B catalog and product selection", aboutLead:"Compact demo version: the full catalog is stored in one data file and pages are rendered dynamically.",
    catalogTitle:"Medical product categories", catalogLead:"Choose a category to open filters, product cards and detailed pages.",
    disclaimer:"Demo version. Before publishing, replace demo data, email, phone, legal information, images and documents with real ones."
  }
};

function t(key){ return (UI[currentLang] && UI[currentLang][key]) || UI.ru[key] || key; }
function field(obj, ruKey, enKey){
  if(currentLang === "en" && obj && obj[enKey]) return obj[enKey];
  return obj ? obj[ruKey] : "";
}
function textCat(c, key){
  if(key === "title") return currentLang === "en" ? (c.titleEn || c.title) : c.title;
  if(key === "desc") return currentLang === "en" ? (c.descEn || c.desc) : c.desc;
  return "";
}
function textProduct(p, key){
  const map = { name:["name","nameEn"], shortName:["shortName","shortNameEn"], category:["category","categoryEn"], subcategory:["subcategory","subcategoryEn"], purpose:["purpose","purposeEn"] };
  const [ru,en] = map[key] || [key, key+"En"];
  return currentLang === "en" ? (p[en] || p[ru]) : p[ru];
}
function textVariant(v, key){
  const map = { name:["name","nameEn"], note:["note","noteEn"], subcategory:["subcategory","subcategoryEn"], price:["price","priceEn"] };
  const [ru,en] = map[key] || [key, key+"En"];
  return currentLang === "en" ? (v[en] || v[ru]) : v[ru];
}
function productFilters(p){
  return currentLang === "en" ? (p.filtersEn || p.filters || {}) : (p.filters || {});
}
function specObj(v){
  return currentLang === "en" ? (v.specsEn || v.specs || {}) : (v.specs || {});
}

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function cartCount(){
  return getCart().reduce((sum, item) => sum + Number(item.qty || 1), 0);
}
function updateCartCount(){
  $$(".cart-count").forEach(el => el.textContent = cartCount());
}
function getProduct(id){
  return DATA.products.find(p => p.id === id);
}
function addToCart(productId, variantIndex=0, qty=1){
  const p = getProduct(productId);
  if(!p) return;
  const v = p.variants[variantIndex] || p.variants[0] || {};
  const key = `${productId}::${v.article || variantIndex}`;
  const cart = getCart();
  const existing = cart.find(item => item.key === key);
  if(existing){
    existing.qty = Number(existing.qty || 1) + qty;
  } else {
    cart.push({
      key,
      productId,
      variantIndex,
      article: v.article || "",
      nameRu: v.name || p.name,
      nameEn: v.nameEn || p.nameEn || v.name || p.name,
      categoryRu: p.category,
      categoryEn: p.categoryEn || p.category,
      qty
    });
  }
  saveCart(cart);
  showToast(t("added"));
  openCart();
}
function removeCartItem(key){
  saveCart(getCart().filter(item => item.key !== key));
  renderCartItems();
}
function setCartQty(key, delta){
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if(!item) return;
  item.qty = Math.max(1, Number(item.qty || 1) + delta);
  saveCart(cart);
  renderCartItems();
}
function clearCart(){
  saveCart([]);
  renderCartItems();
}
function cartItemName(item){
  return currentLang === "en" ? (item.nameEn || item.nameRu) : item.nameRu;
}
function buildCartMessage(){
  const cart = getCart();
  if(!cart.length) return "";
  const lines = [t("quotePrefix"), ""];
  cart.forEach((item, idx) => {
    lines.push(`${idx+1}. ${currentLang === "en" ? "Article" : "Артикул"}: ${item.article || (currentLang === "en" ? "on request" : "по запросу")}`);
    lines.push(`   ${currentLang === "en" ? "Name" : "Наименование"}: ${cartItemName(item)}`);
    lines.push(`   ${currentLang === "en" ? "Quantity" : "Количество"}: ${item.qty || 1}`);
    lines.push("");
  });
  lines.push(t("comment"));
  return lines.join("\n");
}
function goQuoteFromCart(){
  localStorage.setItem("oldtech_prefill_quote", buildCartMessage());
  location.href = "contacts.html?quote=1";
}

function showToast(message){
  const toast = $(".toast");
  if(!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => toast.classList.remove("visible"), 1800);
}

function header(active="catalog"){
  return `<div class="page-bg"></div>
<header class="topbar modern-topbar">
  <a class="logo" href="index.html"><span>O</span><strong>OldTech</strong></a>
  <nav>
    <a class="${active==='home'?'active':''}" href="index.html">${t("home")}</a>
    <a class="${active==='catalog'?'active':''}" href="catalog.html">${t("catalog")}</a>
    <a class="${active==='about'?'active':''}" href="about.html">${t("about")}</a>
    <a class="${active==='contacts'?'active':''}" href="contacts.html">${t("contacts")}</a>
  </nav>
  <div class="top-actions">
    <button class="lang-toggle" type="button" data-lang-toggle>${currentLang === "ru" ? "EN" : "RU"}</button>
    <button class="basket-button" type="button" data-open-cart>🛒 <span class="cart-count">${cartCount()}</span></button>
    <a class="top-cta" href="contacts.html">${t("quote")}</a>
  </div>
</header>`;
}

function footer(){
  return `<footer class="footer">
  <div class="footer-grid">
    <div><a class="logo foot-logo" href="index.html"><span>O</span><strong>OldTech</strong></a><p>${currentLang === "en" ? "Medical B2B catalog, product selection and quote request workflow." : "Медицинский B2B-каталог, подбор оборудования и расходных материалов под клинические задачи."}</p></div>
    <div><h4>${t("catalog")}</h4><a href="catalog.html">${currentLang === "en" ? "All categories" : "Все разделы"}</a><a href="contacts.html">${t("requestQuote")}</a></div>
    <div><h4>${t("contacts")}</h4><a href="mailto:your@email.com">your@email.com</a><a href="contacts.html">${currentLang === "en" ? "Request form" : "Форма заявки"}</a></div>
  </div>
  <div class="footer-note">${t("disclaimer")}</div>
</footer>
<div class="float-buttons"><a href="#top">⌃</a><button type="button" data-open-cart>🛒<span class="cart-count">${cartCount()}</span></button></div>
${cartDrawer()}
<div class="toast"></div>`;
}

function cartDrawer(){
  return `<div class="cart-backdrop" data-close-cart></div>
<aside class="cart-drawer" aria-label="${t("basket")}">
  <div class="cart-head">
    <div><p class="eyebrow">${t("basket")}</p><h3>${t("basket")}</h3></div>
    <button type="button" class="drawer-close" data-close-cart>×</button>
  </div>
  <div class="cart-items"></div>
  <div class="cart-actions">
    <button type="button" class="btn btn-secondary" data-clear-cart>${t("clear")}</button>
    <button type="button" class="btn btn-primary" data-quote-cart>${t("goQuote")}</button>
  </div>
</aside>`;
}

function renderCartItems(){
  const wrap = $(".cart-items");
  if(!wrap) return;
  const cart = getCart();
  if(!cart.length){
    wrap.innerHTML = `<div class="cart-empty">${t("basketEmpty")}</div>`;
    return;
  }
  wrap.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <b>${esc(cartItemName(item))}</b>
        <small>${esc(item.article || (currentLang === "en" ? "article on request" : "артикул по запросу"))}</small>
      </div>
      <div class="cart-qty">
        <button type="button" data-cart-dec="${esc(item.key)}">−</button>
        <span>${esc(item.qty || 1)}</span>
        <button type="button" data-cart-inc="${esc(item.key)}">+</button>
      </div>
      <button type="button" class="cart-remove" data-cart-remove="${esc(item.key)}">${t("remove")}</button>
    </div>
  `).join("");
}
function openCart(){
  document.body.classList.add("cart-open");
  renderCartItems();
}
function closeCart(){
  document.body.classList.remove("cart-open");
}

function initCommonUI(){
  updateCartCount();
  document.addEventListener("click", (e) => {
    const langBtn = e.target.closest("[data-lang-toggle]");
    if(langBtn){
      currentLang = currentLang === "ru" ? "en" : "ru";
      localStorage.setItem(LANG_KEY, currentLang);
      location.reload();
      return;
    }
    if(e.target.closest("[data-open-cart]")){ openCart(); return; }
    if(e.target.closest("[data-close-cart]")){ closeCart(); return; }
    if(e.target.closest("[data-clear-cart]")){ clearCart(); return; }
    if(e.target.closest("[data-quote-cart]")){ goQuoteFromCart(); return; }

    const add = e.target.closest("[data-add-cart]");
    if(add){
      e.preventDefault();
      e.stopPropagation();
      addToCart(add.dataset.product, Number(add.dataset.variant || 0), 1);
      return;
    }

    const remove = e.target.closest("[data-cart-remove]");
    if(remove){ removeCartItem(remove.dataset.cartRemove); return; }
    const inc = e.target.closest("[data-cart-inc]");
    if(inc){ setCartQty(inc.dataset.cartInc, 1); return; }
    const dec = e.target.closest("[data-cart-dec]");
    if(dec){ setCartQty(dec.dataset.cartDec, -1); return; }
  });
}

function initReveal(){
  document.querySelectorAll(".reveal").forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    observer.observe(el);
  });
}

function imgTag(src, alt, cls="", fallback="assets/img/medical.svg"){
  return `<img ${cls ? `class="${cls}"` : ""} loading="lazy" decoding="async" src="${esc(src)}" alt="${esc(alt)}" onerror="this.onerror=null;this.src='${esc(fallback)}';">`;
}

function categoryImage(title){
  const s = title.toLowerCase();
  if(s.includes("щип") || s.includes("биоп")) return "https://img.medicalexpo.it/images_me/photo-mg/79038-9349448.jpg";
  if(s.includes("монитор")) return "assets/img/monitor.svg";
  if(s.includes("инфуз")) return "assets/img/pump.svg";
  if(s.includes("магистра")) return "assets/img/line.svg";
  if(s.includes("энтераль") || s.includes("гастрост") || s.includes("зонд")) return "assets/img/enteral.svg";
  if(s.includes("аксесс")) return "assets/img/accessory.svg";
  return "assets/img/medical.svg";
}

function renderCategories(){
  return DATA.categories.map(c => `
    <a class="cat-card reveal modern-card magnetic" href="catalog.html?cat=${encodeURIComponent(c.slug)}">
      <h3>${esc(textCat(c,"title"))}</h3>
      <div class="plus">+</div>
      <p>${esc(textCat(c,"desc"))}</p>
      ${imgTag(categoryImage(c.title), textCat(c,"title"), "", "assets/img/medical.svg")}
      <div class="cat-meta"><span class="pill">${c.count} ${t("cards")}</span></div>
    </a>
  `).join("");
}



function medicalBentoSection(){
  const isEn = currentLang === "en";
  const labels = isEn ? {
    eyebrow:"21st.dev-inspired medical UI block",
    title:"Procurement cockpit for clinical teams",
    lead:"A compact visual layer for hospitals and distributors: selected categories, request flow, documentation readiness, and service confidence in one premium dashboard-style section.",
    badge:"Live catalog logic",
    card1Title:"Fast selection",
    card1Text:"Categories, article variants, filters, and basket stay connected to one quote request.",
    card2Title:"Document-ready",
    card2Text:"The request can include exact article numbers, quantities, and notes for procurement teams.",
    card3Title:"Clinical reliability",
    card3Text:"A clean trust block for certified equipment, consumables, service, and delivery coordination.",
    cta:"Open catalog",
    quote:"Request quote",
    timeline:["Find category","Select article","Add to basket","Send request"],
    stat1:"657",
    stat1Text:"article rows",
    stat2:"11",
    stat2Text:"directions",
    stat3:"24h",
    stat3Text:"request workflow"
  } : {
    eyebrow:"Медицинский UI-блок в стиле 21st.dev",
    title:"Панель подбора для клиник и закупок",
    lead:"Премиальный dashboard-блок для медицинского сайта: категории, артикулы, корзина, готовность документов и заявка на КП собраны в один понятный сценарий.",
    badge:"Живая логика каталога",
    card1Title:"Быстрый подбор",
    card1Text:"Категории, варианты артикулов, фильтры и корзина связаны с одной заявкой на КП.",
    card2Title:"Готово для закупки",
    card2Text:"В запрос можно передать точные артикулы, количество и комментарии для отдела закупок.",
    card3Title:"Надёжность для клиники",
    card3Text:"Акцент на оборудование, расходные материалы, сервис и координацию поставки.",
    cta:"Открыть каталог",
    quote:"Запросить КП",
    timeline:["Выбор категории","Выбор артикула","Добавление в корзину","Отправка заявки"],
    stat1:"657",
    stat1Text:"строк артикулов",
    stat2:"11",
    stat2Text:"направлений",
    stat3:"24ч",
    stat3Text:"логика заявки"
  };

  return `<section class="section med-bento-section" aria-label="${esc(labels.title)}">
    <div class="med-bento-bg" aria-hidden="true"></div>
    <div class="med-bento-wrap">
      <div class="med-bento-head reveal">
        <div>
          <p class="eyebrow">${labels.eyebrow}</p>
          <h2>${labels.title}</h2>
        </div>
        <p>${labels.lead}</p>
      </div>

      <div class="med-bento-grid reveal">
        <article class="med-bento-card med-bento-main">
          <div class="med-bento-topline">
            <span>${labels.badge}</span>
            <i></i>
          </div>
          <div class="med-cockpit">
            <div class="med-cockpit-radar" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>
            <div class="med-cockpit-panel">
              <div class="med-panel-bar"><b></b><b></b><b></b></div>
              <h3>${isEn ? "Equipment request status" : "Статус подбора оборудования"}</h3>
              <div class="med-progress-line"><span style="width:86%"></span></div>
              <div class="med-timeline">
                ${labels.timeline.map((item, i) => `<div class="${i < 3 ? "done" : ""}"><em>${String(i+1).padStart(2,"0")}</em><span>${item}</span></div>`).join("")}
              </div>
            </div>
          </div>
        </article>

        <article class="med-bento-card">
          <small>${isEn ? "Catalog" : "Каталог"}</small>
          <h3>${labels.card1Title}</h3>
          <p>${labels.card1Text}</p>
        </article>

        <article class="med-bento-card">
          <small>${isEn ? "Quote" : "КП"}</small>
          <h3>${labels.card2Title}</h3>
          <p>${labels.card2Text}</p>
        </article>

        <article class="med-bento-card med-bento-stat">
          <strong>${labels.stat1}</strong>
          <span>${labels.stat1Text}</span>
        </article>

        <article class="med-bento-card med-bento-stat">
          <strong>${labels.stat2}</strong>
          <span>${labels.stat2Text}</span>
        </article>

        <article class="med-bento-card med-bento-wide">
          <div>
            <small>${isEn ? "Clinical trust" : "Доверие клиники"}</small>
            <h3>${labels.card3Title}</h3>
            <p>${labels.card3Text}</p>
          </div>
          <div class="med-mini-stack" aria-hidden="true"><span></span><span></span><span></span></div>
        </article>

        <article class="med-bento-card med-bento-action">
          <strong>${labels.stat3}</strong>
          <span>${labels.stat3Text}</span>
          <div class="med-action-row">
            <a class="btn btn-primary" href="catalog.html">${labels.cta}</a>
            <a class="btn btn-secondary" href="contacts.html">${labels.quote}</a>
          </div>
        </article>
      </div>
    </div>
  </section>`;
}


function renderHome(){
  document.body.innerHTML = header("home") + `
<main id="top">
  <section class="mri-scroll-section mri-top-section mri-big-hero" id="mri-scroll" aria-label="Scroll-driven product animation">
    <div class="mri-pin">
      <div class="mri-visual-wrap">
        <div class="mri-centered-copy reveal">
          <p class="eyebrow">${t("heroEyebrow")}</p>
          <h1>${t("heroTitle")}</h1>
          <p class="lead">${t("heroLead")}</p>
          <div class="hero-overlay-actions">
            <a class="btn btn-primary" href="catalog.html">${t("exploreCatalog")}</a>
            <a class="btn btn-secondary" href="contacts.html">${t("requestQuote")}</a>
          </div>
        </div>

        <div class="mri-stage big-video-stage">
          <video
            id="mriScrollVideo"
            class="mri-video big-scroll-video"
            muted
            playsinline
            preload="metadata"
            poster="assets/video/mri-new-poster.jpg"
            data-src="assets/video/mri-new-scrub.mp4"
            aria-label="Scroll-driven product animation">
          </video>
        </div>

        <div class="scroll-cue">${t("scrollHint")} ↓</div>
      </div>
    </div>
  </section>

  ${medicalBentoSection()}

  <section class="section">
    <div class="section-head reveal"><div><p class="eyebrow">${t("catalog")}</p><h2>${t("categoriesTitle")}</h2></div><p>${t("categoriesLead")}</p></div>
    <div class="category-grid">${renderCategories()}</div>
  </section>
</main>` + footer();
  initReveal();
  initCommonUI();
  initMriScrollVideo();
}



function renderCatalog(){
  const catSlug = params.get("cat");
  const prodId = params.get("product");
  if(prodId) return renderProduct(prodId);
  if(catSlug) return renderCategory(catSlug);

  document.body.innerHTML = header("catalog") + `
<main id="top">
  <section class="page-hero reveal">
    <div class="breadcrumbs"><a href="index.html">${t("home")}</a> / ${t("catalog")}</div>
    <p class="eyebrow">${t("catalog")}</p>
    <h1>${t("catalogTitle")}</h1>
    <p class="lead">${t("catalogLead")}</p>
  </section>
  <section class="section" style="padding-top:28px"><div class="category-grid">${renderCategories()}</div></section>
</main>` + footer();
  initReveal();
  initCommonUI();
}

function getFilterKeys(products){
  const counts = {};
  products.forEach(p => {
    Object.entries(productFilters(p)).forEach(([key, vals]) => {
      vals.forEach(v => {
        if(!v || v === "нет данных" || v === "no data" || v === "—") return;
        counts[key] = counts[key] || new Set();
        counts[key].add(v);
      });
    });
  });
  const prefRu = ["Подраздел","Производитель","Применение","Канал","Диаметр инструмента","Игла","Тип бранш","Механизм","Фенестрированные","Длина"];
  const prefEn = ["Subsection","Manufacturer","Application","Channel","Instrument diameter","Needle","Jaw type","Mechanism","Fenestrated","Length"];
  const preferred = currentLang === "en" ? prefEn : prefRu;
  const keys = preferred.filter(k => counts[k] && counts[k].size > 1);
  Object.keys(counts).forEach(k => { if(!keys.includes(k) && counts[k].size > 1) keys.push(k); });
  return keys.slice(0, 10);
}

function renderFilterBlock(key, products){
  const vals = [...new Set(products.flatMap(p => (productFilters(p)[key]) || []))]
    .filter(v => v && !["нет данных","no data","—"].includes(v))
    .sort((a,b)=>String(a).localeCompare(String(b), currentLang === "en" ? "en" : "ru", {numeric:true}));
  if(vals.length < 2) return "";
  return `<details class="filter-block" ${key===getSubKey() || key===getManufacturerKey() ? "open" : ""}>
    <summary>${esc(key)}</summary>
    <div class="filter-options">
      ${vals.map(v=>`<label class="filter-label"><input class="filter-check" type="checkbox" data-key="${esc(key)}" value="${esc(v)}"> ${esc(v)}</label>`).join("")}
    </div>
  </details>`;
}
function getSubKey(){ return currentLang === "en" ? "Subsection" : "Подраздел"; }
function getManufacturerKey(){ return currentLang === "en" ? "Manufacturer" : "Производитель"; }


function forcepsScrollHero(cat){
  return `<section class="forceps-scroll-section product-scroll-section forceps-big-hero" id="forceps-scroll" aria-label="Scroll-driven forceps animation">
    <div class="product-scroll-pin forceps-pin">
      <div class="product-scroll-wrap">
        <div class="product-scroll-copy reveal">
          <p class="eyebrow">${t("catalog")}</p>
          <h1>${esc(textCat(cat,"title"))}</h1>
          <p class="lead">${esc(textCat(cat,"desc"))}</p>
        </div>

        <div class="product-scroll-stage forceps-scroll-stage big-video-stage">
          <video
            id="forcepsScrollVideo"
            class="product-scroll-video forceps-scroll-video big-scroll-video"
            muted
            playsinline
            preload="metadata"
            poster="assets/video/forceps-new-cropped-poster.jpg"
            data-src="assets/video/forceps-new-cropped-scrub.mp4"
            aria-label="Scroll-driven forceps animation">
          </video>
        </div>

        <div class="scroll-cue">${t("scrollHint")} ↓</div>
      </div>
    </div>
  </section>`;
}


function renderCategory(catSlug){
  const cat = DATA.categories.find(c => c.slug === catSlug) || DATA.categories[0];
  const products = DATA.products.filter(p => p.categorySlug === cat.slug);
  const keys = getFilterKeys(products);
  const subKey = getSubKey();
  const subBadges = [...new Set(products.flatMap(p => (productFilters(p)[subKey]) || [textProduct(p,"subcategory")]))].filter(Boolean).slice(0,10);

  const topAnimation = cat.slug === "category-biopsy-forceps" ? forcepsScrollHero(cat) : "";
  document.body.innerHTML = header("catalog") + `
<main id="top" data-filter-page>
  ${topAnimation}
  <section class="page-hero reveal compact-page-hero">
    <div class="breadcrumbs"><a href="index.html">${t("home")}</a> / <a href="catalog.html">${t("catalog")}</a> / ${esc(textCat(cat,"title"))}</div>
    <p class="eyebrow">${t("catalog")}</p>
    <h1>${esc(textCat(cat,"title"))}</h1>
    <p class="lead">${esc(textCat(cat,"desc"))}</p>
    <div class="quick-filter-row">${subBadges.map(s=>`<button type="button" class="quick-filter-chip" data-chip-key="${esc(subKey)}" data-chip-value="${esc(s)}">${esc(s)}</button>`).join("")}</div>
  </section>
  <section class="section catalog-section" style="padding-top:30px">
    <div class="catalog-layout">
      <aside class="sidebar">
        <div class="filter-title">${t("filters")}</div>
        ${keys.map(k => renderFilterBlock(k, products)).join("")}
      </aside>
      <div>
        <div class="search-row"><input id="catalogSearch" placeholder="${esc(t("search"))}"><a class="btn btn-secondary" href="contacts.html">${t("requestQuote")}</a></div>
        <div class="sortbar"><small id="countText">${t("found")}: ${products.length} ${t("productCards")}, ${products.reduce((a,p)=>a+p.variants.length,0)} ${t("articleRows")}</small><select id="sortSelect"><option value="name">${t("sortName")}</option><option value="article">${t("sortArticle")}</option></select></div>
        <div class="product-grid">${products.map(productCard).join("")}<div class="no-results hidden">${t("nothing")}</div></div>
      </div>
    </div>
  </section>
</main>` + footer();

  initReveal();
  initCommonUI();
  initFilters(products);
  if(cat.slug === "category-biopsy-forceps") initForcepsScrollVideo();
}

function productCard(p){
  const first = p.variants[0] || {};
  const firstArticle = first.article || "";
  const filterText = Object.values(productFilters(p)).flat().join(" ").toLowerCase();
  return `<article class="product-card reveal modern-card" data-name="${esc(textProduct(p,"name").toLowerCase())}" data-article="${esc(firstArticle)}" data-filter="${esc(filterText)}" data-id="${esc(p.id)}">
    <a href="catalog.html?product=${encodeURIComponent(p.id)}" class="product-link-area">
      <div class="product-image">${imgTag(p.image, textProduct(p,"name"), "", p.fallbackImage || "assets/img/medical.svg")}</div>
      <div class="product-kicker">${esc(textProduct(p,"category"))}</div>
      <h3>${esc(textProduct(p,"shortName") || textProduct(p,"name"))}</h3>
      <p>${esc(textProduct(p,"subcategory"))}</p>
      <div class="price">${t("price")}</div>
    </a>
    <div class="buy-row"><span class="pill">${esc(firstArticle || (currentLang === "en" ? "on request" : "по запросу"))}</span><button class="cart-btn" type="button" data-add-cart data-product="${esc(p.id)}" data-variant="0" aria-label="${esc(t("add"))}">🛒</button></div>
  </article>`;
}

function initFilters(products){
  const search = $("#catalogSearch");
  const sort = $("#sortSelect");
  const checks = $$(".filter-check");
  const grid = $(".product-grid");
  const cards = $$(".product-card");
  const noResults = $(".no-results");
  const countText = $("#countText");
  const productById = Object.fromEntries(products.map(p => [p.id, p]));

  function apply(){
    const q = (search?.value || "").toLowerCase();
    const activeByKey = {};
    checks.filter(c => c.checked).forEach(c => {
      activeByKey[c.dataset.key] = activeByKey[c.dataset.key] || [];
      activeByKey[c.dataset.key].push(c.value);
    });
    cards.forEach(card => {
      const p = productById[card.dataset.id];
      const searchable = [
        card.textContent,
        card.dataset.filter,
        card.dataset.article,
        p.name, p.nameEn, p.category, p.categoryEn, p.subcategory, p.subcategoryEn
      ].join(" ").toLowerCase();
      const okSearch = !q || searchable.includes(q);
      const okFilters = Object.entries(activeByKey).every(([key, vals]) => {
        const pVals = (productFilters(p)[key]) || [];
        return vals.some(v => pVals.includes(v));
      });
      card.classList.toggle("hidden", !(okSearch && okFilters));
    });
    const visible = cards.filter(c => !c.classList.contains("hidden"));
    visible.sort((a,b) => {
      if((sort?.value || "name") === "article") return (a.dataset.article || "").localeCompare(b.dataset.article || "", currentLang === "en" ? "en" : "ru", {numeric:true});
      return (a.dataset.name || "").localeCompare(b.dataset.name || "", currentLang === "en" ? "en" : "ru", {numeric:true});
    }).forEach(c => grid.appendChild(c));
    noResults?.classList.toggle("hidden", visible.length > 0);
    if(countText){
      const articleCount = visible.reduce((sum, card) => sum + ((productById[card.dataset.id]?.variants || []).length), 0);
      countText.textContent = `${t("found")}: ${visible.length} ${t("productCards")}, ${articleCount} ${t("articleRows")}`;
    }
    $$(".quick-filter-chip").forEach(chip => {
      const active = checks.some(c => c.checked && c.dataset.key === chip.dataset.chipKey && c.value === chip.dataset.chipValue);
      chip.classList.toggle("active", active);
    });
  }

  search?.addEventListener("input", apply);
  sort?.addEventListener("change", apply);
  checks.forEach(c => c.addEventListener("change", apply));
  $$(".quick-filter-chip").forEach(chip => chip.addEventListener("click", () => {
    const checkbox = checks.find(c => c.dataset.key === chip.dataset.chipKey && c.value === chip.dataset.chipValue);
    if(checkbox){
      checkbox.checked = !checkbox.checked;
      apply();
      document.querySelector(".catalog-section")?.scrollIntoView({behavior:"smooth", block:"start"});
    }
  }));
}

function specGrid(p){
  const specs = {};
  Object.entries(productFilters(p)).forEach(([k,v]) => {
    if([currentLang === "en" ? "Length" : "Длина"].includes(k)) return;
    specs[k] = v.slice(0,4).join(", ");
  });
  return `<div class="spec-grid">${Object.entries(specs).slice(0,10).map(([k,v])=>`<div><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join("")}</div>`;
}

function renderProduct(id){
  const p = DATA.products.find(p => p.id === id) || DATA.products[0];
  document.body.innerHTML = header("catalog") + `
<main id="top">
  <section class="product-page">
    <div class="breadcrumbs"><a href="index.html">${t("home")}</a> / <a href="catalog.html">${t("catalog")}</a> / <a href="catalog.html?cat=${encodeURIComponent(p.categorySlug)}">${esc(textProduct(p,"category"))}</a> / ${esc(textProduct(p,"shortName"))}</div>
    <div class="product-main">
      <div class="info-panel reveal modern-panel">
        <p class="eyebrow">${esc(textProduct(p,"category"))}</p>
        <h1>${esc(textProduct(p,"name"))}</h1>
        <div class="purpose-block"><b>${t("purpose")}</b><p>${esc(textProduct(p,"purpose") || (currentLang === "en" ? "Medical device or accessory for use in the relevant clinical area." : "Медицинское изделие или принадлежность для использования в профильном клиническом направлении."))}</p></div>
        <div class="purpose-block"><b>${t("catSub")}</b><p>${esc(textProduct(p,"category"))} / ${esc(textProduct(p,"subcategory"))}</p></div>
        ${specGrid(p)}
        <div class="actions"><button class="btn btn-primary" type="button" data-add-cart data-product="${esc(p.id)}" data-variant="0">${t("add")}</button><a class="btn btn-secondary" href="catalog.html?cat=${encodeURIComponent(p.categorySlug)}">${t("back")}</a></div>
      </div>
      <div class="reveal">
        <div class="media-panel modern-panel"><div class="product-big-img">${imgTag(p.image, textProduct(p,"name"), "", p.fallbackImage || "assets/img/medical.svg")}</div></div>
        <div class="doc-panel modern-panel"><button class="accordion">📄 ${t("docs")} <span>⌄</span></button><div class="accordion-content"><p><b>${t("reg")}:</b> ${currentLang === "en" ? "on request / see article table" : "по запросу / см. таблицу артикулов"}</p><p><b>${t("instruction")}:</b> ${currentLang === "en" ? "on request" : "по запросу"}</p><p><b>${t("certs")}:</b> ${currentLang === "en" ? "on request" : "по запросу"}</p></div></div>
      </div>
    </div>
    <div class="variants-panel reveal modern-panel">
      <div class="table-heading"><h2>${t("variants")}</h2><p>${currentLang === "en" ? "Add exact article lines to the basket before requesting a quote." : "Добавьте конкретные артикулы в корзину перед запросом КП."}</p></div>
      <div class="table-title"><span>${t("name")}</span><span>${t("note")}</span><span>${t("subsection")}</span><span>${t("price")}</span><span>${t("quantity")}</span></div>
      ${p.variants.map((v,i)=>`<div class="variant-row"><div><b>${esc(textVariant(v,"name"))}</b><small>${esc(v.article || "")}</small></div><div>${esc(textVariant(v,"note") || "—")}</div><div>${esc(textVariant(v,"subcategory") || textProduct(p,"subcategory"))}</div><div><b>${t("price")}</b></div><div><button class="btn-mini-cart" type="button" data-add-cart data-product="${esc(p.id)}" data-variant="${i}">🛒 ${t("add")}</button></div></div>`).join("")}
    </div>
  </section>
</main>` + footer();
  initReveal();
  initCommonUI();
  $(".doc-panel .accordion")?.addEventListener("click", () => $(".doc-panel").classList.toggle("open"));
}

function renderAbout(){
  document.body.innerHTML = header("about") + `<main id="top"><section class="page-hero reveal"><div class="breadcrumbs"><a href="index.html">${t("home")}</a> / ${t("about")}</div><p class="eyebrow">OldTech</p><h1>${t("aboutTitle")}</h1><p class="lead">${t("aboutLead")}</p></section><section class="section"><div class="category-grid"><div class="cat-card reveal modern-card"><h3>${t("catalog")}</h3><div class="plus">+</div><p>${currentLang === "en" ? "Categories, filters, product cards and article tables." : "Разделы, фильтры, карточки товаров и таблицы артикулов."}</p></div><div class="cat-card reveal modern-card"><h3>${currentLang === "en" ? "Selection" : "Подбор"}</h3><div class="plus">+</div><p>${currentLang === "en" ? "Request by technical specification, article or medical direction." : "Запрос по ТЗ, артикулу или медицинскому направлению."}</p></div><div class="cat-card reveal modern-card"><h3>${t("docs")}</h3><div class="plus">+</div><p>${currentLang === "en" ? "Blocks for certificates, instructions and documentation." : "Блок под РУ, инструкции, паспорта и сертификаты."}</p></div></div></section></main>` + footer();
  initReveal();
  initCommonUI();
}

function renderContacts(){
  const prefill = localStorage.getItem("oldtech_prefill_quote") || "";
  document.body.innerHTML = header("contacts") + `<main id="top"><section class="page-hero reveal"><div class="breadcrumbs"><a href="index.html">${t("home")}</a> / ${t("contacts")}</div><p class="eyebrow">${t("quote")}</p><h1>${t("contactTitle")}</h1><p class="lead">${t("contactLead")}</p></section><section class="section" style="padding-top:28px"><div class="form-card reveal modern-panel"><div><h2>${t("whatSend")}</h2><p>${t("whatSendText")}</p><p><b>Email:</b> your@email.com</p><p><b>${t("phone")}:</b> +7 (000) 000-00-00</p><button type="button" class="btn btn-secondary" data-open-cart>🛒 ${t("basket")} (<span class="cart-count">${cartCount()}</span>)</button></div><form class="form" action="mailto:your@email.com" method="post" enctype="text/plain"><input name="name" placeholder="${esc(t("nameField"))}" required><input name="company" placeholder="${esc(t("company"))}"><input type="email" name="email" placeholder="${esc(t("email"))}" required><input name="phone" placeholder="${esc(t("phone"))}"><select name="category"><option>${esc(t("selectCategory"))}</option>${DATA.categories.map(c=>`<option>${esc(textCat(c,"title"))}</option>`).join("")}</select><textarea id="messageTextarea" name="message" placeholder="${esc(t("message"))}">${esc(prefill || buildCartMessage())}</textarea><button class="btn btn-primary" type="submit">${t("send")}</button></form></div></section></main>` + footer();
  initReveal();
  initCommonUI();
}

function initScrollVideoController(options){
  const section = document.querySelector(options.section);
  const video = document.querySelector(options.video);
  if(!section || !video) return;

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let duration = 0;
  let ticking = false;
  let ready = false;

  function load(){
    if(video.dataset.loaded) return;
    if(video.dataset.src){
      video.src = video.dataset.src;
      video.dataset.loaded = "true";
    }
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    try { video.load(); } catch(e) {}
  }

  function updateDuration(){
    duration = video.duration || 0;
    ready = duration > 0;
  }

  function sectionProgress(){
    const rect = section.getBoundingClientRect();
    const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
    return Math.min(1, Math.max(0, -rect.top / scrollRange));
  }

  function setFrame(progress){
    if(!ready) updateDuration();
    if(!duration) return;
    const target = Math.min(duration - 0.04, Math.max(0.02, progress * duration));
    if(Math.abs(video.currentTime - target) > 0.018){
      try { video.currentTime = target; } catch(e) {}
    }
  }

  function update(){
    ticking = false;
    setFrame(sectionProgress());
  }

  function requestUpdate(){
    if(!ticking){
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  load();

  video.addEventListener("loadedmetadata", () => {
    updateDuration();
    setFrame(0);
    requestUpdate();
  });

  video.addEventListener("canplay", () => {
    updateDuration();
    requestUpdate();
  });

  if(reduced){
    video.pause();
    return;
  }

  window.addEventListener("scroll", requestUpdate, { passive:true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();

  // Small safety refreshes for Vercel/browser cache and slow metadata loading.
  setTimeout(requestUpdate, 250);
  setTimeout(requestUpdate, 800);
}

function initMriScrollVideo(){
  initScrollVideoController({
    section: "#mri-scroll",
    video: "#mriScrollVideo"
  });
}





function initForcepsScrollVideo(){
  initScrollVideoController({
    section: "#forceps-scroll",
    video: "#forcepsScrollVideo"
  });
}



if(location.pathname.endsWith("about.html")) renderAbout();
else if(location.pathname.endsWith("contacts.html")) renderContacts();
else if(location.pathname.endsWith("catalog.html")) renderCatalog();
else renderHome();
