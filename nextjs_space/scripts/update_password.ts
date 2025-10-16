
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    const email = 'alejandrozapata.9806@gmail.com';
    const newPassword = '12345';
    
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.error(`❌ Usuario con email ${email} no encontrado`);
      process.exit(1);
    }
    
    console.log(`✅ Usuario encontrado: ${user.name} (${user.email})`);
    
    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Actualizar la contraseña
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log(`✅ Contraseña actualizada exitosamente para ${email}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Nueva contraseña: ${newPassword}`);
    
  } catch (error) {
    console.error('❌ Error actualizando contraseña:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
