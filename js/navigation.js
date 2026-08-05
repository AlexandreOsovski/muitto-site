/* ==========================================================================
   Navigation
   Mobile menu, releases dropdown, sidebar scroll-spy, and the auto-generated
   "on this page" TOC with its own scroll-spy (api.html only — no-ops
   elsewhere since the target elements simply don't exist on other pages).
   ========================================================================== */
(function(){
  "use strict";

  /* ---------- Mobile menu (full-screen overlay) ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobilePanel = document.getElementById('mobilePanel');
  var searchOverlay = document.getElementById('searchOverlay');
  if (menuToggle && mobilePanel) {
    var menuIsOpen = false;

    function openMenu(){
      menuIsOpen = true;
      menuToggle.classList.add('nav__menu-toggle--open');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobilePanel.classList.add('nav__mobile-panel--open');
      document.body.style.overflow = 'hidden';
      var firstLink = mobilePanel.querySelector('.nav__mobile-link');
      if (firstLink) firstLink.focus();
    }

    function closeMenu(returnFocus){
      menuIsOpen = false;
      menuToggle.classList.remove('nav__menu-toggle--open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobilePanel.classList.remove('nav__mobile-panel--open');
      document.body.style.overflow = '';
      if (returnFocus) menuToggle.focus();
    }

    menuToggle.addEventListener('click', function(e){
      e.stopPropagation();
      // If search is open, let it close first instead of stacking overlays.
      if (searchOverlay && searchOverlay.classList.contains('search--open')) {
        searchOverlay.classList.remove('search--open');
        return;
      }
      if (menuIsOpen) closeMenu(false); else openMenu();
    });

    mobilePanel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ closeMenu(false); });
    });

    mobilePanel.addEventListener('click', function(e){
      if (e.target === mobilePanel) closeMenu(false);
    });

    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && menuIsOpen) closeMenu(true);
    });

    window.addEventListener('resize', function(){
      if (window.innerWidth >= 960 && menuIsOpen) closeMenu(false);
    });
  }

  /* ---------- Releases dropdown ---------- */
  var releasesEl = document.getElementById('releases');
  var releasesTrigger = document.getElementById('releasesTrigger');
  if (releasesEl && releasesTrigger) {
    releasesTrigger.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = releasesEl.classList.toggle('releases--open');
      releasesTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){
      if (releasesEl.classList.contains('releases--open') && !releasesEl.contains(e.target)) {
        releasesEl.classList.remove('releases--open');
        releasesTrigger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && releasesEl.classList.contains('releases--open')) {
        releasesEl.classList.remove('releases--open');
        releasesTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Active sidebar link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('.docs__section[id]'));
  var sideLinks = Array.prototype.slice.call(document.querySelectorAll('.sidebar__link'));
  if (sections.length && sideLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    sideLinks.forEach(function(l){ byId[l.getAttribute('href').slice(1)] = l; });
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          sideLinks.forEach(function(l){ l.classList.remove('sidebar__link--active'); });
          link.classList.add('sidebar__link--active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(function(s){ observer.observe(s); });
  }

  /* ---------- On-this-page TOC (auto-generated + scrollspy) ---------- */
  var tocList = document.getElementById('pageTocList');
  var tocEntries = [];

  var savedLang = null;
  try { savedLang = localStorage.getItem('muitto-docs-lang'); } catch(e){}

  function slugify(text){
    var base = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    var candidate = base || 'section';
    var i = 1;
    while (document.getElementById(candidate)) { candidate = base + '-' + (i++); }
    return candidate;
  }

  function tocLabelFor(heading, lang){
    var ptLabel = lang === 'pt' ? heading.getAttribute('data-toc-pt') : null;
    return ptLabel || heading.getAttribute('data-toc') || heading.textContent.trim();
  }

  function refreshTocLabels(lang){
    if (!tocEntries) return;
    tocEntries.forEach(function(entry){
      entry.link.textContent = tocLabelFor(entry.heading, lang);
    });
  }

  if (tocList) {
    var headings = Array.prototype.slice.call(document.querySelectorAll('.docs__content .docs__section > h2, .docs__content .docs__section > h3'));
    headings.forEach(function(h){
      var text = h.textContent.trim();
      if (!text) return;
      if (!h.id) h.id = slugify(text);
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = tocLabelFor(h, (savedLang === 'pt') ? 'pt' : 'en');
      a.className = h.tagName === 'H3' ? 'toc__link toc__link--sub' : 'toc__link';
      li.appendChild(a);
      tocList.appendChild(li);
      tocEntries.push({ heading: h, link: a });
    });

    if (headings.length && 'IntersectionObserver' in window) {
      var tocById = {};
      tocEntries.forEach(function(entry){ tocById[entry.link.getAttribute('href').slice(1)] = entry.link; });
      var tocObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          var link = tocById[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            tocEntries.forEach(function(e){ e.link.classList.remove('toc__link--active'); });
            link.classList.add('toc__link--active');
          }
        });
      }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });
      headings.forEach(function(h){ tocObserver.observe(h); });
    }
  }

  window.refreshTocLabels = refreshTocLabels;
})();
