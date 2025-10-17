
# 🔧 Comparativa de Herramientas para Agendamiento Automático

**Proyecto:** SpeaklyPlan - Prácticas 1 a 1  
**Fecha:** 17 de octubre de 2025  
**Objetivo:** Evaluar opciones para agendamiento automático de sesiones

---

## 📊 Resumen Ejecutivo

| Herramienta | Costo | Complejidad | Meet Links | Recomendación |
|-------------|-------|-------------|------------|---------------|
| **Google Calendar API** | Gratis | Media | ✅ Automático | ⭐⭐⭐⭐⭐ |
| Calendly | Gratis/Pago | Baja | ✅ Integra | ⭐⭐⭐ |
| Cal.com | Gratis | Media-Alta | ✅ Integra | ⭐⭐⭐⭐ |
| Daily.co (Video) | Gratis | Baja | ✅ Nativo | ⭐⭐⭐⭐⭐ |
| Jitsi Meet | Gratis | Alta | ✅ Nativo | ⭐⭐⭐ |
| Zoom API | Pago | Media | ✅ Nativo | ⭐⭐ |

---

## 🗓️ Opciones para Agendamiento

### 1. Google Calendar API ⭐⭐⭐⭐⭐

**Descripción:**
API oficial de Google para crear eventos en Google Calendar y generar links de Google Meet.

#### ✅ Ventajas
- **100% gratuito** sin límites
- **Links de Meet automáticos** incluidos
- **Recordatorios nativos** (email, push)
- **Sincronización** con calendario personal
- **Familiar** para todos los usuarios
- **Confiable** (infraestructura de Google)
- **API bien documentada**
- **Manejo de timezones** automático
- **Reprogramación fácil**

#### ❌ Desventajas
- Requiere OAuth (un paso extra para el usuario)
- Curva de aprendizaje media (setup inicial)
- Depende de que usuario tenga cuenta Google

#### 💰 Costo
- **Gratis:** Sin límites de eventos
- **Infraestructura:** $0 (Google hostea todo)

#### 🛠️ Implementación
```bash
# Complejidad: Media
# Tiempo: 1-2 días
# Dependencias: googleapis

yarn add googleapis
```

**Setup:**
1. Crear proyecto en Google Cloud Console
2. Habilitar Calendar API
3. Crear credenciales OAuth 2.0
4. Implementar flujo de autorización
5. Almacenar tokens en BD

**Código básico:**
```typescript
import { google } from 'googleapis'

const calendar = google.calendar({ version: 'v3', auth })
await calendar.events.insert({
  calendarId: 'primary',
  conferenceDataVersion: 1,
  requestBody: {
    summary: 'Práctica de Inglés',
    start: { dateTime: '2025-10-20T15:00:00-05:00' },
    end: { dateTime: '2025-10-20T15:30:00-05:00' },
    conferenceData: {
      createRequest: { conferenceSolutionKey: { type: 'hangoutsMeet' } }
    }
  }
})
```

#### 📈 Capacidad
- **Eventos:** Ilimitados
- **Meet links:** Ilimitados
- **Participantes por Meet:** Hasta 100 (gratis), 250+ (Workspace)

#### 🎯 Mejor para
- Usuarios con cuenta Gmail/Google
- Integración profunda con ecosistema del usuario
- Recordatorios automáticos críticos
- Budget $0

#### ⚠️ Consideraciones
- Usuario debe autorizar una vez (OAuth)
- Si usuario no tiene Google, usar opción manual

---

### 2. Calendly ⭐⭐⭐

**Descripción:**
Plataforma SaaS para scheduling con página de reserva personalizada.

#### ✅ Ventajas
- **UI lista para usar** (no programar)
- **Integración simple** (embed o API)
- **Múltiples calendarios** (Google, Outlook, iCal)
- **Buffer times** y zona horaria automática
- **Gratis hasta cierto punto**

#### ❌ Desventajas
- **Experiencia externa** (sale de tu plataforma)
- **Menos control** sobre UI/UX
- **Límites en plan gratuito:**
  - 1 tipo de evento activo
  - Solo integraciones básicas
  - Sin personalización avanzada
- **Plan Pro:** $12/mes por usuario

#### 💰 Costo
- **Free:** 1 evento, integraciones básicas
- **Essentials:** $10/mes
- **Professional:** $16/mes
- **Teams:** $16/mes por usuario

#### 🛠️ Implementación
```typescript
// Generar link de scheduling
const link = `https://calendly.com/${username}/${eventType}`

// O usar API (plan pago)
await calendly.createSchedulingLink({
  event_type: 'practice-1-1',
  duration: 30
})
```

#### 📈 Capacidad
- **Free:** 1 evento activo, ilimitadas reservas
- **Pro:** Eventos ilimitados

#### 🎯 Mejor para
- MVP rápido sin programar
- Usuarios no técnicos
- No quieres manejar disponibilidad

#### ⚠️ Consideraciones
- Usuario sale de tu plataforma
- Menos personalización
- Necesitas plan pago para API

---

### 3. Cal.com ⭐⭐⭐⭐

**Descripción:**
Alternativa open-source a Calendly, puedes hostear o usar SaaS.

#### ✅ Ventajas
- **Open source** (self-host gratis)
- **API completa** en plan gratuito
- **Más control** que Calendly
- **Embed personalizable**
- **Integraciones:** Google, Zoom, Meet, Teams

#### ❌ Desventajas
- **Self-hosting:** Requiere servidor y mantenimiento
- **SaaS:** Más caro que Calendly
- **Menos maduro** (producto más nuevo)
- **Documentación:** Menos completa

#### 💰 Costo
- **Self-hosted:** Gratis (pero requiere servidor ~$5-10/mes)
- **SaaS Free:** Limitado
- **SaaS Pro:** $12/mes

#### 🛠️ Implementación
```bash
# Self-hosted
docker run -p 3000:3000 calcom/cal.com

# O usar API SaaS
yarn add @calcom/sdk
```

#### 📈 Capacidad
- **Self-hosted:** Ilimitado
- **SaaS:** Similar a Calendly

#### 🎯 Mejor para
- Equipos técnicos
- Quieres control total
- No quieres depender de SaaS

#### ⚠️ Consideraciones
- Self-hosting requiere DevOps
- SaaS no es más barato que Calendly

---

## 🎥 Opciones para Video

### 4. Daily.co ⭐⭐⭐⭐⭐

**Descripción:**
Plataforma WebRTC con API simple para video/audio integrado.

#### ✅ Ventajas
- **10,000 minutos/mes gratis** (~166 horas)
- **API súper simple** (5 líneas de código)
- **Embed en tu plataforma** (no sale el usuario)
- **Calidad excelente** (WebRTC optimizado)
- **Screen share, chat, recording**
- **No requiere instalación** (browser-based)

#### ❌ Desventajas
- Plan gratis limita a 10K minutos
- Después: $0.008/min (~$0.48/hora)
- Branding "Daily" en plan gratis

#### 💰 Costo
- **Starter:** Gratis hasta 10K min/mes
- **Growth:** $99/mes (100K min incluidos)
- **Pay-as-you-go:** $0.008/min

**Ejemplo cálculo:**
- 30 sesiones/día × 30min × 30 días = 27,000 min/mes
- Costo: ~$13.50/mes extra (sobre los 10K gratis)

#### 🛠️ Implementación
```typescript
import Daily from '@daily-co/daily-js'

// Crear sala
const response = await fetch('https://api.daily.co/v1/rooms', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${DAILY_API_KEY}` },
  body: JSON.stringify({
    name: 'practice-session-123',
    privacy: 'private',
    properties: { max_participants: 2 }
  })
})

// Frontend
const callFrame = Daily.createFrame()
callFrame.join({ url: 'https://yourdomain.daily.co/session-123' })
```

#### 📈 Capacidad
- **Participants:** Hasta 200 por sala
- **Duration:** Ilimitada por sesión
- **Rooms:** Ilimitadas

#### 🎯 Mejor para
- Video integrado en tu app
- Experiencia seamless
- Budget razonable

#### ⚠️ Consideraciones
- Monitorear uso mensual
- Escalar a plan pago si creces

---

### 5. Jitsi Meet ⭐⭐⭐

**Descripción:**
Solución open-source de video conferencia, 100% gratuita.

#### ✅ Ventajas
- **100% gratis** (self-host o public servers)
- **Open source**
- **No límites** de participantes o tiempo
- **Screen share, chat, recording**
- **No requiere cuenta**

#### ❌ Desventajas
- **Self-hosting:** Requiere servidor potente + expertise
- **Public servers:** Calidad variable, no confiable para producción
- **Setup complejo** (Jitsi + Jicofo + Jitsi Videobridge)
- **UI menos pulida** que Daily/Zoom

#### 💰 Costo
- **Self-hosted:** $20-50/mes (servidor Linode/DigitalOcean)
- **Public Jitsi:** Gratis pero no confiable

#### 🛠️ Implementación
```typescript
// Usar public Jitsi
const domain = 'meet.jit.si'
const options = {
  roomName: 'SpeaklyPlan_Session_123',
  width: '100%',
  height: 600,
  parentNode: document.getElementById('jitsi-container')
}
const api = new JitsiMeetExternalAPI(domain, options)
```

#### 📈 Capacidad
- **Ilimitado** (self-hosted)
- **Public Jitsi:** No garantizado

#### 🎯 Mejor para
- Budget $0 estricto
- Equipo DevOps fuerte
- Control total de infraestructura

#### ⚠️ Consideraciones
- Self-hosting no trivial
- Public servers no para producción

---

### 6. Zoom API ⭐⭐

**Descripción:**
API oficial de Zoom para crear meetings programáticos.

#### ✅ Ventajas
- **Marca conocida** (usuarios confían)
- **Calidad excelente**
- **Apps nativas** (mejor que browser)
- **Recording nativo**

#### ❌ Desventajas
- **Pago desde el inicio:** $14.99/mes/host mínimo
- **Por host, no por uso** (menos flexible)
- **Sale de tu plataforma** (app externa)
- **API compleja**

#### 💰 Costo
- **Basic:** Gratis pero sin API
- **Pro:** $14.99/mes/host (necesitas API)
- **Business:** $19.99/mes/host

**Ejemplo:**
- 10 hosts × $15/mes = $150/mes

#### 🛠️ Implementación
```typescript
const zoom = require('zoom-node')
const meeting = await zoom.meetings.create({
  topic: 'Práctica de Inglés',
  type: 2, // Scheduled
  start_time: '2025-10-20T15:00:00Z',
  duration: 30
})
```

#### 🎯 Mejor para
- Empresas con presupuesto
- Ya usan Zoom internamente
- Necesitan recording profesional

#### ⚠️ Consideraciones
- Más caro que otras opciones
- Usuarios salen de tu app

---

## 🏆 Recomendaciones por Caso de Uso

### Caso 1: Startup (Budget $0)
**Recomendación:**
- **Agendamiento:** Google Calendar API
- **Video:** Daily.co (10K min gratis)

**Justificación:**
- Sin costo hasta escalar
- Experiencia profesional
- Control total

**Setup:**
1. Google Calendar para eventos + Meet links
2. Daily.co para video integrado (alternativa)
3. Monitorear uso; escalar cuando sea necesario

---

### Caso 2: MVP Rápido (Menos código)
**Recomendación:**
- **Agendamiento:** Calendly (embed)
- **Video:** Google Meet (desde Calendar)

**Justificación:**
- Menos código que escribir
- UI lista para usar
- Funciona día 1

**Trade-offs:**
- Menos control
- Experiencia externa

---

### Caso 3: Escalabilidad (Crecimiento esperado)
**Recomendación:**
- **Agendamiento:** Google Calendar API
- **Video:** Daily.co → Plan Growth cuando crezcas

**Justificación:**
- Infraestructura confiable
- Pricing predecible
- Fácil de escalar

---

### Caso 4: Control Total (Self-hosted)
**Recomendación:**
- **Agendamiento:** Custom + Google Calendar sync
- **Video:** Jitsi self-hosted

**Justificación:**
- Propiedad completa
- Sin límites externos
- Privacidad total

**Trade-offs:**
- Requiere DevOps
- Mantenimiento continuo

---

## 📊 Matriz de Decisión

| Criterio | Google Calendar | Calendly | Cal.com | Daily.co | Jitsi | Zoom |
|----------|----------------|----------|---------|----------|-------|------|
| **Costo $0** | ✅ | ⚠️ (limitado) | ⚠️ (self-host) | ✅ (10K min) | ✅ (self-host) | ❌ |
| **Fácil setup** | ⚠️ (OAuth) | ✅ | ⚠️ | ✅ | ❌ | ⚠️ |
| **Control UI** | ✅ | ❌ | ⚠️ | ✅ | ✅ | ❌ |
| **Meet links** | ✅ Auto | ✅ Integra | ✅ Integra | ✅ Nativo | ✅ Nativo | ✅ Nativo |
| **Recordatorios** | ✅ Nativo | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Escalabilidad** | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| **Familiaridad** | ✅ | ⚠️ | ❌ | ⚠️ | ⚠️ | ✅ |
| **Mantenimiento** | Bajo | Bajo | Alto | Bajo | Alto | Bajo |

---

## 🎯 Recomendación Final para SpeaklyPlan

### Fase 1: MVP (Mes 1)
```
Agendamiento: Google Calendar API
Video: Google Meet (desde Calendar)
```

**Por qué:**
- $0 costo
- Usuarios ya tienen Gmail
- Meet links automáticos
- Recordatorios gratis
- Profesional desde día 1

### Fase 2: Optimización (Mes 2-3)
```
Agendamiento: Google Calendar API (mantener)
Video: Daily.co integrado
```

**Por qué:**
- Mejorar UX (no salir de plataforma)
- Métricas automáticas
- $0 hasta 10K min/mes

### Fase 3: Escala (Mes 4+)
```
Agendamiento: Google Calendar API (mantener)
Video: Daily.co Growth plan
```

**Por qué:**
- Si superas 10K min/mes = $99/mes
- Pricing predecible
- Infraestructura confiable

---

## 💰 Proyección de Costos

### Año 1 (100 usuarios activos)

**Escenario conservador:**
- 30 sesiones/mes × 25 min promedio = 750 min/mes
- **Costo:** $0 (bajo límite de 10K)

**Escenario moderado:**
- 100 sesiones/mes × 25 min = 2,500 min/mes
- **Costo:** $0 (bajo límite de 10K)

**Escenario alto:**
- 500 sesiones/mes × 25 min = 12,500 min/mes
- **Costo:** $99/mes (plan Growth) o $20/mes pay-as-you-go

### Año 2 (500 usuarios activos)

**Escenario conservador:**
- 1,000 sesiones/mes × 25 min = 25,000 min/mes
- **Costo:** $99/mes (Growth)

**Escenario alto:**
- 3,000 sesiones/mes × 25 min = 75,000 min/mes
- **Costo:** $99/mes (Growth incluye 100K)

---

## ✅ Conclusión

### Para SpeaklyPlan, la mejor combinación es:

**🥇 Opción Recomendada:**
```
Agendamiento: Google Calendar API ✅
Video: Daily.co (start free → Growth) ✅
```

**Justificación:**
1. **$0 para empezar** (crítico en MVP)
2. **Escalable** cuando creces
3. **Experiencia premium** (todo integrado)
4. **Mantenimiento bajo**
5. **Usuarios contentos** (familiar + profesional)

**Inversión total primer año:**
- Desarrollo: 3-4 días
- Infraestructura: $0-99/mes (según crecimiento)
- ROI: Alto (engagement +40%)

---

## 📋 Checklist de Implementación

### Sprint 1 (Google Calendar)
- [ ] Crear proyecto en Google Cloud Console
- [ ] Habilitar Calendar API
- [ ] Generar credenciales OAuth 2.0
- [ ] Implementar flujo de autorización
- [ ] Crear servicio de Calendar
- [ ] Testear creación de eventos + Meet links

### Sprint 2 (Daily.co)
- [ ] Crear cuenta en Daily.co
- [ ] Obtener API key
- [ ] Implementar creación de salas
- [ ] Integrar componente de video
- [ ] Testear flujo completo
- [ ] Monitorear uso mensual

---

**Próximo paso:** Implementar Google Calendar API (Sprint 1)

¿Listo para empezar? 🚀
