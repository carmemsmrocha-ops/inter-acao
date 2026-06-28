const app = document.getElementById('app');
let scene = 0;
let soundOn = true;
let audioCtx;
let explored = new Set();

const soundButton = document.createElement('button');
soundButton.className = 'btn dark soundToggle';
soundButton.textContent = 'Som: ligado';
soundButton.onclick = () => {
  soundOn = !soundOn;
  soundButton.textContent = soundOn ? 'Som: ligado' : 'Som: desligado';
  beep(soundOn ? 660 : 220, .06, 'sine');
};
document.body.appendChild(soundButton);

function beep(freq = 440, duration = .08, type = 'sine', gainValue = .035) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}
function transition(freq = 280) { beep(freq, .08, 'triangle'); }
function clickSound() { beep(520, .045, 'square', .025); }
function successSound() { beep(740, .07, 'sine'); setTimeout(() => beep(980, .08, 'sine'), 85); }

function render(html) {
  app.innerHTML = `<section class="scene"><div class="content">${html}</div><div class="footerline"></div></section>`;
}
function next() { scene++; transition(360 + scene * 25); scenes[scene](); }

const scenes = [intro, possibilidade, experiencia, minhaParte, enem, partes, decisao];

function intro() {
  render(`
    <p class="kicker">INTER + AÇÃO</p>
    <h1>O próximo semestre ainda não existe.</h1>
    <p class="bigline">Você pode ajudar a decidir como ele será.</p>
    <p>Antes de responder ao formulário, passe por esta experiência de um minuto.</p>
    <button class="btn" onclick="next()">Iniciar experiência</button>
  `);
}

function possibilidade() {
  render(`
    <p class="kicker">Protótipo</p>
    <h2 class="type">Uma aula pode começar com uma experiência.</h2>
    <p>Não para substituir a explicação. Para criar uma pergunta real antes dela.</p>
    <button class="btn" onclick="next()">Continuar</button>
  `);
}

function experiencia() {
  explored = new Set();
  render(`
    <p class="kicker">Cena 1</p>
    <h2>Primeiro, uma experiência.</h2>
    <p>Toque nos círculos. Cada um revela uma pista de como uma aula pode começar.</p>
    <div class="circles">
      <button class="circle" onclick="openClue('fotografia', this)"><span class="icon">📷</span><strong>Fotografia</strong><small>Observar antes de concluir.</small></button>
      <button class="circle" onclick="openClue('noticia', this)"><span class="icon">📰</span><strong>Notícia</strong><small>Ler o mundo em disputa.</small></button>
      <button class="circle" onclick="openClue('dado', this)"><span class="icon">📊</span><strong>Dado</strong><small>Interpretar evidências.</small></button>
    </div>
    <p id="status">Uma aula pode começar com observação, dúvida e investigação.</p>
    <button class="btn" onclick="next()">Depois entra a professora</button>
  `);
}

function openClue(kind, element) {
  clickSound();
  explored.add(kind);
  element.classList.add('done');
  const data = {
    fotografia: {
      tag: 'Pista visual',
      title: 'Uma imagem nunca mostra tudo.',
      text: 'Quem aparece? Quem ficou fora? O que a fotografia revela — e o que ela esconde?'
    },
    noticia: {
      tag: 'Pista textual',
      title: 'Uma notícia também constrói uma leitura da realidade.',
      text: 'Qual palavra orienta sua opinião? Que voz aparece? Que voz foi silenciada?'
    },
    dado: {
      tag: 'Pista estatística',
      title: 'Um número não fala sozinho.',
      text: 'Ele precisa de contexto, comparação e interpretação sociológica.'
    }
  }[kind];
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal" onclick="this.remove()">
      <div class="modalCard" onclick="event.stopPropagation()">
        <p class="kicker">${data.tag}</p>
        <h2>${data.title}</h2>
        <p>${data.text}</p>
        <button class="btn" onclick="this.closest('.modal').remove()">Fechar pista</button>
      </div>
    </div>
  `);
  if (explored.size === 3) {
    successSound();
    const status = document.getElementById('status');
    if (status) status.innerHTML = '<strong>Você investigou três pistas.</strong> Agora a experiência precisa de explicação, conceitos e direção.';
  }
}

function minhaParte() {
  render(`
    <p class="kicker">Cena 2</p>
    <h2>Agora entra a minha parte.</h2>
    <p class="bigline">Eu explicarei conteúdos.</p>
    <p>Apresentarei autores, conceitos e caminhos para interpretar questões do ENEM.</p>
    <div class="circles">
      <div class="circle"><span class="icon">📚</span><strong>Autores</strong><small>Durkheim, Weber, Marx e outros.</small></div>
      <div class="circle"><span class="icon">🧠</span><strong>Conceitos</strong><small>Fato social, ideologia, Estado, cultura.</small></div>
      <div class="circle"><span class="icon">🎯</span><strong>ENEM</strong><small>Leitura, interpretação e argumentação.</small></div>
    </div>
    <button class="btn" onclick="next()">Ver como isso aparece no ENEM</button>
  `);
}

function enem() {
  render(`
    <p class="kicker">Cena 3</p>
    <h2>Experiência + explicação + ENEM.</h2>
    <p>Uma questão do ENEM raramente cobra apenas memória. Ela exige leitura de mundo.</p>
    <div class="enemBox">
      <p>Ao analisar uma fotografia, uma notícia ou um dado, você aprende a reconhecer <span>contexto</span>, <span>conceitos</span>, <span>evidências</span> e <span>argumentos</span>.</p>
      <p>É isso que uma boa aula de Sociologia pode treinar.</p>
    </div>
    <button class="btn" onclick="next()">Entender as duas partes</button>
  `);
}

function partes() {
  render(`
    <p class="kicker">Cena 4</p>
    <h2>Uma boa aula precisa de direção e participação.</h2>
    <div class="split">
      <div class="role">
        <h3>Minha parte</h3>
        <ul>
          <li>📚 Explicar conteúdos.</li>
          <li>🧠 Apresentar autores e conceitos.</li>
          <li>🔗 Relacionar teoria e realidade.</li>
          <li>🎯 Preparar para o ENEM.</li>
          <li>🧭 Organizar e conduzir as aulas.</li>
        </ul>
      </div>
      <div class="role">
        <h3>Sua parte</h3>
        <ul>
          <li>👀 Observar.</li>
          <li>🤔 Pensar.</li>
          <li>❓ Perguntar.</li>
          <li>📚 Estudar.</li>
          <li>📝 Se preparar para as aulas.</li>
          <li>🙋 Participar das aulas.</li>
        </ul>
      </div>
    </div>
    <div class="bridge"><div class="interacao">INTER <span class="plus">+</span> AÇÃO</div></div>
    <button class="btn" onclick="next()">Decidir</button>
  `);
}

function decisao() {
  successSound();
  render(`
    <p class="kicker">Decisão</p>
    <h2>Esta foi apenas uma possibilidade.</h2>
    <p class="bigline">O próximo semestre pode ser construído com experiências, explicações, autores e ENEM.</p>
    <p>Agora volte ao formulário e responda: você gostaria que esse tipo de recurso pedagógico estivesse presente nas aulas de Sociologia?</p>
    <p><strong>Sim, não ou depende.</strong> Explique seus motivos.</p>
    <p class="bigline">De que forma você pode participar mais no próximo semestre?</p>
    <button class="btn" onclick="scene = 0; intro()">Rever experiência</button>
  `);
}

intro();
