const statusEl = document.getElementById('arStatus');
const hintEl = document.getElementById('arHint');
const placeHintEl = document.getElementById('arTapHint');
const placeBtn = document.getElementById('arPlaceBtn');
const fallbackEl = document.getElementById('arFallback');
const fallbackMessageEl = document.getElementById('arFallbackMessage');
const fallbackViewLinkEl = document.getElementById('arFallbackViewLink');
const backLinkEl = document.getElementById('arBackLink');

const state = {
  giftId: '',
  media: null,
  renderer: null,
  scene: null,
  camera: null,
  reticle: null,
  hitTestSource: null,
  hitTestSourceRequested: false,
  surfaceDetected: false,
  placed: false,
  giftMesh: null
};

function setStatus(message) {
  if (statusEl) statusEl.textContent = message;
}

function setHint(message) {
  if (hintEl) hintEl.textContent = message;
}

function showFallback(message) {
  if (fallbackMessageEl) {
    fallbackMessageEl.textContent = message;
  }
  if (fallbackEl) {
    fallbackEl.hidden = false;
  }
  setStatus('AR unavailable');
  setHint('Open gift in standard mode');
}

function readGiftId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('giftId') || params.get('id') || '';
}

function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${window.API_BASE.replace(/\/api$/, '')}${url}`;
}

async function loadGiftData(giftId) {
  const data = await window.fetchJson(`/gift/${encodeURIComponent(giftId)}`);
  const mediaUrl = data.videoUrl || data.gifUrl || data.imageUrl || '';
  const mediaType = data.videoUrl ? 'video' : data.gifUrl ? 'gif' : data.imageUrl ? 'image' : '';

  if (!mediaType || !mediaUrl) {
    throw new Error('This gift does not include media for AR placement yet.');
  }

  return {
    mediaType,
    mediaUrl: resolveMediaUrl(mediaUrl),
    message: data.enhancedMessage || data.message || ''
  };
}

async function getThreeJs() {
  return import('https://esm.sh/three@0.160.0');
}

function updateBackLinks(giftId) {
  const href = `view.html?id=${encodeURIComponent(giftId)}`;
  if (backLinkEl) backLinkEl.href = href;
  if (fallbackViewLinkEl) fallbackViewLinkEl.href = href;
}

async function createMediaTexture(THREE, media) {
  if (media.mediaType === 'video') {
    const video = document.createElement('video');
    video.src = media.mediaUrl;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';

    try {
      await video.play();
    } catch (error) {
      console.warn('[ar] video autoplay will retry after user gesture', error);
    }

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;

    return {
      texture,
      ratio: 16 / 9,
      resume() {
        video.play().catch(() => {});
      }
    };
  }

  const textureLoader = new THREE.TextureLoader();
  const imageTexture = await new Promise((resolve, reject) => {
    textureLoader.load(media.mediaUrl, resolve, undefined, reject);
  });

  imageTexture.colorSpace = THREE.SRGBColorSpace;
  const image = imageTexture.image;
  const ratio = image && image.width && image.height ? image.width / image.height : 1;

  return {
    texture: imageTexture,
    ratio
  };
}

async function initArSession() {
  setStatus('Loading AR…');
  setHint('Move phone slowly');

  if (!navigator.xr) {
    showFallback('WebXR is not available. Use Android Chrome or iOS Safari with WebXR support.');
    return;
  }

  const supported = await navigator.xr.isSessionSupported('immersive-ar');
  if (!supported) {
    showFallback('AR session is unsupported on this browser/device.');
    return;
  }

  const THREE = await getThreeJs();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.xr.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.classList.add('ar-webxr-canvas');
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.85);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
  dirLight.position.set(1, 2, 1);
  scene.add(dirLight);

  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.12, 0.16, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  state.renderer = renderer;
  state.scene = scene;
  state.camera = camera;
  state.reticle = reticle;

  placeBtn?.addEventListener('click', () => {
    if (state.surfaceDetected && !state.placed) {
      placeGift(THREE);
    }
  });

  const session = await navigator.xr.requestSession('immersive-ar', {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.body }
  });

  session.addEventListener('end', () => {
    state.hitTestSourceRequested = false;
    state.hitTestSource = null;
    placeHintEl.hidden = true;
  });

  renderer.xr.setSession(session);
  setStatus('Move phone to detect surface');

  renderer.setAnimationLoop((timestamp, frame) => {
    if (frame) {
      const referenceSpace = renderer.xr.getReferenceSpace();
      const sessionNow = renderer.xr.getSession();

      if (!state.hitTestSourceRequested) {
        sessionNow.requestReferenceSpace('viewer').then((viewerSpace) => {
          sessionNow.requestHitTestSource({ space: viewerSpace }).then((source) => {
            state.hitTestSource = source;
          });
        });
        state.hitTestSourceRequested = true;
      }

      if (state.hitTestSource) {
        const hitTestResults = frame.getHitTestResults(state.hitTestSource);
        if (hitTestResults.length > 0 && referenceSpace) {
          const hit = hitTestResults[0];
          const pose = hit.getPose(referenceSpace);

          if (pose) {
            state.reticle.visible = !state.placed;
            state.reticle.matrix.fromArray(pose.transform.matrix);
            if (!state.surfaceDetected) {
              state.surfaceDetected = true;
              setStatus('Surface detected');
              setHint('Tap to place gift');
              placeHintEl.hidden = false;
            }
          }
        } else {
          state.reticle.visible = false;
          if (!state.placed) {
            state.surfaceDetected = false;
            setStatus('Move phone to detect surface');
            setHint('Move phone slowly');
            placeHintEl.hidden = true;
          }
        }
      }
    }

    renderer.render(scene, camera);
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

async function placeGift(THREE) {
  if (state.placed || !state.reticle || !state.media) return;

  const { texture, ratio, resume } = await createMediaTexture(THREE, state.media);
  const width = 0.55;
  const height = width / Math.max(ratio || 1, 0.35);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(width, Math.min(height, 0.95)),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true })
  );

  const matrix = state.reticle.matrix;
  plane.position.setFromMatrixPosition(matrix);
  plane.quaternion.setFromRotationMatrix(matrix);
  plane.rotateX(-Math.PI / 2);

  state.scene.add(plane);
  state.giftMesh = plane;
  state.placed = true;
  state.reticle.visible = false;
  placeHintEl.hidden = true;
  setStatus('Gift placed');
  setHint('Move around to view it in space');

  if (typeof resume === 'function') {
    resume();
  }
}

async function init() {
  const giftId = readGiftId();
  state.giftId = giftId;

  if (!giftId) {
    showFallback('Missing gift ID. Open AR from a valid gift page.');
    return;
  }

  updateBackLinks(giftId);

  try {
    state.media = await loadGiftData(giftId);
  } catch (error) {
    console.error('[ar] failed to load gift data', error);
    showFallback(error.message || 'Unable to load gift media for AR.');
    return;
  }

  try {
    await initArSession();
  } catch (error) {
    console.error('[ar] initialization failed', error);

    if (String(error?.message || '').toLowerCase().includes('permission')) {
      showFallback('Camera permission denied. Enable camera access and try again.');
      return;
    }

    showFallback('Unable to start AR session on this device.');
  }
}

window.addEventListener('DOMContentLoaded', init);
