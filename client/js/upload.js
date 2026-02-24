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
const audioRecorderPanel = document.getElementById('audioRecorderPanel');
const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const reRecordBtn = document.getElementById('reRecordBtn');
const audioPreview = document.getElementById('audioPreview');
const recordingTimer = document.getElementById('recordingTimer');
const audioError = document.getElementById('audioError');
const messageEl = document.getElementById('message');
const ttsVoiceSelect = document.getElementById('ttsVoiceSelect');
const generateVoiceBtn = document.getElementById('generateVoiceBtn');
const ttsPreview = document.getElementById('ttsPreview');
const ttsError = document.getElementById('ttsError');
const ttsLoadingState = document.getElementById('ttsLoadingState');

let latestGiftUrl = '';
let latestQrDataUrl = '';
let mediaRecorder = null;
let recordingChunks = [];
let recordingTimerId = null;
let recordingSeconds = 0;
let audioBlob = null;
let audioStream = null;
let ttsGenerated = false;
let ttsVoices = [];
let ttsIsGenerating = false;

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


function formatRecordingTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function setAudioError(message = '') {
  const hasError = Boolean(message);
  audioError.textContent = message;
  audioError.classList.toggle('hidden', !hasError);
}

function setTTSError(message = '') {
  const hasError = Boolean(message);
  ttsError.textContent = message;
  ttsError.classList.toggle('hidden', !hasError);
}

function showComingSoonTTSNotice() {
  setTTSError('');
  if (window.smartQRUI) {
    window.smartQRUI.showToast('✨ Auto voice generation coming soon');
  }
}

function clearTTSAudioPreview() {
  if (!ttsPreview) return;
  if (ttsPreview.dataset.objectUrl) {
    URL.revokeObjectURL(ttsPreview.dataset.objectUrl);
    delete ttsPreview.dataset.objectUrl;
  }
  ttsPreview.pause();
  ttsPreview.removeAttribute('src');
  ttsPreview.load();
  ttsPreview.classList.remove('tts-visible');
  ttsPreview.classList.add('hidden');
}

function showTTSAudioPreview(blob) {
  clearTTSAudioPreview();
  const objectUrl = URL.createObjectURL(blob);
  ttsPreview.src = objectUrl;
  ttsPreview.dataset.objectUrl = objectUrl;
  ttsPreview.classList.remove('hidden');
  requestAnimationFrame(() => {
    ttsPreview.classList.add('tts-visible');
  });
}

function setTTSLoadingState(isLoading) {
  ttsIsGenerating = isLoading;
  if (!generateVoiceBtn || !ttsLoadingState) return;
  generateVoiceBtn.disabled = false;
  generateVoiceBtn.classList.add('is-disabled');
  generateVoiceBtn.setAttribute('aria-disabled', 'true');
  generateVoiceBtn.classList.toggle('is-generating', isLoading);
  generateVoiceBtn.setAttribute('aria-busy', String(isLoading));
  ttsLoadingState.classList.toggle('hidden', !isLoading);
}

function setGeneratedAudioBlob(blob, source = 'recording') {
  audioBlob = blob;
  ttsGenerated = source === 'tts';
  if (source === 'recording') {
    clearTTSAudioPreview();
    setTTSError('');
  }
}

function setRecorderButtons({ isRecording = false, hasRecording = false } = {}) {
  recordBtn.disabled = isRecording;
  stopBtn.disabled = !isRecording;
  reRecordBtn.disabled = isRecording || !hasRecording;
  reRecordBtn.classList.toggle('hidden', !hasRecording);
  recordBtn.classList.toggle('is-recording', isRecording);
}

function resetRecordingTimer() {
  recordingSeconds = 0;
  recordingTimer.textContent = formatRecordingTime(recordingSeconds);
}

function startRecordingTimer() {
  clearInterval(recordingTimerId);
  recordingTimerId = window.setInterval(() => {
    recordingSeconds += 1;
    recordingTimer.textContent = formatRecordingTime(recordingSeconds);
  }, 1000);
}

function stopRecordingTimer() {
  clearInterval(recordingTimerId);
  recordingTimerId = null;
}

function clearAudioPreview() {
  if (audioPreview.dataset.objectUrl) {
    URL.revokeObjectURL(audioPreview.dataset.objectUrl);
    delete audioPreview.dataset.objectUrl;
  }
  audioPreview.pause();
  audioPreview.removeAttribute('src');
  audioPreview.load();
  audioPreview.classList.add('hidden');
}

function showAudioPreview(blob) {
  clearAudioPreview();
  const objectUrl = URL.createObjectURL(blob);
  audioPreview.src = objectUrl;
  audioPreview.dataset.objectUrl = objectUrl;
  audioPreview.classList.remove('hidden');
}

function stopMediaTracks() {
  if (!audioStream) return;
  audioStream.getTracks().forEach((track) => track.stop());
  audioStream = null;
}

async function startRecording() {
  setAudioError('');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
    setAudioError('Audio recording is not supported in this browser.');
    return;
  }

  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? { mimeType: 'audio/webm;codecs=opus' }
      : {};

    mediaRecorder = new MediaRecorder(audioStream, options);
    recordingChunks = [];

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data && event.data.size > 0) {
        recordingChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener('stop', () => {
      stopRecordingTimer();
      stopMediaTracks();

      if (!recordingChunks.length) {
        setRecorderButtons({ isRecording: false, hasRecording: false });
        setAudioError('No audio was captured. Please try recording again.');
        return;
      }

      const recordedBlob = new Blob(recordingChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
      setGeneratedAudioBlob(recordedBlob, 'recording');
      showAudioPreview(audioBlob);
      setRecorderButtons({ isRecording: false, hasRecording: true });
    });

    mediaRecorder.addEventListener('error', () => {
      stopRecordingTimer();
      stopMediaTracks();
      setRecorderButtons({ isRecording: false, hasRecording: Boolean(audioBlob) });
      setAudioError('Recording failed. Please try again.');
    });

    audioBlob = null;
    clearAudioPreview();
    resetRecordingTimer();
    setRecorderButtons({ isRecording: true, hasRecording: false });
    startRecordingTimer();
    mediaRecorder.start();
  } catch (error) {
    stopRecordingTimer();
    stopMediaTracks();
    setRecorderButtons({ isRecording: false, hasRecording: Boolean(audioBlob) });
    if (error && (error.name === 'NotAllowedError' || error.name === 'SecurityError')) {
      setAudioError('Microphone permission was denied. Please allow microphone access to record.');
    } else {
      setAudioError('Unable to access microphone. Please check your audio settings.');
    }
  }
}

function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state !== 'recording') return;
  mediaRecorder.stop();
}

function resetAudioRecording() {
  setGeneratedAudioBlob(null);
  recordingChunks = [];
  stopRecordingTimer();
  resetRecordingTimer();
  clearAudioPreview();
  setAudioError('');
  setRecorderButtons({ isRecording: false, hasRecording: false });
}

function initAudioRecorder() {
  if (!recordBtn || !stopBtn || !reRecordBtn || !audioPreview || !generateVoiceBtn || !ttsVoiceSelect || !ttsPreview || !ttsError || !ttsLoadingState) return;

  resetAudioRecording();
  setTTSError('');
  clearTTSAudioPreview();
  setTTSLoadingState(false);
  populateVoiceOptions();
  generateVoiceBtn.removeAttribute('disabled');
  generateVoiceBtn.title = 'Coming soon';

  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener('voiceschanged', populateVoiceOptions);
  }

  recordBtn.addEventListener('click', () => {
    if (recordBtn.disabled) return;
    startRecording();
  });

  stopBtn.addEventListener('click', () => {
    stopRecording();
  });

  reRecordBtn.addEventListener('click', () => {
    resetAudioRecording();
  });

  generateVoiceBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showComingSoonTTSNotice();
  });

  generateVoiceBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showComingSoonTTSNotice();
    }
  });
}

function populateVoiceOptions() {
  if (!ttsVoiceSelect) return;

  ttsVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  ttsVoiceSelect.innerHTML = '';

  if (!ttsVoices.length) {
    const fallback = document.createElement('option');
    fallback.value = '';
    fallback.textContent = 'Default voice';
    ttsVoiceSelect.appendChild(fallback);
    ttsVoiceSelect.disabled = true;
    return;
  }

  ttsVoiceSelect.disabled = false;
  ttsVoices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${voice.name} (${voice.lang})`;
    ttsVoiceSelect.appendChild(option);
  });
}

async function generateVoiceFromText() {
  if (ttsIsGenerating) return;

  // Reserved for future production TTS integration.
  showComingSoonTTSNotice();
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
      const isAudio = tab.dataset.tab === 'audio';
      futureHint.classList.toggle('hidden', isVideo || isAudio);
      document.getElementById('video').disabled = tab.dataset.tab !== 'video' && tab.dataset.tab !== 'text';
      audioRecorderPanel.classList.toggle('hidden', !isAudio);
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

  if (audioBlob) {
    formData.append('audio', audioBlob, ttsGenerated ? 'tts.webm' : 'recording.webm');
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
initAudioRecorder();
