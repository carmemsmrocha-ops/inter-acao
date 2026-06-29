/*
  INTER + AÇÃO — experiência audiovisual
  Duração aproximada: 10–12 segundos após o clique inicial.
  Sons gerados com Web Audio API para não depender de arquivos externos.
*/

const start = document.getElementById("start");
const startButton = document.getElementById("startButton");
const stage = document.getElementById("stage");
const sceneText = document.getElementById("sceneText");
const filmStrip = document.getElementById("filmStrip");
const doorScene = document.getElementById("doorScene");
const vennScene = document.getElementById("vennScene");
const returnButton = document.getElementById("returnButton");

let audioContext;
let masterGain;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioCtx();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.22;
  masterGain.connect(audioContext.destination);
}

function tone({ frequency = 80, duration = 1, type = "sine", gain = 0.1, attack = 0.05, release = 0.4 }) {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const g = audioContext.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + release + 0.05);
}

function noise({ duration = 0.5, gain = 0.06, filter = 600 }) {
  if (!audioContext) return;
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = audioContext.createBufferSource();
  const g = audioContext.createGain();
  const f = audioContext.createBiquadFilter();

  f.type = "lowpass";
  f.frequency.value = filter;
  g.gain.value = gain;

  source.buffer = buffer;
  source.connect(f);
  f.connect(g);
  g.connect(masterGain);
  source.start();
}

function cinematicHit() {
  tone({ frequency: 45, duration: 1.2, type: "sine", gain: 0.22, attack: 0.02, release: 1.2 });
  tone({ frequency: 91, duration: 0.9, type: "triangle", gain: 0.055, attack: 0.02, release: 0.8 });
}

function softWhoosh() {
  noise({ duration: 0.7, gain: 0.075, filter: 1150 });
  tone({ frequency: 130, duration: 0.45, type: "sine", gain: 0.03, attack: 0.01, release: 0.5 });
}

function pulse() {
  tone({ frequency: 62, duration: 0.22, type: "sine", gain: 0.11, attack: 0.01, release: 0.3 });
}

function bell() {
  tone({ frequency: 523.25, duration: 1.1, type: "sine", gain: 0.06, attack: 0.01, release: 1.3 });
  tone({ frequency: 783.99, duration: 0.9, type: "triangle", gain: 0.035, attack: 0.02, release: 1.1 });
  tone({ frequency: 1046.5, duration: 0.7, type: "sine", gain: 0.023, attack: 0.02, release: 0.9 });
}

function ambientBed() {
  tone({ frequency: 38, duration: 12, type: "sine", gain: 0.06, attack: 1.2, release: 2.5 });
  tone({ frequency: 57, duration: 12, type: "sine", gain: 0.035, attack: 1.4, release: 2.5 });
}

function showLine(html, className = "") {
  sceneText.innerHTML = `<div class="line ${className} show">${html}</div>`;
}

function hideLine() {
  const line = sceneText.querySelector(".line");
  if (line) line.classList.add("hide");
}

function prepareVideos() {
  const videos = document.querySelectorAll(".real-video");
  videos.forEach(video => {
    const src = video.dataset.src;
    if (!src) return;
    video.src = src;
    video.addEventListener("canplay", () => {
      video.classList.add("ready");
      video.currentTime = 0;
    }, { once: true });
    video.addEventListener("error", () => {
      video.classList.remove("ready");
    }, { once: true });
  });
}

function playVideos() {
  document.querySelectorAll(".real-video").forEach(video => {
    if (video.classList.contains("ready")) {
      video.play().catch(() => {});
    }
  });
}

async function runExperience() {
  start.classList.add("fade-out");
  await wait(700);
  start.classList.add("hidden");
  stage.classList.remove("hidden");

  cinematicHit();
  ambientBed();

  showLine("O mundo muda<br><span class='gold'>todos os dias.</span>");
  await wait(1900);
  hideLine();
  await wait(450);

  filmStrip.classList.remove("hidden");
  filmStrip.classList.add("active");
  playVideos();
  pulse();
  await wait(550);
  pulse();
  await wait(550);
  pulse();
  await wait(1350);
  filmStrip.classList.add("hidden");

  softWhoosh();
  showLine("Algumas portas só se abrem<br><span class='gold'>quando você decide compreender o mundo.</span>", "small");
  await wait(2300);
  hideLine();
  await wait(350);

  doorScene.classList.remove("hidden");
  doorScene.classList.add("active");
  tone({ frequency: 72, duration: 2.3, type: "sawtooth", gain: 0.035, attack: 0.4, release: 1.2 });
  await wait(2600);
  doorScene.classList.add("hidden");

  vennScene.classList.remove("hidden");
  vennScene.classList.add("active", "step-in");
  softWhoosh();
  await wait(2300);

  vennScene.classList.add("merge");
  tone({ frequency: 84, duration: 2.4, type: "sine", gain: 0.06, attack: 0.4, release: 0.8 });
  await wait(1700);

  vennScene.classList.add("show-aula");
  bell();
  await wait(1700);

  returnButton.classList.remove("hidden");
  returnButton.classList.add("visible");
}

startButton.addEventListener("click", async () => {
  startButton.disabled = true;
  try {
    createAudio();
    if (audioContext.state === "suspended") await audioContext.resume();
  } catch (e) {
    console.warn("Áudio não iniciado:", e);
  }
  runExperience();
});

returnButton.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    alert("Retorne ao formulário e responda à última pergunta.");
  }
});

prepareVideos();
