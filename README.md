# Luxe Hotel OS — Full Stack Hotel Management System

A market-ready starter hotel management system with animated React UI, Express API, Prisma ORM, SQLite database, JWT login, protected routes, dashboard analytics, rooms, bookings, guests and staff tasks.

## Credits
Built with project credits to **Chinmay** and **Krutick**.

## Tech Stack
- Frontend: React 19, Vite, React Router, Framer Motion, Recharts, Lucide Icons
- Backend: Node.js, Express, JWT, bcrypt, Zod
- Database: SQLite using Prisma ORM

## Features
- Login authentication with JWT
- Multiple protected routes: Dashboard, Rooms, Bookings, Guests, Staff Tasks
- Animated classy UI with glassmorphism, premium hotel styling and responsive layout
- Room inventory with status, price, capacity, image and amenities
- Booking management APIs
- Guest CRM APIs
- Staff task operations APIs
- Seeded database with realistic hospitality data
- Git-ready monorepo structure

## Data Notes
Seed data is synthetic but inspired by public hospitality standards and amenity guidance. References used while shaping the room/amenity model:
- OpenTravel hotel/room amenity code lists and related OTA guidance
- Travelport Universal API amenity documentation
- HotelTechReport, Cvent and SiteMinder hospitality amenity guidance
- Agilysys room type guidance

No private or scraped guest data is included.

## Quick Start

```bash
cd luxe-hotel-system
cp backend/.env.example backend/.env
npm run install:all
npm run seed
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000/api/health

## Demo Login

```txt
Email: chinmay@luxeos.dev
Password: password123
```

Alternative:
```txt
Email: krutick@luxeos.dev
Password: password123
```

## API Routes

```txt
POST /api/auth/login
GET  /api/dashboard
GET  /api/rooms
POST /api/rooms
PATCH /api/rooms/:id
GET  /api/guests
POST /api/guests
GET  /api/bookings
POST /api/bookings
PATCH /api/bookings/:id
GET  /api/tasks
POST /api/tasks
PATCH /api/tasks/:id
```

All routes except `/api/auth/login` and `/api/health` require `Authorization: Bearer <token>`.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Luxe Hotel OS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/luxe-hotel-system.git
git push -u origin main
```

## Suggested Next Production Upgrades
- Replace SQLite with PostgreSQL for deployment
- Add role-based permissions per route
- Add booking conflict validation
- Add invoice PDF export
- Add payment gateway integration
- Add automated tests and CI/CD
