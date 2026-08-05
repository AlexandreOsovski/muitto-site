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

  var SITE_INDEX = [
    { text: "Home", group: "", href: "index.html#top" },
    { text: "Why MUITTO", group: "Home", href: "index.html#features" },
    { text: "What is MUITTO?", group: "Guide", href: "about.html#guide" },
    { text: "Installation & usage", group: "Guide", href: "about.html#guide-installation" },
    { text: "File discovery", group: "Guide", href: "about.html#guide-discovery" },
    { text: "Writing tests", group: "Guide", href: "about.html#guide-writing-tests" },
    { text: "Mocks & spies", group: "Guide", href: "about.html#guide-mocks" },
    { text: "Fake timers", group: "Guide", href: "about.html#guide-timers" },
    { text: "Snapshots", group: "Guide", href: "about.html#guide-snapshots" },
    { text: "Retry", group: "Guide", href: "about.html#guide-retry" },
    { text: "What is MUITTO?", group: "API", href: "api.html#what-is-muitto" },
    { text: "Installation & usage", group: "API", href: "api.html#getting-started" },
    { text: "File discovery", group: "API", href: "api.html#project-structure" },
    { text: "describe / suite", group: "API", href: "api.html#describe" },
    { text: "it / test", group: "API", href: "api.html#it" },
    { text: ".skip / .only / .todo", group: "API", href: "api.html#skip-only" },
    { text: "it.each", group: "API", href: "api.html#each" },
    { text: "expect()", group: "API", href: "api.html#expect" },
    { text: "Matchers", group: "API", href: "api.html#matchers" },
    { text: "Snapshots", group: "API", href: "api.html#snapshots" },
    { text: "Asymmetric matchers", group: "API", href: "api.html#asymmetric" },
    { text: "fn() & spyOn()", group: "API", href: "api.html#mocks" },
    { text: "mock.calls / mock.results", group: "API", href: "api.html#mock-properties" },
    { text: "mockReturnValue & friends", group: "API", href: "api.html#mock-control" },
    { text: "mockClear / mockReset / mockRestore", group: "API", href: "api.html#mock-reset" },
    { text: "useFakeTimers()", group: "API", href: "api.html#fake-timers" },
    { text: "Timer control methods", group: "API", href: "api.html#timer-methods" },
    { text: "retry()", group: "API", href: "api.html#retry" },
    { text: "Lifecycle hooks", group: "API", href: "api.html#hooks" },
    { text: "CLI", group: "API", href: "api.html#cli" },
    { text: "Config file", group: "API", href: "api.html#config" },
    { text: "Reporters", group: "API", href: "api.html#reporters" },
    { text: "Playground", group: "API", href: "api.html#playground" }
  ];

  function searchIndex(){ return SITE_INDEX; }

  function renderSearchResults(query){
    var items = searchIndex();
    var q = query.trim().toLowerCase();
    if (q) items = items.filter(function(it){ return it.text.toLowerCase().indexOf(q) !== -1; });

    searchResults.innerHTML = '';
    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'search__empty';
      empty.textContent = 'No results';
      searchResults.appendChild(empty);
      return;
    }
    items.forEach(function(it, i){
      var a = document.createElement('a');
      a.href = it.href;
      a.className = 'search__result';
      if (i === 0) a.classList.add('search__result--active');
      var span = document.createElement('span');
      span.textContent = it.text;
      a.appendChild(span);
      if (it.group) {
        var small = document.createElement('small');
        small.className = 'search__result-meta';
        small.textContent = it.group;
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
