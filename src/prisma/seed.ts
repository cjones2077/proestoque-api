import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categorias = [
    { nome: 'Alimentos' },
    { nome: 'Bebidas' },
    { nome: 'Limpeza' },
    { nome: 'Papelaria' },
    { nome: 'Outros' },
  ];

  console.log('Iniciando o seeding de categorias...');

  for (const cat of categorias) {
    const dbCat = await prisma.categoria.upsert({
      where: { nome: cat.nome },
      update: {},
      create: { nome: cat.nome },
    });
    console.log(`Categoria: ${dbCat.nome} (${dbCat.id})`);
  }

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
