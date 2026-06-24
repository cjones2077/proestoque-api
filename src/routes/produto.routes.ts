import { Router } from 'express';
import produtoController from '../controllers/produto.controller';
import { autenticar } from '../middlewares/auth';

const router = Router();

// Protege todas as rotas de produtos com autenticação JWT
router.use(autenticar);

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.deletar);

// Movimentações (Desafio Bônus)
router.post('/:id/movimentacao', produtoController.registrarMovimentacao);
router.get('/:id/movimentacoes', produtoController.listarMovimentacoes);

export default router;
