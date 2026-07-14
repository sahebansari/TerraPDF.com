/**
 * TerraPDF.com — Analytics bootstrap (Google Analytics 4, cookieless).
 *
 * Consent Mode defaults deny every storage category, so gtag.js never sets
 * analytics or advertising cookies; Google receives anonymized, aggregate
 * pings only. Documented for visitors at /privacy/.
 *
 * This file must be loaded BEFORE the async gtag.js library tag so the
 * consent default is queued ahead of the config command.
 */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});

gtag('js', new Date());
gtag('config', 'G-RZQ8PWHNLP', { 'anonymize_ip': true });
