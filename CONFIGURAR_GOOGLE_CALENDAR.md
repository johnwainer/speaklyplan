
# 🗓️ Configurar Google Calendar para Prácticas 1 a 1

**IMPORTANTE:** El sistema de Prácticas 1 a 1 funciona sin Google Calendar, pero la integración agrega funcionalidades premium:
- ✅ Links de Google Meet generados automáticamente
- ✅ Recordatorios por email (24h, 1h, 10min antes)
- ✅ Eventos sincronizados en Calendar de ambos usuarios
- ✅ Manejo automático de zonas horarias

---

## 📋 Guía Rápida de Configuración

### Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto:
   - Click en el selector de proyectos (arriba)
   - Click en "New Project"
   - Nombre: **SpeaklyPlan Calendar**
   - Click "Create"

### Paso 2: Habilitar Google Calendar API

1. En el menú lateral → "APIs & Services" → "Library"
2. Busca: **Google Calendar API**
3. Click en el resultado
4. Click "Enable"

### Paso 3: Configurar OAuth Consent Screen

1. Ve a "APIs & Services" → "OAuth consent screen"
2. Selecciona **External** (para permitir que cualquier usuario se conecte)
3. Click "Create"

4. **Configurar App**:
   - App name: `SpeaklyPlan`
   - User support email: tu email
   - App logo: (opcional)
   - App domain → Application home page: `https://speaklyplan.abacusai.app`
   - Authorized domains: `abacusai.app`
   - Developer contact information: tu email
   - Click "Save and Continue"

5. **Scopes** (NO agregues nada aquí, se manejan automáticamente):
   - Click "Save and Continue"

6. **Test users** (Importante para testing):
   - Click "Add Users"
   - Agrega tu email y el de otros testers
   - Click "Save and Continue"

7. Click "Back to Dashboard"

### Paso 4: Crear Credenciales OAuth 2.0

1. Ve a "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"

3. **Configurar Client ID**:
   - Application type: **Web application**
   - Name: **SpeaklyPlan Calendar Integration**
   
4. **Authorized redirect URIs** (CRÍTICO):
   ```
   https://speaklyplan.abacusai.app/api/auth/google-calendar/callback
   ```
   ⚠️ **IMPORTANTE:** La URL debe ser EXACTAMENTE esta, sin espacios ni caracteres extra.

5. Click "Create"

6. **Copiar credenciales**:
   - Verás una ventana con:
     - **Client ID**: Empieza con números-letras.apps.googleusercontent.com
     - **Client Secret**: Empieza con GOCSPX-
   - Copia ambos (los necesitarás en el siguiente paso)

### Paso 5: Agregar Variables de Entorno

**OPCIÓN A: Usar la UI de Abacus (Recomendado)**

1. Ve a la configuración del proyecto en Abacus
2. Busca "Environment Variables"
3. Agrega:
   ```
   GOOGLE_CLIENT_ID = [tu Client ID aquí]
   GOOGLE_CLIENT_SECRET = [tu Client Secret aquí]
   ```
4. Guarda y redeploy la aplicación

**OPCIÓN B: Editar .env manualmente**

1. SSH al servidor o accede al proyecto
2. Edita el archivo .env:
   ```bash
   cd /home/ubuntu/speaklyplan/nextjs_space
   nano .env
   ```

3. Agrega al final:
   ```env
   # Google Calendar API
   GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMn
   ```
   ⚠️ Reemplaza con tus credenciales reales

4. Guarda (Ctrl+X, Y, Enter)

5. Redeploy o reinicia la app

### Paso 6: Verificar Configuración

1. Ve a https://speaklyplan.abacusai.app/practice
2. Deberías ver un banner azul: "Mejora tu experiencia con Google Calendar"
3. Click en "Conectar Google Calendar"
4. Se abre ventana de Google → Inicia sesión
5. Acepta los permisos
6. La ventana se cierra automáticamente
7. ✅ Verás "Google Calendar Conectado"

---

## ✅ Verificar que Funciona

### Test Completo

1. **Conectar Calendar** (ya hecho en Paso 6)

2. **Invitar a otro usuario**:
   - Click "Nueva Invitación"
   - Email: otro usuario de prueba
   - Enviar

3. **Que el otro usuario acepte** (en su cuenta)

4. **Programar sesión**:
   - Tab "Compañeros"
   - Click "Programar"
   - Selecciona fecha y hora
   - Tema: "Test de Calendar"
   - ✓ Marca "Crear evento en Google Calendar"
   - Click "Programar Sesión"

5. **Verificar en Google Calendar**:
   - Abre https://calendar.google.com
   - Deberías ver el evento "🎤 Práctica de Inglés: Test de Calendar"
   - Click en el evento → Deberías ver un link de Google Meet
   - El otro usuario también debería tener el evento

6. **Verificar Recordatorios**:
   - Si la sesión es en 24 horas, ambos recibirán un email
   - 1 hora antes: notificación
   - 10 minutos antes: notificación

---

## 🐛 Solución de Problemas

### Error: "Redirect URI mismatch"

**Causa:** La URL de callback no coincide con la registrada en Google.

**Solución:**
1. Ve a Google Cloud Console → Credentials
2. Click en tu OAuth 2.0 Client ID
3. Verifica que la URI sea EXACTAMENTE:
   ```
   https://speaklyplan.abacusai.app/api/auth/google-calendar/callback
   ```
4. Si no coincide, edítala y guarda
5. Espera 5 minutos para que Google propague los cambios
6. Intenta conectar de nuevo

### Error: "Access blocked: SpeaklyPlan has not completed Google verification"

**Causa:** La app está en modo "Testing" y el usuario no está en la lista de test users.

**Solución:**
1. Ve a OAuth consent screen
2. Scroll hasta "Test users"
3. Click "Add Users"
4. Agrega el email del usuario
5. Guarda
6. El usuario puede intentar de nuevo inmediatamente

### Error: "Calendar API has not been enabled"

**Causa:** Google Calendar API no está habilitada.

**Solución:**
1. Ve a APIs & Services → Library
2. Busca "Google Calendar API"
3. Click "Enable"
4. Espera 1 minuto
5. Intenta de nuevo

### No aparece el banner de "Conectar Google Calendar"

**Causa:** Las variables de entorno no están configuradas.

**Solución:**
1. Verifica que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` estén en .env
2. Reinicia la aplicación
3. Limpia caché del navegador
4. Recarga la página /practice

### El link de Meet no se genera

**Causa 1:** El usuario no conectó Google Calendar

**Solución:** Conectar Google Calendar primero (banner azul)

**Causa 2:** Los permisos de Calendar no fueron otorgados

**Solución:**
1. Ve a https://myaccount.google.com/permissions
2. Busca "SpeaklyPlan"
3. Si no aparece o está revocado:
   - Reconecta Google Calendar desde /practice
   - Acepta TODOS los permisos solicitados

---

## 📊 Límites y Costos

### Google Calendar API

- ✅ **100% GRATUITO**
- ✅ **Sin límites** de eventos creados
- ✅ **Sin límites** de usuarios
- ✅ **Sin costos ocultos**

### Cuota de Uso (Gratuita)

- Quota: **1,000,000 requests/día**
- Reset: Diario (medianoche UTC)
- Límite por usuario: **10,000 requests/día**

**Para referencia:**
- Crear 1 sesión = 1 request
- Ver disponibilidad = 1 request
- 100 usuarios creando 5 sesiones/día = 500 requests/día
- Muy por debajo del límite gratuito

---

## 🔐 Seguridad

### Datos Almacenados

En la base de datos guardamos:
```
CalendarIntegration
├─ userId (referencia al usuario)
├─ provider ("google")
├─ accessToken (encriptado)
├─ refreshToken (encriptado)
└─ expiresAt (fecha de expiración)
```

### Permisos Solicitados

Solo pedimos lo mínimo necesario:
- ✅ Ver eventos de tu calendar
- ✅ Crear eventos nuevos
- ✅ Editar eventos creados por SpeaklyPlan

❌ NO pedimos:
- Acceso a Gmail
- Acceso a Drive
- Acceso a otros servicios de Google

### Refresh Automático

El sistema refresca automáticamente los tokens antes de que expiren:
- Tokens expiran cada 1 hora
- Sistema los refresca automáticamente
- Usuario nunca necesita reconectar (a menos que revoque permisos)

---

## 📝 Notas Importantes

1. **Modo Testing**: Por defecto, la app está en modo "Testing". Solo usuarios en la lista de "Test users" pueden conectar. Para producción, necesitarás enviar la app a verificación de Google (proceso separado).

2. **Zona Horaria**: Todos los eventos se crean en `America/Bogota`. Si necesitas otra zona horaria, edita `lib/services/google-calendar-service.ts`.

3. **Duración**: Por defecto, las sesiones son de 30 minutos. Se puede cambiar en el modal de programación.

4. **Recordatorios**: Los recordatorios se envían automáticamente por Google (24h, 1h, 10min antes). No se pueden personalizar sin perder la automatización.

5. **Sin Calendar**: Si un usuario NO conecta Google Calendar, puede programar sesiones manualmente agregando links de Zoom/Meet/etc. El sistema sigue funcionando.

---

## ✅ Checklist de Configuración

Usa este checklist para verificar que todo esté configurado:

- [ ] Proyecto creado en Google Cloud Console
- [ ] Google Calendar API habilitada
- [ ] OAuth consent screen configurado
- [ ] Test users agregados
- [ ] OAuth 2.0 Client ID creado
- [ ] Redirect URI configurada correctamente
- [ ] Client ID copiado
- [ ] Client Secret copiado
- [ ] Variables de entorno agregadas
- [ ] Aplicación redeployada/reiniciada
- [ ] Banner "Conectar Google Calendar" aparece en /practice
- [ ] Conexión exitosa (botón cambia a "Google Calendar Conectado")
- [ ] Sesión de prueba programada
- [ ] Evento aparece en Google Calendar
- [ ] Link de Meet funciona
- [ ] Recordatorios programados

---

## 🎯 Resultado Final

Cuando todo esté configurado:

1. Usuario conecta Google Calendar (una sola vez)
2. Programa sesión con compañero
3. Sistema automáticamente:
   - ✅ Crea evento en Calendar de ambos
   - ✅ Genera link de Google Meet
   - ✅ Programa recordatorios
   - ✅ Envía emails de confirmación
4. Ambos usuarios reciben:
   - 📧 Email confirmación
   - 📅 Evento en su Calendar
   - 🔔 Recordatorios automáticos
5. A la hora de la sesión:
   - Click en "Unirse a la sesión"
   - Se abre Google Meet
   - Practican inglés en tiempo real
6. Después:
   - Sesión se guarda en historial
   - Pueden calificar mutuamente

---

**¿Necesitas ayuda?**

Si tienes problemas, revisa la sección "Solución de Problemas" arriba o contacta soporte.

---

**Última actualización:** 17 de octubre de 2025  
**Versión del sistema:** 2.0 (Prácticas 1 a 1 + Google Calendar)

---
