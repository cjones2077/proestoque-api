import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';

export class CategoriaController {
  public async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const categorias = await prisma.categoria.findMany({
        orderBy: { nome: 'asc' },
      });
      return res.json(categorias);
    } catch (error) {
      next(error);
    }
  }

  public async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const categoria = await prisma.categoria.findUnique({
        where: { id },
      });

      if (!categoria) {
        throw new AppError('Categoria não encontrada.', 404);
      }

      return res.json(categoria);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoriaController();
