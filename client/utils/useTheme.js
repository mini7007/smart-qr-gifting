import { THEME_CONFIG, PALETTE_LIBRARY, EXPERIMENT_CONFIG, SAFE_DEFAULT_PALETTE } from './themeConfig.js';
import { getContrastColor, validateThemeTokens } from './themeContrast.js';

const PALETTE_STORAGE_KEY = 'user_palette_variant';

const mapTheme = (rawTheme = 'default') => {
  const normalized = rawTheme.toLowerCase();
  const aliases = { love: 'romantic', 'corporate gifting': 'corporate' };
  return aliases[normalized] || (THEME_CONFIG[normalized] ? normalized : 'default');
};
const mode = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
const readQueryPalette = () => new URLSearchParams(window.location.search).get('palette');
const getThemeSettings = (themeName) => THEME_CONFIG[mapTheme(themeName)] || THEME_CONFIG.default;

function validateContrast(tokens) {
  if (import.meta?.env?.MODE === 'production') return;
  const pairs = [['--text-primary', '--bg-primary'], ['--text-secondary', '--bg-secondary'], ['--button-text', '--button-bg']];
  pairs.forEach(([fg, bg]) => {
    if (!tokens[fg] || !tokens[bg]) return;
    if (getContrastColor(tokens[bg]) !== tokens[fg].toLowerCase()) {
      console.warn(`⚠️ Low contrast detected between ${fg} and ${bg}`);
    }
  });
}

function applyPaletteVariables(paletteName) {
  const selected = PALETTE_LIBRARY[paletteName];
  const raw = selected?.[mode()] || selected?.light || SAFE_DEFAULT_PALETTE;
  let tokens = validateThemeTokens(raw);
  tokens['--button-text'] = getContrastColor(tokens['--button-bg']);
  tokens['--accent-contrast'] = getContrastColor(tokens['--accent']);
  validateContrast(tokens);
  const root = document.documentElement;
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));
}

function pickExperimentPalette(themeName) {
  const theme = getThemeSettings(themeName);
  const pool = EXPERIMENT_CONFIG.enabled ? EXPERIMENT_CONFIG.variants.filter((variant) => theme.palettes.includes(variant)) : [];
  const candidates = pool.length ? pool : theme.palettes;
  return candidates[Math.floor(Math.random() * candidates.length)] || theme.recommendedPalette;
}

function getActivePalette(themeName) {
  const theme = getThemeSettings(themeName);
  const requested = readQueryPalette() || localStorage.getItem(PALETTE_STORAGE_KEY);
  if (requested && theme.palettes.includes(requested)) return requested;
  const assigned = pickExperimentPalette(themeName);
  localStorage.setItem(PALETTE_STORAGE_KEY, assigned);
  return assigned;
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
    refreshForMode() { applyPaletteVariables(localStorage.getItem(PALETTE_STORAGE_KEY) || activePalette); }
  };
}
