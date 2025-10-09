import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@speaklyplan.com' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })
  
  if (admin) {
    console.log('✅ Usuario administrador encontrado:')
    console.log(JSON.stringify(admin, null, 2))
  } else {
    console.log('❌ Usuario administrador no encontrado')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
