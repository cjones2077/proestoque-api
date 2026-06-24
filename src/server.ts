import { config } from './config';
import { app } from './app';

app.listen(config.PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${config.PORT}! 🚀`);
});
