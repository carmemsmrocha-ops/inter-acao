const gate = document.getElementById('soundGate');
const stage = document.getElementById('stage');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scenes = Array.from(document.querySelectorAll('.scene'));
let timers = [];
let audioCtx;

function clearTimers(){ timers.forEach(clearTimeout); timers = []; }
function showScene(index){ scenes.forEach((s,i)=>s.classList.toggle('active', i===index)); }
function at(ms, fn){ timers.push(setTimeout(fn, ms)); }

function initAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if(audioCtx.state === 'suspended') audioCtx.resume();
}
function tone(freq=120, dur=.2, type='sine', gain=.06){
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type; osc.frequency.value = freq;
  g.gain.value = 0;
  osc.connect(g); g.connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  g.gain.linearRampToValueAtTime(gain,t+.02);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  osc.start(t); osc.stop(t+dur+.03);
}
function boom(){ tone(55,.9,'sine',.11); tone(92,.55,'triangle',.04); }
function click(){ tone(540,.08,'square',.025); }
function whoosh(){ tone(180,.2,'sawtooth',.025); setTimeout(()=>tone(320,.14,'sawtooth',.018),70); }
function shimmer(){ [660,880,1100].forEach((f,i)=>setTimeout(()=>tone(f,.18,'sine',.025),i*65)); }

function play(){
  clearTimers();
  showScene(0); boom();
  at(3600, ()=>{ showScene(1); whoosh(); });
  at(6200, ()=>{ showScene(2); boom(); });
  at(10100, ()=>{ showScene(3); shimmer(); });
  at(13700, ()=>{ showScene(4); shimmer(); });
  at(17900, ()=>{ showScene(5); tone(120,.4,'sine',.05); });
}

startBtn.addEventListener('click', ()=>{
  initAudio(); click();
  gate.classList.add('hidden');
  stage.classList.remove('hidden');
  play();
});
restartBtn.addEventListener('click', ()=>{ click(); play(); });
