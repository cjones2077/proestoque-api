import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // ─── 1. CATEGORIAS ────────────────────────────────────────────────
  const categoriasData = [
    { nome: 'Alimentos' },
    { nome: 'Bebidas' },
    { nome: 'Limpeza' },
    { nome: 'Papelaria' },
    { nome: 'Eletrônicos' },
    { nome: 'Higiene' },
    { nome: 'Outros' },
  ];

  console.log('📂 Criando categorias...');
  const categorias: Record<string, string> = {};

  for (const cat of categoriasData) {
    const registro = await prisma.categoria.upsert({
      where: { nome: cat.nome },
      update: {},
      create: { nome: cat.nome },
    });
    categorias[cat.nome] = registro.id;
    console.log(`   ✔ ${registro.nome} (${registro.id})`);
  }

  // ─── 2. PRODUTOS ─────────────────────────────────────────────────
  const produtosData = [
    // Alimentos
    {
      nome: 'Arroz Branco 5kg',
      quantidade: 42,
      quantidadeMinima: 10,
      preco: 28.90,
      unidade: 'cx',
      categoriaId: categorias['Alimentos'],
      observacao: 'Marca Tio João',
    },
    {
      nome: 'Feijão Carioca 1kg',
      quantidade: 5,
      quantidadeMinima: 8,
      preco: 9.50,
      unidade: 'un',
      categoriaId: categorias['Alimentos'],
      observacao: 'Estoque crítico — repor com urgência',
    },
    {
      nome: 'Azeite Extra Virgem 500ml',
      quantidade: 0,
      quantidadeMinima: 4,
      preco: 45.00,
      unidade: 'un',
      categoriaId: categorias['Alimentos'],
      observacao: 'Sem estoque',
    },
    {
      nome: 'Macarrão Espaguete 500g',
      quantidade: 30,
      quantidadeMinima: 12,
      preco: 4.99,
      unidade: 'un',
      categoriaId: categorias['Alimentos'],
    },

    // Bebidas
    {
      nome: 'Café Especial 250g',
      quantidade: 3,
      quantidadeMinima: 10,
      preco: 32.90,
      unidade: 'un',
      categoriaId: categorias['Bebidas'],
      observacao: 'Blend Serra da Mantiqueira',
    },
    {
      nome: 'Água Mineral 500ml',
      quantidade: 96,
      quantidadeMinima: 24,
      preco: 1.80,
      unidade: 'un',
      categoriaId: categorias['Bebidas'],
    },
    {
      nome: 'Suco de Laranja 1L',
      quantidade: 6,
      quantidadeMinima: 12,
      preco: 8.90,
      unidade: 'un',
      categoriaId: categorias['Bebidas'],
    },
    {
      nome: 'Refrigerante Cola 2L',
      quantidade: 24,
      quantidadeMinima: 12,
      preco: 8.50,
      unidade: 'un',
      categoriaId: categorias['Bebidas'],
    },

    // Limpeza
    {
      nome: 'Detergente Neutro 500ml',
      quantidade: 22,
      quantidadeMinima: 10,
      preco: 3.99,
      unidade: 'un',
      categoriaId: categorias['Limpeza'],
    },
    {
      nome: 'Sabão em Pó 3kg',
      quantidade: 0,
      quantidadeMinima: 4,
      preco: 24.90,
      unidade: 'cx',
      categoriaId: categorias['Limpeza'],
      observacao: 'Esgotado — pedir fornecedor',
    },
    {
      nome: 'Álcool 70% 1L',
      quantidade: 15,
      quantidadeMinima: 5,
      preco: 12.90,
      unidade: 'un',
      categoriaId: categorias['Limpeza'],
    },
    {
      nome: 'Desinfetante Pinho 2L',
      quantidade: 8,
      quantidadeMinima: 4,
      preco: 10.50,
      unidade: 'un',
      categoriaId: categorias['Limpeza'],
    },

    // Papelaria
    {
      nome: 'Caneta Esferográfica Azul',
      quantidade: 1,
      quantidadeMinima: 20,
      preco: 1.50,
      unidade: 'cx',
      categoriaId: categorias['Papelaria'],
      observacao: 'Caixa com 50 unidades',
    },
    {
      nome: 'Papel A4 500fls',
      quantidade: 8,
      quantidadeMinima: 5,
      preco: 32.00,
      unidade: 'cx',
      categoriaId: categorias['Papelaria'],
    },
    {
      nome: 'Grampeador Profissional',
      quantidade: 3,
      quantidadeMinima: 2,
      preco: 45.00,
      unidade: 'un',
      categoriaId: categorias['Papelaria'],
    },

    // Eletrônicos
    {
      nome: 'Cabo USB-C 1m',
      quantidade: 12,
      quantidadeMinima: 5,
      preco: 29.90,
      unidade: 'un',
      categoriaId: categorias['Eletrônicos'],
    },
    {
      nome: 'Adaptador HDMI x VGA',
      quantidade: 2,
      quantidadeMinima: 3,
      preco: 55.00,
      unidade: 'un',
      categoriaId: categorias['Eletrônicos'],
      observacao: 'Estoque baixo',
    },
    {
      nome: 'Mouse USB sem fio',
      quantidade: 7,
      quantidadeMinima: 3,
      preco: 89.90,
      unidade: 'un',
      categoriaId: categorias['Eletrônicos'],
    },

    // Higiene
    {
      nome: 'Sabonete Líquido 500ml',
      quantidade: 18,
      quantidadeMinima: 6,
      preco: 11.90,
      unidade: 'un',
      categoriaId: categorias['Higiene'],
    },
    {
      nome: 'Papel Higiênico 12 rolos',
      quantidade: 4,
      quantidadeMinima: 6,
      preco: 22.90,
      unidade: 'cx',
      categoriaId: categorias['Higiene'],
    },
  ];

  console.log('\n📦 Criando produtos...');
  const produtos: string[] = [];

  for (const prod of produtosData) {
    const registro = await prisma.produto.upsert({
      where: { id: `seed-${prod.nome.replace(/\s/g, '-').toLowerCase()}` },
      update: {
        quantidade: prod.quantidade,
        preco: prod.preco,
      },
      create: {
        id: `seed-${prod.nome.replace(/\s/g, '-').toLowerCase()}`,
        ...prod,
      },
    });
    produtos.push(registro.id);

    const statusIcon =
      registro.quantidade === 0 ? '🔴' :
      registro.quantidade <= registro.quantidadeMinima ? '🟡' : '🟢';
    console.log(`   ${statusIcon} ${registro.nome} (qtd: ${registro.quantidade})`);
  }

  // ─── 3. MOVIMENTAÇÕES DE EXEMPLO ─────────────────────────────────
  console.log('\n📊 Criando movimentações de exemplo...');

  const movimentacoes = [
    { produtoId: produtos[0], tipo: 'ENTRADA', quantidade: 50, observacao: 'Compra mensal fornecedor' },
    { produtoId: produtos[0], tipo: 'SAIDA',   quantidade: 8,  observacao: 'Consumo semana 1' },
    { produtoId: produtos[4], tipo: 'SAIDA',   quantidade: 6,  observacao: 'Uso do escritório' },
    { produtoId: produtos[5], tipo: 'ENTRADA', quantidade: 48, observacao: 'Reposição semanal' },
    { produtoId: produtos[8], tipo: 'ENTRADA', quantidade: 24, observacao: 'Compra mensal' },
    { produtoId: produtos[9], tipo: 'SAIDA',   quantidade: 4,  observacao: 'Limpeza geral' },
    { produtoId: produtos[15], tipo: 'ENTRADA', quantidade: 10, observacao: 'Novo lote' },
  ];

  for (const mov of movimentacoes) {
    await prisma.movimentacao.create({ data: mov });
    console.log(`   ↕ ${mov.tipo} de ${mov.quantidade} unidades`);
  }

  console.log('\n✅ Seed concluído com sucesso!');
  console.log(`   📂 ${categoriasData.length} categorias`);
  console.log(`   📦 ${produtosData.length} produtos`);
  console.log(`   📊 ${movimentacoes.length} movimentações`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
