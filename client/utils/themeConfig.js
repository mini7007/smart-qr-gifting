export const THEME_CONFIG = {
  birthday: {
    primary: '#ff7b7b',
    secondary: '#ffd6a5',
    gradient: 'linear-gradient(135deg, #2f1639 0%, #613457 48%, #a95d47 100%)',
    particleStyle: 'confetti',
    animationSpeed: 18,
    glowColor: 'rgba(255, 169, 107, 0.45)'
  },
  wedding: {
    primary: '#d4af37',
    secondary: '#f7ecd1',
    gradient: 'linear-gradient(135deg, #21160d 0%, #493520 52%, #7c5f34 100%)',
    particleStyle: 'sparkle',
    animationSpeed: 22,
    glowColor: 'rgba(248, 226, 167, 0.38)'
  },
  corporate: {
    primary: '#1f3f77',
    secondary: '#9ab8df',
    gradient: 'linear-gradient(135deg, #0c1b34 0%, #14315a 50%, #20466f 100%)',
    particleStyle: 'line-shimmer',
    animationSpeed: 0,
    glowColor: 'rgba(120, 166, 214, 0.22)'
  },
  love: {
    primary: '#f0548a',
    secondary: '#ffc2d8',
    gradient: 'linear-gradient(135deg, #2a1025 0%, #5d1f42 52%, #8a305f 100%)',
    particleStyle: 'hearts',
    animationSpeed: 20,
    glowColor: 'rgba(255, 140, 176, 0.36)'
  },
  festival: {
    primary: '#9b5de5',
    secondary: '#f9c74f',
    gradient: 'linear-gradient(135deg, #161637 0%, #353d7b 48%, #844cb1 100%)',
    particleStyle: 'dots',
    animationSpeed: 16,
    glowColor: 'rgba(255, 211, 107, 0.34)'
  },
  surprise: {
    primary: '#7c3aed',
    secondary: '#c4b5fd',
    gradient: 'linear-gradient(135deg, #170f37 0%, #322069 48%, #513099 100%)',
    particleStyle: 'glow-pulse',
    animationSpeed: 14,
    glowColor: 'rgba(166, 133, 255, 0.4)'
  },
  default: {
    primary: '#8b5cf6',
    secondary: '#c4b5fd',
    gradient: 'linear-gradient(135deg, #1f153f 0%, #3e2972 48%, #5640a8 100%)',
    particleStyle: 'minimal',
    animationSpeed: 0,
    glowColor: 'rgba(156, 125, 255, 0.24)'
  }
};

if (typeof window !== 'undefined') {
  window.THEME_CONFIG = THEME_CONFIG;
}
