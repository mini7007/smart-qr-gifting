(function () {
  const dictionaries = {
    en: {
      'hero.eyebrow': 'Turn moments into unforgettable surprises',
      'hero.title': 'Create beautiful QR-powered gifts in minutes',
      'hero.subtitle': 'Craft a personalized page with message, media, and a ready-to-share QR code.',
      'hero.primaryCta': 'Create a Gift',
      'hero.install': 'Install App',
      'hero.storyTitle': 'Why teams and families love SmartQR',
      'hero.storyBody': 'From birthdays to brand activations, SmartQR helps you deliver meaning through a simple scan.',
      'how.title': 'How it works',
      'how.step1Title': '1. Personalize',
      'how.step1Body': 'Write your message and choose media for the perfect delivery.',
      'how.step2Title': '2. Generate',
      'how.step2Body': 'Instantly get a unique QR code linked to your gift page.',
      'how.step3Title': '3. Delight',
      'how.step3Body': 'Print, share, or attach your QR and reveal the surprise.',
      'formats.title': 'Supported gift formats',
      'formats.text': 'Text',
      'formats.video': 'Video',
      'formats.audio': 'Audio',
      'formats.images': 'Images',
      'formats.gif': 'GIFs',
      'useCases.title': 'Built for every occasion',
      'useCases.birthdays': 'Birthdays',
      'useCases.corporate': 'Corporate gifting',
      'useCases.weddings': 'Weddings',
      'useCases.surprises': 'Surprises',
      'cta.title': 'Ready to create your next unforgettable gift?',
      'cta.body': 'Start free and share your first QR gift in less than a minute.',
      'cta.button': 'Start Creating',
      'footer.tagline': 'Premium gifting experiences, one scan away.',
      'upload.title': 'Create your premium gift',
      'upload.subtitle': 'Keep your existing flow, now with a future-ready media experience.',
      'upload.tabs.text': 'Text',
      'upload.tabs.video': 'Video',
      'upload.tabs.audio': 'Audio',
      'upload.tabs.image': 'Image',
      'upload.tabs.gif': 'GIF',
      'upload.futureHint': 'Video upload is live today. Audio/Image/GIF tabs are UI-ready for upcoming releases.',
      'upload.messageLabel': 'Gift message',
      'upload.messagePlaceholder': 'Write something memorable...',
      'upload.videoLabel': 'Optional video (MP4, WebM, OGG, MOV · max 30MB)',
      'upload.submit': 'Generate QR code',
      'upload.resultTitle': 'Your gift is ready 🎉',
      'upload.openGift': 'Open gift page',
      'upload.copyLink': 'Copy Link',
      'upload.share': 'Share',
      'upload.downloadQr': 'Download QR',
      'upload.statusLoading': 'Creating gift and generating your QR code',
      'upload.statusSuccess': 'Gift created successfully. Save or share your QR code.',
      'upload.statusMissingMessage': 'Please add a gift message before generating the QR code.',
      'upload.statusFailed': 'Could not create gift right now.'
    },
    es: {
      'hero.eyebrow': 'Convierte momentos en sorpresas inolvidables',
      'hero.title': 'Crea regalos con QR en minutos',
      'hero.subtitle': 'Diseña una página personalizada con mensaje, media y QR listo para compartir.',
      'hero.primaryCta': 'Crear regalo',
      'hero.install': 'Instalar app',
      'hero.storyTitle': 'Por qué aman SmartQR',
      'hero.storyBody': 'Desde cumpleaños hasta activaciones de marca, SmartQR entrega emoción con un escaneo.'
    }
  };

  const languages = [{ code: 'en', label: 'English' }, { code: 'es', label: 'Español' }];
  const storageKey = 'smartqr-lang';
  const defaultLanguage = 'en';

  function getCurrentLanguage() {
    const saved = localStorage.getItem(storageKey);
    if (saved && dictionaries[saved]) return saved;
    const browser = (navigator.language || '').slice(0, 2);
    return dictionaries[browser] ? browser : defaultLanguage;
  }

  function t(key) {
    const lang = getCurrentLanguage();
    return dictionaries[lang][key] || dictionaries.en[key] || key;
  }

  function renderText() {
    document.documentElement.lang = getCurrentLanguage();
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
  }

  function mountSwitcher() {
    const switcher = document.getElementById('languageSwitcher');
    if (!switcher) return;

    switcher.innerHTML = '';
    languages.forEach((lang) => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.label;
      switcher.append(option);
    });

    switcher.value = getCurrentLanguage();
    switcher.addEventListener('change', (event) => {
      localStorage.setItem(storageKey, event.target.value);
      renderText();
      document.dispatchEvent(new CustomEvent('smartqr:languagechange'));
    });
  }

  window.smartQRI18n = { t, renderText, mountSwitcher };
})();
