/**
 * TerraPDF.com — Main JavaScript
 * Handles interactive features: copy buttons, mobile menu, smooth scroll
 */

(function() {
  'use strict';

  // ===========================
  // Copy Button Functionality
  // ===========================
  function initCopyButtons() {
    document.addEventListener('click', async function(e) {
      const button = e.target.closest('.copy-btn, .copy-code-btn, [data-copy], [data-copy-target]');
      if (!button) return;

      e.preventDefault();

      const targetId = button.getAttribute('data-copy') || button.getAttribute('href');
      let textToCopy = '';

      // If data-copy-target is set, copy from that element's text content
      const targetSelector = button.getAttribute('data-copy-target');
      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          textToCopy = targetEl.textContent.trim();
        }
      } else if (targetId && targetId.startsWith('#')) {
        // Copy from element with matching ID
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          textToCopy = targetEl.textContent.trim();
        }
      } else {
        // Copy button's code instance (inline code block)
        const codeEl = button.closest('pre')?.querySelector('code') ||
                      button.closest('.install-box')?.querySelector('code');
        if (codeEl) {
          textToCopy = codeEl.textContent.trim();
        }
      }

      if (!textToCopy) {
        console.warn('No content found to copy');
        return;
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        showCopyFeedback(button, 'Copied!');
      } catch (err) {
        console.error('Copy failed:', err);
        // Fallback for older browsers
        fallbackCopy(textToCopy, button);
      }
    });
  }

  // ===========================
  // Sample Page Modals
  // ===========================
  function initSampleModals() {
    const openButtons = document.querySelectorAll('[data-sample-modal-open]');
    if (!openButtons.length) return;

    let activeModal = null;
    let lastFocused = null;
    const sampleCodeCache = new Map();

    async function loadSampleCode() {
      const output = document.querySelector('#sample-code-output');
      if (!output) return;

      const sourceUrl = output.getAttribute('data-sample-code-src');
      const inlineSource = output.textContent.trim();

      if (inlineSource && !inlineSource.startsWith('// Loading') && !inlineSource.startsWith('// Unable')) {
        sampleCodeCache.set(sourceUrl, inlineSource);
        return;
      }

      if (!sourceUrl) {
        setSampleCode(output, '// No sample source file configured for this page.');
        return;
      }

      if (sampleCodeCache.has(sourceUrl)) {
        setSampleCode(output, sampleCodeCache.get(sourceUrl));
        return;
      }

      setSampleCode(output, '// Loading sample source code...');

      try {
        const response = await fetch(sourceUrl, { cache: 'force-cache' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const source = await response.text();
        sampleCodeCache.set(sourceUrl, source);
        setSampleCode(output, source);
      } catch (err) {
        console.error('Sample source code load failed:', err);
        setSampleCode(output, `// Unable to load sample source code from ${sourceUrl}.`);
      }
    }

    function setSampleCode(output, source) {
      output.textContent = source;

      if (typeof hljs !== 'undefined') {
        delete output.dataset.highlighted;
        hljs.highlightElement(output);
      }
    }

    function openModal(modal) {
      if (!modal) return;

      if (modal.id === 'sample-code-modal') {
        loadSampleCode();
      }

      lastFocused = document.activeElement;
      activeModal = modal;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('sample-modal-open');

      const firstFocusable = modal.querySelector('button, a, iframe, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    function closeModal(modal) {
      const targetModal = modal || activeModal;
      if (!targetModal) return;

      targetModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('sample-modal-open');
      activeModal = null;

      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    openButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = document.getElementById(this.getAttribute('data-sample-modal-open'));
        openModal(modal);
      });
    });

    document.querySelectorAll('[data-sample-modal-close]').forEach(button => {
      button.addEventListener('click', function() {
        closeModal(this.closest('.sample-modal'));
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && activeModal) {
        closeModal(activeModal);
      }
    });
  }

  // Fallback copy method for browsers without Clipboard API
  function fallbackCopy(text, button) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      showCopyFeedback(button, 'Copied!');
    } catch (err) {
      console.error('Fallback copy failed:', err);
      showCopyFeedback(button, 'Failed');
    }

    document.body.removeChild(textarea);
  }

  // Show temporary feedback message on button
  function showCopyFeedback(button, message) {
    const originalText = button.textContent;
    button.textContent = message;
    button.classList.add('copied');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }

  // ===========================
  // Mobile Menu Toggle
  // ===========================
  function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    // Toggle menu on button click
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link (mobile UX)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  }

  // ===========================
  // Smooth Scrolling
  // ===========================
  function initSmoothScroll() {
    // Handle all anchor links with hash
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without triggering scroll
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  // ===========================
  // Keyboard Navigation
  // ===========================
  function initKeyboardNav() {
    // Add visible focus styles for keyboard users
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-nav');
    });

    // Trap focus in mobile menu when open
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

     if (menuToggle && navLinks) {
       menuToggle.addEventListener('click', function() {
         if (navLinks.classList.contains('active')) {
           // Trap focus inside menu
           const firstLink = navLinks.querySelector('a');
           const lastLink = Array.from(navLinks.querySelectorAll('a')).pop();

          firstLink.addEventListener('keydown', function trapFirst(e) {
            if (e.key === 'Tab' && e.shiftKey) {
              e.preventDefault();
              lastLink.focus();
            }
          });

          lastLink.addEventListener('keydown', function trapLast(e) {
            if (e.key === 'Tab' && !e.shiftKey) {
              e.preventDefault();
              firstLink.focus();
            }
          });
        }
      });
    }
  }

  // ===========================
  // Scroll to Top Button
  // ===========================
  function initScrollToTop() {
    // Create scroll-to-top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '↑';
    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===========================
  // Code Block Actions
  // ===========================
  function initCodeBlocks() {
    // Add copy button to each code block if not present
    document.querySelectorAll('pre code').forEach(codeBlock => {
      const pre = codeBlock.parentElement;
      if (!pre.querySelector('.copy-code-btn')) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.setAttribute('aria-label', 'Copy code');
        copyBtn.textContent = 'Copy';
        copyBtn.setAttribute('data-copy-target', '#' + (codeBlock.id || ''));
        pre.appendChild(copyBtn);
      }
    });

    // Ensure code blocks have IDs for copying
    document.querySelectorAll('pre code').forEach((codeBlock, index) => {
      if (!codeBlock.id) {
        codeBlock.id = 'code-block-' + index;
      }
    });
  }

  // ===========================
  // Initialize Everything
  // ===========================
   function init() {
     initCopyButtons();
     initMobileMenu();
     initSmoothScroll();
     initKeyboardNav();
     initScrollToTop();
     initCodeBlocks();
     initSampleModals();
     initSyntaxHighlighting();
   }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ===========================
  // Syntax Highlighting (Highlight.js)
  // ===========================
  function initSyntaxHighlighting() {
    if (typeof hljs !== 'undefined') {
      hljs.highlightAll();
    }
  }

})();
