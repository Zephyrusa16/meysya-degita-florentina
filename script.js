const typeTarget = document.querySelector(".typewriter");
const floatLayer = document.querySelector(".float-layer");
const secretButton = document.querySelector(".secret-button");
const secretMessage = document.querySelector(".secret-message");
const musicButton = document.querySelector(".music-toggle");
const lightbox = document.querySelector(".lightbox");
const lightboxPhoto = document.querySelector(".lightbox-photo");
const lightboxCaption = document.querySelector(".lightbox-caption");
const closeLightbox = document.querySelector(".lightbox-close");
const canvas = document.querySelector(".confetti-canvas");
const celebrateButton = document.querySelector(".celebrate-button");

// Teks intro typewriter. Edit kalimat ini jika ingin mengubah pembuka di halaman cover.
const intro =
  "A quiet page made with soft wishes, gentle colors, and a little sparkle for a birthday that still deserves to be celebrated.";

// Caption gallery. Angka 1-4 harus sesuai dengan data-image di index.html.
const galleryCaptions = {
  1: "warm tone",
  2: "ocean breeze",
  3: "random capture",
  4: "silent grace",
};

let typeIndex = 0;
let audioContext;
let masterGain;
let musicTimer;
let musicPlaying = false;
let confettiStarted = false;

// Menjalankan efek ketik otomatis pada intro di hero.
function typeLine() {
  if (!typeTarget || typeIndex > intro.length) return;
  typeTarget.textContent = intro.slice(0, typeIndex);
  typeIndex += 1;
  window.setTimeout(typeLine, typeIndex < 16 ? 62 : 34);
}

// Membuat hati dan bintang yang melayang di seluruh halaman.
function createFloatingItems() {
  if (!floatLayer) return;
  const symbols = ["♡", "✦", "⋆", "♡", "✧"];

  for (let index = 0; index < 26; index += 1) {
    const item = document.createElement("span");
    item.className = "float-item";
    item.textContent = symbols[index % symbols.length];
    item.style.left = `${Math.random() * 100}%`;
    item.style.setProperty("--size", `${0.82 + Math.random() * 1.22}rem`);
    item.style.setProperty("--duration", `${11 + Math.random() * 10}s`);
    item.style.setProperty("--delay", `${Math.random() * -18}s`);
    floatLayer.appendChild(item);
  }
}

// Membuat elemen muncul halus saat masuk ke viewport.
function setupRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

// Membuka preview gallery di lightbox.
function openGalleryPreview(card) {
  const imageId = card.dataset.image;
  lightboxPhoto.dataset.image = imageId;
  lightboxCaption.textContent = galleryCaptions[imageId] || "memory";
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

// Menutup lightbox dan mengembalikan scroll halaman.
function closeGalleryPreview() {
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
}

// Menghubungkan klik polaroid, tombol close, klik overlay, dan tombol Escape.
function setupLightbox() {
  document.querySelectorAll(".polaroid").forEach((card) => {
    card.addEventListener("click", () => openGalleryPreview(card));
  });

  closeLightbox.addEventListener("click", closeGalleryPreview);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeGalleryPreview();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeGalleryPreview();
  });
}

// Tombol reveal untuk menampilkan atau menyembunyikan secret message.
function setupSecretMessage() {
  secretButton.addEventListener("click", () => {
    const isHidden = secretMessage.hidden;
    secretMessage.hidden = !isHidden;
    secretMessage.classList.toggle("is-visible", isHidden);
    secretButton.textContent = isHidden ? "Hide Message" : "Reveal Message";
  });
}

// Membuat satu nada lembut memakai Web Audio API.
function playNote(frequency, startTime, duration) {
  const oscillator = audioContext.createOscillator();
  const harmony = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const harmonyGain = audioContext.createGain();

  oscillator.type = "triangle";
  harmony.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  harmony.frequency.setValueAtTime(frequency * 2, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  harmonyGain.gain.setValueAtTime(0.0001, startTime);
  harmonyGain.gain.exponentialRampToValueAtTime(0.055, startTime + 0.04);
  harmonyGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  harmony.connect(harmonyGain);
  gain.connect(masterGain);
  harmonyGain.connect(masterGain);
  oscillator.start(startTime);
  harmony.start(startTime);
  oscillator.stop(startTime + duration + 0.04);
  harmony.stop(startTime + duration + 0.04);
}

// Melodi "Happy Birthday" sederhana untuk background music.
// Format tiap item: [frekuensi nada, durasi]. Angka frekuensi bisa diubah jika ingin mengganti lagu.
function playMusicPhrase() {
  if (!audioContext || !musicPlaying) return;
  const now = audioContext.currentTime;
  const melody = [
    [392.0, 0.28],
    [392.0, 0.22],
    [440.0, 0.48],
    [392.0, 0.48],
    [523.25, 0.48],
    [493.88, 0.86],
    [392.0, 0.28],
    [392.0, 0.22],
    [440.0, 0.48],
    [392.0, 0.48],
    [587.33, 0.48],
    [523.25, 0.86],
    [392.0, 0.28],
    [392.0, 0.22],
    [783.99, 0.48],
    [659.25, 0.48],
    [523.25, 0.48],
    [493.88, 0.48],
    [440.0, 0.92],
    [698.46, 0.28],
    [698.46, 0.22],
    [659.25, 0.48],
    [523.25, 0.48],
    [587.33, 0.48],
    [523.25, 1.05],
  ];

  let cursor = 0;
  melody.forEach(([note, duration]) => {
    playNote(note, now + cursor, duration);
    cursor += duration + 0.08;
  });

  musicTimer = window.setTimeout(playMusicPhrase, (cursor + 1.2) * 1000);
}

// Menyalakan atau mematikan musik. Browser hanya mengizinkan audio setelah user klik tombol.
async function toggleMusic() {
  if (!audioContext) {
    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    // Volume utama musik. Naikkan sedikit jika masih kurang, turunkan jika terlalu keras.
    masterGain.gain.value = 0.32;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  musicPlaying = !musicPlaying;
  musicButton.setAttribute("aria-pressed", String(musicPlaying));

  if (musicPlaying) {
    playMusicPhrase();
  } else {
    window.clearTimeout(musicTimer);
  }
}

// Mengaktifkan tombol music di header.
function setupMusic() {
  musicButton.addEventListener("click", toggleMusic);
}

// Menyesuaikan ukuran canvas confetti dengan ukuran section.
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
}

// Animasi confetti untuk final celebration.
function burstConfetti() {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const colors = ["#f5b8c8", "#d9c7f2", "#fff7e8", "#d77c9a", "#f5e3c8"];
  const pieces = Array.from({ length: 120 }, () => ({
    x: (canvas.width / ratio) * Math.random(),
    y: -20 - Math.random() * 180,
    size: 5 + Math.random() * 8,
    speed: 2 + Math.random() * 4.5,
    drift: -1.5 + Math.random() * 3,
    rotate: Math.random() * Math.PI,
    spin: -0.12 + Math.random() * 0.24,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  let frame = 0;
  resizeCanvas();

  function animate() {
    frame += 1;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.scale(ratio, ratio);

    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.x += piece.drift;
      piece.rotate += piece.spin;
      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.rotate);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.58);
      context.restore();
    });

    context.restore();

    if (frame < 210) {
      requestAnimationFrame(animate);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// Confetti muncul otomatis saat final section terlihat, dan bisa diulang dengan tombol.
function setupConfetti() {
  const finalSection = document.querySelector(".final-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !confettiStarted) {
          confettiStarted = true;
          burstConfetti();
        }
      });
    },
    { threshold: 0.48 }
  );

  observer.observe(finalSection);
  celebrateButton.addEventListener("click", burstConfetti);
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}

// Semua fitur diaktifkan setelah HTML selesai dimuat.
document.addEventListener("DOMContentLoaded", () => {
  typeLine();
  createFloatingItems();
  setupRevealObserver();
  setupLightbox();
  setupSecretMessage();
  setupMusic();
  setupConfetti();
});
