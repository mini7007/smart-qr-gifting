const uploadForm = document.getElementById('uploadForm');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');
const qrImageEl = document.getElementById('qrImage');
const openLinkEl = document.getElementById('openLink');
const submitBtn = document.getElementById('submitBtn');

const API_BASE = window.location.origin.includes('localhost:3000')
  ? 'http://localhost:5000'
  : window.location.origin;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
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

  submitBtn.disabled = true;
  setStatus('Creating gift and generating your QR code...');
  resultEl.classList.add('hidden');

  try {
    const response = await fetch(`${API_BASE}/api/gifts`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate QR code.');
    }

    qrImageEl.src = data.qr;
    openLinkEl.href = data.viewUrl;
    resultEl.classList.remove('hidden');
    setStatus('Gift created successfully. Save or share your QR code.');
  } catch (error) {
    setStatus(error.message || 'Could not create gift right now.', true);
  } finally {
    submitBtn.disabled = false;
  }
});
