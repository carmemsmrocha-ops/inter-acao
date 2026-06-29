const stage = document.getElementById('stage');
const startButton = document.getElementById('startButton');
let audioCtx;

function sound(type = 'soft') {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    const freq = type === 'boom' ? 58 : type === 'shine' ? 620 : type === 'pulse' ? 180 : 340;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * (type === 'boom' ? 0.55 : 1.35), now + 0.35);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(type === 'boom' ? 0.22 : 0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === 'boom' ? 0.7 : 0.32));
    osc.type = type === 'shine' ? 'sine' : 'triangle';
    osc.start(now);
    osc.stop(now + (type === 'boom' ? 0.75 : 0.35));
  } catch (e) {}
}

const scenes = [
  {
    time: 0,
    sfx: 'boom',
    html: `<div><div class="big">O mundo muda todos os dias.</div><div class="small" style="margin-top:24px">Você apenas assiste... ou aprende a compreendê-lo?</div></div>`
  },
  {
    time: 2800,
    sfx: 'pulse',
    html: `<div class="flashgrid">
      <div class="flash">ENEM</div><div class="flash">IA</div><div class="flash">Redes</div><div class="flash">Trabalho</div>
      <div class="flash">Democracia</div><div class="flash">Cultura</div><div class="flash">Consumo</div><div class="flash">Escola</div>
    </div>`
  },
  {
    time: 5600,
    sfx: 'shine',
    html: `<div><div class="medium">Algumas portas só se abrem...</div><div class="small" style="margin-top:22px">quando você decide compreender o mundo.</div></div>`
  },
  {
    time: 7800,
    sfx: 'shine',
    html: `<div class="door-wrap"><div class="door-light"></div><div class="door"></div></div>`
  },
  {
    time: 9900,
    sfx: 'pulse',
    html: `<div class="roles">
      <div class="role"><div><h2>MINHA PARTE</h2><p>Prepararei as aulas.<br>Apresentarei conteúdos, autores e conceitos.</p></div></div>
      <div class="role"><div><h2>SUA PARTE</h2><p>Prepare-se para participar das aulas.</p></div></div>
    </div>`
  },
  {
    time: 12600,
    sfx: 'shine',
    html: `<div><div class="interacao">INTER <span class="plus">+</span> AÇÃO</div><div class="small" style="margin-top:22px">Uma boa aula começa quando cada um faz a sua parte.</div></div>`
  },
  {
    time: 15300,
    sfx: 'soft',
    html: `<div class="footer"><div class="medium">O próximo semestre ainda não foi escrito.</div><div class="small">Agora a decisão também é sua.</div><button class="btn" onclick="window.history.length > 1 ? history.back() : null">Voltar ao formulário</button></div>`
  }
];

function showScene(html) {
  const old = stage.querySelector('.scene');
  if (old) old.classList.add('out');
  setTimeout(() => {
    stage.querySelectorAll('.scene.out').forEach(e => e.remove());
    const div = document.createElement('div');
    div.className = 'scene';
    div.innerHTML = html;
    stage.appendChild(div);
  }, old ? 260 : 0);
}

function startExperience() {
  startButton.remove();
  scenes.forEach(scene => {
    setTimeout(() => {
      sound(scene.sfx);
      showScene(scene.html);
    }, scene.time);
  });
}

startButton.addEventListener('click', startExperience);
