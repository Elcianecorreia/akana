/* ==========================================
   MEMÓRIA E DADOS (storage.js)
   ========================================== */

let user = JSON.parse(localStorage.getItem('max_pro_user')) || {
    nome: "", 
    genero: "f",
    nivel: 1, 
    moedas: 100, 
    xp: 0, 
    energia: 100, 
    hidratacao: 0,
    metas: [],
    historicoFoco: [],
    historicoMissoes: [], 
    ultimaDataAcesso: "",
    registrosSemanais: { "Seg": 0, "Ter": 0, "Qua": 0, "Qui": 0, "Sex": 0, "Sáb": 0, "Dom": 0 },
    rodaVida: {
        foco: 5,
        saude: 5,
        mental: 5,
        social: 5,
        ambiente: 5
    }, // <-- Aqui precisava desta vírgula!
    focoAtivo: false,
    tempoRestante: 0,
    fimDoFoco: null,
    loja: {
        itensComprados: [],
        itemEquipado: "padrao",
        acessorioEquipado: "nenhum"
    },
      biometria: { peso: 0, metaAgua: 2000, consumoAguaAtual: 0 },
    rodaVida: { saude: 5, foco: 5, espiritualidade: 5 }, // Adicione todos aqui
    historicoMissoes: []
}; 

function salvar() {
    localStorage.setItem('max_pro_user', JSON.stringify(user));
}

function verificarResetDiario() {
    const hoje = new Date().toDateString();
    if (user.ultimaDataAcesso !== hoje) {
        user.hidratacao = 0; 
        if (user.biometria) user.biometria.consumoAguaAtual = 0; // Correção para a nova gaveta
        user.historicoMissoes = []; 
        user.ultimaDataAcesso = hoje;
        salvar();
        console.log("🌅 Santuário Renovado para um novo dia!");
    }
}

// === FUNÇÕES DO CALENDÁRIO ADICIONADAS ===

function marcarAtividadeNoCalendario() {
    const hoje = new Date();
    const dataID = `${hoje.getFullYear()}-${hoje.getMonth()}-${hoje.getDate()}`;
    
    if (!user.historicoFoco.includes(dataID)) {
        user.historicoFoco.push(dataID);
        salvar();
        if (typeof gerarCalendario === "function") gerarCalendario();
    }
}

verificarResetDiario();

// Procure a parte da rodaVida no seu storage.js e deixe assim:
rodaVida: {
    espiritualidade; 5, saude; 5, intelectual; 5, emocional; 5, 
    realizacao; 5, recursos; 5, social; 5, familia; 5, 
    amoroso; 5, social_rel; 5, hobbies; 5, plenitude; 5
}
function ganharXP(quantidade) {
    user.xp += quantidade;
    
    // Cálculo simples: Cada nível precisa de 1000 de XP a mais que o anterior
    let xpNecessarioParaSubir = user.nivel * 1000;
    
    if (user.xp >= xpNecessarioParaSubir) {
        user.nivel++;
        user.xp = 0; // Reinicia a barra para o próximo nível
        exibirMensagemSubiuNivel(user.nivel);
    }
    
    salvar(); // Salva no localStorage
    atualizarInterfaceStatus();
}

function exibirMensagemSubiuNivel(novoNivel) {
    mostrarToast(`✨ INCRÍVEL, LUA! Você subiu para o Nível ${novoNivel}! Novos itens foram desbloqueados na loja.`, "sucesso");
}