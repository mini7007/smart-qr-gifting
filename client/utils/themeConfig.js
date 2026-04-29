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

const createPalette = (light, dark) => ({
  light,
  dark
});

export const PALETTE_LIBRARY = {
  warm_gold: createPalette(
    { backgroundGradient: 'linear-gradient(135deg, #fff4d8 0%, #ffe7be 52%, #ffd89c 100%)', primaryColor: '#b7791f', secondaryColor: '#f6ad55', accentColor: '#dd6b20', textPrimary: '#2d1f12', textSecondary: '#6b4f35', cardBackground: 'rgba(255,255,255,0.84)', borderColor: 'rgba(183,121,31,0.28)', glowEffect: 'rgba(246,173,85,0.34)', buttonGradient: 'linear-gradient(135deg, #d69e2e 0%, #dd6b20 100%)' },
    { backgroundGradient: 'linear-gradient(135deg, #1f1408 0%, #3f2a14 52%, #5c3b1a 100%)', primaryColor: '#f6ad55', secondaryColor: '#fbd38d', accentColor: '#f6e05e', textPrimary: '#fff7e6', textSecondary: '#f6d9af', cardBackground: 'rgba(30,22,14,0.84)', borderColor: 'rgba(246,173,85,0.32)', glowEffect: 'rgba(246,173,85,0.42)', buttonGradient: 'linear-gradient(135deg, #f6ad55 0%, #d69e2e 100%)' }
  ),
  pastel_fun: createPalette(
    { backgroundGradient: 'linear-gradient(135deg, #ffe2f2 0%, #dff7ff 50%, #fff2c9 100%)', primaryColor: '#7c3aed', secondaryColor: '#60a5fa', accentColor: '#ec4899', textPrimary: '#2d1b46', textSecondary: '#5b4a76', cardBackground: 'rgba(255,255,255,0.8)', borderColor: 'rgba(124,58,237,0.25)', glowEffect: 'rgba(96,165,250,0.35)', buttonGradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' },
    { backgroundGradient: 'linear-gradient(135deg, #221335 0%, #2f1f4f 52%, #3a2d68 100%)', primaryColor: '#c4b5fd', secondaryColor: '#93c5fd', accentColor: '#f9a8d4', textPrimary: '#f9f5ff', textSecondary: '#d6cbef', cardBackground: 'rgba(37,27,54,0.82)', borderColor: 'rgba(196,181,253,0.28)', glowEffect: 'rgba(147,197,253,0.36)', buttonGradient: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)' }
  ),
  neon_party: createPalette(
    { backgroundGradient: 'linear-gradient(135deg, #1f0133 0%, #2a0b52 48%, #0b3f6e 100%)', primaryColor: '#22d3ee', secondaryColor: '#a3e635', accentColor: '#f472b6', textPrimary: '#f8fafc', textSecondary: '#c4d4ea', cardBackground: 'rgba(16,20,42,0.78)', borderColor: 'rgba(34,211,238,0.32)', glowEffect: 'rgba(244,114,182,0.4)', buttonGradient: 'linear-gradient(135deg, #22d3ee 0%, #f472b6 100%)' },
    { backgroundGradient: 'linear-gradient(135deg, #12011f 0%, #260540 50%, #073052 100%)', primaryColor: '#67e8f9', secondaryColor: '#bef264', accentColor: '#f9a8d4', textPrimary: '#f8fafc', textSecondary: '#d9e1ee', cardBackground: 'rgba(10,13,30,0.8)', borderColor: 'rgba(103,232,249,0.32)', glowEffect: 'rgba(190,242,100,0.36)', buttonGradient: 'linear-gradient(135deg, #22d3ee 0%, #a3e635 100%)' }
  ),
  rose_gold: createPalette(
    { backgroundGradient: 'linear-gradient(135deg, #fff0f3 0%, #ffe5d4 50%, #f8d7da 100%)', primaryColor: '#b76e79', secondaryColor: '#e09f9f', accentColor: '#d97789', textPrimary: '#3f1f29', textSecondary: '#6b4651', cardBackground: 'rgba(255,255,255,0.84)', borderColor: 'rgba(183,110,121,0.26)', glowEffect: 'rgba(224,159,159,0.33)', buttonGradient: 'linear-gradient(135deg, #b76e79 0%, #d97789 100%)' },
    { backgroundGradient: 'linear-gradient(135deg, #241118 0%, #3a1d27 52%, #4f2832 100%)', primaryColor: '#f5b8c0', secondaryColor: '#f8d3cb', accentColor: '#fda4af', textPrimary: '#fff3f5', textSecondary: '#f2cad0', cardBackground: 'rgba(38,18,27,0.84)', borderColor: 'rgba(245,184,192,0.28)', glowEffect: 'rgba(253,164,175,0.36)', buttonGradient: 'linear-gradient(135deg, #f5b8c0 0%, #fda4af 100%)' }
  ),
  deep_red: createPalette({backgroundGradient:'linear-gradient(135deg,#3a0b16 0%,#6b112b 52%,#8b1d38 100%)',primaryColor:'#fb7185',secondaryColor:'#fca5a5',accentColor:'#f43f5e',textPrimary:'#fff1f2',textSecondary:'#fecdd3',cardBackground:'rgba(42,10,20,0.8)',borderColor:'rgba(251,113,133,0.3)',glowEffect:'rgba(244,63,94,0.36)',buttonGradient:'linear-gradient(135deg,#fb7185 0%,#f43f5e 100%)'},{backgroundGradient:'linear-gradient(135deg,#21050d 0%,#430818 52%,#641126 100%)',primaryColor:'#fda4af',secondaryColor:'#fecaca',accentColor:'#fb7185',textPrimary:'#fff1f2',textSecondary:'#ffd4dc',cardBackground:'rgba(30,8,15,0.82)',borderColor:'rgba(253,164,175,0.3)',glowEffect:'rgba(251,113,133,0.4)',buttonGradient:'linear-gradient(135deg,#fda4af 0%,#fb7185 100%)'}),
  lavender_soft: createPalette({backgroundGradient:'linear-gradient(135deg,#f3e8ff 0%,#ede9fe 52%,#e0e7ff 100%)',primaryColor:'#8b5cf6',secondaryColor:'#a78bfa',accentColor:'#6366f1',textPrimary:'#2e1a47',textSecondary:'#5d4b7a',cardBackground:'rgba(255,255,255,0.84)',borderColor:'rgba(139,92,246,0.24)',glowEffect:'rgba(167,139,250,0.35)',buttonGradient:'linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%)'},{backgroundGradient:'linear-gradient(135deg,#1f1539 0%,#2f2252 52%,#3b2c66 100%)',primaryColor:'#c4b5fd',secondaryColor:'#ddd6fe',accentColor:'#a5b4fc',textPrimary:'#f7f4ff',textSecondary:'#ddd6f4',cardBackground:'rgba(33,24,53,0.84)',borderColor:'rgba(196,181,253,0.28)',glowEffect:'rgba(165,180,252,0.36)',buttonGradient:'linear-gradient(135deg,#a78bfa 0%,#818cf8 100%)'}),
  minimal_dark: createPalette({backgroundGradient:'linear-gradient(135deg,#eef2f7 0%,#dbe6f0 52%,#cfdbe8 100%)',primaryColor:'#1e293b',secondaryColor:'#334155',accentColor:'#2563eb',textPrimary:'#0f172a',textSecondary:'#334155',cardBackground:'rgba(255,255,255,0.9)',borderColor:'rgba(30,41,59,0.2)',glowEffect:'rgba(37,99,235,0.2)',buttonGradient:'linear-gradient(135deg,#1e293b 0%,#2563eb 100%)'},{backgroundGradient:'linear-gradient(135deg,#0b1220 0%,#111827 52%,#172033 100%)',primaryColor:'#93c5fd',secondaryColor:'#60a5fa',accentColor:'#38bdf8',textPrimary:'#f8fafc',textSecondary:'#bfdbfe',cardBackground:'rgba(17,24,39,0.85)',borderColor:'rgba(147,197,253,0.24)',glowEffect:'rgba(56,189,248,0.34)',buttonGradient:'linear-gradient(135deg,#2563eb 0%,#38bdf8 100%)'}),
  premium_gold: createPalette({backgroundGradient:'linear-gradient(135deg,#fff8e1 0%,#fde68a 52%,#fcd34d 100%)',primaryColor:'#92400e',secondaryColor:'#b45309',accentColor:'#ca8a04',textPrimary:'#3b1e08',textSecondary:'#7c4a16',cardBackground:'rgba(255,252,238,0.88)',borderColor:'rgba(146,64,14,0.26)',glowEffect:'rgba(251,191,36,0.3)',buttonGradient:'linear-gradient(135deg,#b45309 0%,#f59e0b 100%)'},{backgroundGradient:'linear-gradient(135deg,#2b1b06 0%,#4a2f0a 52%,#6a410e 100%)',primaryColor:'#fde68a',secondaryColor:'#fcd34d',accentColor:'#fbbf24',textPrimary:'#fff9e6',textSecondary:'#f8e8b0',cardBackground:'rgba(43,27,6,0.84)',borderColor:'rgba(253,230,138,0.28)',glowEffect:'rgba(251,191,36,0.38)',buttonGradient:'linear-gradient(135deg,#f59e0b 0%,#fbbf24 100%)'}),
  clean_blue: createPalette({backgroundGradient:'linear-gradient(135deg,#e0f2fe 0%,#dbeafe 52%,#ede9fe 100%)',primaryColor:'#1d4ed8',secondaryColor:'#3b82f6',accentColor:'#0ea5e9',textPrimary:'#0f172a',textSecondary:'#1e3a8a',cardBackground:'rgba(255,255,255,0.88)',borderColor:'rgba(29,78,216,0.24)',glowEffect:'rgba(14,165,233,0.3)',buttonGradient:'linear-gradient(135deg,#2563eb 0%,#0ea5e9 100%)'},{backgroundGradient:'linear-gradient(135deg,#081226 0%,#10284e 52%,#1f3f77 100%)',primaryColor:'#93c5fd',secondaryColor:'#60a5fa',accentColor:'#22d3ee',textPrimary:'#eff6ff',textSecondary:'#bfdbfe',cardBackground:'rgba(9,20,40,0.84)',borderColor:'rgba(147,197,253,0.26)',glowEffect:'rgba(34,211,238,0.34)',buttonGradient:'linear-gradient(135deg,#2563eb 0%,#22d3ee 100%)'}),
  vibrant_mix: createPalette({backgroundGradient:'linear-gradient(135deg,#fff1f2 0%,#fef3c7 50%,#dbeafe 100%)',primaryColor:'#7c3aed',secondaryColor:'#f97316',accentColor:'#06b6d4',textPrimary:'#25123a',textSecondary:'#574170',cardBackground:'rgba(255,255,255,0.84)',borderColor:'rgba(124,58,237,0.24)',glowEffect:'rgba(249,115,22,0.3)',buttonGradient:'linear-gradient(135deg,#7c3aed 0%,#06b6d4 100%)'},{backgroundGradient:'linear-gradient(135deg,#220f38 0%,#3f1d63 52%,#114a69 100%)',primaryColor:'#c4b5fd',secondaryColor:'#fdba74',accentColor:'#67e8f9',textPrimary:'#f8f7ff',textSecondary:'#d8cdf8',cardBackground:'rgba(33,21,58,0.82)',borderColor:'rgba(196,181,253,0.28)',glowEffect:'rgba(103,232,249,0.36)',buttonGradient:'linear-gradient(135deg,#a78bfa 0%,#22d3ee 100%)'}),
  mystery_dark: createPalette({backgroundGradient:'linear-gradient(135deg,#121212 0%,#1f1b2e 52%,#2a2042 100%)',primaryColor:'#8b5cf6',secondaryColor:'#6366f1',accentColor:'#22d3ee',textPrimary:'#f8fafc',textSecondary:'#cbd5e1',cardBackground:'rgba(17,17,24,0.84)',borderColor:'rgba(139,92,246,0.28)',glowEffect:'rgba(34,211,238,0.33)',buttonGradient:'linear-gradient(135deg,#6366f1 0%,#22d3ee 100%)'},{backgroundGradient:'linear-gradient(135deg,#08080d 0%,#131321 52%,#1f1a34 100%)',primaryColor:'#a78bfa',secondaryColor:'#818cf8',accentColor:'#67e8f9',textPrimary:'#f8fafc',textSecondary:'#cbd5e1',cardBackground:'rgba(11,11,19,0.86)',borderColor:'rgba(167,139,250,0.28)',glowEffect:'rgba(103,232,249,0.35)',buttonGradient:'linear-gradient(135deg,#818cf8 0%,#67e8f9 100%)'})
};

export const THEME_CONFIG = {
  birthday: { palettes: ['warm_gold', 'pastel_fun', 'neon_party'], ...BASE_THEME_BEHAVIOR.birthday },
  wedding: { palettes: ['rose_gold', 'premium_gold', 'lavender_soft'], ...BASE_THEME_BEHAVIOR.wedding },
  romantic: { palettes: ['rose_gold', 'deep_red', 'lavender_soft'], ...BASE_THEME_BEHAVIOR.romantic },
  corporate: { palettes: ['minimal_dark', 'premium_gold', 'clean_blue'], ...BASE_THEME_BEHAVIOR.corporate },
  festival: { palettes: ['vibrant_mix', 'pastel_fun', 'neon_party'], ...BASE_THEME_BEHAVIOR.festival },
  surprise: { palettes: ['vibrant_mix', 'mystery_dark'], ...BASE_THEME_BEHAVIOR.surprise },
  default: { palettes: ['warm_gold', 'clean_blue'], ...BASE_THEME_BEHAVIOR.default }
};

if (typeof window !== 'undefined') {
  window.THEME_CONFIG = THEME_CONFIG;
  window.PALETTE_LIBRARY = PALETTE_LIBRARY;
  window.EXPERIMENT_CONFIG = EXPERIMENT_CONFIG;
}
