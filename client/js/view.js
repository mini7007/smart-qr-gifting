const statusEl = document.getElementById('viewerStatus');
const messageEl = document.getElementById('giftMessage');
const videoEl = document.getElementById('videoPlayer');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function resolveMediaUrl(videoUrl) {
  if (!videoUrl) {
    return '';
  }

  if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
    return videoUrl;
  }

  return `${API_BASE}${videoUrl}`;
}

async function loadGift() {
  if (!id) {
    setStatus('Missing gift link. Please scan a valid QR code.', true);
    return;
  }

  try {
    const data = await fetchJson(`/api/gifts/${encodeURIComponent(id)}`);

    messageEl.textContent = data.message;

    if (data.videoUrl) {
      videoEl.src = resolveMediaUrl(data.videoUrl);
      videoEl.classList.remove('hidden');
    }

    setStatus('');
  } catch (error) {
    setStatus(error.message || 'Unable to load this gift.', true);
  }
}

loadGift();
