
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@speaklyplan.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const adminName = process.env.ADMIN_NAME || 'Administrador'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('✅ El administrador ya existe')
    console.log('Email:', adminEmail)
    
    // Update to admin role if not already
    if (existingAdmin.role !== 'admin') {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' }
      })
      console.log('✅ Usuario actualizado a rol de administrador')
    }
    
    return
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: 'admin',
      points: 0,
      level: 1,
      currentStreak: 0,
      bestStreak: 0
    }
  })

  console.log('✅ Administrador creado exitosamente')
  console.log('Email:', admin.email)
  console.log('Password:', adminPassword)
  console.log('⚠️  Por favor, cambia la contraseña después del primer inicio de sesión')
}

main()
  .catch((e) => {
    console.error('Error creating admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
