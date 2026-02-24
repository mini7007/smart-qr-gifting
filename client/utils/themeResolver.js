const THEME_CLASS_LIST = [
  'theme-birthday',
  'theme-wedding',
  'theme-corporate',
  'theme-love',
  'theme-festival',
  'theme-surprise',
  'theme-default'
];

function resolveTheme(category) {
  const normalized = (category || 'default').toString().trim().toLowerCase();

  const mapping = {
    birthday: 'birthday',
    wedding: 'wedding',
    'corporate gifting': 'corporate',
    corporate: 'corporate',
    love: 'love',
    romantic: 'love',
    festival: 'festival',
    surprise: 'surprise',
    default: 'default'
  };

  return mapping[normalized] || 'default';
}

if (typeof window !== 'undefined') {
  window.resolveGiftTheme = resolveTheme;
  window.GIFT_THEME_CLASS_LIST = THEME_CLASS_LIST;
}
