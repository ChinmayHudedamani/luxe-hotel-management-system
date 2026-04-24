import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const roomImages = [
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
];
const amenitySets = [
  'Wi-Fi, Air conditioning, Minibar, Private bathroom, Flat-screen TV, Coffee kit',
  'Balcony, Bathrobe, Refrigerator, Work desk, Premium toiletries, Smart lock',
  'Executive lounge, Jacuzzi tub, Multi-line phone, Printer, Dining area, City view',
  'Kitchenette, Microwave, Sofa bed, Prayer mats, Office supplies, Family crib'
];

async function main() {
  await prisma.payment.deleteMany(); await prisma.booking.deleteMany(); await prisma.staffTask.deleteMany(); await prisma.room.deleteMany(); await prisma.guest.deleteMany(); await prisma.user.deleteMany();
  const password = await bcrypt.hash('password123', 10);
  await prisma.user.createMany({ data: [
    { name: 'Chinmay Admin', email: 'chinmay@luxeos.dev', password, role: 'ADMIN' },
    { name: 'Krutick Manager', email: 'krutick@luxeos.dev', password, role: 'MANAGER' },
    { name: 'Reception Desk', email: 'frontdesk@luxeos.dev', password, role: 'RECEPTIONIST' }
  ]});
  const guests = await Promise.all(['Aarav Mehta','Sophia Williams','Kabir Rao','Amelia Brown','Rohan Iyer','Mia Chen','Noah Wilson','Anaya Shah','Liam Davis','Isha Kapoor'].map((name, i)=>
    prisma.guest.create({ data: { name, email: name.toLowerCase().replaceAll(' ','.')+'@example.com', phone: `+91-90000-100${i}`, country: ['India','USA','Singapore','UK','UAE'][i%5], vip: i % 4 === 0 }})
  ));
  const roomTypes = ['Standard King','Deluxe Twin','Executive Suite','Family Villa'];
  const rooms = [];
  for (let floor = 1; floor <= 5; floor++) {
    for (let n = 1; n <= 6; n++) {
      const idx = (floor + n) % roomTypes.length;
      rooms.push(await prisma.room.create({ data: {
        number: `${floor}0${n}`, type: roomTypes[idx], floor,
        status: ['AVAILABLE','OCCUPIED','CLEANING','MAINTENANCE'][(floor*n)%4],
        price: [5200,7800,12800,18500][idx], capacity: [2,2,3,5][idx],
        amenities: amenitySets[idx], image: `${roomImages[idx]}?auto=format&fit=crop&w=1200&q=80`
      }}));
    }
  }
  const bookings = [];
  for (let i = 0; i < 12; i++) {
    const checkIn = new Date(); checkIn.setDate(checkIn.getDate() + i - 3);
    const checkOut = new Date(checkIn); checkOut.setDate(checkOut.getDate() + (i % 4) + 1);
    const room = rooms[i + 2];
    bookings.push(await prisma.booking.create({ data: {
      code: `LUX-${2026}-${String(i+1).padStart(4,'0')}`, guestId: guests[i % guests.length].id, roomId: room.id,
      checkIn, checkOut, status: ['RESERVED','CHECKED_IN','CHECKED_OUT','CANCELLED'][i%4],
      totalAmount: room.price * ((i % 4) + 1), notes: i % 3 === 0 ? 'Airport pickup requested' : null
    }}));
  }
  await Promise.all(bookings.filter((_,i)=>i%4!==3).map(b => prisma.payment.create({ data: { bookingId: b.id, amount: Math.round(b.totalAmount * 0.65), method: ['UPI','Card','Cash','Bank Transfer'][b.id%4] }})));
  await prisma.staffTask.createMany({ data: [
    { title:'Prepare presidential suite welcome setup', area:'Housekeeping', priority:'HIGH', dueAt:new Date(Date.now()+3600000) },
    { title:'Restock premium toiletries on floor 3', area:'Inventory', priority:'MEDIUM', dueAt:new Date(Date.now()+7200000) },
    { title:'Inspect smart locks in east wing', area:'Maintenance', priority:'HIGH', dueAt:new Date(Date.now()+10800000) },
    { title:'Confirm airport pickups for VIP arrivals', area:'Concierge', priority:'LOW', dueAt:new Date(Date.now()+14400000) }
  ]});
}
main().then(()=>console.log('Seed complete. Login: chinmay@luxeos.dev / password123')).finally(()=>prisma.$disconnect());
