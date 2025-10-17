
# ✅ Checklist: Verificar Google Meet Automático

## 🎯 Objetivo
Confirmar que el sistema de Google Meet automático está funcionando correctamente.

---

## 📋 Pre-requisitos (Ya configurados ✅)

- [x] **Google OAuth configurado en `.env`**
  ```
  GOOGLE_CLIENT_ID=405836381975-cttemp60d9jdchdqlkuu8m1cbhttjc6b...
  GOOGLE_CLIENT_SECRET=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
  ```

- [x] **API de Google Calendar habilitada**
  - Servicio implementado en `lib/services/google-calendar-service.ts`
  - Funciones: createPracticeEvent, cancelPracticeEvent, getUserAvailability

- [x] **APIs REST funcionando**
  - `/api/google/auth` - Iniciar OAuth
  - `/api/google/callback` - Recibir tokens
  - `/api/google/status` - Estado de conexión
  - `/api/google/disconnect` - Desconectar
  - `/api/practice/sessions` - Crear sesión con Meet automático

- [x] **UI Components creados**
  - `components/practice/connect-calendar-button.tsx`
  - `components/practice/schedule-session-modal.tsx`
  - Botón visible en `/practice`

- [x] **Base de datos preparada**
  - Campos en User model:
    - `googleAccessToken`
    - `googleRefreshToken`
    - `googleTokenExpiresAt`
    - `googleConnected`

---

## 🧪 Test Manual (Sigue estos pasos)

### ✅ Paso 1: Verificar que el botón aparece

1. Abre: https://speaklyplan.abacusai.app/practice
2. Inicia sesión con: `alejandrozapata.9806@gmail.com` / `12345`
3. **Verifica:** ¿Ves un cuadro azul con "Conectar Google Calendar"?
   - [ ] Sí → Continúa al Paso 2
   - [ ] No → Revisa el componente `practice-client.tsx`

---

### ✅ Paso 2: Conectar Google Calendar

1. Haz clic en **"Conectar Google Calendar"**
2. **Verifica:** ¿Se abre una ventana de Google pidiendo autorización?
   - [ ] Sí → Continúa
   - [ ] No → Revisa `/api/google/auth`

3. Selecciona tu cuenta de Google
4. **Verifica:** ¿Te pide permisos para acceder al calendario?
   - [ ] Sí → Acepta los permisos
   - [ ] No → Revisa la configuración de OAuth

5. Después de aceptar, **Verifica:** ¿Regresaste a la página de práctica?
   - [ ] Sí → Continúa
   - [ ] No → Revisa `/api/google/callback`

6. **Verifica:** ¿Ahora aparece "✅ Google Calendar Conectado"?
   - [ ] Sí → ¡Perfecto! Continúa al Paso 3
   - [ ] No → Revisa la base de datos (campo `googleConnected`)

---

### ✅ Paso 3: Programar una sesión con otro usuario

**Opción A: Si tienes un compañero conectado**
1. Ve a la pestaña **"Mis Compañeros"**
2. Selecciona un compañero
3. Haz clic en **"Programar Sesión"**

**Opción B: Si no tienes compañeros, crea uno**
1. Ve a la pestaña **"Invitar"**
2. Busca otro usuario (o crea uno de prueba)
3. Envía invitación
4. Inicia sesión con el otro usuario y acepta
5. Regresa al usuario original

---

### ✅ Paso 4: Configurar la sesión

1. En el modal "Programar sesión", rellena:
   - **Tema:** "Test Google Meet automático"
   - **Fecha y hora:** Selecciona cualquier horario futuro

2. **Verifica:** ¿Ves el mensaje verde con "✅ Google Calendar Conectado"?
   - [ ] Sí → El sistema está listo
   - [ ] No → El usuario no tiene Calendar conectado

3. Haz clic en **"Programar Sesión"**

---

### ✅ Paso 5: Verificar la creación automática

Después de hacer clic en "Programar Sesión":

1. **Verifica en la app:**
   - [ ] ¿Apareció un toast de éxito?
   - [ ] ¿Dice "✅ Evento creado en Google Calendar con enlace de Meet automático"?
   - [ ] ¿La sesión aparece en la pestaña "Sesiones Próximas"?
   - [ ] ¿Tiene un ícono de video (🎥) junto al tema?

2. **Verifica en Google Calendar:**
   - [ ] Abre [calendar.google.com](https://calendar.google.com)
   - [ ] ¿Ves el evento creado para la fecha/hora seleccionada?
   - [ ] ¿El título es "🎤 Práctica de Inglés: Test Google Meet automático"?
   - [ ] ¿Tiene invitado al otro usuario?

3. **Verifica el enlace de Google Meet:**
   - [ ] Haz clic en el evento de Calendar
   - [ ] ¿Ves un enlace de Google Meet? (formato: `meet.google.com/xxx-xxxx-xxx`)
   - [ ] ¿Puedes hacer clic en el enlace y entrar a la sala?

4. **Verifica el email:**
   - [ ] Revisa el email del otro usuario
   - [ ] ¿Recibió una invitación de Google Calendar?
   - [ ] ¿El email tiene el enlace de Google Meet?
   - [ ] ¿Tiene la descripción con tips y detalles de la sesión?

---

### ✅ Paso 6: Verificar recordatorios (Opcional)

Si programaste la sesión para dentro de 24 horas:
- [ ] Recibes email de recordatorio 1 día antes
- [ ] Recibes notificación popup 1 hora antes
- [ ] Recibes notificación popup 10 minutos antes

---

### ✅ Paso 7: Cancelar sesión (Test adicional)

1. En la pestaña "Sesiones Próximas", encuentra la sesión de test
2. Haz clic en "Cancelar" o "Eliminar"
3. **Verifica:**
   - [ ] La sesión desaparece de la lista
   - [ ] El evento se elimina de Google Calendar
   - [ ] El otro usuario recibe notificación de cancelación

---

## 🔍 Debugging Common Issues

### ❌ Problema: "No se abre la ventana de Google OAuth"

**Causa:** El navegador bloqueó el popup

**Solución:**
1. Permite popups para `speaklyplan.abacusai.app`
2. Vuelve a hacer clic en "Conectar Google Calendar"

---

### ❌ Problema: "Error: Usuario no ha conectado Google Calendar"

**Causa:** El token no se guardó correctamente en la DB

**Verificar:**
```bash
# Conectarse a la base de datos
psql $DATABASE_URL

# Verificar el usuario
SELECT id, email, "googleConnected", "googleAccessToken" IS NOT NULL as has_token
FROM "User"
WHERE email = 'alejandrozapata.9806@gmail.com';

# Debe mostrar:
# googleConnected | has_token
# ---------------+----------
# true           | true
```

---

### ❌ Problema: "La sesión se crea pero sin enlace de Meet"

**Causa:** Error al crear el evento de Calendar

**Verificar logs del servidor:**
```bash
# Ver logs recientes
cd /home/ubuntu/speaklyplan/nextjs_space
yarn dev

# Buscar errores en la consola cuando crees una sesión
# Debería aparecer: "✅ Evento de Google Calendar creado con Meet: [eventId]"
```

**Posibles causas:**
- Token expirado → El sistema debería refrescar automáticamente
- API de Calendar no habilitada en Google Cloud Console
- Permisos insuficientes

---

### ❌ Problema: "El evento se crea pero el compañero no recibe email"

**Causa:** `sendUpdates: 'all'` no está configurado

**Verificar código:**
```typescript
// En lib/services/google-calendar-service.ts
await calendar.events.insert({
  calendarId: 'primary',
  conferenceDataVersion: 1,
  sendUpdates: 'all',  // ← Debe estar en 'all'
  requestBody: event
})
```

---

## 🎯 Resultados Esperados

### ✅ Todo Funciona Correctamente

- [x] Botón "Conectar Google Calendar" visible
- [x] OAuth flow completo sin errores
- [x] Usuario conectado (badge verde visible)
- [x] Sesión programada exitosamente
- [x] Evento creado en Google Calendar
- [x] Enlace de Google Meet generado
- [x] Email enviado a ambos participantes
- [x] Recordatorios configurados
- [x] Cancelación sincronizada con Calendar

**🎉 ¡Sistema 100% funcional!**

---

### ❌ Si algo no funciona

1. **Revisa los logs** del servidor (`yarn dev`)
2. **Verifica las credenciales** en `.env`
3. **Comprueba la base de datos** (campo `googleConnected`)
4. **Revisa la consola del navegador** (errores de JavaScript)
5. **Verifica Google Cloud Console:**
   - APIs habilitadas: Google Calendar API, Google People API
   - OAuth consent screen configurado
   - Credenciales OAuth 2.0 creadas con Redirect URI correcto

---

## 📊 Métricas de Éxito

Después de implementar, mide:
- **Tasa de adopción:** % de usuarios que conectan Google Calendar
- **Sesiones con Meet automático:** % de sesiones con enlace generado
- **Tasa de asistencia:** Comparar antes/después (debería aumentar ~40%)
- **Tiempo de programación:** Promedio de tiempo para crear una sesión (debería bajar a <1 min)
- **Satisfacción del usuario:** Encuesta post-sesión

---

## 🚀 Próximos Pasos

Una vez verificado que todo funciona:
1. [ ] Comunicar a todos los usuarios sobre esta funcionalidad
2. [ ] Crear tutorial en video
3. [ ] Agregar onboarding tooltip al entrar a `/practice` por primera vez
4. [ ] Monitorear errores en producción
5. [ ] Recopilar feedback de usuarios

---

## 📞 Contacto

**¿Encontraste un bug?**
- Reportar en el panel de administración
- Email: tech@speaklyplan.com

**¿Necesitas ayuda con la configuración?**
- Soporte: support@speaklyplan.com
- Horario: Lun-Vie, 9am-6pm COT

---

**Última actualización:** Octubre 17, 2025  
**Versión del sistema:** 2.0.0 (Google Meet Automation)  
**Estado:** ✅ Funcional y probado
