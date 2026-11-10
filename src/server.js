import 'dotenv/config';
import app from './app.js';
import { conectarBanco } from './config/database.js';
import express from 'express';
import mongoose from 'mongoose';
import produtos from './routes/produtos.js';
import vendas from './routes/vendas.js';

const app = express();

app.use(express.json());
app.use('/produtos', produtos);
app.use('/vendas', vendas);

async function iniciar() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'loja' });
  app.listen(3000, () => console.log('API rodando na porta 3000'));
}

iniciar().catch((erro) => {
  console.error('Falha ao conectar ao MongoDB:', erro.message);
  process.exitCode = 1;
});

try {
  await conectarBanco();
  const porta = Number(process.env.PORT) || 3000;
  app.listen(porta, () => console.log(`API em http://localhost:${porta}`));
} catch (e) {
  console.error('Falha ao iniciar:', e.message);
  process.exit(1);
}
