export const THEME_CONFIG = {
  birthday: {
    primary: "#ff7b7b",
    secondary: "#ffd6a5",
    background: "birthday-gradient",
    particles: "confetti",
    mood: "celebration"
  },
  wedding: {
    primary: "#e6c200",
    secondary: "#fff4d6",
    background: "wedding-gradient",
    particles: "sparkle",
    mood: "romantic"
  },
  corporate: {
    primary: "#1e3a8a",
    secondary: "#93c5fd",
    background: "corporate-gradient",
    particles: "minimal",
    mood: "professional"
  },
  surprise: {
    primary: "#7c3aed",
    secondary: "#c4b5fd",
    background: "surprise-gradient",
    particles: "burst",
    mood: "mystery"
  },
  default: {
    primary: "#8b5cf6",
    secondary: "#c4b5fd",
    background: "default-gradient",
    particles: "minimal",
    mood: "clean"
  }
};

if (typeof window !== 'undefined') {
  window.THEME_CONFIG = THEME_CONFIG;
}
