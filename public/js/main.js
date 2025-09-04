const API_BASE = "http://localhost:8080";

// Carregar produtos ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    setupFiltrosCategorias();
});

// Carregar todos os produtos
async function carregarProdutos() {
    try {
        const response = await fetch(`${API_BASE}/produtos`);
        const produtos = await response.json();
        exibirProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Filtrar por categoria
async function filtrarPorCategoria(categoria) {
    try {
        const response = await fetch(`${API_BASE}/produtos/categoria/${categoria}`);
        const produtos = await response.json();
        exibirProdutos(produtos);
    } catch (error) {
        console.error('Erro ao filtrar produtos:', error);
    }
}

// Exibir produtos na página
function exibirProdutos(produtos) {
    const container = document.getElementById('produtos-container');
    container.innerHTML = '';

    produtos.forEach(produto => {
        const hasImage = produto.imagem && produto.imagem.src;
        const imageUrl = hasImage ? `${API_BASE}/${produto.imagem.src}` : '/images/placeholder.jpg';

        const produtoCard = `
            <div class="produto-card">
                <img src="${imageUrl}" alt="${produto.nome}" class="produto-imagem">
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.desc || 'Sem descrição'}</p>
                    <p class="produto-categoria">${produto.categoria}</p>
                    <p class="produto-preco">R$ ${produto.precovenda.toFixed(2)}</p>
                </div>
            </div>
        `;
        container.innerHTML += produtoCard;
    });
}

// Configurar filtros de categoria
function setupFiltrosCategorias() {
    const botoesCategoria = document.querySelectorAll('.categoria-btn');
    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', () => {
            const categoria = botao.dataset.categoria;
            filtrarPorCategoria(categoria);
        });
    });
}