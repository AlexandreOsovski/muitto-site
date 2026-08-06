/* ==========================================================================
   Search (⌘K)
   Command-palette style search over a hardcoded site-wide index covering
   Home, Guide and API. Works on all three pages.
   ========================================================================== */
(function(){
  "use strict";

  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var navSearchBtn = document.getElementById('navSearch');

  var GROUPS = {
    "": { en: "", pt: "" },
    "Home": { en: "Home", pt: "Início" },
    "Guide": { en: "Guide", pt: "Guia" },
    "API": { en: "API", pt: "API" }
  };

  var SITE_INDEX = [
    { en: "Home", pt: "Início", group: "", href: "index.html#top" },
    { en: "Why MUITTO", pt: "Por que MUITTO", group: "Home", href: "index.html#features" },
    { en: "What is MUITTO?", pt: "O que é o MUITTO?", group: "Guide", href: "about.html#guide" },
    { en: "Installation & usage", pt: "Instalação & uso", group: "Guide", href: "about.html#guide-installation" },
    { en: "File discovery", pt: "Descoberta de arquivos", group: "Guide", href: "about.html#guide-discovery" },
    { en: "Writing tests", pt: "Escrevendo testes", group: "Guide", href: "about.html#guide-writing-tests" },
    { en: "Mocks & spies", pt: "Mocks & spies", group: "Guide", href: "about.html#guide-mocks" },
    { en: "Fake timers", pt: "Fake timers", group: "Guide", href: "about.html#guide-timers" },
    { en: "Snapshots", pt: "Snapshots", group: "Guide", href: "about.html#guide-snapshots" },
    { en: "Retry", pt: "Retry", group: "Guide", href: "about.html#guide-retry" },
    { en: "What is MUITTO?", pt: "O que é o MUITTO?", group: "API", href: "api.html#what-is-muitto" },
    { en: "Installation & usage", pt: "Instalação & uso", group: "API", href: "api.html#getting-started" },
    { en: "File discovery", pt: "Descoberta de arquivos", group: "API", href: "api.html#project-structure" },
    { en: "describe / suite", pt: "describe / suite", group: "API", href: "api.html#describe" },
    { en: "it / test", pt: "it / test", group: "API", href: "api.html#it" },
    { en: ".skip / .only / .todo", pt: ".skip / .only / .todo", group: "API", href: "api.html#skip-only" },
    { en: "it.each", pt: "it.each", group: "API", href: "api.html#each" },
    { en: "expect()", pt: "expect()", group: "API", href: "api.html#expect" },
    { en: "Matchers", pt: "Matchers", group: "API", href: "api.html#matchers" },
    { en: "Snapshots", pt: "Snapshots", group: "API", href: "api.html#snapshots" },
    { en: "Asymmetric matchers", pt: "Matchers assimétricos", group: "API", href: "api.html#asymmetric" },
    { en: "fn() & spyOn()", pt: "fn() & spyOn()", group: "API", href: "api.html#mocks" },
    { en: "mock.calls / mock.results", pt: "mock.calls / mock.results", group: "API", href: "api.html#mock-properties" },
    { en: "mockReturnValue & friends", pt: "mockReturnValue e afins", group: "API", href: "api.html#mock-control" },
    { en: "mockClear / mockReset / mockRestore", pt: "mockClear / mockReset / mockRestore", group: "API", href: "api.html#mock-reset" },
    { en: "useFakeTimers()", pt: "useFakeTimers()", group: "API", href: "api.html#fake-timers" },
    { en: "Timer control methods", pt: "Métodos de controle", group: "API", href: "api.html#timer-methods" },
    { en: "retry()", pt: "retry()", group: "API", href: "api.html#retry" },
    { en: "Lifecycle hooks", pt: "Hooks de ciclo de vida", group: "API", href: "api.html#hooks" },
    { en: "CLI", pt: "CLI", group: "API", href: "api.html#cli" },
    { en: "Config file", pt: "Arquivo de config", group: "API", href: "api.html#config" },
    { en: "Reporters", pt: "Reporters", group: "API", href: "api.html#reporters" },
    { en: "Playground", pt: "Playground", group: "API", href: "api.html#playground" }
  ];

  var NO_RESULTS = { en: "No results", pt: "Nenhum resultado" };

  function currentLang(){
    return document.documentElement.lang && document.documentElement.lang.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  function searchIndex(){ return SITE_INDEX; }

  function renderSearchResults(query){
    var lang = currentLang();
    var items = searchIndex();
    var q = query.trim().toLowerCase();
    if (q) items = items.filter(function(it){ return it[lang].toLowerCase().indexOf(q) !== -1; });

    searchResults.innerHTML = '';
    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'search__empty';
      empty.textContent = NO_RESULTS[lang];
      searchResults.appendChild(empty);
      return;
    }
    items.forEach(function(it, i){
      var a = document.createElement('a');
      a.href = it.href;
      a.className = 'search__result';
      if (i === 0) a.classList.add('search__result--active');
      var span = document.createElement('span');
      span.textContent = it[lang];
      a.appendChild(span);
      if (it.group) {
        var small = document.createElement('small');
        small.className = 'search__result-meta';
        small.textContent = GROUPS[it.group][lang];
        a.appendChild(small);
      }
      a.addEventListener('click', function(){ closeSearch(); });
      searchResults.appendChild(a);
    });
  }

  function openSearch(){
    searchOverlay.classList.add('search--open');
    searchInput.value = '';
    renderSearchResults('');
    setTimeout(function(){ searchInput.focus(); }, 0);
  }
  function closeSearch(){
    searchOverlay.classList.remove('search--open');
  }

  var langButtons = Array.prototype.slice.call(document.querySelectorAll('[data-lang-btn]'));
  langButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      if (searchOverlay && searchOverlay.classList.contains('search--open')) renderSearchResults(searchInput.value);
    });
  });

  if (navSearchBtn) navSearchBtn.addEventListener('click', openSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function(e){ if (e.target === searchOverlay) closeSearch(); });
  }
  if (searchInput) {
    searchInput.addEventListener('input', function(){ renderSearchResults(searchInput.value); });
    searchInput.addEventListener('keydown', function(e){
      var items = Array.prototype.slice.call(searchResults.querySelectorAll('a'));
      if (!items.length) return;
      var activeIndex = items.findIndex(function(a){ return a.classList.contains('search__result--active'); });
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        items[activeIndex] && items[activeIndex].classList.remove('search__result--active');
        var next = e.key === 'ArrowDown' ? (activeIndex + 1) % items.length : (activeIndex - 1 + items.length) % items.length;
        items[next].classList.add('search__result--active');
        items[next].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var current = items[activeIndex] || items[0];
        if (current) { window.location.href = current.getAttribute('href'); closeSearch(); }
      }
    });
  }
  document.addEventListener('keydown', function(e){
    var isK = e.key === 'k' || e.key === 'K';
    if ((e.metaKey || e.ctrlKey) && isK) { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('search--open')) closeSearch();
  });
})();
