import { THEME_CONFIG } from '../utils/themeConfig.js';

const statusEl = document.getElementById('viewerStatus');
const messageEl = document.getElementById('giftMessage');
const videoEl = document.getElementById('videoPlayer');
const spotlightEl = document.getElementById('giftSpotlight');

let activeCategory = 'default';

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function setLoadingState(isLoading) {
  document.body.classList.toggle('is-loading-gift', isLoading);
  if (isLoading) {
    setStatus('Loading your gift...');
  }
}

function getGiftIdFromUrl() {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  if (pathSegments.length >= 2 && pathSegments[pathSegments.length - 2] === 'gift') {
    return pathSegments[pathSegments.length - 1];
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('id') || '';
}

function getTheme(themeName) {
  const resolved = window.resolveGiftTheme ? window.resolveGiftTheme(themeName) : 'default';
  return {
    name: resolved,
    config: THEME_CONFIG[resolved] || THEME_CONFIG.default
  };
}

function createBackgroundLayer() {
  const existing = document.querySelector('.theme-immersive-bg');
  if (existing) return existing;

  const background = document.createElement('div');
  background.className = 'theme-immersive-bg';
  background.innerHTML = `
    <div class="theme-immersive-bg__gradient"></div>
    <div class="theme-immersive-bg__glow"></div>
  `;
  document.body.prepend(background);
  return background;
}

function createParticles(themeName, themeToken) {
  const existingLayer = document.querySelector('.view-particles');
  if (existingLayer) {
    existingLayer.remove();
  }

  if (!themeToken.animationSpeed) {
    return;
  }

  const layer = document.createElement('div');
  layer.className = `view-particles particles-${themeToken.particleStyle} particles-${themeName}`;
  document.body.appendChild(layer);

  const isMobile = window.matchMedia('(max-width: 479px)').matches;
  const baseCount = {
    confetti: 14,
    sparkle: 10,
    hearts: 10,
    dots: 12,
    'glow-pulse': 9,
    'line-shimmer': 4,
    minimal: 0
  }[themeToken.particleStyle] || 8;

  const particleCount = isMobile ? Math.max(4, Math.ceil(baseCount / 2)) : baseCount;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'view-particles__dot';
    particle.style.left = `${Math.random() * 100}%`;

    if (themeName === 'birthday') {
      particle.style.animationDelay = `${0.22 * i + Math.random() * 0.35}s`;
      particle.style.animationDuration = `${themeToken.animationSpeed + 6 + Math.random() * 4}s`;
    } else {
      particle.style.animationDelay = `${Math.random() * themeToken.animationSpeed}s`;
      particle.style.animationDuration = `${themeToken.animationSpeed + (Math.random() * 4 - 2)}s`;
    }

    particle.style.setProperty('--particle-sway', `${(Math.random() * 24 - 12).toFixed(1)}px`);
    layer.appendChild(particle);
  }
}

function runEntrySequence() {
  document.body.classList.remove('experience-bg-visible', 'experience-particles-visible', 'experience-card-visible', 'experience-message-visible');

  window.setTimeout(() => document.body.classList.add('experience-bg-visible'), 0);
  window.setTimeout(() => document.body.classList.add('experience-particles-visible'), 220);
  window.setTimeout(() => document.body.classList.add('experience-card-visible'), 440);
  window.setTimeout(() => document.body.classList.add('experience-message-visible'), 680);
}

function applyThemeExperience(theme) {
  const { name, config } = getTheme(theme);
  activeCategory = name;

  const categoryClassMap = {
    birthday: 'birthday-theme',
    wedding: 'wedding-theme',
    corporate: 'corporate-theme',
    love: 'love-theme',
    festival: 'festival-theme',
    default: 'default-theme'
  };

  const categoryClass = categoryClassMap[name] || categoryClassMap.default;
  document.body.className = `viewer-experience ${categoryClass} theme-${name}`;
  document.body.dataset.giftTheme = name;

  document.body.style.setProperty('--gift-theme-primary', config.primary);
  document.body.style.setProperty('--gift-theme-secondary', config.secondary);
  document.body.style.setProperty('--gift-theme-gradient', config.gradient);
  document.body.style.setProperty('--gift-theme-glow', config.glowColor);
  document.body.style.setProperty('--gift-animation-speed', `${config.animationSpeed}s`);

  createBackgroundLayer();
  createParticles(name, config);

  if (spotlightEl) {
    spotlightEl.dataset.theme = name;
  }

  runEntrySequence();
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
  const id = getGiftIdFromUrl();
  if (!id) {
    setStatus('Missing gift link. Please scan a valid QR code.', true);
    return;
  }

  setLoadingState(true);

  try {
    const data = await window.fetchJson(`/gift/${encodeURIComponent(id)}`);
    const message = data?.enhancedMessage || data?.message || 'A surprise gift is waiting for you.';

    messageEl.textContent = message;
    applyThemeExperience(data?.theme || 'default');

    if (data.videoUrl) {
      videoEl.src = resolveMediaUrl(data.videoUrl);
      videoEl.classList.remove('hidden');
    }

    setStatus('');
    if (spotlightEl) {
      spotlightEl.classList.add('reveal-active');
    }
  } catch (error) {
    console.error('[gift-view] Failed to load gift:', error);
    setStatus(error.message || 'Unable to load this gift.', true);
    applyThemeExperience('default');
  } finally {
    setLoadingState(false);
  }
}

window.addEventListener('DOMContentLoaded', loadGift);
window.smartQRGiftView = {
  get category() {
    return activeCategory;
  }
};
