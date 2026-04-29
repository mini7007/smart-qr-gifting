import { useTheme } from '../utils/useTheme.js';

(function () {
  const root = document.documentElement;
  const storageKey = 'smartqr-theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let deferredPrompt;
  let themeController;

  function showToast(message) {
    const region = document.getElementById('toastRegion');
    if (!region) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    region.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    window.setTimeout(() => { toast.classList.remove('show'); window.setTimeout(() => toast.remove(), 220); }, 2200);
  }

  function mountPaletteSwitcher() {
    const select = document.getElementById('paletteSwitcher');
    if (!select || !themeController) return;
    select.innerHTML = themeController.availablePalettes.map((palette) => `<option value="${palette}">${palette.replaceAll('_', ' ')}</option>`).join('');
    select.value = themeController.palette;
    select.addEventListener('change', () => {
      themeController.setPalette(select.value);
      console.info('[theme-experiment] user selected palette', select.value);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    if (themeController) themeController.refreshForMode();
  }

  function initTheme() {
    const saved = localStorage.getItem(storageKey);
    applyTheme(saved || (media.matches ? 'dark' : 'light'));
    themeController = useTheme('birthday');
    mountPaletteSwitcher();

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const current = root.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(storageKey, next);
        applyTheme(next);
      });
    }

    media.addEventListener('change', function (event) {
      if (!localStorage.getItem(storageKey)) applyTheme(event.matches ? 'dark' : 'light');
    });
  }

  function initInstallPrompt() { /* unchanged */
    const installBtn = document.getElementById('installBtn');
    window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredPrompt = event; if (installBtn) installBtn.classList.remove('hidden'); });
    if (installBtn) installBtn.addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; installBtn.classList.add('hidden'); });
  }

  function initObservers() { const revealEls = document.querySelectorAll('.reveal'); const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target);} }); }, { threshold: 0.2 }); revealEls.forEach((el) => observer.observe(el)); }
  function registerSW() { if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('/service-worker.js').catch((error) => console.warn('Service worker registration failed:', error)); }); }
  function initI18n() { if (!window.smartQRI18n) return; window.smartQRI18n.mountSwitcher(); window.smartQRI18n.renderText(); }

  if (!window.smartQRAIState) window.smartQRAIState = { triesUsed: 0, theme: null, lastMessages: [] };
  initTheme(); initInstallPrompt(); initObservers(); initI18n(); registerSW();
  window.smartQRUI = { showToast };
})();
