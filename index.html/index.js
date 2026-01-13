/* ==========================================
   CÉREBRO DA PÁGINA INICIAL (index.js)
   ========================================== */

window.onload = () => {
    verificarNomeUsuario();
    definirFraseDoDia();
    gerarCalendario();
    
    // Atualiza os dados imediatamente ao carregar
    atualizarStatusHome();

    // Loop de atualização: Verifica mudanças no storage a cada 2 segundos
    // Isso garante que se você ganhar XP em outra aba, a Home atualize sozinha
    setInterval(atualizarStatusHome, 2000);
};

function verificarNomeUsuario() {
    if (!user.nome) {
        user.nome = prompt("Bem-vinda ao seu Santuário! Como você quer ser chamada?");
        if(!user.nome) user.nome = "Lua";
        salvar();
    }
    atualizarSaudacao();
}

function atualizarSaudacao() {
    const hora = new Date().getHours();
    let saudacao = "Bom dia";
    if (hora >= 12) saudacao = "Boa tarde";
    if (hora >= 18) saudacao = "Boa noite";
    document.getElementById('saudacao').innerText = `${saudacao}, ${user.nome}!`;
}

function definirFraseDoDia() {
    const frases = {
        0: "Domingo: Recarregue suas energias! 🌙",
        1: "Segunda: O foco de hoje constrói seu império! 🔥",
        2: "Terça: Disciplina é a ponte para as metas. 💪",
        3: "Quarta: No meio da jornada a magia acontece. ✨",
        4: "Quinta: A persistência é o caminho do êxito. 🛡️",
        5: "Sexta: Missão dada é missão cumprida! 🏆",
        6: "Sábado: Dia de equilíbrio e celebração. 🎡"
    };
    const diaSemana = new Date().getDay();
    document.getElementById('frase-dia').innerText = frases[diaSemana];
}

function atualizarStatusHome() {
    // 1. Atualiza Texto de Moedas e Nível
    document.getElementById('user-moedas').innerText = user.moedas;
    document.getElementById('user-nivel').innerText = user.nivel;

    // 2. Lógica da Barra de Energia Vital
    const barra = document.getElementById('energia-fill'); // Aqui definimos quem é a 'barra'
    
    if (barra) { // Só mexe se a barra existir no HTML
        const porcentagemEnergia = Math.max(0, Math.min(100, user.energia));
        barra.style.width = porcentagemEnergia + "%";

        // Muda a cor se estiver acabando
        if (porcentagemEnergia < 25) {
            barra.style.backgroundColor = "#ff4d4d"; // Vermelho
        } else {
            barra.style.backgroundColor = "#4ae3b5"; // Verde
        }
    }

    // 3. Evolução Visual do Avatar (Gato)
    const corpo = document.getElementById('camada-corpo');
    if (user.nivel >= 30) {
        corpo.src = "corpo_forte.png.png";
    } else if (user.nivel >= 10) {
        corpo.src = "corpo_atletico.png.png";
    } else {
        corpo.src = "corpo_base.png.png";
    }

    // 4. Sistema de Roupas
    const roupa = document.getElementById('camada-roupa');
    if (user.loja && user.loja.itemEquipado !== "padrao") {
        roupa.src = `assets/${user.loja.itemEquipado}.png`;
        roupa.style.display = "block";
    } else {
        roupa.style.display = "none";
    }
    
}

function gerarCalendario() {
    const container = document.getElementById('calendario-container');
    container.innerHTML = ""; 
    
    const hoje = new Date();
    const diasNoMes = new Date(hoje.getFullYear(), hoje.getUTCMonth() + 1, 0).getDate();
    const diaAtual = hoje.getDate();

    // No seu storage.js, você deve ter um array: user.historicoProgresso = [1, 5, 12] 
    // indicando quais dias do mês foram concluídos.
    const diasConcluidos = user.historicoProgresso || [];

    for (let i = 1; i <= diasNoMes; i++) {
        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia-calendario';
        
        // Verifica se o dia está no histórico de concluídos
        if (diasConcluidos.includes(i)) {
            diaDiv.innerHTML = `${i}<span class="x-dourado">X</span>`;
            diaDiv.classList.add('dia-concluido');
        } else {
            diaDiv.innerText = i;
        }
        
        if (i === diaAtual) diaDiv.classList.add('dia-atual');
        
        container.appendChild(diaDiv);
    }
}
// Função temporária para você testar o X Dourado
function marcarDiaComoConcluido() {
    const hoje = new Date().getDate();
    if (!user.historicoProgresso) {
        user.historicoProgresso = [];
    }
    
    if (!user.historicoProgresso.includes(hoje)) {
        user.historicoProgresso.push(hoje);
        salvar();
        gerarCalendario(); // Atualiza o calendário na tela
        alert("Parabéns, Lua! Dia marcado com o X Dourado! ✨");
    }
}