import { THEME_CONFIG, PALETTE_LIBRARY } from '../utils/themeConfig.js';
import { useTheme } from '../utils/useTheme.js';

const statusEl = document.getElementById('viewerStatus');
const messageEl = document.getElementById('giftMessage');
const videoEl = document.getElementById('videoPlayer');
const spotlightEl = document.getElementById('giftSpotlight');
let activeCategory = 'default';

function setStatus(message, isError = false) { statusEl.textContent = message; statusEl.classList.toggle('error', isError); }
function setLoadingState(isLoading) { document.body.classList.toggle('is-loading-gift', isLoading); if (isLoading) setStatus('Loading your gift...'); }
function getGiftIdFromUrl() { const p = window.location.pathname.split('/').filter(Boolean); if (p.length >= 2 && p[p.length - 2] === 'gift') return p[p.length - 1]; return new URLSearchParams(window.location.search).get('id') || ''; }

function getTheme(themeName) {
  const resolved = window.resolveGiftTheme ? window.resolveGiftTheme(themeName) : 'default';
  const mapped = resolved === 'love' ? 'romantic' : resolved;
  const config = THEME_CONFIG[mapped] || THEME_CONFIG.default;
  const paletteName = config.recommendedPalette;
  const mode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const palette = (PALETTE_LIBRARY[paletteName] || PALETTE_LIBRARY.warm_gold)[mode];
  return { name: mapped, config: { ...config, primary: palette.primaryColor, secondary: palette.secondaryColor, gradient: palette.backgroundGradient, glowColor: palette.glowEffect } };
}

function createBackgroundLayer() { const e = document.querySelector('.theme-immersive-bg'); if (e) return e; const bg = document.createElement('div'); bg.className = 'theme-immersive-bg'; bg.innerHTML = '<div class="theme-immersive-bg__gradient"></div><div class="theme-immersive-bg__glow"></div>'; document.body.prepend(bg); return bg; }
function createParticles(themeName, themeToken) { const existing = document.querySelector('.view-particles'); if (existing) existing.remove(); if (!themeToken.animationSpeed) return; const layer = document.createElement('div'); layer.className = `view-particles particles-${themeToken.particleStyle} particles-${themeName}`; document.body.appendChild(layer); const mobile = window.matchMedia('(max-width: 479px)').matches; const base = { confetti: 14, sparkle: 10, hearts: 10, dots: 12, 'glow-pulse': 9, 'line-shimmer': 4, minimal: 0 }[themeToken.particleStyle] || 8; const count = mobile ? Math.max(4, Math.ceil(base / 2)) : base; for (let i=0;i<count;i++){ const particle=document.createElement('span'); particle.className='view-particles__dot'; particle.style.left=`${Math.random()*100}%`; particle.style.animationDelay=`${Math.random()*themeToken.animationSpeed}s`; particle.style.animationDuration=`${themeToken.animationSpeed + (Math.random()*4-2)}s`; particle.style.setProperty('--particle-sway',`${(Math.random()*24-12).toFixed(1)}px`); layer.appendChild(particle);} }
function runEntrySequence(){document.body.classList.remove('experience-bg-visible','experience-particles-visible','experience-card-visible','experience-message-visible'); setTimeout(()=>document.body.classList.add('experience-bg-visible'),0);setTimeout(()=>document.body.classList.add('experience-particles-visible'),220);setTimeout(()=>document.body.classList.add('experience-card-visible'),440);setTimeout(()=>document.body.classList.add('experience-message-visible'),680)}

function applyThemeExperience(theme) {
  const { name, config } = getTheme(theme);
  useTheme(name);
  activeCategory = name;
  document.body.className = `viewer-experience theme-${name}`;
  document.body.dataset.giftTheme = name;
  document.body.style.setProperty('--gift-theme-primary', config.primary);
  document.body.style.setProperty('--gift-theme-secondary', config.secondary);
  document.body.style.setProperty('--gift-theme-gradient', config.gradient);
  document.body.style.setProperty('--gift-theme-glow', config.glowColor);
  document.body.style.setProperty('--gift-animation-speed', `${config.animationSpeed}s`);
  createBackgroundLayer(); createParticles(name, config);
  if (spotlightEl) spotlightEl.dataset.theme = name;
  runEntrySequence();
}

function resolveMediaUrl(videoUrl){if(!videoUrl) return ''; if(videoUrl.startsWith('http')) return videoUrl; return `${window.API_BASE.replace(/\/api$/, '')}${videoUrl}`;}
async function loadGift(){ const id=getGiftIdFromUrl(); if(!id){setStatus('Missing gift link. Please scan a valid QR code.',true);return;} setLoadingState(true); try{const data=await window.fetchJson(`/gift/${encodeURIComponent(id)}`); messageEl.textContent=data?.enhancedMessage||data?.message||'A surprise gift is waiting for you.'; applyThemeExperience(data?.theme||'default'); if(data.videoUrl){videoEl.src=resolveMediaUrl(data.videoUrl);videoEl.classList.remove('hidden');} setStatus(''); if(spotlightEl) spotlightEl.classList.add('reveal-active');}catch(error){console.error('[gift-view] Failed to load gift:', error); setStatus(error.message||'Unable to load this gift.',true); applyThemeExperience('default');}finally{setLoadingState(false);} }
window.addEventListener('DOMContentLoaded', loadGift);
window.smartQRGiftView = { get category() { return activeCategory; } };
