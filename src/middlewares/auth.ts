import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';

// Estende a tipagem do Express Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      usuario: {
        id: string;
      };
    }
  }
}

/**
 * Middleware de autenticação JWT.
 * Verifica o token do header Authorization: Bearer <token>.
 * Injeta req.usuario.id com o ID decodificado do token.
 */
export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token de autenticação não fornecido.', 401);
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new AppError('Token mal formatado.', 401);
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };

    req.usuario = {
      id: decoded.id,
    };

    return next();
  } catch (error) {
    throw new AppError('Token inválido ou expirado.', 401);
  }
}
