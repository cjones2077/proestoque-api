import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Middleware genérico de validação com Zod.
 * Recebe um schema e valida o req.body.
 * Retorna 422 (Unprocessable Entity) com detalhes dos erros em caso de falha.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = (error as any).issues || (error as any).errors || [];
        const errosFormatados = issues.map((err: any) => ({
          campo: err.path?.join('.') || '',
          mensagem: err.message || 'Erro de validação',
        }));

        return res.status(422).json({
          status: 'error',
          message: 'Erro de validação.',
          erros: errosFormatados,
        });
      }

      next(error);
    }
  };
}
