/* Shared site chrome for every page: the nav, the footer and Google Analytics.
 *
 * Each page loads this from its <head> (with `defer`) and carries two
 * placeholders outside <x-dc>:
 *
 *   <div id="site-nav" data-cta-href="#enquire">…noscript links…</div>
 *   <x-dc>…page…</x-dc>
 *   <div id="site-footer"></div>
 *
 * The chrome lives outside <x-dc> on purpose: support.js replaces <x-dc>
 * with a React root, and anything inside it is React's to re-render.
 *
 * To add a page to the menu, add or edit its entry in MENU below. An entry
 * without `href` shows as "Coming soon". That is the only place nav and
 * footer links are defined.
 */
(function () {
  'use strict';

  /* ---------- Google Analytics (GA4) ---------- */

  // Public by design, like the Web3Forms key. If this is ever reset to the
  // G-XXXXXXXXXX placeholder, the GA script is not loaded and events go nowhere.
  var GA_MEASUREMENT_ID = 'G-X8TNDSGXCQ';
  var GA_ENABLED = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Consent Mode v2: analytics only, no advertising storage or signals.
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  if (GA_ENABLED) {
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(ga);
  }

  // Pages call this from their own scripts, e.g. on a confirmed enquiry.
  window.sjTrack = function (name, params) {
    window.gtag('event', name, params || {});
  };

  /* ---------- Site map ---------- */

  // `industries` keeps its key so existing data-sj-menu analytics values stay comparable;
  // its label is now "Tertiary product". Digital is out of the menu (page kept, noindex).
  var MENU = {
    industries: {
      label: 'Tertiary product',
      items: [
        { name: 'Microcredentials & post-experience', href: 'tertiary-education.html', desc: 'Credentials designed with industry, assessed by your institution, stacking toward an award.' },
        { name: 'Online postgraduate', desc: 'Portfolio and product strategy for online graduate certificates and master’s.' },
        { name: 'SkillsJewels', href: 'skillsjewels.html', desc: 'The bridge from the employment services caseload to tertiary enrolments that count toward Accord targets.' }
      ]
    },
    services: {
      label: 'Services',
      items: [
        { name: 'Product Strategy', href: 'product-strategy.html', desc: 'Decide which products to build, for which learners, and what to stop offering.' },
        { name: 'Product Development', href: 'product-development.html', desc: 'Lead a product from agreed direction to launch, with your team set up to own it.' },
        { name: 'Advisory Services', href: 'advisory-services.html', desc: 'Senior product counsel for tertiary leadership teams, boards and investors.' }
      ]
    },
    work: { name: 'Work' },
    about: { name: 'About', href: 'about.html' },
    contact: { name: 'Contact', href: 'contact.html' }
  };

  // The broader practice trades under Julian's name until the business name is settled.
  // Change BRAND here and the wordmark in nav and footer follows.
  var BRAND = 'Julian Stevenson';
  var BRAND_SUB = 'Tertiary product';
  var EMAIL = 'info@julianstevenson.com';
  var TAGLINE = 'Product strategy, development and advisory for online and post-experience tertiary education.';
  var ACKNOWLEDGEMENT = 'Julian Stevenson acknowledges the Traditional Custodians of Country throughout Australia and their continuing connection to land, waters and community. I pay my respects to Elders past and present.';

  function wordmark(cls) {
    return '<span class="sjc-wordmark ' + cls + '"><span class="sjc-wordmark-name">' + esc(BRAND) +
      '</span><span class="sjc-wordmark-sub">' + esc(BRAND_SUB) + '</span></span>';
  }

  /* ---------- Helpers ---------- */

  function currentFile() {
    var file = location.pathname.split('/').pop();
    return file === '' ? 'index.html' : file;
  }

  function isCurrent(href) {
    return !!href && href.split('#')[0] === currentFile() && href.indexOf('#') === -1;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var SOON = '<span class="sjc-badge">Soon</span>';

  var CHEVRON = '<svg class="sjc-chevron" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  var BURGER = '<svg class="sjc-toggle-icon" viewBox="0 0 14 10" aria-hidden="true"><path d="M0 1h14M0 5h14M0 9h14" stroke="currentColor" stroke-width="1.5"/></svg>';

  /* ---------- Nav ---------- */

  function navGroup(key, group) {
    var active = group.items.some(function (i) { return isCurrent(i.href); });
    var panelId = 'sjc-panel-' + key;
    var entries = group.items.map(function (i) {
      if (!i.href) {
        return '<li><span class="sjc-entry sjc-soon" aria-disabled="true">' +
          '<span class="sjc-entry-name">' + esc(i.name) + SOON + '</span></span></li>';
      }
      var current = isCurrent(i.href);
      return '<li><a class="sjc-entry' + (current ? ' is-current' : '') + '" href="' + esc(i.href) + '"' +
        (current ? ' aria-current="page"' : '') + ' data-sj-menu="' + key + '">' +
        '<span class="sjc-entry-name">' + esc(i.name) + '</span>' +
        (i.desc ? '<span class="sjc-entry-desc">' + esc(i.desc) + '</span>' : '') +
        '</a></li>';
    }).join('');

    return '<li class="sjc-item">' +
      '<button type="button" class="sjc-trigger' + (active ? ' is-active' : '') + '" aria-expanded="false" aria-controls="' + panelId + '">' +
      esc(group.label) + CHEVRON + '</button>' +
      '<div class="sjc-panel" id="' + panelId + '"><ul>' + entries + '</ul></div></li>';
  }

  function navLink(key, item) {
    if (!item.href) {
      return '<li class="sjc-item"><span class="sjc-link sjc-soon" aria-disabled="true">' + esc(item.name) + SOON + '</span></li>';
    }
    var current = isCurrent(item.href);
    return '<li class="sjc-item"><a class="sjc-link' + (current ? ' is-active' : '') + '" href="' + esc(item.href) + '"' +
      (current ? ' aria-current="page"' : '') + ' data-sj-menu="' + key + '">' + esc(item.name) + '</a></li>';
  }

  function renderNav(host) {
    var ctaHref = host.getAttribute('data-cta-href') || 'contact.html';
    host.className = 'sjc-nav';
    host.setAttribute('role', 'navigation');
    host.setAttribute('aria-label', 'Main');
    host.innerHTML =
      '<div class="sjc-bar">' +
        '<a class="sjc-logo" href="index.html" data-sj-menu="logo" aria-label="' + esc(BRAND) + ' home">' +
          wordmark('') +
        '</a>' +
        '<ul class="sjc-menu" id="sjc-menu">' +
          navGroup('industries', MENU.industries) +
          navGroup('services', MENU.services) +
          navLink('work', MENU.work) +
          navLink('about', MENU.about) +
          navLink('contact', MENU.contact) +
        '</ul>' +
        '<a class="sjc-cta" href="' + esc(ctaHref) + '" data-sj-cta="nav">' +
          '<span class="sjc-cta-full">Book a scoping call</span><span class="sjc-cta-short">Book a call</span>' +
        '</a>' +
        '<button type="button" class="sjc-toggle" aria-expanded="false" aria-controls="sjc-menu">' +
          BURGER + '<span class="sjc-toggle-label">Menu</span>' +
        '</button>' +
      '</div>';

    var items = host.querySelectorAll('.sjc-item');
    var toggle = host.querySelector('.sjc-toggle');

    function closeAll(except) {
      Array.prototype.forEach.call(items, function (it) {
        if (it === except) return;
        it.classList.remove('is-open');
        var t = it.querySelector('.sjc-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }

    Array.prototype.forEach.call(host.querySelectorAll('.sjc-trigger'), function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.parentNode;
        var open = !item.classList.contains('is-open');
        closeAll(item);
        item.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
      });
    });

    toggle.addEventListener('click', function () {
      var open = !host.classList.contains('is-open');
      host.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', function (e) {
      if (!host.contains(e.target)) closeAll(null);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = host.querySelector('.sjc-item.is-open .sjc-trigger');
      closeAll(null);
      if (open) open.focus();
    });

    // Close the mobile menu after following an in-page link (e.g. Contact on the home page)
    host.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) {
        host.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        closeAll(null);
      }
    });
  }

  /* ---------- Footer ---------- */

  function footerList(key, items) {
    return '<ul>' + items.map(function (i) {
      if (!i.href) return '<li><span class="sjc-soon">' + esc(i.name) + SOON + '</span></li>';
      return '<li><a href="' + esc(i.href) + '" data-sj-menu="footer">' + esc(i.name) + '</a></li>';
    }).join('') + '</ul>';
  }

  function renderFooter(host, ctaHref) {
    host.className = 'sjc-footer';
    host.setAttribute('role', 'contentinfo');
    var year = new Date().getFullYear();
    host.innerHTML =
      '<div class="sjc-footer-inner">' +
        '<div class="sjc-cols">' +
          '<div class="sjc-brand">' +
            wordmark('sjc-wordmark-reversed') +
            '<p>' + esc(TAGLINE) + '</p>' +
            '<a class="sjc-brand-cta" href="' + esc(ctaHref) + '" data-sj-cta="footer">Book a scoping call</a>' +
          '</div>' +
          '<div class="sjc-col"><h2>Tertiary product</h2>' + footerList('industries', MENU.industries.items) + '</div>' +
          '<div class="sjc-col"><h2>Services</h2>' + footerList('services', MENU.services.items) + '</div>' +
          '<div class="sjc-col"><h2>Company</h2>' +
            footerList('company', [MENU.work, MENU.about, MENU.contact]).replace('</ul>',
              '<li><a href="mailto:' + EMAIL + '">' + esc(EMAIL) + '</a></li></ul>') +
          '</div>' +
        '</div>' +
        '<div class="sjc-bottom">' +
          '<p class="sjc-ack">' + esc(ACKNOWLEDGEMENT) + '</p>' +
          '<p class="sjc-legal"><span>&copy; ' + year + ' ' + esc(BRAND) + '</span><a href="privacy.html" data-sj-menu="footer">Privacy</a></p>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Analytics events ---------- */

  function trackClicks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href') || '';

      if (href.indexOf('mailto:') === 0) {
        window.sjTrack('contact_email_click', { form_page: currentFile() });
        return;
      }

      var cta = a.getAttribute('data-sj-cta');
      if (cta || a.classList.contains('btn-primary') || a.classList.contains('sj-cta')) {
        window.sjTrack('cta_click', { cta_location: cta || 'page', link_text: (a.innerText || a.textContent).trim().slice(0, 100) });
        return;
      }

      var menu = a.getAttribute('data-sj-menu');
      if (menu) {
        window.sjTrack('nav_click', { menu: menu, link_text: (a.innerText || a.textContent).trim().slice(0, 100) });
      }
    });
  }

  /* ---------- Boot ---------- */

  function boot() {
    var nav = document.getElementById('site-nav');
    var footer = document.getElementById('site-footer');
    var ctaHref = (nav && nav.getAttribute('data-cta-href')) || 'contact.html';
    if (nav) renderNav(nav);
    if (footer) renderFooter(footer, ctaHref);
    trackClicks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
