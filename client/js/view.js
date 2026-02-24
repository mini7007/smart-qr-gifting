const statusEl = document.getElementById('viewerStatus');
const messageEl = document.getElementById('giftMessage');
const videoEl = document.getElementById('videoPlayer');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}


function applyThemeExperience(theme) {
  const normalized = (theme || 'default').toLowerCase();
  document.body.dataset.giftTheme = normalized;

  if (normalized === 'birthday') {
    const layer = document.createElement('div');
    layer.className = 'view-particles';
    document.body.appendChild(layer);

    for (let i = 0; i < 18; i += 1) {
      const dot = document.createElement('span');
      dot.className = 'view-particles__dot';
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 3}s`;
      layer.appendChild(dot);
    }
  }
}

function resolveMediaUrl(videoUrl) {
  if (!videoUrl) {
    return '';
  }

  if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
    return videoUrl;
  }

  return `${API_BASE.replace(/\/api$/, '')}${videoUrl}`;
}

async function loadGift() {
  if (!id) {
    setStatus('Missing gift link. Please scan a valid QR code.', true);
    return;
  }

  try {
    const data = await fetchJson(`/gifts/${encodeURIComponent(id)}`);

    messageEl.textContent = data.message;

    applyThemeExperience(data.theme);

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
