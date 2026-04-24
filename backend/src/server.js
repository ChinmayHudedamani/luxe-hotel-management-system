import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import coreRoutes from './routes/core.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.get('/api/health', (_req, res) => res.json({ ok: true, product: 'Luxe Hotel OS', credits: ['Chinmay', 'Krutick'] }));
app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Server error', detail: err.message }); });
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Luxe Hotel API running on http://localhost:${port}`));
