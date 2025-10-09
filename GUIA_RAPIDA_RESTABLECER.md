
# 🔐 Guía Rápida: Restablecimiento de Contraseña

## Para Usuarios

### ¿Olvidaste tu contraseña?

1. **Ve a la página de login**: `/auth/login`
2. **Click en "¿Olvidaste tu contraseña?"** (debajo del campo de contraseña)
3. **Ingresa tu email** y haz click en "Enviar enlace de restablecimiento"
4. **Revisa tu email** (y la carpeta de spam si no lo ves)
5. **Click en el enlace** del email (válido por 1 hora)
6. **Ingresa tu nueva contraseña** (2 veces para confirmar)
7. **¡Listo!** Serás redirigido al login automáticamente

### ⚠️ Importante

- El enlace expira en **1 hora**
- Solo puedes usar el enlace **una vez**
- Si el enlace expiró, solicita uno nuevo
- Verifica tu carpeta de **spam**

## Para Desarrolladores

### Archivos Principales

```
lib/email.ts                              → Servicio de email
app/api/auth/forgot-password/route.ts     → API: Solicitar restablecimiento
app/api/auth/reset-password/route.ts      → API: Actualizar contraseña
app/auth/forgot-password/page.tsx         → UI: Solicitar restablecimiento
app/auth/reset-password/page.tsx          → UI: Nueva contraseña
```

### APIs Disponibles

#### 1. Solicitar Restablecimiento
```typescript
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "usuario@ejemplo.com"
}

// Respuesta
{
  "message": "Si el email existe en nuestro sistema, recibirás un enlace de restablecimiento."
}
```

#### 2. Restablecer Contraseña
```typescript
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "email": "usuario@ejemplo.com",
  "password": "nuevaContraseña"
}

// Respuesta Exitosa
{
  "message": "Contraseña actualizada exitosamente"
}

// Respuesta Error
{
  "error": "Token inválido o expirado"
}
```

### Testing Rápido

1. **Crear usuario de prueba** (si no existe):
   ```bash
   # Desde el admin panel o API
   ```

2. **Solicitar restablecimiento**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@ejemplo.com"}'
   ```

3. **Copiar token de la consola** (en desarrollo)

4. **Restablecer contraseña**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{
       "token":"TOKEN_DE_LA_CONSOLA",
       "email":"test@ejemplo.com",
       "password":"nueva123"
     }'
   ```

### Configuración de Email para Producción

**Opción 1: SendGrid**
```env
SENDGRID_API_KEY=tu_api_key
FROM_EMAIL=noreply@speaklyplan.com
```

**Opción 2: Resend**
```env
RESEND_API_KEY=tu_api_key
FROM_EMAIL=noreply@speaklyplan.com
```

Luego descomentar el código correspondiente en `lib/email.ts`.

### Seguridad

✅ Tokens hasheados con SHA-256  
✅ Expiración de 1 hora  
✅ Un solo uso por token  
✅ Contraseñas hasheadas con bcrypt  
✅ Mensajes genéricos (no revela si email existe)  
✅ Validación de entrada  

### Troubleshooting

**Problema**: No se recibe el email
- **Desarrollo**: Revisa la consola del servidor
- **Producción**: Verifica configuración de email y variables de entorno

**Problema**: Token inválido o expirado
- Solicita un nuevo enlace
- Verifica que no haya pasado más de 1 hora
- Verifica que no se haya usado ya el token

**Problema**: Error al actualizar contraseña
- Verifica que la contraseña tenga mínimo 6 caracteres
- Verifica que las contraseñas coincidan
- Revisa logs del servidor para más detalles

## Páginas Disponibles

- `/auth/login` - Login (con enlace a forgot password)
- `/auth/register` - Registro
- `/auth/forgot-password` - Solicitar restablecimiento
- `/auth/reset-password?token=X&email=Y` - Establecer nueva contraseña

## Flujo Visual

```
┌─────────────┐
│   Login     │
│             │
│ ¿Olvidaste? │──────┐
└─────────────┘      │
                     ▼
              ┌─────────────┐
              │   Forgot    │
              │  Password   │
              │             │
              │ Ingresar    │
              │   Email     │
              └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │   Email     │
              │   Enviado   │
              └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │ Verificar   │
              │   Email     │
              └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │   Reset     │
              │  Password   │
              │             │
              │   Nueva     │
              │ Contraseña  │
              └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │   ¡Éxito!   │
              │             │
              │ → Login     │
              └─────────────┘
```

---

**Documentación completa**: Ver `SISTEMA_RESTABLECER_CONTRASEÑA.md`
