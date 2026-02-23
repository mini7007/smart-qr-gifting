const statusEl = document.getElementById('viewerStatus');
const messageEl = document.getElementById('giftMessage');
const videoEl = document.getElementById('videoPlayer');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const API_BASE = window.location.origin.includes('localhost:3000')
  ? 'http://localhost:5000'
  : window.location.origin;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

async function loadGift() {
  if (!id) {
    setStatus('Missing gift link. Please scan a valid QR code.', true);
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/gifts/${encodeURIComponent(id)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Gift not available.');
    }

    messageEl.textContent = data.message;

    if (data.videoUrl) {
      videoEl.src = `${API_BASE}${data.videoUrl}`;
      videoEl.classList.remove('hidden');
    }

    setStatus('');
  } catch (error) {
    setStatus(error.message || 'Unable to load this gift.', true);
  }
}

loadGift();
