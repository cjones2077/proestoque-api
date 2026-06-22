import { Router } from 'express';
import produtoController from '../controllers/produto.controller';

const router = Router();

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.deletar);

// Movimentações (Desafio Bônus)
router.post('/:id/movimentacao', produtoController.registrarMovimentacao);
router.get('/:id/movimentacoes', produtoController.listarMovimentacoes);

export default router;
