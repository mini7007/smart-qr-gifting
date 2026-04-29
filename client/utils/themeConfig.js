export const EXPERIMENT_CONFIG = {
  enabled: true,
  variants: ['warm_gold', 'pastel_fun', 'minimal_dark']
};

const BASE_THEME_BEHAVIOR = {
  birthday: { particleStyle: 'confetti', animationSpeed: 18, recommendedPalette: 'warm_gold' },
  wedding: { particleStyle: 'sparkle', animationSpeed: 22, recommendedPalette: 'rose_gold' },
  romantic: { particleStyle: 'hearts', animationSpeed: 20, recommendedPalette: 'rose_gold' },
  corporate: { particleStyle: 'line-shimmer', animationSpeed: 0, recommendedPalette: 'minimal_dark' },
  festival: { particleStyle: 'dots', animationSpeed: 16, recommendedPalette: 'vibrant_mix' },
  surprise: { particleStyle: 'glow-pulse', animationSpeed: 14, recommendedPalette: 'mystery_dark' },
  default: { particleStyle: 'minimal', animationSpeed: 0, recommendedPalette: 'warm_gold' }
};

const SAFE_DEFAULT_TOKENS = {
  '--bg-primary': '#f6f8fb',
  '--bg-secondary': '#edf2f8',
  '--text-primary': '#0f172a',
  '--text-secondary': '#334155',
  '--text-muted': '#475569',
  '--accent': '#2563eb',
  '--accent-contrast': '#ffffff',
  '--card-bg': 'rgba(255,255,255,0.92)',
  '--card-border': 'rgba(15,23,42,0.14)',
  '--button-bg': '#2563eb',
  '--button-text': '#ffffff',
  '--button-hover': '#1d4ed8',
  '--danger': '#dc2626',
  '--success': '#15803d'
};

const createPalette = (light, dark) => ({ light, dark });

export const PALETTE_LIBRARY = {
  warm_gold: createPalette(
    { ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#fff8ef', '--bg-secondary': '#ffe9c5', '--text-primary': '#2f1e11', '--text-secondary': '#5d3d23', '--text-muted': '#704f35', '--accent': '#c07c2a', '--accent-contrast': '#ffffff', '--card-bg': 'rgba(255,255,255,0.9)', '--card-border': 'rgba(138,88,27,0.22)', '--button-bg': '#c07c2a', '--button-text': '#ffffff', '--button-hover': '#a8671e' },
    { ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#1a1209', '--bg-secondary': '#342312', '--text-primary': '#fff7ea', '--text-secondary': '#efd6b1', '--text-muted': '#dbc198', '--accent': '#f1b463', '--accent-contrast': '#1f1308', '--card-bg': 'rgba(28,19,10,0.9)', '--card-border': 'rgba(241,180,99,0.28)', '--button-bg': '#f1b463', '--button-text': '#1f1308', '--button-hover': '#f7c888' }
  ),
  pastel_fun: createPalette(
    { ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#fff1f8', '--bg-secondary': '#e8f5ff', '--text-primary': '#291942', '--text-secondary': '#4a3668', '--text-muted': '#5a4a79', '--accent': '#7c3aed', '--button-bg': '#7c3aed', '--button-hover': '#6d28d9' },
    { ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#1d1532', '--bg-secondary': '#2b2150', '--text-primary': '#fbf8ff', '--text-secondary': '#dfd2f7', '--text-muted': '#c9b9ea', '--accent': '#c4b5fd', '--accent-contrast': '#1d1532', '--card-bg': 'rgba(39,28,60,0.9)', '--card-border': 'rgba(196,181,253,0.26)', '--button-bg': '#c4b5fd', '--button-text': '#1d1532', '--button-hover': '#ddd6fe' }
  ),
  minimal_dark: createPalette(
    { ...SAFE_DEFAULT_TOKENS },
    { ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#0b1220', '--bg-secondary': '#101b33', '--text-primary': '#f8fafc', '--text-secondary': '#d7e3f4', '--text-muted': '#bfd1ea', '--accent': '#7cc4ff', '--accent-contrast': '#071021', '--card-bg': 'rgba(15,25,45,0.9)', '--card-border': 'rgba(124,196,255,0.26)', '--button-bg': '#7cc4ff', '--button-text': '#071021', '--button-hover': '#a2d6ff' }
  ),
  rose_gold: createPalette({ ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#fff3f5', '--bg-secondary': '#ffe4d9', '--text-primary': '#3d1f2a', '--text-secondary': '#6a4250', '--text-muted': '#7b5563', '--accent': '#b86f7d', '--button-bg': '#b86f7d', '--button-hover': '#9c5968' }, { ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#231117', '--bg-secondary': '#3a1d27', '--text-primary': '#fff3f6', '--text-secondary': '#f0cad3', '--text-muted': '#ddb1be', '--accent': '#f6b6c3', '--accent-contrast': '#2b1219', '--card-bg': 'rgba(45,21,31,0.9)', '--button-bg': '#f6b6c3', '--button-text': '#2b1219', '--button-hover': '#ffd1da' }),
  neon_party: createPalette({ ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#170a2d', '--bg-secondary': '#0d3558', '--text-primary': '#f8fbff', '--text-secondary': '#d5e4f5', '--text-muted': '#bfd3ea', '--accent': '#22d3ee', '--accent-contrast': '#051823', '--card-bg': 'rgba(12,18,34,0.88)', '--card-border': 'rgba(34,211,238,0.24)', '--button-bg': '#22d3ee', '--button-text': '#051823', '--button-hover': '#67e8f9' }, { ...SAFE_DEFAULT_TOKENS, '--bg-primary': '#11071f', '--bg-secondary': '#0a253f', '--text-primary': '#f8fbff', '--text-secondary': '#d5e4f5', '--text-muted': '#bfd3ea', '--accent': '#67e8f9', '--accent-contrast': '#03131c', '--card-bg': 'rgba(10,14,28,0.9)', '--button-bg': '#67e8f9', '--button-text': '#03131c', '--button-hover': '#a6f0fb' })
};

export const THEME_CONFIG = {
  birthday: { palettes: ['warm_gold', 'pastel_fun', 'neon_party'], ...BASE_THEME_BEHAVIOR.birthday },
  wedding: { palettes: ['rose_gold', 'warm_gold', 'pastel_fun'], ...BASE_THEME_BEHAVIOR.wedding },
  romantic: { palettes: ['rose_gold', 'pastel_fun', 'warm_gold'], ...BASE_THEME_BEHAVIOR.romantic },
  corporate: { palettes: ['minimal_dark', 'warm_gold', 'pastel_fun'], ...BASE_THEME_BEHAVIOR.corporate },
  festival: { palettes: ['pastel_fun', 'neon_party', 'warm_gold'], ...BASE_THEME_BEHAVIOR.festival },
  surprise: { palettes: ['neon_party', 'minimal_dark'], ...BASE_THEME_BEHAVIOR.surprise },
  default: { palettes: ['warm_gold', 'minimal_dark'], ...BASE_THEME_BEHAVIOR.default }
};

export const SAFE_DEFAULT_PALETTE = SAFE_DEFAULT_TOKENS;
