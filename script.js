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
const restart = document.getElementById('restart');
const flash = document.getElementById('flash');

let audioCtx;
function audio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function tone(freq=80, dur=.25, type='sine', gain=.08){
  const ctx = audio();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime+.02);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+dur);
  osc.connect(g); g.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+dur+.02);
}
function boom(){ tone(45,.55,'sine',.14); setTimeout(()=>tone(92,.28,'triangle',.04),80); }
function tick(){ tone(900,.045,'square',.025); }
function chime(){ tone(520,.22,'sine',.045); setTimeout(()=>tone(780,.18,'sine',.035),90); }
function whoosh(){ tone(170,.16,'sawtooth',.025); }
function set(el, styles){ Object.assign(el.style, styles); }
function fadeIn(el, ms=700){ el.animate([{opacity:0, transform:'scale(.985)'},{opacity:1, transform:'scale(1)'}],{duration:ms,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'}); }
function fadeOut(el, ms=500){ el.animate([{opacity:1},{opacity:0}],{duration:ms,fill:'forwards',easing:'ease'}); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
async function play(){
  start.style.display='none'; scene.classList.remove('hidden');
  [opening,montage,doorScene,roles,final].forEach(el=>set(el,{opacity:0}));
  roleEu.style.opacity=0; roleVoce.style.opacity=0;
  shots.forEach(s=>set(s,{opacity:0, transform:'scale(1.08)'}));
  boom(); fadeIn(opening,900); await sleep(1900); fadeOut(opening,450); await sleep(220);
  montage.style.opacity=1;
  for (const s of shots){
    tick(); flash.animate([{opacity:.0},{opacity:.22},{opacity:0}],{duration:180,fill:'forwards'});
    s.animate([{opacity:0, transform:'scale(1.14)'},{opacity:1, transform:'scale(1.02)'},{opacity:0, transform:'scale(1)'}],{duration:700,fill:'forwards',easing:'ease-out'});
    await sleep(620);
  }
  montage.style.opacity=0; await sleep(100); whoosh(); fadeIn(doorScene,800); await sleep(800);
  document.querySelector('.door.left').animate([{transform:'rotateY(0deg)'},{transform:'rotateY(-68deg)'}],{duration:1100,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  document.querySelector('.door.right').animate([{transform:'rotateY(0deg)'},{transform:'rotateY(68deg)'}],{duration:1100,fill:'forwards',easing:'cubic-bezier(.2,.8,.2,1)'});
  document.querySelector('.door-light').animate([{opacity:.15, transform:'scale(.9)'},{opacity:.86, transform:'scale(1.25)'}],{duration:1200,fill:'forwards'});
  await sleep(1600); fadeOut(doorScene,380); await sleep(220);
  chime(); fadeIn(roles,500); await sleep(150); roleEu.animate([{opacity:0, transform:'translateY(30px)'},{opacity:1, transform:'translateY(0)'}],{duration:520,fill:'forwards'});
  await sleep(850); chime(); roleVoce.animate([{opacity:0, transform:'translateY(30px)'},{opacity:1, transform:'translateY(0)'}],{duration:520,fill:'forwards'});
  await sleep(1350); fadeOut(roles,420); await sleep(220);
  boom(); fadeIn(final,900);
}
start.addEventListener('click', play);
restart.addEventListener('click', play);
