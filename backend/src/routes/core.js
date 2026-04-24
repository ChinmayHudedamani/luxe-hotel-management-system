import express from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

router.get('/dashboard', async (_req, res) => {
  const [rooms, guests, bookings, payments, tasks] = await Promise.all([
    prisma.room.findMany(), prisma.guest.count(), prisma.booking.findMany({ include: { guest: true, room: true } }), prisma.payment.findMany(), prisma.staffTask.findMany()
  ]);
  const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const occupied = rooms.filter(r => r.status === 'OCCUPIED').length;
  const occupancyRate = rooms.length ? Math.round((occupied / rooms.length) * 100) : 0;
  const arrivals = bookings.filter(b => ['RESERVED', 'CHECKED_IN'].includes(b.status)).slice(0, 6);
  res.json({ stats: { rooms: rooms.length, guests, bookings: bookings.length, revenue, occupancyRate, openTasks: tasks.filter(t => t.status !== 'DONE').length }, arrivals });
});

router.get('/rooms', async (_req, res) => res.json(await prisma.room.findMany({ orderBy: [{ floor: 'asc' }, { number: 'asc' }] })));
router.post('/rooms', async (req, res) => res.status(201).json(await prisma.room.create({ data: req.body })));
router.patch('/rooms/:id', async (req, res) => res.json(await prisma.room.update({ where: { id: Number(req.params.id) }, data: req.body })));

router.get('/guests', async (_req, res) => res.json(await prisma.guest.findMany({ include: { bookings: true }, orderBy: { createdAt: 'desc' } })));
router.post('/guests', async (req, res) => res.status(201).json(await prisma.guest.create({ data: req.body })));

router.get('/bookings', async (_req, res) => res.json(await prisma.booking.findMany({ include: { guest: true, room: true, payments: true }, orderBy: { checkIn: 'asc' } })));
router.post('/bookings', async (req, res) => {
  const data = { ...req.body, checkIn: new Date(req.body.checkIn), checkOut: new Date(req.body.checkOut) };
  const booking = await prisma.booking.create({ data });
  await prisma.room.update({ where: { id: booking.roomId }, data: { status: 'OCCUPIED' } });
  res.status(201).json(booking);
});
router.patch('/bookings/:id', async (req, res) => res.json(await prisma.booking.update({ where: { id: Number(req.params.id) }, data: req.body })));

router.get('/tasks', async (_req, res) => res.json(await prisma.staffTask.findMany({ orderBy: { dueAt: 'asc' } })));
router.post('/tasks', async (req, res) => res.status(201).json(await prisma.staffTask.create({ data: { ...req.body, dueAt: new Date(req.body.dueAt) } })));
router.patch('/tasks/:id', async (req, res) => res.json(await prisma.staffTask.update({ where: { id: Number(req.params.id) }, data: req.body })));

export default router;
