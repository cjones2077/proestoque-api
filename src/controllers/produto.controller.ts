import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

export class ProdutoController {
  public async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await prisma.produto.findMany({
        include: { categoria: true },
        orderBy: { nome: 'asc' },
      });
      return res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  public async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const produto = await prisma.produto.findUnique({
        where: { id },
        include: { categoria: true },
      });

      if (!produto) {
        throw new AppError('Produto não encontrado.', 404);
      }

      return res.json(produto);
    } catch (error) {
      next(error);
    }
  }

  public async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, quantidade, quantidadeMinima, preco, unidade, observacao, categoriaId } = req.body;

      if (!nome || quantidade === undefined || quantidadeMinima === undefined || preco === undefined || !unidade || !categoriaId) {
        throw new AppError('Por favor, preencha todos os campos obrigatórios.', 400);
      }

      const categoriaExists = await prisma.categoria.findUnique({
        where: { id: categoriaId },
      });

      if (!categoriaExists) {
        throw new AppError('A categoria associada não existe.', 400);
      }

      const produto = await prisma.produto.create({
        data: {
          nome,
          quantidade: Number(quantidade),
          quantidadeMinima: Number(quantidadeMinima),
          preco: Number(preco),
          unidade,
          observacao,
          categoriaId,
        },
        include: { categoria: true },
      });

      return res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  }

  public async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nome, quantidade, quantidadeMinima, preco, unidade, observacao, categoriaId } = req.body;

      const produto = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        throw new AppError('Produto não encontrado.', 404);
      }

      if (categoriaId) {
        const categoriaExists = await prisma.categoria.findUnique({
          where: { id: categoriaId },
        });
        if (!categoriaExists) {
          throw new AppError('A categoria associada não existe.', 400);
        }
      }

      const produtoAtualizado = await prisma.produto.update({
        where: { id },
        data: {
          nome: nome ?? produto.nome,
          quantidade: quantidade !== undefined ? Number(quantidade) : produto.quantidade,
          quantidadeMinima: quantidadeMinima !== undefined ? Number(quantidadeMinima) : produto.quantidadeMinima,
          preco: preco !== undefined ? Number(preco) : produto.preco,
          unidade: unidade ?? produto.unidade,
          observacao: observacao !== undefined ? observacao : produto.observacao,
          categoriaId: categoriaId ?? produto.categoriaId,
        },
        include: { categoria: true },
      });

      return res.json(produtoAtualizado);
    } catch (error) {
      next(error);
    }
  }

  public async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        throw new AppError('Produto não encontrado.', 404);
      }

      await prisma.produto.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async registrarMovimentacao(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { tipo, quantidade, observacao = '' } = req.body;

      if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
        throw new AppError('O tipo de movimentação deve ser ENTRADA ou SAIDA.', 400);
      }

      const qtdNum = Number(quantidade);
      if (isNaN(qtdNum) || qtdNum <= 0) {
        throw new AppError('A quantidade da movimentação deve ser um número maior que 0.', 400);
      }

      const produto = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        throw new AppError('Produto não encontrado.', 404);
      }

      if (tipo === 'SAIDA' && produto.quantidade < qtdNum) {
        throw new AppError('Quantidade insuficiente em estoque para realizar esta saída.', 400);
      }

      const novaQtd = tipo === 'ENTRADA' ? produto.quantidade + qtdNum : produto.quantidade - qtdNum;

      // Executa a transação atômica
      const result = await prisma.$transaction(async (tx) => {
        const movimentacao = await tx.movimentacao.create({
          data: {
            tipo,
            quantidade: qtdNum,
            observacao,
            produtoId: id,
          },
        });

        const produtoAtualizado = await tx.produto.update({
          where: { id },
          data: {
            quantidade: novaQtd,
          },
          include: {
            categoria: true,
          },
        });

        return { movimentacao, produto: produtoAtualizado };
      });

      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async listarMovimentacoes(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        throw new AppError('Produto não encontrado.', 404);
      }

      const movimentacoes = await prisma.movimentacao.findMany({
        where: { produtoId: id },
        orderBy: { data: 'desc' },
      });

      return res.json(movimentacoes);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProdutoController();
