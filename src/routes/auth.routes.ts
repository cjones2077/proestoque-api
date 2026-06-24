import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { registroSchema, loginSchema } from '../schemas/auth.schema';
import { autenticar } from '../middlewares/auth';

const router = Router();

// Rotas públicas
router.post('/registro', validate(registroSchema), authController.registrar);
router.post('/login', validate(loginSchema), authController.login);

// Rota protegida
router.get('/me', autenticar, authController.perfil);

export default router;
