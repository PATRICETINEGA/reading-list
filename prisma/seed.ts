import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('demo123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@reading.app' },
    update: {},
    create: { email: 'demo@reading.app', password },
  })

  await prisma.book.upsert({
    where: { id: 'seed-book' },
    update: {},
    create: { id: 'seed-book', title: 'Atomic Habits', author: 'James Clear', status: 'reading', ownerId: user.id },
  })

  console.log('Seed done')
}

main().finally(() => prisma.$disconnect())
