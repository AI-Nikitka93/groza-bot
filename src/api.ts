import express from 'express';
import cors from 'cors';
import path from 'path';
import { getRecentStrikes } from './alerting/store';

export function startApiServer() {
  const app = express();
  
  app.use(cors());
  
  // Отдача статики из папки public
  app.use(express.static(path.join(__dirname, '../../public')));

  // Эндпоинт для активных молний
  app.get('/api/strikes', (req, res) => {
    const strikes = getRecentStrikes();
    res.json({ strikes });
  });

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`API and Static server running on port ${PORT}`);
  });
  return server;
}
