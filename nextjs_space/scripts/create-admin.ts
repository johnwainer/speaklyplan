
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@speaklyplan.com'
  const adminPassword = 'Admin123!'
  const adminName = 'Administrador'
  
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (existingUser) {
      // Si existe, solo actualizar el rol
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'admin' }
      })
      console.log(`✅ Usuario existente ${adminEmail} actualizado a rol: ${updatedUser.role}`)
    } else {
      // Si no existe, crear el usuario
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      
      const newUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          password: hashedPassword,
          role: 'admin',
          emailVerified: new Date()
        }
      })
      
      console.log(`✅ Usuario administrador creado exitosamente`)
      console.log(`   Email: ${newUser.email}`)
      console.log(`   Contraseña: ${adminPassword}`)
      console.log(`   Rol: ${newUser.role}`)
    }
  } catch (error) {
    console.error('Error procesando usuario:', error)
    process.exit(1)
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
