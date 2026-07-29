/**
 * TerraPDF.com — Theme bootstrap
 * Runs synchronously, before CSS paints, to avoid a flash of the wrong theme.
 * The toggle click-handling lives in main.js; this file only decides the
 * initial state.
 */
(function () {
  'use strict';
  var stored = localStorage.getItem('terrapdf-theme');
  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();
