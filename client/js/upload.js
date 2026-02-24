const uploadForm = document.getElementById('uploadForm');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const qrImageEl = document.getElementById('qrImage');
const openLinkEl = document.getElementById('openLink');
const submitBtn = document.getElementById('submitBtn');

const defaultBtnLabel = 'Generate QR code';

function setStatus(message, isError = false, isLoading = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
  statusEl.classList.toggle('loading', isLoading);
}

function setLoadingState(isLoading) {
  submitBtn.disabled = isLoading;
  if (isLoading) {
    submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span>Generating...';
  } else {
    submitBtn.textContent = defaultBtnLabel;
  }
}

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = document.getElementById('message').value.trim();
  const file = document.getElementById('video').files[0];

  if (!message) {
    setStatus('Please add a gift message before generating the QR code.', true);
    return;
  }

  const formData = new FormData();
  formData.append('message', message);

  if (file) {
    formData.append('video', file);
  }

  setLoadingState(true);
  setStatus('Creating gift and generating your QR code', false, true);
  resultEl.classList.add('hidden');
  resultEl.classList.remove('success');

  try {
    const response = await fetch(`${API_BASE}/api/gifts`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Could not create gift right now.');
    }

    // ✅ UPDATED VALIDATION (matches backend)
    if (!data.viewUrl || !data.qr) {
      throw new Error('Invalid gift response from server');
    }

    // ✅ SET QR IMAGE
    qrImageEl.src = data.qr;

    // ✅ USE BACKEND URL DIRECTLY
    openLinkEl.href = data.viewUrl;
    openLinkEl.target = '_blank';
    openLinkEl.rel = 'noopener noreferrer';

    resultEl.classList.remove('hidden');
    requestAnimationFrame(() => {
      resultEl.classList.add('success');
      openLinkEl.classList.remove('cta-animated');
      void openLinkEl.offsetWidth;
      openLinkEl.classList.add('cta-animated');
    });

    setStatus('Gift created successfully. Save or share your QR code.');
  } catch (err) {
    console.error('QR generation failed:', err);
    alert('Failed to generate QR. Please try again.');
    setStatus(err.message || 'Could not create gift right now.', true);
  } finally {
    setLoadingState(false);
  }
});
