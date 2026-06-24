import { Router } from 'express';
import categoriaController from '../controllers/categoria.controller';
import { autenticar } from '../middlewares/auth';

const router = Router();

// Protege todas as rotas de categorias com autenticação JWT
router.use(autenticar);

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.buscarPorId);

export default router;
