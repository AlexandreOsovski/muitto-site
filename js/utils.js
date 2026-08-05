/* ==========================================================================
   Utilities
   Copy-to-clipboard buttons (install command, code blocks)
   ========================================================================== */
(function(){
  "use strict";

  document.querySelectorAll('.copy-button').forEach(function(btn){
    btn.addEventListener('click', function(){
      var text = btn.getAttribute('data-copy');
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function(){
        var original = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';
        btn.classList.add('copy-button--copied');
        setTimeout(function(){ btn.innerHTML = original; btn.classList.remove('copy-button--copied'); }, 1400);
      });
    });
  });
})();
