/* БИЙИК — общая логика: язык, шапка, подвал, логотип, орнаменты, данные, добавление от посетителей */
(function () {
  /* ═════════════ ЯЗЫК: РУС / КЫР ═════════════ */
  let LANG = "ru";
  try { LANG = new URLSearchParams(location.search).get("lang") || localStorage.getItem("biyik-lang") || "ru"; } catch {}
  if (LANG !== "ky") LANG = "ru";
  try { localStorage.setItem("biyik-lang", LANG); } catch {}
  const KY = LANG === "ky";
  document.documentElement.lang = LANG;

  // Объединяем данные: тексты на кыргызском поверх русских (ссылки и даты остаются из data.js)
  const merge = (base, over) => {
    if (!over) return base;
    if (Array.isArray(base)) return base.map((x, i) => (over[i] === undefined ? x : Array.isArray(x) ? over[i] : { ...x, ...over[i] }));
    return base;
  };
  const RU = window.DATA;
  const D = KY ? Object.fromEntries(Object.keys(RU).map((k) => [k, merge(RU[k], (window.DATA_KY || {})[k])])) : RU;

  const UI = {
    ru: {
      nav: ["Главная", "Как поступить", "Олимпиады", "Программы", "Research", "Истории", "О проекте"],
      switchTo: "КЫР", switchTitle: "Кыргызча",
      footAbout: "Бийик — значит «высокий». Сайт для школьников Кыргызстана, которые хотят учиться в лучших вузах мира и заниматься наукой.",
      footSections: "Разделы", footData: "Честно о данных",
      footDataText: (d) => `Информацию собрал ИИ по открытым источникам: новости, официальные сайты олимпиад и программ. У каждого факта есть ссылка на источник. Последняя проверка: ${d}. То, что добавляют посетители, помечено отдельно. Сроки меняются каждый год, поэтому перед подачей проверяй их на официальном сайте.`,
      footCopy: "образовательный проект", footAuthor: "автор — Ариет Алимжанов", footMade: "Сделано в Оше, Кыргызстан 🇰🇬",
      pvLabel: "Пословица", pvOrig: "Кыргызский оригинал", pvLit: "дословно",
      more: "Подробнее →", official: "Официальный сайт →", source: "Источник",
      who: "Кто", when: "Сроки", money: "Деньги", exams: "Экзамены", startHere: "Начни отсюда", kgLabel: "Кыргызстан",
      hot: (d) => `Приём открыт · ${d} дн.`, all: "Все", empty: "Ничего не нашлось. Попробуй другой запрос или добавь своё.",
      pending: "Ждёт проверки · видно тебе", community: "Добавлено сообществом",
      idea: "Идея", myProject: "Твой проект", lookingTeam: "Ищет команду", contact: "Связь",
      grades: ["Все классы", "8 класс", "9 класс", "10 класс", "11 класс"], hidePast: "Скрыть прошедшие", showPast: "Показать прошедшие",
      past: "✓ Уже прошло", open: (d) => `● Идёт сейчас · осталось ${d} дн.`, soon: (d) => `Через ${d} дн.`, today: "Сегодня",
      approxShort: "ориентир.", approxNote: "Даты ориентировочные, по графику прошлого года.", gr: "кл.", noEvents: "Для этого класса событий нет.",
      months: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
      from: "с", until: "до", translated: "",
      authorLabel: "Автор проекта", authorContact: "Связаться",
      send: "Отправить", sending: "Отправляю…", cancel: "Отмена", close: "Закрыть",
      confirm: "Я подтверждаю, что информация правдива и ссылка её подтверждает",
      noteDbProject: "Проект сразу появится на доске.", noteDb: "После проверки модератором запись увидят все. Пока она видна только тебе.",
      noteLocal: "⚠️ Общая база ещё не подключена, поэтому запись сохранится только в твоём браузере. Как подключить базу, написано в README.",
      toastProject: "Проект добавлен на доску!", toastOther: "Спасибо! Запись добавлена и ждёт проверки.",
      forms: {
        olympiad: { title: "Добавить олимпиаду", f: { name: "Название олимпиады", subject: "Предмет", level: "Уровень", when: "Когда проходит", about: "Коротко об олимпиаде", kg: "Результаты Кыргызстана (если знаешь)", link: "Ссылка на официальный сайт или новость" },
          ph: { subject: "Например: Математика", when: "Например: Апрель" }, opt: { level: ["Кыргызстан", "Регион", "Мир"] } },
        program: { title: "Добавить вуз или программу", f: { name: "Название вуза / программы", type: "Что это", country: "Страна", who: "Кто может подать", deadline: "Сроки", cost: "Стоимость / стипендия", about: "Коротко о программе", link: "Ссылка на официальный сайт" },
          ph: { who: "Например: 10–11 класс, граждане КР" }, opt: { type: ["Университет", "Стипендия", "Обмен", "Летняя программа", "Школа", "Экзамен", "Другое"] } },
        story: { title: "Рассказать историю успеха", f: { name: "Имя и фамилия", tag: "Главное достижение (коротко)", year: "Год", text: "История: откуда, как готовился, что помогло", quote: "Совет школьникам (цитата, по желанию)", src: "Ссылка, которая подтверждает (новость, сайт, соцсеть)" },
          ph: { tag: "Например: NYU Abu Dhabi или Серебро IOI" }, opt: {} },
        project: { title: "Предложить research-проект", f: { title: "Название проекта", field: "Направление", text: "Какой вопрос исследуете и кого ищете в команду", contact: "Как связаться (Telegram, email)" },
          ph: {}, opt: { field: ["Экология / Данные", "Химия / Биология", "Физика / Инженерия", "Информатика / ИИ", "Математика", "Социология / Психология", "Экономика / Бизнес", "Другое"] } }
      }
    },
    ky: {
      nav: ["Башкы бет", "Тапшыруу", "Олимпиадалар", "Программалар", "Research", "Окуялар", "Долбоор"],
      switchTo: "РУС", switchTitle: "По-русски",
      footAbout: "Бийик — «жогорку» деген маани. Дүйнөнүн мыкты ЖОЖдорунда окуп, илим менен алектенгиси келген Кыргызстандын окуучулары үчүн сайт.",
      footSections: "Бөлүмдөр", footData: "Маалымат тууралуу чынын айтсак",
      footDataText: (d) => `Маалыматты ЖИ ачык булактардан чогулткан: жаңылыктар, олимпиадалардын жана программалардын расмий сайттары. Ар бир фактынын булагына шилтеме бар. Акыркы текшерүү: ${d}. Келүүчүлөр кошкон нерселер өзүнчө белгиленет. Мөөнөттөр жыл сайын өзгөрөт, ошондуктан тапшыруудан мурун расмий сайттан текшер.`,
      footCopy: "билим берүү долбоору", footAuthor: "автору — Ариет Алимжанов", footMade: "Ош шаарында жасалды, Кыргызстан 🇰🇬", views: "жолу сайт каралды",
      pvLabel: "Кыргыз макалы", pvOrig: "Орусча окшошу", pvLit: "сөзмө-сөз",
      more: "Кененирээк →", official: "Расмий сайт →", source: "Булак",
      who: "Ким", when: "Мөөнөт", money: "Акча", exams: "Экзамендер", startHere: "Ушул жерден башта", kgLabel: "Кыргызстан",
      hot: (d) => `Кабыл алуу ачык · ${d} күн`, all: "Баары", empty: "Эч нерсе табылган жок. Башкача издеп көр же өзүңдүкүн кош.",
      pending: "Текшерүүнү күтүүдө · сага гана көрүнөт", community: "Коомчулук кошкон",
      idea: "Идея", myProject: "Сенин долбооруң", lookingTeam: "Команда издейт", contact: "Байланыш",
      grades: ["Бардык класстар", "8-класс", "9-класс", "10-класс", "11-класс"], hidePast: "Өткөндөрдү жашыруу", showPast: "Өткөндөрдү көрсөтүү",
      past: "✓ Өтүп кетти", open: (d) => `● Азыр жүрүп жатат · ${d} күн калды`, soon: (d) => `${d} күндөн кийин`, today: "Бүгүн",
      approxShort: "болжолдуу", approxNote: "Даталар болжолдуу, өткөн жылдын графиги боюнча.", gr: "кл.", noEvents: "Бул класс үчүн окуялар жок.",
      months: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
      from: "", until: "", translated: " (орусчадан которулду)",
      authorLabel: "Долбоордун автору", authorContact: "Байланыш",
      send: "Жөнөтүү", sending: "Жөнөтүлүүдө…", cancel: "Жокко чыгаруу", close: "Жабуу",
      confirm: "Маалымат чын жана шилтеме аны тастыктай турганын ырастайм",
      noteDbProject: "Долбоор тактага дароо чыгат.", noteDb: "Модератор текшергенден кийин жазууну баары көрөт. Азырынча ал сага гана көрүнөт.",
      noteLocal: "⚠️ Жалпы база азырынча туташтырыла элек, ошондуктан жазуу сенин браузериңде гана сакталат. Базаны кантип туташтыруу README файлында жазылган.",
      toastProject: "Долбоор тактага кошулду!", toastOther: "Рахмат! Жазуу кошулду жана текшерүүнү күтүүдө.",
      forms: {
        olympiad: { title: "Олимпиада кошуу", f: { name: "Олимпиаданын аталышы", subject: "Сабак", level: "Деңгээли", when: "Качан өтөт", about: "Олимпиада жөнүндө кыскача", kg: "Кыргызстандын жыйынтыктары (билсең)", link: "Расмий сайтка же жаңылыкка шилтеме" },
          ph: { subject: "Мисалы: Математика", when: "Мисалы: Апрель" }, opt: { level: ["Кыргызстан", "Аймак", "Дүйнө"] } },
        program: { title: "ЖОЖ же программа кошуу", f: { name: "ЖОЖдун / программанын аталышы", type: "Бул эмне", country: "Өлкө", who: "Ким тапшыра алат", deadline: "Мөөнөттөр", cost: "Баасы / стипендия", about: "Программа жөнүндө кыскача", link: "Расмий сайтка шилтеме" },
          ph: { who: "Мисалы: 10–11-класс, КРдин жарандары" }, opt: { type: ["Университет", "Стипендия", "Алмашуу", "Жайкы программа", "Мектеп", "Экзамен", "Башка"] } },
        story: { title: "Ийгилик окуясын айтып берүү", f: { name: "Аты-жөнү", tag: "Башкы жетишкендик (кыскача)", year: "Жылы", text: "Окуя: кайдан, кантип даярданган, эмне жардам берген", quote: "Окуучуларга кеңеш (цитата, каалоо боюнча)", src: "Тастыктаган шилтеме (жаңылык, сайт, соцтармак)" },
          ph: { tag: "Мисалы: NYU Abu Dhabi же IOI күмүшү" }, opt: {} },
        project: { title: "Research-долбоор сунуштоо", f: { title: "Долбоордун аталышы", field: "Багыты", text: "Кандай суроону изилдейсиңер жана командага кимди издейсиңер", contact: "Кантип байланышуу (Telegram, email)" },
          ph: {}, opt: { field: ["Экология / Маалыматтар", "Химия / Биология", "Физика / Инженерия", "Информатика / ЖИ", "Математика", "Социология / Психология", "Экономика / Бизнес", "Башка"] } }
      }
    }
  }[LANG];

  const CFG = window.BIYIK_CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return "—"; } };
  const safeUrl = (u) => /^https?:\/\//i.test(u || "") ? u : "";
  const today = new Date();
  const day = (s) => new Date(s + "T00:00:00");

  /* Статичный текст страницы: элементы с data-ky */
  if (KY) {
    $$("[data-ky]").forEach((el) => { el.innerHTML = el.dataset.ky; });
    $$("[data-ky-ph]").forEach((el) => { el.placeholder = el.dataset.kyPh; });
    if (document.documentElement.dataset.titleKy) document.title = document.documentElement.dataset.titleKy;
  }

  /* ═════════════ ЛОГОТИП: солнце флага + тундук-глобус + орбита ═════════════ */
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function logoSVG({ uid = "lg", orbit = "#c4161c", rays = "#f5b21a", animate = false } = {}) {
    let r = "";
    for (let i = 0; i < 40; i++) { // 40 лучей — как на флаге Кыргызстана
      const a = (i / 40) * Math.PI * 2, l2 = i % 2 ? 82 : 90;
      r += `<line x1="${(Math.cos(a) * 66).toFixed(1)}" y1="${(Math.sin(a) * 66).toFixed(1)}" x2="${(Math.cos(a) * l2).toFixed(1)}" y2="${(Math.sin(a) * l2).toFixed(1)}"/>`;
    }
    const tr = "rotate(-22)";
    const anim = animate && !REDUCED;
    // Орбита: первая половина пути — перед глобусом, вторая — за ним
    const ORBIT = "M96 0A96 28 0 0 1 -96 0A96 28 0 0 1 96 0";
    const DUR = "9s";
    const sat = (front) => anim
      ? `<g transform="${tr}"><circle r="10" fill="#f5b21a" stroke="${orbit}" stroke-width="4" opacity="${front ? 1 : 0}">
           <animateMotion dur="${DUR}" repeatCount="indefinite" path="${ORBIT}"/>
           <animate attributeName="opacity" dur="${DUR}" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5" values="${front ? "1;0" : "0;1"}"/>
         </circle></g>`
      : front ? `<g transform="${tr}"><circle cx="70" cy="19" r="10" fill="#f5b21a" stroke="${orbit}" stroke-width="4"/></g>` : "";
    const breathe = anim
      ? `<animateTransform attributeName="transform" type="scale" values="1;1.06;1" keyTimes="0;0.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="4.5s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values="1;.75;1" dur="4.5s" repeatCount="indefinite"/>`
      : "";
    return `<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><clipPath id="${uid}g"><circle r="50"/></clipPath>
      <linearGradient id="${uid}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#33b8f2"/><stop offset="1" stop-color="#0a6fb8"/></linearGradient></defs>
      <g stroke="${rays}" stroke-width="5" stroke-linecap="round">${breathe}${r}</g>
      <path d="M-96 0A96 28 0 0 1 96 0" transform="${tr}" fill="none" stroke="${orbit}" stroke-width="5" stroke-linecap="round"/>
      ${sat(false)}
      <circle r="60" fill="#c4161c"/>
      <circle r="50" fill="url(#${uid}b)"/>
      <g clip-path="url(#${uid}g)" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round">
        <ellipse rx="27" ry="50"/><line x1="0" y1="-50" x2="0" y2="50"/>
        <path d="M-50 -22Q0 -34 50 -22M-50 22Q0 10 50 22M-50 0Q0 -12 50 0"/>
      </g>
      <path d="M96 0A96 28 0 0 1 -96 0" transform="${tr}" fill="none" stroke="${orbit}" stroke-width="5" stroke-linecap="round"/>
      ${sat(true)}
    </svg>`;
  }

  /* ═════════════ ОРНАМЕНТЫ ═════════════ */
  const HORN = "M0 0C0-14 6-24 16-24C26-24 30-14 26-8C22-2 14-4 14-10C14-14 19-15 20-12";
  const pair = (tr = "") => `<g transform="${tr}"><path d="${HORN}"/><path d="${HORN}" transform="scale(-1 1)"/><path d="M0 0V7"/></g>`;
  const corded = (inner, fg, out, w = 4.5) =>
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="${out}" stroke-width="${w + 3.5}">${inner}</g><g stroke="${fg}" stroke-width="${w}">${inner}</g></g>`;

  function tunduk({ ring = "#c4161c", rays = "#f5b21a", slats = "#ffffff", spokes = 36, uid = "t" } = {}) {
    let r = "";
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2;
      r += `<line x1="${(Math.cos(a) * 72).toFixed(1)}" y1="${(Math.sin(a) * 72).toFixed(1)}" x2="${(Math.cos(a) * 97).toFixed(1)}" y2="${(Math.sin(a) * 97).toFixed(1)}"/>`;
    }
    const arcs = [-26, 0, 26].map((o) => `<path d="M-66 ${o} Q0 ${o - 14} 66 ${o}"/><path d="M${o} -66 Q${o + 14} 0 ${o} 66"/>`).join("");
    return `<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><clipPath id="${uid}c"><circle r="62"/></clipPath></defs>
      <g stroke="${rays}" stroke-width="3.2" stroke-linecap="round">${r}</g>
      <circle r="67" fill="none" stroke="${ring}" stroke-width="9"/>
      <g clip-path="url(#${uid}c)" fill="none" stroke="${slats}" stroke-width="6" stroke-linecap="round">${arcs}</g>
      <circle r="62" fill="none" stroke="${ring}" stroke-width="2"/>
    </svg>`;
  }

  function rosette(fg = "#f5b21a", out = "#8f0f14", center = "#c4161c") {
    const horns = [0, 90, 180, 270].map((a) => pair(`rotate(${a}) translate(0 -9) scale(.9)`)).join("");
    return `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${corded(horns, fg, out)}
      <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="${center}" stroke="${out}" stroke-width="2.5"/></svg>`;
  }

  function divider(color = "var(--red)") {
    return `<svg class="divider" viewBox="0 0 240 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 22H74M166 22H240" stroke="${color}" stroke-width="2"/>
      <g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round">
        ${pair("translate(96 22) scale(.55) rotate(-90)")}${pair("translate(144 22) scale(.55) rotate(90)")}
      </g>
      <rect x="114" y="16" width="12" height="12" transform="rotate(45 120 22)" fill="${color}"/>
    </svg>`;
  }
  window.BIYIK = { tunduk, rosette, divider, logoSVG };

  /* ═════════════ ШАПКА И ПОДВАЛ ═════════════ */
  const files = ["index.html", "guide.html", "olympiads.html", "programs.html", "research.html", "stories.html", "about.html"];
  const pages = files.map((f, i) => [f, UI.nav[i]]);
  const current = location.pathname.split("/").pop() || "index.html";
  const logo = (uid, orbit) => `<a class="logo" href="index.html">${logoSVG({ uid, orbit })}<span>Бийик<small>Kyrgyzstan → World</small></span></a>`;

  const header = $("#site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `<nav class="wrap nav" aria-label="Menu">${logo("lgh")}
      <button class="burger" aria-label="Menu" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      <ul class="nav-links">${pages.map(([h, t]) => `<li><a href="${h}"${h === current ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul>
      <div class="lang-switch" role="group" aria-label="Тил / Язык">
        <button data-lang="ru" aria-pressed="${!KY}">РУС</button><button data-lang="ky" aria-pressed="${KY}">КЫР</button>
      </div>
    </nav>`;
    const burger = $(".burger", header), links = $(".nav-links", header);
    burger.addEventListener("click", () => burger.setAttribute("aria-expanded", links.classList.toggle("open")));
    $$("[data-lang]", header).forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.lang === LANG) return;
      try { localStorage.setItem("biyik-lang", b.dataset.lang); } catch {}
      const u = new URL(location.href); u.searchParams.set("lang", b.dataset.lang);
      location.href = u.href;
    }));
  }

  const footer = $("#site-footer");
  if (footer) {
    footer.innerHTML = `<div class="band"></div>
    <footer class="site-footer"><div class="wrap">
      <div class="foot-grid">
        <div>${logo("lgf", "#f5b21a")}
          <p>${esc(UI.footAbout)}</p>
          <p class="kg foot-motto">Колуңдан келет!</p></div>
        <div><h4>${esc(UI.footSections)}</h4><ul>${pages.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
        <div><h4>${esc(UI.footData)}</h4><p style="font-size:.92rem">${esc(UI.footDataText(window.CHECKED))}</p></div>
      </div>
      <div class="foot-bottom"><span>© ${today.getFullYear()} Бийик · ${esc(UI.footCopy)} · <a href="about.html">${esc(UI.footAuthor)}</a></span><span class="views" hidden>👁 <b></b> ${esc(UI.views)}</span><span>${esc(UI.footMade)}</span></div>
    </div></footer>`;
  }

  $$("[data-logo]").forEach((el, i) => { el.innerHTML = logoSVG({ uid: "big" + i, orbit: el.dataset.logo || "#f5b21a", animate: el.classList.contains("hero-logo") }); });
  $$("[data-tunduk]").forEach((el, i) => { el.innerHTML = tunduk({ uid: "tk" + i, spokes: +el.dataset.tunduk || 36 }); });
  $$("[data-rosette]").forEach((el) => { el.innerHTML = rosette(el.dataset.rosette || "#f5b21a", el.dataset.out || "#8f0f14"); });
  $$("[data-divider]").forEach((el) => { el.innerHTML = divider(el.dataset.divider || "var(--red)"); });

  /* ═════════════ ПОСЛОВИЦЫ ═════════════
     По-кыргызски — кыргызский макал, по-русски — похожая по смыслу русская пословица. */
  $$("[data-proverb]").forEach((el) => {
    const p = RU.proverbs[el.dataset.proverb]; if (!p) return;
    el.className = "proverb reveal";
    el.innerHTML = `${divider()}
      <div class="pv-label">${esc(UI.pvLabel)}</div>
      <p class="pv-text">${esc(KY ? p.ky : p.ru)}</p>
      <p class="pv-sub">${KY
        ? `${esc(UI.pvOrig)}: «${esc(p.ru)}»`
        : `${esc(UI.pvOrig)}: <b lang="ky">«${esc(p.ky)}»</b> · ${esc(UI.pvLit)}: «${esc(p.lit)}»`}</p>`;
  });

  /* ═════════════ ДОБАВЛЕНИЯ ОТ ПОСЕТИТЕЛЕЙ ═════════════ */
  const DB = !!(CFG.supabaseUrl && CFG.supabaseKey);
  const LKEY = "biyik-submissions";
  const localAll = () => { try { return JSON.parse(localStorage.getItem(LKEY) || "[]"); } catch { return []; } };
  const localSave = (arr) => { try { localStorage.setItem(LKEY, JSON.stringify(arr)); } catch {} };
  const community = { olympiad: [], program: [], story: [], project: [] };

  async function loadCommunity() {
    const mine = localAll().map((x) => ({ ...x.data, _type: x.type, _pending: true }));
    let shared = [];
    if (DB) {
      try {
        const r = await fetch(`${CFG.supabaseUrl}/rest/v1/submissions?approved=eq.true&select=type,data&order=created_at.desc`,
          { headers: { apikey: CFG.supabaseKey, Authorization: `Bearer ${CFG.supabaseKey}` } });
        if (r.ok) shared = (await r.json()).map((x) => ({ ...x.data, _type: x.type, _community: true }));
      } catch {}
    }
    Object.keys(community).forEach((k) => {
      const sharedK = shared.filter((x) => x._type === k);
      const mineK = mine.filter((x) => x._type === k && !sharedK.some((s) => (s.name || s.title) === (x.name || x.title)));
      community[k] = [...mineK, ...sharedK];
    });
  }

  async function submit(type, data) {
    let sent = false;
    if (DB) {
      try {
        const r = await fetch(`${CFG.supabaseUrl}/rest/v1/submissions`, {
          method: "POST",
          headers: { apikey: CFG.supabaseKey, Authorization: `Bearer ${CFG.supabaseKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ type, data: { ...data, lang: LANG }, approved: type === "project" })
        });
        sent = r.ok;
      } catch {}
    }
    if (!(sent && type === "project")) { const all = localAll(); all.unshift({ type, data }); localSave(all); }
    return sent;
  }

  // [поле, тип, обязательное]
  const FORMS = {
    olympiad: [["name", "text", 1], ["subject", "text", 1], ["level", "select"], ["when", "text"], ["about", "textarea", 1], ["kg", "text"], ["link", "url", 1]],
    program: [["name", "text", 1], ["type", "select"], ["country", "text", 1], ["who", "text"], ["deadline", "text"], ["cost", "text"], ["about", "textarea", 1], ["link", "url", 1]],
    story: [["name", "text", 1], ["tag", "text", 1], ["year", "number"], ["text", "textarea", 1], ["quote", "textarea"], ["src", "url", 1]],
    project: [["title", "text", 1], ["field", "select"], ["text", "textarea", 1], ["contact", "text", 1]]
  };

  const dlg = document.createElement("dialog");
  dlg.className = "add-dialog";
  document.body.appendChild(dlg);
  const onAdded = {};

  function openForm(type) {
    const L = UI.forms[type];
    const field = ([n, kind, req]) => {
      const r = req ? " required" : "", ph = esc((L.ph || {})[n] || (kind === "url" ? "https://…" : ""));
      const input = kind === "select"
        ? `<select name="${n}">${L.opt[n].map((o) => `<option>${esc(o)}</option>`).join("")}</select>`
        : kind === "textarea" ? `<textarea name="${n}"${r} maxlength="600" placeholder="${ph}"></textarea>`
        : `<input name="${n}" type="${kind}"${r} maxlength="200" placeholder="${ph}">`;
      return `<label class="${kind === "textarea" ? "full" : ""}"><span>${esc(L.f[n])}${req ? " *" : ""}</span>${input}</label>`;
    };
    dlg.innerHTML = `<form class="add-form">
      <div class="add-head"><div class="add-orn">${rosette()}</div><h3>${esc(L.title)}</h3><button type="button" class="x close" aria-label="${esc(UI.close)}">×</button></div>
      <div class="add-grid">${FORMS[type].map(field).join("")}</div>
      ${type !== "project" ? `<label class="check"><input type="checkbox" required> ${esc(UI.confirm)}</label>` : ""}
      <p class="note">${esc(DB ? (type === "project" ? UI.noteDbProject : UI.noteDb) : UI.noteLocal)}</p>
      <div class="add-actions"><button type="button" class="btn ghost x">${esc(UI.cancel)}</button><button class="btn red" type="submit">${esc(UI.send)}</button></div>
    </form>`;
    $$(".x", dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
    $("form", dlg).addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries([...new FormData(e.target)].map(([k, v]) => [k, String(v).trim()]));
      ["link", "src"].forEach((k) => { if (k in data && !safeUrl(data[k])) data[k] = ""; });
      const btn = $('button[type="submit"]', dlg); btn.disabled = true; btn.textContent = UI.sending;
      await submit(type, data);
      dlg.close();
      await loadCommunity();
      onAdded[type] && onAdded[type]();
      toast(type === "project" ? UI.toastProject : UI.toastOther);
    });
    dlg.showModal();
  }
  $$("[data-add]").forEach((b) => b.addEventListener("click", () => openForm(b.dataset.add)));

  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 3500);
  }

  /* ═════════════ КАРТОЧКИ ═════════════ */
  const srcLink = (u) => safeUrl(u) ? `<a class="src" href="${esc(u)}" target="_blank" rel="noopener">${esc(UI.source)}: ${esc(host(u))}</a>` : "";
  const badge = (x) => x._pending ? `<span class="tag pending">${esc(UI.pending)}</span>` : x._community ? `<span class="tag community">${esc(UI.community)}</span>` : "";

  const olympiadCard = (o) => `<article class="card reveal${o._pending || o._community ? " user" : ""}">
      <div class="meta"><span class="tag red">${esc(o.subject)}</span><span class="tag">${esc(o.level)}</span>${o.when ? `<span class="tag sun">${esc(o.when)}</span>` : ""}${o.start ? `<span class="tag lake">${esc(UI.startHere)}</span>` : ""}${badge(o)}</div>
      <h3>${esc(o.name)}</h3>
      <p>${esc(o.about)}</p>
      ${o.kg ? `<div class="kg-result"><strong>${esc(UI.kgLabel)}</strong>${esc(o.kg)}</div>` : ""}
      <div class="foot">${safeUrl(o.link) ? `<a class="more" href="${esc(o.link)}" target="_blank" rel="noopener">${esc(UI.more)}</a>` : ""}${o.src && o.src !== o.link ? srcLink(o.src) : ""}</div>
    </article>`;

  const programCard = (p) => {
    const hot = p.hot && new Date(p.hot + "T23:59:59") >= today;
    const days = hot ? Math.ceil((new Date(p.hot + "T23:59:59") - today) / 864e5) : 0;
    return `<article class="card reveal${hot ? " hot" : ""}${p._pending || p._community ? " user" : ""}">
      ${hot ? `<span class="hot-badge">${esc(UI.hot(days))}</span>` : ""}
      <div class="meta"><span class="tag red">${esc(p.type)}</span><span class="tag">${esc(p.country)}</span>${badge(p)}</div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.about)}</p>
      <dl class="facts"><dt>${esc(UI.who)}</dt><dd>${esc(p.who || "—")}</dd><dt>${esc(UI.when)}</dt><dd>${esc(p.deadline || "—")}</dd><dt>${esc(UI.money)}</dt><dd>${esc(p.cost || "—")}</dd></dl>
      <div class="foot">${safeUrl(p.link) ? `<a class="more" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(UI.official)}</a>` : ""}${p.src && p.src !== p.link ? srcLink(p.src) : ""}</div>
    </article>`;
  };

  const storyCard = (s) => `<article class="card story reveal">
      <div class="meta">${s.year ? `<span class="tag">${esc(s.year)}</span>` : ""}${badge(s)}</div>
      <div class="big">${esc(s.tag)}</div>
      <div class="who">${esc(s.name)}</div>
      <p>${esc(s.text)}</p>
      ${s.quote ? `<blockquote class="mini-quote">«${esc(s.quote)}»</blockquote>` : ""}
      <div class="foot">${srcLink(s.src)}</div>
    </article>`;

  const quoteCard = (q) => `<figure class="quote-card reveal">
      <div class="q-orn">${rosette()}</div>
      <blockquote>«${esc(q.text)}»</blockquote>
      <figcaption><b>${esc(q.who)}</b><span>${esc(q.what)}</span>${srcLink(q.src)}${UI.translated ? `<em class="note">${esc(UI.translated.trim())}</em>` : ""}</figcaption>
    </figure>`;

  /* ═════════════ СПИСКИ С ФИЛЬТРАМИ ═════════════ */
  function filtered(listEl, getItems, render, key, chipsEl, searchEl) {
    let cat = UI.all, q = "";
    const draw = () => {
      const items = getItems();
      const cats = [UI.all, ...new Set(items.flatMap((x) => key(x)).filter(Boolean))];
      if (!cats.includes(cat)) cat = UI.all;
      chipsEl.innerHTML = cats.map((c) => `<button class="chip" aria-pressed="${c === cat}">${esc(c)}</button>`).join("");
      const res = items.filter((x) => (cat === UI.all || key(x).includes(cat)) && JSON.stringify(x).toLowerCase().includes(q));
      listEl.innerHTML = res.length ? res.map(render).join("") : `<p class="empty">${esc(UI.empty)}</p>`;
      observe();
    };
    chipsEl.addEventListener("click", (e) => { const b = e.target.closest(".chip"); if (!b) return; cat = b.textContent; draw(); });
    searchEl && searchEl.addEventListener("input", () => { q = searchEl.value.trim().toLowerCase(); draw(); });
    draw();
    return draw;
  }

  const subjOf = (o) => String(o.subject || "").split(" / ").map((s) => s.split(" (")[0].trim()).concat(o.level || []);
  const ol = $("#olympiad-list");
  if (ol) onAdded.olympiad = filtered(ol, () => [...community.olympiad, ...D.olympiads], olympiadCard, subjOf, $("#olympiad-chips"), $("#olympiad-search"));

  const pl = $("#program-list");
  if (pl) {
    const sorted = [...D.programs].sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0));
    onAdded.program = filtered(pl, () => [...community.program, ...sorted], programCard,
      (p) => [String(p.country || "").includes("мир") ? "Мир" : String(p.country || "").split(" (")[0]], $("#program-chips"), $("#program-search"));
  }

  const sl = $("#story-list");
  if (sl) { onAdded.story = () => { sl.innerHTML = [...community.story, ...D.stories].map(storyCard).join(""); observe(); }; onAdded.story(); }
  const sf = $("#story-featured"); if (sf) sf.innerHTML = D.stories.slice(0, 3).map(storyCard).join("");

  const ql = $("#quote-list"); if (ql) ql.innerHTML = D.quotes.map(quoteCard).join("");
  const qf = $("#quote-featured"); if (qf) qf.innerHTML = [D.quotes[0], D.quotes[3], D.quotes[5]].map(quoteCard).join("");

  /* ═════════════ ПЛАН / КАЛЕНДАРЬ ПОСТУПЛЕНИЯ ═════════════ */
  const tl = $("#timeline");
  if (tl) {
    const fmt = (s) => { const d = day(s); return `${d.getDate()} ${UI.months[d.getMonth()]}`; };
    const status = (e) => {
      const s = e.start ? day(e.start) : null, en = e.end ? new Date(e.end + "T23:59:59") : null;
      if (en && en < today) return "past";
      if (s && s > today) return "soon";
      if (!s && en) return (en - today) / 864e5 <= 45 ? "open" : "soon";
      return "open";
    };
    const daysTo = (e) => Math.ceil(((e.end ? new Date(e.end + "T23:59:59") : day(e.start)) - today) / 864e5);
    const daysFrom = (e) => Math.ceil((day(e.start) - today) / 864e5);
    let grade = 0, showPast = true;
    const gradeChips = $("#timeline-grades");
    const draw = () => {
      gradeChips.innerHTML = [0, 8, 9, 10, 11].map((g, i) => `<button class="chip" data-g="${g}" aria-pressed="${g === grade}">${UI.grades[i]}</button>`).join("")
        + `<button class="chip ghost-chip" data-past aria-pressed="${showPast}">${showPast ? UI.hidePast : UI.showPast}</button>`;
      const items = D.timeline.filter((e) => !grade || e.grades.includes(grade)).map((e) => ({ ...e, st: status(e) })).filter((e) => showPast || e.st !== "past");
      const firstUpcoming = items.findIndex((e) => e.st !== "past");
      const range = (e) => e.start && e.end ? `${fmt(e.start)} – ${fmt(e.end)}`
        : e.end ? (KY ? `${fmt(e.end)} чейин` : `${UI.until} ${fmt(e.end)}`)
        : (KY ? `${fmt(e.start)} баштап` : `${UI.from} ${fmt(e.start)}`);
      tl.innerHTML = items.map((e, i) => {
        const yr = day(e.end || e.start).getFullYear();
        const pill = e.st === "past" ? `<span class="st past">${UI.past}</span>`
          : e.st === "open" ? `<span class="st open">${UI.open(daysTo(e))}</span>`
          : `<span class="st soon">${UI.soon(e.start ? daysFrom(e) : daysTo(e))}</span>`;
        const notes = [e.note, e.approx ? UI.approxNote : ""].filter(Boolean).join(". ");
        return `${i === firstUpcoming ? `<li class="tl-now"><span>${UI.today}</span></li>` : ""}
        <li class="tl-item ${e.st}">
          <div class="tl-date"><b>${range(e)}</b><span>${yr}${e.approx ? " · " + UI.approxShort : ""}</span></div>
          <div class="tl-dot"></div>
          <div class="tl-card">
            <div class="meta">${pill}<span class="tag">${esc(e.cat)}</span><span class="tag">${e.grades.join(", ")} ${UI.gr}</span></div>
            <h3>${esc(e.title)}</h3>
            ${e.result ? `<p class="tl-res">${esc(e.result)}</p>` : ""}
            ${notes ? `<p class="muted tl-note">${esc(notes)}</p>` : ""}
            <a class="more" href="${esc(e.link)}" target="_blank" rel="noopener">${esc(UI.more)}</a>
          </div>
        </li>`;
      }).join("") || `<li class="empty">${UI.noEvents}</li>`;
    };
    gradeChips.addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      if (b.hasAttribute("data-past")) showPast = !showPast; else grade = +b.dataset.g;
      draw();
    });
    draw();
  }

  /* ═════════════ ОСТАЛЬНЫЕ БЛОКИ ═════════════ */
  const rm = $("#roadmap");
  if (rm) rm.innerHTML = D.roadmap.map((r, i) => `<div class="rm reveal"><div class="dot">${8 + i}</div><h3>${esc(r.grade)}</h3><div class="sub">${esc(r.title)}</div><ul>${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>`).join("");

  const st = $("#steps");
  if (st) st.innerHTML = D.steps.map(([t, d]) => `<li class="reveal"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("");

  const gl = $("#glossary");
  if (gl) {
    const half = Math.ceil(D.glossary.length / 2);
    const col = (arr) => `<div>${arr.map(([t, d]) => `<details><summary>${esc(t)}</summary><div>${esc(d)}</div></details>`).join("")}</div>`;
    gl.innerHTML = col(D.glossary.slice(0, half)) + col(D.glossary.slice(half));
  }

  const fq = $("#faq");
  if (fq) fq.innerHTML = D.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><div>${esc(a)}</div></details>`).join("");

  const my = $("#myths");
  if (my) my.innerHTML = D.myths.map(([n, y]) => `<div class="card myth reveal"><div class="no">«${esc(n)}»</div><div class="yes">${esc(y)}</div></div>`).join("");

  const co = $("#countries");
  if (co) co.innerHTML = D.countries.map((c) => `<article class="card country reveal"><div class="flag">${c.flag}</div><h3>${esc(c.name)}</h3>
      <dl class="facts"><dt>${esc(UI.exams)}</dt><dd>${esc(c.exams)}</dd><dt>${esc(UI.when)}</dt><dd>${esc(c.deadlines)}</dd><dt>${esc(UI.money)}</dt><dd>${esc(c.money)}</dd></dl>
      <p>💡 ${esc(c.tip)}</p></article>`).join("");

  const rs = $("#research-steps");
  if (rs) rs.innerHTML = D.researchSteps.map(([t, d]) => `<li class="reveal"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("");

  const board = $("#board");
  if (board) {
    const ideaCard = (x) => `<article class="card reveal">
        <div class="meta"><span class="tag lake">${esc(x.field)}</span>${x._pending ? `<span class="tag pending">${esc(UI.myProject)}</span>` : x._community ? `<span class="tag community">${esc(UI.lookingTeam)}</span>` : `<span class="tag">${esc(UI.idea)}</span>`}</div>
        <h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>
        ${x.contact ? `<p><b>${esc(UI.contact)}:</b> ${esc(x.contact)}</p>` : ""}
      </article>`;
    onAdded.project = () => { board.innerHTML = [...community.project, ...D.ideas].map(ideaCard).join(""); observe(); };
    onAdded.project();
  }

  /* ═════════════ АВТОР ═════════════ */
  const A = window.AUTHOR || {};
  const AL = A[LANG] || A.ru || {};
  const photo = (cls, uid) => `<div class="${cls}"><div class="ap-rays">${logoRays(uid)}</div><div class="ap-ring"></div>${A.photo ? `<img src="${esc(A.photo)}" alt="${esc(A.name)}">` : `<span>?</span>`}</div>`;
  function logoRays(uid) {
    let r = "";
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2, l2 = i % 2 ? 88 : 98;
      r += `<line x1="${(Math.cos(a) * 74).toFixed(1)}" y1="${(Math.sin(a) * 74).toFixed(1)}" x2="${(Math.cos(a) * l2).toFixed(1)}" y2="${(Math.sin(a) * l2).toFixed(1)}"/>`;
    }
    return `<svg viewBox="-100 -100 200 200" aria-hidden="true"><g stroke="#f5b21a" stroke-width="4.5" stroke-linecap="round">${r}</g></svg>`;
  }
  const au = $("#author");
  if (au) {
    au.innerHTML = `${photo("author-photo", "au")}
      <div class="author-text">
        <div class="eyebrow light">${esc(UI.authorLabel)}</div>
        <h1>${esc(A.name)}</h1>
        <p class="author-full">${esc(A.fullName || "")}</p>
        <p class="author-role">📍 ${esc(AL.role || "")}</p>
        ${AL.motto ? `<blockquote class="author-motto">«${esc(AL.motto)}»</blockquote>` : ""}
      </div>`;
  }
  const at = $("#author-about");
  if (at) at.innerHTML = (AL.about || []).map((p) => `<p>${esc(p)}</p>`).join("") + (A.contact ? `<p><b>${esc(UI.authorContact)}:</b> ${esc(A.contact)}</p>` : "");
  const ah = $("#author-home");
  if (ah) ah.innerHTML = `${photo("author-photo sm", "ah")}
      <div><div class="eyebrow">${esc(UI.authorLabel)}</div><h2>${esc(A.name)}</h2><p class="author-role">📍 ${esc(AL.role || "")}</p>
      ${AL.motto ? `<blockquote class="author-motto dark">«${esc(AL.motto)}»</blockquote>` : ""}</div>`;

  /* ═════════════ СЧЁТЧИК ПОСЕЩЕНИЙ (GoatCounter) ═════════════ */
  const GC = String(CFG.goatcounter || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (GC && location.protocol.startsWith("http")) {
    const sc = document.createElement("script");
    sc.async = true; sc.src = "https://gc.zgo.at/count.js";
    sc.dataset.goatcounter = `https://${GC}.goatcounter.com/count`;
    document.head.appendChild(sc);
    fetch(`https://${GC}.goatcounter.com/counter/TOTAL.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const v = $(".views");
        if (j && j.count && v) { $("b", v).textContent = j.count; v.hidden = false; }
      }).catch(() => {});
  }

  /* ═════════════ ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ═════════════ */
  var io;
  function observe() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
    io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -40px" });
    $$(".reveal:not(.in)").forEach((e) => io.observe(e));
  }
  observe();

  loadCommunity().then(() => Object.values(onAdded).forEach((f) => f && f()));
})();
