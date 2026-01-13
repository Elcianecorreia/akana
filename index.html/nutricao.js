/* ==========================================
   CÉREBRO DA PÁGINA NUTRIÇÃO (nutricao.js)
   ========================================== */

window.onload = () => {
    // Verifica se o objeto user existe, se não, evita o erro
    if (typeof user !== 'undefined') {
        atualizarTelaNutricao();
    } else {
        console.error("Erro: O objeto 'user' não foi encontrado. Verifique o storage.js");
    }
};

function salvarPeso() {
    let peso = parseFloat(document.getElementById('input-peso').value);
    if (!peso || peso <= 0) return alert("Digite um peso válido!");

    // Inicializa biometria se não existir
    if (!user.biometria) user.biometria = {};

    // Regra: 35ml por quilo
    user.biometria.peso = peso;
    user.biometria.metaAgua = peso * 35; 
    
    // Salva no storage.js
    if (typeof salvar === 'function') salvar();
    
    atualizarTelaNutricao();
    alert(`Meta de água atualizada: ${user.biometria.metaAgua}ml!`);
}

function adicionarAgua(ml) {
    // Inicializa valores se estiverem vazios
    if (!user.biometria) user.biometria = {};
    if (!user.biometria.consumoAguaAtual) user.biometria.consumoAguaAtual = 0;

    user.biometria.consumoAguaAtual += ml;
    user.moedas = (user.moedas || 0) + 5; // Recompensa
    
    // Atualiza a Roda da Vida (Pilar Saúde)
    if (user.rodaVida && user.rodaVida.saude < 10) {
        user.rodaVida.saude += 0.5;
    }

    if (typeof salvar === 'function') salvar();
    atualizarTelaNutricao();
}

function validarNutriente(tipo, energiaGanha) {
    const agora = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Garante que o histórico de missões exista antes de dar o push
    if (!user.historicoMissoes) user.historicoMissoes = [];

    // Adiciona ao histórico
    user.historicoMissoes.push({
        tarefa: `Nutrição: ${tipo}`,
        hora: agora
    });

    user.energia = Math.min(100, (user.energia || 0) + energiaGanha);
    user.xp = (user.xp || 0) + 10;

    if (typeof salvar === 'function') salvar();
    atualizarTelaNutricao();
}

function atualizarTelaNutricao() {
    // Proteção contra dados nulos
    const biometria = user.biometria || {};
    const meta = biometria.metaAgua || 2000;
    const atual = biometria.consumoAguaAtual || 0;
    const porcetagem = (atual / meta) * 100;

    // Atualiza elementos de texto e barra
    if(document.getElementById('agua-atual')) document.getElementById('agua-atual').innerText = atual;
    if(document.getElementById('agua-meta')) document.getElementById('agua-meta').innerText = meta;
    
    const barra = document.getElementById('barra-agua-interna');
    if(barra) {
        barra.style.width = Math.min(100, porcetagem) + "%";
    }

    const txtMeta = document.getElementById('meta-agua-texto');
    if(txtMeta) {
        txtMeta.innerText = `Sua meta atual é ${meta}ml por dia.`;
    }

    // Atualiza Lista de Consumo (Onde dava o erro do .includes)
    const lista = document.getElementById('lista-nutricao');
    if (lista) {
        // Se historicoMissoes for undefined, usamos um array vazio []
        const missoes = user.historicoMissoes || [];
        
        lista.innerHTML = missoes
            .filter(m => m.tarefa && m.tarefa.includes("Nutrição"))
            .slice().reverse()
            .map(m => `<li><span>${m.tarefa}</span> <small>${m.hora}</small></li>`)
            .join('');
    }
}