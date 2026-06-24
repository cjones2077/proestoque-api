import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

function loadConfig(): EnvConfig {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error(
      '❌ A variável de ambiente JWT_SECRET não está definida. ' +
      'Adicione JWT_SECRET ao seu arquivo .env para continuar.'
    );
  }

  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : 3333,
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
    JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  };
}

export const config = loadConfig();
