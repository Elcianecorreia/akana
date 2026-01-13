/* ==========================================
   CÉREBRO DA LOJA (loja.js)
   ========================================== */

const ITENS = [
    { id: 'armadura_bronze', nome: 'Peitoral de Bronze', preco: 5000, img: 'armadura_bronze.png.png' },
    { id: 'oculos_foco', nome: 'Óculos de Foco', preco: 3000, img: 'oculos_foco.png.png' }
];

window.onload = () => {
    // 1. Garante que a estrutura da loja exista no seu usuário
    if (!user.loja) {
        user.loja = { itensComprados: [], itemEquipado: "padrao", acessorioEquipado: "nenhum" };
        salvar();
    }
    
    // 2. Atualiza o saldo de moedas na tela
    const saldoElemento = document.getElementById('saldo-moedas');
    if (saldoElemento) {
        saldoElemento.innerText = user.moedas;
    }

    // 3. Chama a função para desenhar os itens (Agora com o nome correto!)
    renderizarItensLoja();
};

function renderizarItensLoja() {
    const container = document.getElementById('lista-loja');
    if (!container) return;
    
    container.innerHTML = ""; // Limpa a loja antes de carregar

    ITENS.forEach(item => {
        const jaComprou = user.loja.itensComprados.includes(item.id);
        
        container.innerHTML += `
            <div class="item-loja card-glass">
                <img src="${item.img}" style="width: 80px; margin-bottom: 10px;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/679/679821.png'">
                <h4>${item.nome}</h4>
                <p>💰 ${item.preco}</p>
                <button onclick="comprarItem('${item.id}')" ${jaComprou ? 'disabled' : ''} class="btn-comprar">
                    ${jaComprou ? 'Adquirido' : 'Comprar'}
                </button>
            </div>
        `;
    });
}

function comprarItem(id) {
    const item = ITENS.find(i => i.id === id);
    
    if (user.moedas >= item.preco) {
        user.moedas -= item.preco;
        user.loja.itensComprados.push(id);
        
        // Equipa automaticamente se for armadura ou óculos
        if (id.includes('armadura')) user.loja.itemEquipado = id;
        if (id.includes('oculos')) user.loja.acessorioEquipado = id;
        
        salvar();
        alert(`Parabéns ! Você comprou: ${item.nome}`);
        location.reload(); // Atualiza a página para mostrar como "Comprado"
    } else {
        alert("Puxa, Você ainda não tem moedas suficientes. Foque um pouco mais! 💪");
    }
}
