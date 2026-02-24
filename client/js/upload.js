const uploadForm = document.getElementById('uploadForm');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const qrImageEl = document.getElementById('qrImage');
const openLinkEl = document.getElementById('openLink');
const submitBtn = document.getElementById('submitBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const shareBtn = document.getElementById('shareBtn');
const downloadQrBtn = document.getElementById('downloadQrBtn');
const progressWrap = document.getElementById('uploadProgressWrap');
const progressBar = document.getElementById('uploadProgressBar');
const progressText = document.getElementById('uploadProgressText');
const successConfetti = document.getElementById('successConfetti');
const tabs = document.querySelectorAll('.upload-tab');
const futureHint = document.getElementById('futureUploaderHint');

let latestGiftUrl = '';
let latestQrDataUrl = '';

function t(key) {
  return window.smartQRI18n ? window.smartQRI18n.t(key) : key;
}

function setStatus(message, isError = false, isLoading = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
  statusEl.classList.toggle('loading', isLoading);
}

function setLoadingState(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading
    ? '<span class="spinner" aria-hidden="true"></span>Generating...'
    : t('upload.submit');
  progressWrap.classList.toggle('hidden', !isLoading);
}

function setProgress(percent) {
  progressBar.style.width = `${Math.max(5, percent)}%`;
  progressText.textContent = `${Math.round(percent)}%`;
}

function createGift(formData) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/api/gifts`);
    xhr.responseType = 'json';

    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable) return;
      setProgress((event.loaded / event.total) * 100);
    });

    xhr.onload = function () {
      const data = xhr.response || {};
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data.error || t('upload.statusFailed')));
      }
    };

    xhr.onerror = function () {
      reject(new Error(t('upload.statusFailed')));
    };

    xhr.send(formData);
  });
}

function launchSuccessBurst() {
  successConfetti.classList.remove('run');
  void successConfetti.offsetWidth;
  successConfetti.classList.add('run');
}

function initTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const isVideo = tab.dataset.tab === 'video' || tab.dataset.tab === 'text';
      futureHint.classList.toggle('hidden', isVideo);
      document.getElementById('video').disabled = tab.dataset.tab !== 'video' && tab.dataset.tab !== 'text';
    });
  });
}

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = document.getElementById('message').value.trim();
  const file = document.getElementById('video').files[0];

  if (!message) {
    setStatus(t('upload.statusMissingMessage'), true);
    return;
  }

  const formData = new FormData();
  formData.append('message', message);

  if (file) {
    formData.append('video', file);
  }

  setLoadingState(true);
  setProgress(10);
  setStatus(t('upload.statusLoading'), false, true);
  resultEl.classList.add('hidden');
  resultEl.classList.remove('success');

  try {
    const data = await createGift(formData);

    if (!data.viewUrl || !data.qr) {
      throw new Error('Invalid gift response from server');
    }

    qrImageEl.src = data.qr;
    latestQrDataUrl = data.qr;
    latestGiftUrl = data.viewUrl;

    openLinkEl.href = data.viewUrl;
    openLinkEl.target = '_blank';
    openLinkEl.rel = 'noopener noreferrer';

    resultEl.classList.remove('hidden');
    requestAnimationFrame(() => {
      resultEl.classList.add('success');
      launchSuccessBurst();
    });

    setStatus(t('upload.statusSuccess'));
    if (window.smartQRUI) {
      window.smartQRUI.showToast('Gift created successfully!');
    }
  } catch (err) {
    console.error('QR generation failed:', err);
    setStatus(err.message || t('upload.statusFailed'), true);
    if (window.smartQRUI) {
      window.smartQRUI.showToast('Could not create gift right now.');
    }
  } finally {
    setLoadingState(false);
    setProgress(0);
  }
});

copyLinkBtn.addEventListener('click', async () => {
  if (!latestGiftUrl) return;
  await navigator.clipboard.writeText(latestGiftUrl);
  window.smartQRUI && window.smartQRUI.showToast('Gift link copied.');
});

shareBtn.addEventListener('click', async () => {
  if (!latestGiftUrl) return;
  if (navigator.share) {
    await navigator.share({ title: 'My Smart QR Gift', url: latestGiftUrl });
  } else {
    await navigator.clipboard.writeText(latestGiftUrl);
    window.smartQRUI && window.smartQRUI.showToast('Web Share unavailable. Link copied.');
  }
});

downloadQrBtn.addEventListener('click', () => {
  if (!latestQrDataUrl) return;
  const link = document.createElement('a');
  link.href = latestQrDataUrl;
  link.download = 'smartqr-gift.png';
  link.click();
});

document.addEventListener('smartqr:languagechange', () => {
  submitBtn.textContent = t('upload.submit');
});

initTabs();
