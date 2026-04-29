import { SAFE_DEFAULT_PALETTE } from './themeConfig.js';

export function getContrastColor(bgColor) {
  const hex = (bgColor || '').replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((a, c, i) => a + [0.2126, 0.7152, 0.0722][i] * c, 0);
  return lum > 0.45 ? '#000000' : '#ffffff';
}

export function validateThemeTokens(tokens) {
  const merged = { ...SAFE_DEFAULT_PALETTE, ...tokens };
  for (const k of Object.keys(SAFE_DEFAULT_PALETTE)) {
    if (!merged[k]) {
      console.warn(`[theme] Missing token ${k}. Falling back to safe default.`);
      merged[k] = SAFE_DEFAULT_PALETTE[k];
    }
  }
  return merged;
}
