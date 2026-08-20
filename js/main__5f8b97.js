/* ═══════════════ SPA AUTO — интерактив ═══════════════ */
(function () {
  'use strict';

  /* ─── Год в футере ─── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── Хедер: фон при скролле ─── */
  var header = document.getElementById('header');
  var onScroll = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Cookies и Яндекс.Метрика ─── */
  var loadMetrika = function () {
    if (window.__spaAutoMetrikaLoaded) return;
    window.__spaAutoMetrikaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) return;
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=110153530', 'ym');

    window.ym(110153530, 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true
    });
  };

  var cookieNotice = document.getElementById('cookieNotice');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieKey = 'spaAutoCookieConsent';
  try {
    if (localStorage.getItem(cookieKey) === 'accepted') {
      loadMetrika();
    } else if (cookieNotice) {
      cookieNotice.hidden = false;
    }
  } catch (_e) {
    if (cookieNotice) cookieNotice.hidden = false;
  }
  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      try { localStorage.setItem(cookieKey, 'accepted'); } catch (_e) {}
      if (cookieNotice) cookieNotice.hidden = true;
      loadMetrika();
    });
  }

  /* ─── Мобильное меню ─── */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    var toggleMenu = function (open) {
      var willOpen = open !== undefined ? open : !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      if (header) header.classList.toggle('is-menu-open', willOpen);
      burger.setAttribute('aria-expanded', String(willOpen));
      document.body.style.overflow = willOpen ? 'hidden' : '';
    };
    burger.addEventListener('click', function () { toggleMenu(); });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') toggleMenu(false);
    });
  }

  /* ─── Появление блоков при скролле ─── */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ─── Счётчики в hero ─── */
  var counters = document.querySelectorAll('[data-count]');
  var runCounter = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var start = performance.now();
    var dur = 1400;
    var step = function (now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ─── Переключатель услуг и печатающийся заголовок в hero ─── */
  var heroSlideButtons = Array.prototype.slice.call(document.querySelectorAll('.hero__slide-btn'));
  var heroTitle = document.getElementById('heroTitle');
  if (heroSlideButtons.length && heroTitle) {
    heroSlideButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        heroSlideButtons.forEach(function (item) { item.classList.remove('is-active'); });
        button.classList.add('is-active');
      });
    });
  }

  var heroTypeword = document.getElementById('heroTypeword');
  if (heroTypeword) {
    var typewordText = heroTypeword.getAttribute('data-word') || 'КАЧЕСТВО';
    var reduceTypewordMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var typewordIndex = reduceTypewordMotion ? typewordText.length : 0;
    var typewordDeleting = false;
    var typewordTimer = 0;

    var renderTypeword = function () {
      heroTypeword.textContent = typewordText.slice(0, typewordIndex);
    };
    var stepTypeword = function () {
      if (typewordDeleting) {
        typewordIndex = Math.max(0, typewordIndex - 1);
      } else {
        typewordIndex = Math.min(typewordText.length, typewordIndex + 1);
      }
      renderTypeword();

      var delay = typewordDeleting ? 72 : 118;
      if (!typewordDeleting && typewordIndex === typewordText.length) {
        typewordDeleting = true;
        delay = 1500;
      } else if (typewordDeleting && typewordIndex === 0) {
        typewordDeleting = false;
        delay = 520;
      }
      typewordTimer = window.setTimeout(stepTypeword, delay);
    };

    renderTypeword();
    if (!reduceTypewordMotion) typewordTimer = window.setTimeout(stepTypeword, 360);
    window.addEventListener('pagehide', function () { window.clearTimeout(typewordTimer); }, { once: true });
  }

  /* ─── Слайдер «До / После» ─── */
  var range = document.getElementById('baRange');
  var before = document.getElementById('baBefore');
  var handle = document.getElementById('baHandle');
  if (range && before && handle) {
    var setBA = function (val) {
      before.style.clipPath = 'inset(0 ' + (100 - val) + '% 0 0)';
      handle.style.left = val + '%';
    };
    range.addEventListener('input', function () { setBA(this.value); });
    setBA(range.value);
  }

  /* ─── Мобильный слайдер работ ─── */
  var gallery = document.querySelector('.gallery');
  if (gallery && window.matchMedia) {
    var galleryItems = Array.prototype.slice.call(gallery.querySelectorAll('.gallery__item'));
    var galleryDots = document.querySelector('.gallery__dots');
    var mobileGallery = window.matchMedia('(max-width: 720px)');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var galleryTimer = null;
    var galleryResumeTimer = null;
    var galleryScrollRaf = null;

    var nearestGalleryIndex = function () {
      var left = gallery.scrollLeft;
      var bestIndex = 0;
      var bestDistance = Infinity;
      galleryItems.forEach(function (item, index) {
        var distance = Math.abs(item.offsetLeft - left);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });
      return bestIndex;
    };

    var setActiveGalleryDot = function (index) {
      if (!galleryDots) return;
      galleryDots.querySelectorAll('.gallery__dot').forEach(function (dot, dotIndex) {
        var active = dotIndex === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    };

    var scrollGalleryTo = function (index) {
      var item = galleryItems[index];
      if (!item) return;
      gallery.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
      setActiveGalleryDot(index);
    };

    var stopGalleryAuto = function () {
      if (galleryTimer) {
        window.clearInterval(galleryTimer);
        galleryTimer = null;
      }
    };

    var startGalleryAuto = function () {
      stopGalleryAuto();
      if (!mobileGallery.matches || reducedMotion.matches || galleryItems.length < 2) return;
      galleryTimer = window.setInterval(function () {
        var next = (nearestGalleryIndex() + 1) % galleryItems.length;
        scrollGalleryTo(next);
      }, 3200);
    };

    var pauseGalleryAuto = function () {
      stopGalleryAuto();
      if (galleryResumeTimer) window.clearTimeout(galleryResumeTimer);
      galleryResumeTimer = window.setTimeout(startGalleryAuto, 7000);
    };

    if (galleryDots) {
      galleryItems.forEach(function (_item, index) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'gallery__dot';
        dot.setAttribute('aria-label', 'Показать работу ' + (index + 1));
        dot.addEventListener('click', function () {
          pauseGalleryAuto();
          scrollGalleryTo(index);
        });
        galleryDots.appendChild(dot);
      });
      setActiveGalleryDot(0);
    }

    gallery.addEventListener('scroll', function () {
      if (galleryScrollRaf) return;
      galleryScrollRaf = window.requestAnimationFrame(function () {
        galleryScrollRaf = null;
        setActiveGalleryDot(nearestGalleryIndex());
      });
    }, { passive: true });
    gallery.addEventListener('pointerdown', pauseGalleryAuto, { passive: true });
    gallery.addEventListener('wheel', pauseGalleryAuto, { passive: true });
    mobileGallery.addEventListener('change', startGalleryAuto);
    reducedMotion.addEventListener('change', startGalleryAuto);
    startGalleryAuto();
  }

  /* ─── Маска телефона (мягкая) ─── */
  var phone = document.querySelector('input[name="phone"]');
  if (phone) {
    phone.addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '').slice(0, 11);
      if (!d) { this.value = ''; return; }
      if (d[0] === '8') d = '7' + d.slice(1);
      if (d[0] !== '7') d = '7' + d;
      var out = '+7';
      if (d.length > 1) out += ' (' + d.slice(1, 4);
      if (d.length >= 4) out += ') ' + d.slice(4, 7);
      if (d.length >= 7) out += '-' + d.slice(7, 9);
      if (d.length >= 9) out += '-' + d.slice(9, 11);
      this.value = out;
    });
  }

  /* ─── Общие помощники расчёта ─── */
  var fmt = function (n) { return n.toLocaleString('ru-RU') + '\u00A0₽'; };
  var classKeyFromOption = function (el) {
    return el ? (el.dataset.classKey || 'sedan') : 'sedan';
  };
  var priceForClass = function (el, classKey) {
    var attr = 'price' + classKey.charAt(0).toUpperCase() + classKey.slice(1);
    return parseInt(el.dataset[attr] || el.dataset.priceSedan || el.dataset.price || '0', 10) || 0;
  };
  var sumChecked = function (root, classKey) {
    var sum = 0, services = [];
    root.querySelectorAll('input[type="checkbox"]:checked').forEach(function (c) {
      sum += priceForClass(c, classKey);
      services.push(c.value);
    });
    return { sum: sum, services: services };
  };
  var refreshDisplayedPrices = function (classKey) {
    document.querySelectorAll('[data-price-display]').forEach(function (el) {
      var price = priceForClass(el, classKey);
      if (!price) return;
      el.textContent = 'от\u00A0' + fmt(price);
    });
  };
  // Подсветка выбранных чипов/опций без CSS :has() (он вызывает лишние перерисовки)
  var syncStates = function (root) {
    root.querySelectorAll('.chip, .calc__opt').forEach(function (label) {
      var inp = label.querySelector('input');
      label.classList.toggle('is-on', !!(inp && inp.checked));
    });
  };

  /* ─── Форма записи: несколько услуг + живой расчёт цены ─── */
  var form = document.getElementById('bookingForm');
  var status = document.getElementById('formStatus');
  if (form) {
    var formServices = document.getElementById('formServices');
    var formClass = document.getElementById('formClass');

    var getFormSelection = function () {
      var opt = formClass.options[formClass.selectedIndex];
      var classKey = classKeyFromOption(opt);
      var picked = sumChecked(formServices, classKey);
      return { services: picked.services, carClass: formClass.value, classKey: classKey, total: picked.sum };
    };

    var refreshFormTotal = function () {
      syncStates(form);
    };
    form.addEventListener('change', refreshFormTotal);
    refreshFormTotal();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = '';

      var sel = getFormSelection();
      var val = function (name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ''; };
      var data = {
        name: val('name'),
        phone: val('phone'),
        service: sel.services.join(', '),
        carclass: sel.carClass,
        datetime: val('datetime'),
        comment: val('comment'),
        company: val('company') // honeypot
      };
      var submitBtn = form.querySelector('.form__submit');
      var privacy = form.querySelector('input[name="privacy"]');

      if (data.name.length < 2 || data.phone.replace(/\D/g, '').length < 10) {
        status.className = 'form__status is-err';
        status.textContent = 'Укажите, пожалуйста, имя и\u00A0корректный телефон.';
        return;
      }
      if (privacy && !privacy.checked) {
        status.className = 'form__status is-err';
        status.textContent = 'Подтвердите согласие на\u00A0обработку персональных данных.';
        privacy.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем…';

      fetch('api/submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          if (res && res.ok) {
            form.reset();
            refreshFormTotal();
            status.className = 'form__status is-ok';
            status.textContent = '✓ Заявка отправлена! Мы\u00A0свяжемся с\u00A0вами в\u00A0ближайшее время.';
          } else {
            status.className = 'form__status is-err';
            status.textContent = (res && res.error) || 'Не\u00A0удалось отправить. Используйте демонстрационные контакты на странице.';
          }
        })
        .catch(function () {
          status.className = 'form__status is-err';
          status.textContent = 'Ошибка сети. Используйте демонстрационные контакты на странице.';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить заявку';
        });
    });
  }

  /* ─── Перенос выбора услуг в форму записи ─── */
  var fillBookingForm = function (services, carClass) {
    var fs = document.getElementById('formServices');
    var fc = document.getElementById('formClass');
    if (fs) {
      fs.querySelectorAll('input[type="checkbox"]').forEach(function (c) {
        c.checked = services.indexOf(c.value) !== -1;
      });
    }
    if (fc && carClass) fc.value = carClass;
    var bForm = document.getElementById('bookingForm');
    if (bForm) bForm.dispatchEvent(new Event('change', { bubbles: true }));
  };

  /* ─── Калькулятор стоимости ─── */
  var calc = document.getElementById('calc');
  if (calc) {
    var calcTotalEl = document.getElementById('calcTotal');
    var calcVisual = document.getElementById('calcVisual');
    var calcVisualNext = document.getElementById('calcVisualNext');
    var calcVisualCaption = document.getElementById('calcVisualCaption');
    var calcVisualSwapId = 0;

    var animatePrice = function () {
      calcTotalEl.classList.remove('is-changing');
      void calcTotalEl.offsetWidth;
      calcTotalEl.classList.add('is-changing');
    };

    var showCalcVisual = function (label) {
      if (!label || !calcVisual || !calcVisualNext) return;
      var nextSrc = label.dataset.image;
      if (!nextSrc) return;
      var nextAlt = label.dataset.imageAlt || label.textContent.trim();
      var nextCaption = label.querySelector('span').textContent;
      var swapId = ++calcVisualSwapId;
      var preloader = new Image();
      var revealed = false;
      calcVisualNext.classList.remove('is-visible');

      var reveal = function () {
        if (revealed || swapId !== calcVisualSwapId) return;
        revealed = true;
        calcVisualNext.src = nextSrc;
        if (calcVisualCaption) {
          calcVisualCaption.classList.add('is-changing');
          window.setTimeout(function () {
            if (swapId !== calcVisualSwapId) return;
            calcVisualCaption.textContent = nextCaption;
            calcVisualCaption.classList.remove('is-changing');
          }, 180);
        }
        window.requestAnimationFrame(function () {
          if (swapId === calcVisualSwapId) calcVisualNext.classList.add('is-visible');
        });
        window.setTimeout(function () {
          if (swapId !== calcVisualSwapId) return;
          calcVisual.src = nextSrc;
          calcVisual.alt = nextAlt;
          calcVisualNext.classList.remove('is-visible');
        }, 620);
      };

      preloader.onload = reveal;
      preloader.src = nextSrc;
      if (preloader.complete) reveal();
    };

    var getCalcSelection = function () {
      var classInput = calc.querySelector('input[name="carclass"]:checked');
      var classKey = classKeyFromOption(classInput);
      var picked = sumChecked(calc, classKey);
      return { services: picked.services, carClass: classInput ? classInput.value : '', classKey: classKey, total: picked.sum };
    };

    var recalc = function () {
      var s = getCalcSelection();
      refreshDisplayedPrices(s.classKey);
      calcTotalEl.textContent = s.total > 0 ? 'от\u00A0' + fmt(s.total) : 'ВЫБЕРИТЕ УСЛУГИ';
      calcTotalEl.classList.toggle('is-empty', s.total === 0);
      animatePrice();
      syncStates(calc);
    };
    calc.addEventListener('change', function (event) {
      var serviceLabel = event.target.closest('.calc__opt[data-image]');
      if (serviceLabel) showCalcVisual(serviceLabel);
      recalc();
    });
    recalc();

    // Клик по карточке услуги → отметить её в калькуляторе и прокрутить сюда
    document.querySelectorAll('.card[data-service]').forEach(function (card) {
      var go = function () {
        var name = card.getAttribute('data-service');
        var box = calc.querySelector('input[type="checkbox"][value="' + name + '"]');
        if (box) { box.checked = true; showCalcVisual(box.closest('.calc__opt')); recalc(); }
        calc.scrollIntoView({ behavior: 'smooth' });
      };
      card.addEventListener('click', go);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });

    // «Записаться» → перенести выбор в форму и прокрутить к ней
    var calcBook = document.getElementById('calcBook');
    if (calcBook) {
      calcBook.addEventListener('click', function () {
        var s = getCalcSelection();
        fillBookingForm(s.services, s.carClass);
        var booking = document.getElementById('booking');
        if (booking) booking.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  /* ─── Интерактивная стопка преимуществ ─── */
  var advantageRoot = document.querySelector('[data-advantage-stack]');
  if (advantageRoot) {
    var advantageProjects = [
      {
        number: '01', category: 'ЗАЩИТА КАЧЕСТВА', title: 'Гарантия на работы',
        description: 'Работаем сертифицированными материалами и отвечаем за результат каждой услуги.',
        images: [
          ['assets/services-v2/ceramic-light-4k.jpg', 'Нанесение защитного покрытия на кузов'],
          ['assets/services-v2/wrapping-light-4k.jpg', 'Точная оклейка кузова защитной плёнкой'],
          ['assets/advantages/guarantee.jpg', 'Мастер наносит защитный состав на автомобиль']
        ]
      },
      {
        number: '02', category: 'ПРОЗРАЧНЫЙ ПРОЦЕСС', title: 'Фото- и видеоотчёт',
        description: 'Фиксируем ключевые этапы и показываем, как меняется автомобиль в процессе работы.',
        images: [
          ['assets/works/interior-cleaning.webp', 'Детальная очистка элементов салона'],
          ['assets/works/polishing.webp', 'Контроль качества полировки кузова'],
          ['assets/advantages/report.jpg', 'Специалист снимает фотоотчёт выполненных работ']
        ]
      },
      {
        number: '03', category: 'СРОКИ ПОД КОНТРОЛЕМ', title: 'Точно в срок',
        description: 'Заранее согласуем этапы и дату выдачи. Большинство работ выполняем за один-два дня.',
        images: [
          ['assets/services-v2/windshield-light-4k.jpg', 'Точная установка защитной плёнки на стекло'],
          ['assets/works/anti-chrome.webp', 'Аккуратная работа с деталями автомобиля'],
          ['assets/advantages/deadline.jpg', 'Финальная проверка автомобиля перед выдачей']
        ]
      },
      {
        number: '04', category: 'ПОДБОР РЕШЕНИЯ', title: 'Бесплатная консультация',
        description: 'Оценим состояние автомобиля и предложим подходящие услуги без переплаты и навязывания.',
        images: [
          ['assets/services-v2/interior-light-4k.jpg', 'Профессиональный уход за светлым салоном'],
          ['assets/services-v2/polishing-light-4k.jpg', 'Выбор подходящего уровня полировки'],
          ['assets/advantages/consultation.jpg', 'Консультант показывает клиенту варианты материалов']
        ]
      }
    ];

    var cardsHost = advantageRoot.querySelector('.advantage-stack__cards');
    cardsHost.innerHTML = advantageProjects.map(function (project, index) {
      var firstLoad = index === 0 ? 'eager' : 'lazy';
      return '<article class="adv-card" data-adv-card data-index="' + index + '" tabindex="0" role="group" aria-label="' + project.number + '. ' + project.title + '">' +
        '<button class="adv-card__edge" type="button" tabindex="-1" aria-label="Показать карточку: ' + project.title + '"></button>' +
        '<header class="adv-card__head">' +
          '<span class="adv-card__number" aria-hidden="true">' + project.number + '</span>' +
          '<div class="adv-card__copy"><span class="adv-card__category">' + project.category + '</span><h3>' + project.title + '</h3><p>' + project.description + '</p></div>' +
          '<a class="adv-card__action" href="#booking" aria-label="Записаться: ' + project.title + '">ЗАПИСАТЬСЯ</a>' +
        '</header>' +
        '<div class="adv-card__gallery">' +
          '<div class="adv-card__small">' +
            '<img src="' + project.images[0][0] + '" alt="' + project.images[0][1] + '" width="1200" height="675" loading="' + firstLoad + '" decoding="async">' +
            '<img src="' + project.images[1][0] + '" alt="' + project.images[1][1] + '" width="1200" height="675" loading="lazy" decoding="async">' +
          '</div>' +
          '<img class="adv-card__featured" src="' + project.images[2][0] + '" alt="' + project.images[2][1] + '" width="2400" height="1600" loading="' + firstLoad + '" decoding="async">' +
        '</div>' +
      '</article>';
    }).join('');

    var advantageCards = Array.prototype.slice.call(cardsHost.querySelectorAll('[data-adv-card]'));
    var advantageSection = advantageRoot.closest('.advantage-catalog');
    var advantageFrameRequested = false;
    var advantageSectionTop = 0;
    var advantageTravel = 1;
    var reduceAdvantageMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    advantageRoot.classList.add('is-scroll-linked');
    advantageSection.style.setProperty('--adv-card-count', String(advantageCards.length));
    advantageCards.forEach(function (card, index) {
      card.dataset.depth = '0';
      card.style.zIndex = String(index + 1);
      card.style.setProperty('--adv-translate', index === 0 ? '0%' : '100%');
      var edgeButton = card.querySelector('.adv-card__edge');
      if (edgeButton) edgeButton.hidden = true;
    });

    var measureAdvantages = function () {
      advantageSectionTop = window.scrollY + advantageSection.getBoundingClientRect().top;
      advantageTravel = Math.max(1, advantageSection.offsetHeight - window.innerHeight);
    };

    var updateAdvantages = function () {
      var progress = Math.min(1, Math.max(0, (window.scrollY - advantageSectionTop) / advantageTravel));
      var segmentProgress = progress * Math.max(1, advantageCards.length - 1);
      var activeIndex = Math.min(advantageCards.length - 1, Math.floor(segmentProgress + 0.001));

      advantageCards.forEach(function (card, index) {
        var localProgress = index === 0
          ? 1
          : Math.min(1, Math.max(0, segmentProgress - (index - 1)));
        var translate = (1 - localProgress) * 100;
        card.style.setProperty('--adv-translate', translate.toFixed(3) + '%');
        var isCurrent = index === activeIndex;
        card.setAttribute('aria-current', isCurrent ? 'true' : 'false');
        card.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
        card.tabIndex = isCurrent ? 0 : -1;
        card.inert = !isCurrent;
      });
      advantageRoot.style.setProperty('--adv-progress', progress.toFixed(4));
      advantageFrameRequested = false;
    };

    var requestAdvantageUpdate = function () {
      if (advantageFrameRequested) return;
      advantageFrameRequested = true;
      window.requestAnimationFrame(updateAdvantages);
    };

    var refreshAdvantages = function () {
      measureAdvantages();
      requestAdvantageUpdate();
    };

    refreshAdvantages();
    window.addEventListener('scroll', requestAdvantageUpdate, { passive: true });
    window.addEventListener('resize', refreshAdvantages);
    reduceAdvantageMotion.addEventListener?.('change', requestAdvantageUpdate);
  }

  /* ─── Карта: внешний iframe только если он доступен ─── */
  var mapEl = document.getElementById('map');
  if (mapEl) {
    var mapSrc = mapEl.getAttribute('data-map-src');
    if (mapSrc) {
      var mapLoaded = false;
      var mapFrame = document.createElement('iframe');
      var mapFallbackTimer = window.setTimeout(function () {
        if (!mapLoaded) mapFrame.remove();
      }, 5000);

      mapFrame.setAttribute('src', mapSrc);
      mapFrame.setAttribute('loading', 'lazy');
      mapFrame.setAttribute('allowfullscreen', '');
      mapFrame.setAttribute('title', 'Демонстрационная карта расположения студии');
      mapFrame.addEventListener('load', function () {
        mapLoaded = true;
        window.clearTimeout(mapFallbackTimer);
        mapEl.classList.add('is-map-ready');
      });
      mapFrame.addEventListener('error', function () {
        window.clearTimeout(mapFallbackTimer);
        mapFrame.remove();
      });
      mapEl.appendChild(mapFrame);
    }
  }

})();
