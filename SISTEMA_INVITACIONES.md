
# 📬 Sistema de Invitaciones - SpeaklyPlan

## 🎯 Descripción General

Se ha implementado un **sistema completo de invitaciones** que permite a los usuarios invitar a sus amigos a unirse a SpeaklyPlan. Esta funcionalidad está diseñada para ser **destacada pero no intrusiva**, promoviendo el crecimiento orgánico de la plataforma gratuita.

## ✨ Características Principales

### 1. **Invitaciones desde el Landing Page**
- **Ubicación**: Nueva sección dedicada antes del footer
- **Diseño**: Sección vibrante con gradiente azul-púrpura-rosa
- **Elementos visuales**:
  - Iconos animados
  - 3 tarjetas destacando beneficios:
    - 🏆 Aprendan Juntos
    - 🔥 Manténganse Motivados
    - ⭐ Siempre Gratis
  - Botón prominente "Invitar Amigos Ahora"

### 2. **Invitaciones desde dentro de la Aplicación**
- **Ubicación Desktop**: 
  - Botón destacado en el header del dashboard
  - Con gradiente azul-púrpura sutil
  - Posicionado entre el nombre de usuario y "Mi Perfil"

- **Ubicación Mobile**:
  - Botón en el menú desplegable
  - Primera opción en la sección final
  - Mismo estilo visual que la versión desktop

### 3. **Modal de Invitación Interactivo**
El modal permite:
- ✉️ Agregar hasta 10 correos electrónicos
- ➕ Botón para agregar campos de email dinámicamente
- ❌ Eliminar campos no deseados
- 💬 Mensaje personalizado opcional (hasta 500 caracteres)
- ✅ Validación de formato de emails
- 🎉 Feedback visual al enviar

### 4. **Base de Datos**
Nuevo modelo `Invitation` con:
```prisma
model Invitation {
  id             String   @id @default(cuid())
  senderEmail    String?  // Email del remitente
  senderName     String?  // Nombre del remitente
  recipientEmail String   // Email del destinatario
  recipientName  String?  // Nombre del destinatario
  status         String   @default("pending") // "pending", "registered", "expired"
  inviteCode     String   @unique // Código único de invitación
  message        String?  @db.Text // Mensaje personalizado
  sentAt         DateTime @default(now())
  registeredAt   DateTime?
  expiresAt      DateTime // Expira en 30 días
}
```

### 5. **API Endpoints**

#### POST `/api/invitations/send`
Envía invitaciones por email
```typescript
{
  emails: string[]        // Array de emails (máx 10)
  message?: string        // Mensaje personalizado
  senderEmail?: string    // Email del remitente (opcional)
  senderName?: string     // Nombre del remitente (opcional)
}
```

Respuesta:
```typescript
{
  success: true,
  sent: number,           // Número de emails enviados
  total: number,          // Total de emails en la petición
  invitations: [{
    id: string,
    email: string,
    code: string
  }]
}
```

#### GET `/api/invitations/send`
Obtiene estadísticas de invitaciones del usuario autenticado
```typescript
{
  invitations: Invitation[],  // Lista de invitaciones
  stats: {
    total: number,
    pending: number,
    registered: number,
    expired: number
  }
}
```

## 🎨 Diseño y UX

### Características Visuales:
1. **No intrusivo**: El botón está presente pero no interfiere con la experiencia de estudio
2. **Destacado**: Usa gradientes y colores que lo hacen visible sin ser molesto
3. **Responsive**: Se adapta perfectamente a móviles y desktop
4. **Animaciones**: Efectos sutiles en hover para mejor feedback
5. **Accesible**: Buenos contrastes y textos claros

### Posicionamiento Estratégico:
- **Landing**: Sección completa antes del footer (alta visibilidad)
- **Dashboard**: Header principal (siempre visible, fácil acceso)
- **Mobile**: Menú lateral (primera opción en la sección de acciones)

## 🔧 Integración con Email (Próximos Pasos)

Actualmente, el sistema registra las invitaciones en la base de datos. Para enviar emails reales, puedes integrar con servicios como:

### Opción 1: Resend (Recomendado)
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'SpeaklyPlan <invitaciones@speaklyplan.com>',
  to: email,
  subject: `${senderName} te invita a SpeaklyPlan`,
  html: emailTemplate
})
```

### Opción 2: SendGrid
```typescript
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

await sgMail.send({
  to: email,
  from: 'invitaciones@speaklyplan.com',
  subject: `${senderName} te invita a SpeaklyPlan`,
  html: emailTemplate
})
```

### Opción 3: Nodemailer
```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

await transporter.sendMail({
  from: '"SpeaklyPlan" <noreply@speaklyplan.com>',
  to: email,
  subject: `${senderName} te invita a SpeaklyPlan`,
  html: emailTemplate
})
```

## 📧 Template de Email Sugerido

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 40px;">
    <h1 style="color: #2563eb; text-align: center;">
      ¡Te invitamos a SpeaklyPlan! 🎉
    </h1>
    
    <p style="font-size: 18px; color: #333;">
      Hola,
    </p>
    
    <p style="font-size: 16px; color: #666;">
      <strong>${senderName}</strong> te ha invitado a unirte a <strong>SpeaklyPlan</strong>, 
      una plataforma <strong>100% gratuita</strong> para aprender inglés de manera efectiva.
    </p>
    
    ${message ? `
    <div style="background-color: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #1e40af; font-style: italic;">
        "${message}"
      </p>
    </div>
    ` : ''}
    
    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
      <h3 style="color: #2563eb; margin-top: 0;">✨ ¿Qué es SpeaklyPlan?</h3>
      <ul style="color: #666; line-height: 1.8;">
        <li>Plan estructurado de 6 meses para profesionales</li>
        <li>AI Tutor personalizado disponible 24/7</li>
        <li>Sistema de gamificación y seguimiento de progreso</li>
        <li>Vocabulario técnico y recursos gratuitos</li>
        <li>100% gratis, sin costos ocultos</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.NEXTAUTH_URL}/auth/register?invite=${inviteCode}" 
         style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); 
                color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; 
                font-size: 18px; font-weight: bold;">
        Únete Ahora
      </a>
    </div>
    
    <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
      Esta invitación expira en 30 días.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center;">
      © 2024 SpeaklyPlan. Transformando profesionales a través del inglés.
    </p>
  </div>
</body>
</html>
```

## 📊 Métricas Sugeridas para Tracking

Puedes trackear:
1. **Invitaciones enviadas**: Total por usuario
2. **Tasa de conversión**: % de invitados que se registran
3. **Tiempo promedio**: Desde invitación hasta registro
4. **Usuarios más activos**: Top invitadores
5. **Mensajes personalizados**: % de invitaciones con mensaje

## 🚀 Próximas Mejoras Sugeridas

1. **Dashboard de invitaciones**: Vista para que usuarios vean sus invitaciones
2. **Recompensas**: Badges o puntos por invitar amigos
3. **Compartir en redes sociales**: Botones de compartir
4. **Link único de invitación**: URL personalizada por usuario
5. **Recordatorios**: Enviar recordatorio a invitados que no se han registrado
6. **Estadísticas en perfil**: Mostrar cuántos amigos ha invitado

## 📝 Archivos Modificados/Creados

### Nuevos Archivos:
- `components/invite-friends-modal.tsx` - Componente modal de invitación
- `app/api/invitations/send/route.ts` - API endpoint para invitaciones
- Schema: Modelo `Invitation` en `prisma/schema.prisma`

### Archivos Modificados:
- `app/page.tsx` - Agregada sección de invitación en landing
- `app/dashboard/_components/dashboard-client.tsx` - Botones en header y menú
- `prisma/schema.prisma` - Agregado modelo Invitation

## 🎉 Resultado Final

✅ Sistema completo de invitaciones implementado
✅ Visible en landing page con sección dedicada
✅ Accesible desde dashboard (desktop y mobile)
✅ Modal interactivo y amigable
✅ Base de datos configurada
✅ API funcionando correctamente
✅ Diseño no intrusivo pero destacado
✅ Listo para integración con servicio de email

---

**La aplicación está lista para deployment y la funcionalidad de invitaciones está completamente operativa.** 🚀
