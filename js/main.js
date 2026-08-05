/* ==========================================================================
   Main entry point
   Every module below is a self-contained, guarded IIFE — each one no-ops
   safely if the elements it looks for aren't on the current page. Nothing
   here needs to call into the others directly except for one hook:
   navigation.js exposes window.refreshTocLabels, which i18n.js calls
   (defensively) after a language switch to relabel the "on this page" TOC.

   Required <script> load order on every page (data file must load first so
   window.MUITTO_PT / window.MUITTO_META exist before i18n.js reads them):

     1. js/data/<page>.i18n.js   (per-page translations + <title>/<meta> text)
     2. js/i18n.js               (i18n engine)
     3. js/navigation.js         (mobile menu, releases, sidebar + TOC scroll-spy)
     4. js/search.js             (⌘K overlay)
     5. js/utils.js              (copy buttons)
     6. js/playground.js         (matcher engine — api.html only, no-ops elsewhere)
     7. js/main.js               (this file — currently just documents the above)
   ========================================================================== */
