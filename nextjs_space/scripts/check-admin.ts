
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: {
        email: 'admin@speaklyplan.com'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    if (admin) {
      console.log('✅ Usuario administrador encontrado:')
      console.log(JSON.stringify(admin, null, 2))
      
      if (admin.role === 'admin') {
        console.log('\n✅ El rol es correcto: admin')
      } else {
        console.log('\n❌ ERROR: El rol no es admin, es:', admin.role)
      }
    } else {
      console.log('❌ No se encontró el usuario administrador con email: admin@speaklyplan.com')
      console.log('\nVerificando otros usuarios con rol admin:')
      
      const admins = await prisma.user.findMany({
        where: {
          role: 'admin'
        }
      })
      
      if (admins.length > 0) {
        console.log('Administradores encontrados:', admins)
      } else {
        console.log('No hay usuarios con rol admin en la base de datos')
      }
    }
  } catch (error) {
    console.error('Error al verificar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmin()
