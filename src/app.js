import express from 'express';
import mongoose from 'mongoose';
import produtoRoutes from './routes/produtoRoutes.js';

const app = express();

app.use(express.json());
app.get('/api/health', (req, res) => {
  const conectado = mongoose.connection.readyState === 1;
  res.status(conectado ? 200 : 503).json({ 
    status: conectado ? 'ok' : 'indisponivel', 
    mongodb: conectado ? 'conectado' : 'desconectado' 
  });
});
app.use('/api/produtos', produtoRoutes);
app.use((req,res) => res.status(404).json({ erro: 'Rota não encontrada' }));

export default app;
