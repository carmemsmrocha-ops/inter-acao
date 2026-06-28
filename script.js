const app = document.getElementById("app");

let soundEnabled = false;
let sceneIndex = 0;

function beep(type = "click") {
  if (!soundEnabled) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const freq = type === "stamp" ? 120 : type === "success" ? 660 : 330;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.type = type === "stamp" ? "sawtooth" : "sine";
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

function setScene(html) {
  app.innerHTML = `<section class="scene">${html}</section>`;
}

function next() {
  sceneIndex++;
  beep("click");
  render();
}

function render() {
  const scenes = [intro, decision, observe, write, teacher, enem, parts, interaction, final];
  scenes[Math.min(sceneIndex, scenes.length - 1)]();
}

function intro() {
  setScene(`
    <p class="kicker">Protótipo interativo</p>
    <h1>INTER <span class="glow">+</span> AÇÃO</h1>
    <p class="big-line">O próximo semestre de Sociologia ainda não existe.</p>
    <p>Você pode ajudar a decidir como ele será.</p>
    <div class="progress"><span class="dot active"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    <button onclick="soundEnabled = true; next();">Iniciar experiência</button>
    <button class="secondary" onclick="next();">Continuar sem som</button>
  `);
}

function decision() {
  setScene(`
    <p class="kicker">Antes de responder ao formulário</p>
    <h2>Experimente uma possibilidade.</h2>
    <p>Não é uma aula completa. Não é uma prova. É um trailer de uma proposta: usar experiências curtas para preparar a explicação dos conteúdos, dos autores e das questões do ENEM.</p>
    <p class="footer-note">Duração aproximada: 1 minuto.</p>
    <button onclick="next();">Começar</button>
  `);
}

function observe() {
  setScene(`
    <p class="kicker">Cena 1</p>
    <h2>Primeiro, uma experiência.</h2>
    <div class="objects">
      <div class="object" onclick="beep(); this.querySelector('small').textContent='Quem produziu esta imagem? Quem aparece? Quem ficou fora?'">
        <span class="icon">📷</span>
        <strong>Fotografia</strong>
        <small>Clique para investigar.</small>
      </div>
      <div class="object" onclick="beep(); this.querySelector('small').textContent='Toda notícia seleciona palavras, fontes e enquadramentos.'">
        <span class="icon">📰</span>
        <strong>Notícia</strong>
        <small>Clique para investigar.</small>
      </div>
      <div class="object" onclick="beep(); this.querySelector('small').textContent='Dados mostram algo, mas também precisam ser interpretados.'">
        <span class="icon">📊</span>
        <strong>Dado</strong>
        <small>Clique para investigar.</small>
      </div>
    </div>
    <p>Uma aula pode começar assim: com observação, dúvida e investigação.</p>
    <button onclick="next();">Continuar</button>
  `);
}

function write() {
  setScene(`
    <p class="kicker">Sua primeira ação</p>
    <h2>O que chamou sua atenção?</h2>
    <p>Escreva uma frase. Não existe resposta certa. A ideia é produzir uma pergunta para a aula.</p>
    <textarea class="input" placeholder="Escreva aqui uma observação, pergunta ou hipótese..."></textarea>
    <button onclick="next();">Avançar</button>
  `);
}

function teacher() {
  setScene(`
    <p class="kicker">Agora entra a minha parte</p>
    <h2>Eu explicarei conteúdos.</h2>
    <p>Apresentarei autores, conceitos e caminhos para interpretar questões do ENEM.</p>
    <div class="objects">
      <div class="object"><span class="icon">📚</span><strong>Autores</strong><small>Marx, Durkheim, Weber e outros.</small></div>
      <div class="object"><span class="icon">🧠</span><strong>Conceitos</strong><small>Cultura, ideologia, Estado, desigualdade.</small></div>
      <div class="object"><span class="icon">🎯</span><strong>ENEM</strong><small>Ler textos, imagens, dados e alternativas.</small></div>
    </div>
    <button onclick="next();">Ver como isso se conecta</button>
  `);
}

function enem() {
  setScene(`
    <p class="kicker">Experiência + explicação</p>
    <h2>Depois, aplicamos ao ENEM.</h2>
    <p>Uma questão do ENEM não exige apenas decorar conteúdo. Ela exige leitura, interpretação, repertório e conceitos.</p>
    <p class="big-line">Observar → Entender → Conceituar → Resolver</p>
    <button onclick="next();">Continuar</button>
  `);
}

function parts() {
  setScene(`
    <p class="kicker">A proposta</p>
    <div class="split">
      <div class="panel">
        <h3>Minha parte</h3>
        <ul>
          <li>📚 Explicar conteúdos.</li>
          <li>🧠 Apresentar autores e conceitos.</li>
          <li>🎯 Preparar para o ENEM.</li>
          <li>🧭 Organizar o caminho da aula.</li>
          <li>💬 Responder dúvidas.</li>
        </ul>
      </div>
      <div class="panel">
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
    <button onclick="next();">Unir as partes</button>
  `);
}

function interaction() {
  beep("stamp");
  setScene(`
    <p class="kicker">INTER + AÇÃO</p>
    <h1>Uma boa aula depende da conexão entre essas duas partes.</h1>
    <p>Explicação sem participação vira apenas fala. Participação sem orientação pode virar dispersão. A proposta é unir experiência, explicação e estudo.</p>
    <div class="stamp">Proposta em construção</div>
    <button onclick="next();">Finalizar</button>
  `);
}

function final() {
  beep("success");
  setScene(`
    <p class="kicker">Decisão</p>
    <h2>Este foi apenas um protótipo.</h2>
    <p>Agora volte ao formulário e responda à pergunta final.</p>
    <p class="big-line">Você gostaria que esse tipo de recurso pedagógico estivesse presente nas aulas de Sociologia?</p>
    <p>Escolha: <strong>Sim</strong>, <strong>Não</strong> ou <strong>Depende</strong>. Explique seus motivos.</p>
    <p class="footer-note">De que forma você pode participar mais no próximo semestre?</p>
  `);
}

render();
