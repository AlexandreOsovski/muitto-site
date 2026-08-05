/* ==========================================================================
   i18n engine
   English lives directly in the markup (single source of truth) — at load we
   snapshot every [data-i18n] element's innerHTML into EN. Portuguese strings
   and the page META come from window.MUITTO_PT / window.MUITTO_META, which
   must be set by a page-specific js/data/*.i18n.js file loaded before this one.
   ========================================================================== */
(function(){
  "use strict";

  var i18nElements = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var EN = {};
  i18nElements.forEach(function(el){ EN[el.getAttribute('data-i18n')] = el.innerHTML; });

  var i18nPlaceholders = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-placeholder]'));
  i18nPlaceholders.forEach(function(el){ EN[el.getAttribute('data-i18n-placeholder')] = el.getAttribute('placeholder'); });

  var META = window.MUITTO_META || {};
  var PT = window.MUITTO_PT || {};

  var langButtons = Array.prototype.slice.call(document.querySelectorAll('[data-lang-btn]'));
  var LANG_KEY = 'muitto-docs-lang';

  function applyLang(lang){
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    i18nElements.forEach(function(el){
      var key = el.getAttribute('data-i18n');
      el.innerHTML = lang === 'pt' ? (PT[key] || EN[key]) : EN[key];
    });
    i18nPlaceholders.forEach(function(el){
      var key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', lang === 'pt' ? (PT[key] || EN[key]) : EN[key]);
    });
    if (META[lang]) {
      var titleEl = document.getElementById('pageTitle');
      var descEl = document.getElementById('pageDesc');
      if (titleEl) titleEl.textContent = META[lang].title;
      if (descEl) descEl.setAttribute('content', META[lang].desc);
    }
    langButtons.forEach(function(b){ b.classList.toggle('language-switcher__option--active', b.getAttribute('data-lang-btn') === lang); });
    if (typeof window.refreshTocLabels === 'function') window.refreshTocLabels(lang);
    try { localStorage.setItem(LANG_KEY, lang); } catch(e){}
  }

  langButtons.forEach(function(btn){
    btn.addEventListener('click', function(){ applyLang(btn.getAttribute('data-lang-btn')); });
  });

  var savedLang = null;
  try { savedLang = localStorage.getItem(LANG_KEY); } catch(e){}
  if (savedLang === 'pt') applyLang('pt');

  window.applyLang = applyLang;
})();
