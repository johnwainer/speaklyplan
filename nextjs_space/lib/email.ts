
/**
 * Email Service
 * En producción, esto se conectaría a un servicio real como SendGrid, Resend, etc.
 * Por ahora, simula el envío y muestra el token en consola para desarrollo.
 */

interface EmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  // En desarrollo, mostrar en consola
  if (process.env.NODE_ENV === 'development') {
    console.log('═══════════════════════════════════════════════════')
    console.log('📧 EMAIL SIMULADO (DESARROLLO)')
    console.log('═══════════════════════════════════════════════════')
    console.log('Para:', to)
    console.log('Asunto:', subject)
    console.log('Contenido HTML:')
    console.log(html)
    console.log('═══════════════════════════════════════════════════')
    return { success: true }
  }

  // En producción, usar un servicio real de email
  // Ejemplo con SendGrid, Resend, etc.
  try {
    // TODO: Implementar con servicio real de email
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: to }] }],
    //     from: { email: process.env.FROM_EMAIL },
    //     subject,
    //     content: [{ type: 'text/html', value: html }]
    //   })
    // })
    
    console.warn('⚠️ Email service not configured for production. Please set up SendGrid, Resend, or similar.')
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

export function generatePasswordResetEmail(userName: string, resetLink: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablece tu Contraseña</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #2d3748;
      margin-top: 0;
      font-size: 22px;
    }
    .content p {
      color: #4a5568;
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 24px 0;
      transition: background 0.3s;
    }
    .button:hover {
      background: #5568d3;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px 16px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background: #f7fafc;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #718096;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 SpeaklyPlan</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Restablecimiento de Contraseña</p>
    </div>
    
    <div class="content">
      <h2>Hola ${userName},</h2>
      
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en SpeaklyPlan.</p>
      
      <p>Si no solicitaste este cambio, puedes ignorar este email de forma segura.</p>
      
      <p>Para establecer una nueva contraseña, haz clic en el siguiente botón:</p>
      
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Restablecer Contraseña</a>
      </div>
      
      <p style="font-size: 14px; color: #718096;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:
        <br>
        <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
      </p>
      
      <div class="warning">
        <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por razones de seguridad.
      </div>
      
      <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
      
      <p style="margin-top: 30px;">
        Saludos,<br>
        <strong>El equipo de SpeaklyPlan</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>
        © ${new Date().getFullYear()} SpeaklyPlan. Todos los derechos reservados.
      </p>
      <p>
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}">Visitar SpeaklyPlan</a>
      </p>
    </div>
  </div>
</body>
</html>
  `
}
