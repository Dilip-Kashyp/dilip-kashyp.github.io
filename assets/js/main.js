function initSphere() {
  const canvas = document.getElementById("sphere-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  resize();

  const geometry = new THREE.IcosahedronGeometry(1.8, 4);
  const wireframe = new THREE.WireframeGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.12,
  });
  const sphere = new THREE.LineSegments(wireframe, material);
  scene.add(sphere);

  camera.position.z = 4.5;

  let animationId;

  function animate() {
    animationId = requestAnimationFrame(animate);
    sphere.rotation.y += 0.0015;
    sphere.rotation.x += 0.0005;
    renderer.render(scene, camera);
  }

  animate();
  window.addEventListener("resize", resize);
}

function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

function initNavScroll() {
  const nav = document.getElementById("header");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
}

function initMobileMenu() {
  const btn = document.getElementById("navMenuBtn");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.classList.remove("active");
      links.classList.remove("open");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSphere();
  initReveal();
  initNavScroll();
  initMobileMenu();
});
