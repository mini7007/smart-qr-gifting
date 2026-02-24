import { THEME_CONFIG } from '../utils/themeConfig.js';

const statusEl = document.getElementById('viewerStatus');
const messageEl = document.getElementById('giftMessage');
const videoEl = document.getElementById('videoPlayer');
const spotlightEl = document.getElementById('giftSpotlight');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function sanitizeTheme(theme) {
  const normalized = (theme || 'default').toLowerCase();
  const aliases = {
    love: 'wedding',
    romantic: 'wedding',
    festival: 'corporate'
  };
  const resolved = aliases[normalized] || normalized;
  return THEME_CONFIG[resolved] ? resolved : 'default';
}

function applyThemeExperience(theme) {
  const normalizedTheme = sanitizeTheme(theme);
  const themeToken = THEME_CONFIG[normalizedTheme];

  document.body.classList.remove(
    'theme-birthday',
    'theme-wedding',
    'theme-corporate',
    'theme-surprise',
    'theme-default'
  );
  document.body.classList.add(`theme-${normalizedTheme}`);
  document.body.dataset.giftTheme = normalizedTheme;
  document.body.style.setProperty('--gift-theme-primary', themeToken.primary);
  document.body.style.setProperty('--gift-theme-secondary', themeToken.secondary);

  if (spotlightEl) {
    spotlightEl.dataset.mood = themeToken.mood;
  }

  const existingLayer = document.querySelector('.view-particles');
  if (existingLayer) {
    existingLayer.remove();
  }

  const layer = document.createElement('div');
  layer.className = `view-particles particles-${themeToken.particles}`;
  document.body.appendChild(layer);

  const particleCount = themeToken.particles === 'minimal' ? 8 : 14;
  for (let i = 0; i < particleCount; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'view-particles__dot';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 4}s`;
    dot.style.animationDuration = `${6 + Math.random() * 4}s`;
    layer.appendChild(dot);
  }
}

function resolveMediaUrl(videoUrl) {
  if (!videoUrl) {
    return '';
  }

  if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
    return videoUrl;
  }

  return `${window.API_BASE.replace(/\/api$/, '')}${videoUrl}`;
}

async function loadGift() {
  if (!id) {
    setStatus('Missing gift link. Please scan a valid QR code.', true);
    return;
  }

  try {
    const data = await window.fetchJson(`/gifts/${encodeURIComponent(id)}`);

    messageEl.textContent = data.message;

    applyThemeExperience(data.theme);

    if (data.videoUrl) {
      videoEl.src = resolveMediaUrl(data.videoUrl);
      videoEl.classList.remove('hidden');
    }

    setStatus('');
    if (spotlightEl) {
      spotlightEl.classList.add('reveal-active');
    }
  } catch (error) {
    setStatus(error.message || 'Unable to load this gift.', true);
  }
}

loadGift();
