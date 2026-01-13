/* ==========================================
   SISTEMA GLOBAL (script.js)
   ========================================== */

// INICIALIZAÇÃO DO MODAL DE NOME
window.onload = () => {
    if (typeof user === 'undefined') {
        console.error("Erro: storage.js não carregado!");
        return;
    }

    // Se não tem nome, mostra o modal de boas-vindas
    const modal = document.getElementById('modal-inicio');
    if (modal && (!user.nome || user.nome.trim() === "")) {
        modal.style.display = 'flex';
    } else if (modal) {
        modal.style.display = 'none';
    }

    // Dispara a inicialização da página atual (se a função existir)
    if (typeof inicializarDashboard === "function") inicializarDashboard();
};

function definirPerfil(genero) {
    let nomeInput = document.getElementById('input-nome').value;
    if(!nomeInput) return alert("Lua, por favor, digite seu nome para começarmos!");
    
    user.nome = nomeInput; 
    user.genero = genero;
    salvar();
    location.reload(); // Recarrega para aplicar o nome na home
}

/* --- AUXILIARES GLOBAIS (USADOS POR TODOS OS JS) --- */

function avisar(mensagem, tipo = 'sucesso') {
    const banner = document.getElementById('notificacao-custom');
    if (!banner) return;
    
    banner.innerText = mensagem;
    banner.className = 'notificacao-ativa';
    
    if (tipo === 'sucesso') banner.style.borderLeft = "5px solid #2ecc71";
    if (tipo === 'erro') banner.style.borderLeft = "5px solid #e74c3c";
    
    setTimeout(() => banner.className = '', 3000);
}

function tocarSom(tipo) {
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const osc = context.createOscillator();
        const g = context.createGain();
        osc.frequency.setValueAtTime(tipo === 'sucesso' ? 880 : 440, context.currentTime);
        osc.connect(g); g.connect(context.destination);
        g.gain.setValueAtTime(0.1, context.currentTime);
        osc.start(); osc.stop(context.currentTime + 0.3);
    } catch (e) {}
}