const arBtn = document.getElementById("launch-ar-btn");
const arContainer = document.getElementById("ar-container");

if (arBtn) {
  arBtn.addEventListener("click", async () => {
    try {
      // request camera
      await navigator.mediaDevices.getUserMedia({ video: true });

      arContainer.classList.remove("hidden");

      initARScene();
    } catch (err) {
      alert("Camera permission is required for AR experience.");
    }
  });
}

function initARScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  arContainer.innerHTML = "";
  arContainer.appendChild(renderer.domElement);

  // 🎁 Floating gift plane
  const geometry = new THREE.PlaneGeometry(3, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geometry, material);
  plane.position.z = -5;
  scene.add(plane);

  camera.position.z = 1;

  function animate() {
    requestAnimationFrame(animate);
    plane.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}
