const THEME_EMOJIS = {
  birthday: ['🎉', '🎂', '🥳'],
  wedding: ['💍', '❤️', '✨'],
  love: ['💍', '❤️', '✨'],
  romantic: ['💍', '❤️', '✨'],
  corporate: ['🎉', '🤝'],
  surprise: ['🎁', '✨'],
  default: ['🎁', '✨']
};

const SHORTCUTS = {
  hbd: 'Happy Birthday',
  hbday: 'Happy Birthday',
  bday: 'Happy birthday'
};

function capitalizeSentence(text) {
  if (!text) return '';

  return text.replace(/(^|[.!?]\s+)([a-z])/g, (match, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
}

function smoothGrammar(text) {
  if (!text) return '';

  let output = text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim();

  output = capitalizeSentence(output);

  if (!/[.!?…]$/.test(output)) {
    output += '!';
  }

  return output;
}

function themeToEmoji(theme) {
  const normalizedTheme = typeof theme === 'string' ? theme.trim().toLowerCase() : 'default';
  return THEME_EMOJIS[normalizedTheme] || THEME_EMOJIS.default;
}

function messageLooksLatin(text) {
  return /[A-Za-z]/.test(text);
}

function maybeExpandShortMessage(text) {
  const lowered = text.toLowerCase();

  if (SHORTCUTS[lowered]) {
    return SHORTCUTS[lowered];
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 2 && messageLooksLatin(text)) {
    return `${text} Wishing you a beautiful day`;
  }

  return text;
}

function enhanceGiftMessage(message, theme) {
  const trimmed = typeof message === 'string' ? message.trim() : '';
  if (!trimmed) return '';

  const base = trimmed.length <= 14 ? maybeExpandShortMessage(trimmed) : trimmed;
  const polished = smoothGrammar(base);

  const emojiSet = themeToEmoji(theme);
  const emojiLimit = polished.length > 120 ? 1 : 2;
  const emojis = emojiSet.slice(0, emojiLimit).join('');

  if (polished.includes('🎉') || polished.includes('🎁') || polished.includes('✨') || polished.includes('❤️') || polished.includes('💍')) {
    return polished;
  }

  return `${polished} ${emojis}`.trim();
}

module.exports = {
  enhanceGiftMessage
};
