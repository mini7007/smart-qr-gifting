import { THEME_CONFIG, PALETTE_LIBRARY, EXPERIMENT_CONFIG } from './themeConfig.js';

const PALETTE_STORAGE_KEY = 'user_palette_variant';

const mapTheme = (rawTheme = 'default') => {
  const normalized = rawTheme.toLowerCase();
  const aliases = { love: 'romantic', 'corporate gifting': 'corporate' };
  return aliases[normalized] || (THEME_CONFIG[normalized] ? normalized : 'default');
};

const mode = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

const readQueryPalette = () => new URLSearchParams(window.location.search).get('palette');

function getThemeSettings(themeName) {
  return THEME_CONFIG[mapTheme(themeName)] || THEME_CONFIG.default;
}

function pickExperimentPalette(themeName) {
  const theme = getThemeSettings(themeName);
  const pool = EXPERIMENT_CONFIG.enabled
    ? EXPERIMENT_CONFIG.variants.filter((variant) => theme.palettes.includes(variant))
    : [];
  const candidates = pool.length ? pool : theme.palettes;
  return candidates[Math.floor(Math.random() * candidates.length)] || theme.recommendedPalette;
}

function getActivePalette(themeName) {
  const theme = getThemeSettings(themeName);
  const queryPalette = readQueryPalette();
  const saved = localStorage.getItem(PALETTE_STORAGE_KEY);

  const requestedPalette = queryPalette || saved;
  if (requestedPalette && theme.palettes.includes(requestedPalette)) {
    localStorage.setItem(PALETTE_STORAGE_KEY, requestedPalette);
    return requestedPalette;
  }

  const assigned = pickExperimentPalette(themeName);
  localStorage.setItem(PALETTE_STORAGE_KEY, assigned);
  console.info('[theme-experiment] assigned palette', { theme: mapTheme(themeName), palette: assigned });
  return assigned;
}

function applyPaletteVariables(paletteName) {
  const selected = PALETTE_LIBRARY[paletteName] || PALETTE_LIBRARY.warm_gold;
  const tokens = selected[mode()] || selected.light;
  const root = document.documentElement;

  root.style.setProperty('--bg-gradient', tokens.backgroundGradient);
  root.style.setProperty('--primary', tokens.primaryColor);
  root.style.setProperty('--secondary', tokens.secondaryColor);
  root.style.setProperty('--accent', tokens.accentColor);
  root.style.setProperty('--text-main', tokens.textPrimary);
  root.style.setProperty('--text-secondary', tokens.textSecondary);
  root.style.setProperty('--card-bg', tokens.cardBackground);
  root.style.setProperty('--border-color', tokens.borderColor);
  root.style.setProperty('--glow-effect', tokens.glowEffect);
  root.style.setProperty('--button-gradient', tokens.buttonGradient);
}

export function useTheme(themeName = 'default') {
  const resolvedTheme = mapTheme(themeName);
  const activePalette = getActivePalette(resolvedTheme);
  applyPaletteVariables(activePalette);

  return {
    theme: resolvedTheme,
    palette: activePalette,
    availablePalettes: getThemeSettings(resolvedTheme).palettes,
    recommendedPalette: getThemeSettings(resolvedTheme).recommendedPalette,
    setPalette(nextPalette) {
      if (!getThemeSettings(resolvedTheme).palettes.includes(nextPalette)) return;
      localStorage.setItem(PALETTE_STORAGE_KEY, nextPalette);
      applyPaletteVariables(nextPalette);
    },
    refreshForMode() {
      applyPaletteVariables(localStorage.getItem(PALETTE_STORAGE_KEY) || activePalette);
    }
  };
}

export const THEME_STORAGE_KEYS = { PALETTE_STORAGE_KEY };
