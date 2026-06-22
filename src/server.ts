import { app } from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

app.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}! 🚀`);
});
