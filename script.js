const inicio=document.getElementById('inicio'),iniciar=document.getElementById('iniciar'),palco=document.getElementById('palco'),frase=document.getElementById('frase'),mundo=document.getElementById('mundo'),porta=document.getElementById('porta'),venn=document.getElementById('venn'),retornar=document.getElementById('retornar');
let ctx,master; const esperar=ms=>new Promise(r=>setTimeout(r,ms));
function criarAudio(){const A=window.AudioContext||window.webkitAudioContext;ctx=new A();master=ctx.createGain();master.gain.value=.12;master.connect(ctx.destination)}
function tom(freq,dur,gain=.04,tipo='sine'){if(!ctx)return;const now=ctx.currentTime,osc=ctx.createOscillator(),g=ctx.createGain();osc.type=tipo;osc.frequency.value=freq;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(gain,now+.08);g.gain.exponentialRampToValueAtTime(.0001,now+dur);osc.connect(g);g.connect(master);osc.start(now);osc.stop(now+dur+.1)}
function grave(){tom(42,2.8,.09);tom(64,2.4,.035,'triangle')} function ambiente(){tom(34,16,.025);tom(51,16,.018)} function transicao(){tom(90,.8,.022)} function sino(){tom(440,2.4,.025);tom(660,1.8,.016,'triangle');tom(880,1.4,.01)}
function escrever(texto,classe=''){frase.innerHTML=`<div class="linha ${classe}">${texto}</div>`} function apagarFrase(){const el=frase.querySelector('.linha'); if(el)el.classList.add('sai')}
async function experiencia(){inicio.classList.add('saindo');await esperar(900);inicio.classList.add('oculto');palco.classList.remove('oculto');grave();ambiente();
escrever("O mundo muda<br><span class='ouro'>todos os dias.</span>");await esperar(2800);apagarFrase();await esperar(900);
mundo.classList.remove('oculto');transicao();await esperar(3300);mundo.classList.add('oculto');
escrever("Algumas portas só se abrem<br><span class='ouro'>quando você decide compreender o mundo.</span>","menor");await esperar(3400);apagarFrase();await esperar(700);
porta.classList.remove('oculto');await esperar(3100);porta.classList.add('oculto');
venn.classList.remove('oculto');await esperar(4200);venn.classList.add('mesclar');await esperar(2600);venn.classList.add('mostrar-aula');sino();await esperar(2300);
retornar.classList.remove('oculto');retornar.classList.add('visivel')}
iniciar.addEventListener('click',async()=>{iniciar.disabled=true;try{criarAudio();if(ctx.state==='suspended')await ctx.resume()}catch(e){console.warn(e)}experiencia()});
retornar.addEventListener('click',()=>{window.location.href='https://docs.google.com/forms/d/e/1FAIpQLScW912RPTK4wo0lss49pQo1898S8ZXlbwJ_19v7A7msCLHN9Q/viewform?usp=header';});
