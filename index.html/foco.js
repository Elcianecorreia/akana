let tempoIntervalo;
let meuGraficoRoda;

// --- 1. LÓGICA DO TIMER PERSISTENTE ---
function iniciarFoco() {
    const minutosInput = document.getElementById('minutos');
    const missaoInput = document.getElementById('missao-nome');

    if (user.focoAtivo) {
        pararTimer();
        return;
    }

    let minutos = parseInt(minutosInput.value);
    if (isNaN(minutos) || minutos <= 0) return alert("Lua, insira o tempo!");

    user.focoAtivo = true;
    user.fimDoFoco = Date.now() + (minutos * 60 * 1000);
    user.missaoAtual = missaoInput.value || "Foco Ativo"; 
    
    salvar();
    executarContagem();
}

function executarContagem() {
    const display = document.getElementById('timer');
    const btn = document.getElementById('btn-foco');

    if (tempoIntervalo) clearInterval(tempoIntervalo);

    tempoIntervalo = setInterval(() => {
        if (!user.fimDoFoco) {
            pararTimer();
            return;
        }

        const restante = Math.ceil((user.fimDoFoco - Date.now()) / 1000);

        if (restante <= 0) {
            concluirSessaoFoco();
            return;
        }

        let m = Math.floor(restante / 60);
        let s = restante % 60;
        display.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        btn.innerText = "Parar Missão";
    }, 1000);
}

function pararTimer() {
    clearInterval(tempoIntervalo);
    user.focoAtivo = false;
    user.fimDoFoco = null;
    salvar();
    document.getElementById('timer').innerText = "25:00";
    document.getElementById('btn-foco').innerText = "Iniciar Hiperfoco";
}

function concluirSessaoFoco() {
    const missao = user.missaoAtual;
    pararTimer();
    user.moedas += 20;
    user.xp += 50;
    if (!user.historicoMissoes) user.historicoMissoes = [];
    user.historicoMissoes.push(`${missao} (Concluída ✨)`);
    salvar();
    renderizarMural();
}

// --- 2. MURAL DE METAS (O QUE ESTAVA DANDO ERRO) ---
function adicionarMeta() {
    const input = document.getElementById('nova-meta');
    const selecaoPrio = document.getElementById('prio-meta');
    if (!input || input.value.trim() === "") return;

    const novaMeta = {
        texto: input.value,
        prioridade: selecaoPrio ? selecaoPrio.value : "qualquer-momento"
    };

    user.metas.push(novaMeta);
    input.value = "";
    salvar();
    renderizarMural();
}

function renderizarMural() {
    const listaAberta = document.getElementById('lista-metas');
    const listaConcluida = document.getElementById('lista-historico-foco');

    if (!listaAberta || !listaConcluida) return;

    listaAberta.innerHTML = "";
    listaConcluida.innerHTML = "";

    // Renderiza metas abertas com proteção contra undefined
    if (user.metas) {
        user.metas.forEach((meta, index) => {
            const texto = typeof meta === 'object' ? meta.texto : meta;
            const prio = (meta && meta.prioridade) ? meta.prioridade : "qualquer-momento";
            
            const li = document.createElement('li');
            li.className = `meta-item meta-${prio}`;
            li.innerHTML = `
                <span><b>${prio.toUpperCase()}:</b> ${texto}</span>
                <button onclick="concluirMetaNoMural(${index})">✅</button>
            `;
            listaAberta.appendChild(li);
        });
    }

    // Renderiza concluídas (Sua lista que sumiu)
    if (user.historicoMissoes) {
        user.historicoMissoes.forEach(meta => {
            const li = document.createElement('li');
            li.className = "meta-item feita";
            li.innerHTML = `<span><s>${meta}</s></span> ✨`;
            listaConcluida.appendChild(li);
        });
    }
}

function concluirMetaNoMural(index) {
    const removida = user.metas.splice(index, 1)[0];
    const texto = typeof removida === 'object' ? removida.texto : removida;
    if (!user.historicoMissoes) user.historicoMissoes = [];
    user.historicoMissoes.push(texto);
    salvar();
    renderizarMural();
}

// --- 3. RODA DA VIDA DE 12 ÁREAS ---
function inicializarRoda() {
    const canvas = document.getElementById('graficoRodaVida');
    if (!canvas) return;

    if (meuGraficoRoda) meuGraficoRoda.destroy();

    const labels = ['Espiritual', 'Saúde', 'Intelectual', 'Emocional', 'Realização', 'Recursos', 'Contribuição', 'Família', 'Amoroso', 'Social', 'Hobbies', 'Plenitude'];
    
    // Se a rodaVida não existir no user, cria uma padrão
    if (!user.rodaVida) user.rodaVida = {};

    const dados = [
        user.rodaVida.espiritualidade || 5, user.rodaVida.saude || 5, user.rodaVida.intelectual || 5, 
        user.rodaVida.emocional || 5, user.rodaVida.realizacao || 5, user.rodaVida.recursos || 5, 
        user.rodaVida.contribuicao || 5, user.rodaVida.familia || 5, user.rodaVida.amoroso || 5, 
        user.rodaVida.social || 5, user.rodaVida.hobbies || 5, user.rodaVida.plenitude || 5
    ];

    meuGraficoRoda = new Chart(canvas.getContext('2d'), {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                data: dados,
                backgroundColor: 'rgba(255, 182, 193, 0.4)',
                borderColor: '#ff69b4',
                borderWidth: 2
            }]
        },
        options: { scales: { r: { min: 0, max: 10, ticks: { display: false } } } }
    });
}

function ajustarRoda(area, valor) {
    if(!user.rodaVida) user.rodaVida = {};
    user.rodaVida[area] = parseInt(valor);
    salvar();
    inicializarRoda();
}

// --- 4. INICIALIZAÇÃO AO CARREGAR ---
window.onload = () => {
    renderizarMural();
    inicializarRoda();
    if (user.focoAtivo && user.fimDoFoco) executarContagem();
};