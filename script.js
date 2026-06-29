const start = document.getElementById('start');
const scene = document.getElementById('scene');
const opening = document.getElementById('opening');
const montage = document.getElementById('montage');
const shots = document.querySelectorAll('.shot');
const doorScene = document.getElementById('doorScene');
const roles = document.getElementById('roles');
const roleEu = document.querySelector('.role-eu');
const roleVoce = document.querySelector('.role-voce');
const final = document.getElementById('final');
const returnForm = document.getElementById('returnForm');
const flash = document.getElementById('flash');

let audioCtx;
let master;

function audio(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    master = audioCtx.createGain();
    master.gain.value = 0.72;
    master.connect(audioCtx.destination);
  }
  return audioCtx;
}

function tone(freq=80, dur=.25, type='sine', gain=.08, delay=0){
  const ctx = audio();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  g.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + delay + .025);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + dur + .04);
}

function noise(dur=.28, gain=.05, delay=0, filter=900){
  const ctx = audio();
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i/bufferSize, 1.6);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const biquad = ctx.createBiquadFilter();
  biquad.type = 'lowpass';
  biquad.frequency.value = filter;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + delay + .03);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
  src.connect(biquad);
  biquad.connect(g);
  g.connect(master);
  src.start(ctx.currentTime + delay);
}

function cinematicBoom(){
  tone(36,.95,'sine',.16);
  tone(72,.55,'triangle',.05,.06);
  noise(.75,.035,.02,320);
}

function cutHit(){
  tone(110,.09,'triangle',.04);
  noise(.12,.025,0,1500);
}

function softWhoosh(){
  noise(.55,.055,0,750);
  tone(165,.38,'sawtooth',.018,.04);
}

function doorOpenSound(){
  noise(.75,.045,0,520);
  tone(220,.28,'triangle',.025,.12);
  tone(330,.32,'sine',.018,.28);
}

function revealChime(){
  tone(440,.26,'sine',.035);
  tone(660,.30,'sine',.026,.08);
  tone(990,.20,'sine',.015,.18);
}

function finalImpact(){
  cinematicBoom();
  tone(520,.45,'sine',.035,.10);
  tone(780,.42,'sine',.025,.18);
}

function set(el, styles){ Object.assign(el.style, styles); }
function fadeIn(el, ms=700){ el.animate([{opacity:0, transform:'scale(.985)'},{opacity:1, transform:'scale(1)'}],{duration:ms,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'}); }
function fadeOut(el, ms=500){ el.animate([{opacity:1},{opacity:0}],{duration:ms,fill:'forwards',easing:'ease'}); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function play(){
  start.style.display='none';
  scene.classList.remove('hidden');
  [opening,montage,doorScene,roles,final].forEach(el=>set(el,{opacity:0}));
  roleEu.style.opacity=0;
  roleVoce.style.opacity=0;
  shots.forEach(s=>set(s,{opacity:0, transform:'scale(1.08)'}));

  cinematicBoom();
  fadeIn(opening,900);
  await sleep(1900);
  fadeOut(opening,450);
  await sleep(220);

  montage.style.opacity=1;
  for (const s of shots){
    cutHit();
    flash.animate([{opacity:.0},{opacity:.26},{opacity:0}],{duration:190,fill:'forwards'});
    s.animate([{opacity:0, transform:'scale(1.14)'},{opacity:1, transform:'scale(1.02)'},{opacity:0, transform:'scale(1)'}],{duration:700,fill:'forwards',easing:'ease-out'});
    await sleep(620);
  }

  montage.style.opacity=0;
  await sleep(100);
  softWhoosh();
  fadeIn(doorScene,800);
  await sleep(800);
  doorOpenSound();
  document.querySelector('.door.left').animate([{transform:'rotateY(0deg)'},{transform:'rotateY(-68deg)'}],{duration:1100,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  document.querySelector('.door.right').animate([{transform:'rotateY(0deg)'},{transform:'rotateY(68deg)'}],{duration:1100,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  document.querySelector('.door-light').animate([{opacity:.15, transform:'scale(.9)'},{opacity:.86, transform:'scale(1.25)'}],{duration:1200,fill:'forwards'});

  await sleep(1600);
  fadeOut(doorScene,380);
  await sleep(220);

  revealChime();
  fadeIn(roles,500);
  await sleep(150);
  roleEu.animate([{opacity:0, transform:'translateY(30px)'},{opacity:1, transform:'translateY(0)'}],{duration:520,fill:'forwards'});
  await sleep(850);
  revealChime();
  roleVoce.animate([{opacity:0, transform:'translateY(30px)'},{opacity:1, transform:'translateY(0)'}],{duration:520,fill:'forwards'});

  await sleep(1350);
  fadeOut(roles,420);
  await sleep(220);
  finalImpact();
  fadeIn(final,900);
}

start.addEventListener('click', play);
returnForm.addEventListener('click', () => {
  if (document.referrer) {
    history.back();
  } else {
    alert('Volte ao formulário e responda à pergunta final.');
  }
});
