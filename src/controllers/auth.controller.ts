import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { config } from '../config';
import { AppError } from '../middlewares/errorHandler';

function gerarToken(id: string): string {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as any,
  });
}

export class AuthController {
  /**
   * POST /auth/registro
   * Cria um novo usuário com senha hasheada e retorna user + token.
   */
  public async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, email, senha } = req.body;

      // Verifica se o e-mail já está em uso
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email },
      });

      if (usuarioExistente) {
        throw new AppError('Este e-mail já está em uso.', 409);
      }

      // Hash da senha com salt 10
      const senhaHash = await bcrypt.hash(senha, 10);

      // Cria o usuário no banco
      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
        },
      });

      // Gera o token JWT
      const token = gerarToken(usuario.id);

      // Retorna usuário (sem a senha) + token
      return res.status(201).json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          criadoEm: usuario.criadoEm,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   * Autentica o usuário com e-mail e senha, retornando user + token.
   */
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;

      // Busca o usuário pelo e-mail
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        throw new AppError('E-mail ou senha inválidos.', 401);
      }

      // Compara a senha fornecida com o hash armazenado
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        throw new AppError('E-mail ou senha inválidos.', 401);
      }

      // Gera o token JWT
      const token = gerarToken(usuario.id);

      // Retorna usuário (sem a senha) + token
      return res.json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          criadoEm: usuario.criadoEm,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/me
   * Retorna os dados do usuário logado baseado no ID do token.
   */
  public async perfil(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.usuario.id },
        select: {
          id: true,
          nome: true,
          email: true,
          criadoEm: true,
          atualizadoEm: true,
        },
      });

      if (!usuario) {
        throw new AppError('Usuário não encontrado.', 404);
      }

      return res.json({ usuario });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
