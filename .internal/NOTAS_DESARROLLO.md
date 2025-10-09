
# NOTAS INTERNAS DE DESARROLLO

## ⚠️ DOCUMENTO INTERNO - NO EXPONER AL CLIENTE

---

## 📌 ESTADO ACTUAL DEL PROYECTO

**Fecha:** 09 de Octubre de 2025
**Última conversación:** Optimización de interfaz y guía de uso interactiva
**Último checkpoint:** "Guía de uso dinámica e interactiva"

### Funcionalidades Completadas

✅ **Sistema de Autenticación**
- Login/Register funcionando
- Sesiones con JWT
- Protección de rutas

✅ **Dashboard**
- Vista de progreso
- Calendario semanal
- Rachas y logros
- Logo clickeable que redirige a dashboard en todas las secciones

✅ **Tutor de IA**
- Chat conversacional con GPT-4o-mini
- Múltiples contextos (casual, meeting, interview, email, grammar)
- Corrección gramatical en tiempo real
- Traducción para principiantes
- Historial de conversaciones
- Detección de vocabulario usado
- Menu limpio sin duplicados

✅ **Sistema de Vocabulario**
- 8 categorías implementadas
- Sistema de repetición espaciada (SM-2)
- Progreso de aprendizaje
- Filtros por categoría y dificultad

✅ **Recursos Educativos**
- Curación de recursos
- Categorización
- Filtros funcionales

✅ **Guía de Uso Interactiva**
- Tutorial interactivo con pasos
- Checklist de primeros pasos
- Quiz de objetivos personalizados
- Planificador semanal interactivo
- Gráficos de progreso con Chart.js
- Videos demostrativos embebidos
- Tips contextuales animados
- Tarjetas interactivas con flip effect
- Tour guiado de la plataforma
- Animaciones con Framer Motion
- Celebraciones con canvas-confetti

✅ **Sistema de Gamificación**
- Puntos y niveles
- 12 logros diferentes
- Rachas de estudio
- Animaciones de celebración
- Modals de level up y achievements

✅ **Indicadores de Sección**
- Alineados a la izquierda en todas las secciones
- Consistencia visual en toda la app

---

## 🔧 CAMBIOS RECIENTES

### Cambio 1: Header Consistente en Tutor AI
- **Archivo:** `app/tutor/_components/tutor-client.tsx`
- **Cambio:** Reemplazados botones por nombre de usuario y logout
- **Motivo:** Consistencia con el resto de la aplicación
- **Fecha:** 08 Oct 2025

### Cambio 2: Logo Clickeable
- **Archivos:** Todos los headers en: tutor, dashboard, vocabulario, guia, recursos
- **Cambio:** Logo ahora es un Link que redirige a /dashboard
- **Motivo:** Mejora de navegación UX
- **Fecha:** 08 Oct 2025

### Cambio 3: Menu Tutor Limpio
- **Archivo:** `app/tutor/_components/tutor-client.tsx`
- **Cambio:** Eliminado botón "Ver Dashboard" del menú de contextos
- **Motivo:** Evitar duplicación, ya que el logo ya redirige
- **Fecha:** 08 Oct 2025

### Cambio 4: Indicadores Alineados a la Izquierda
- **Archivos:** tutor-client.tsx, dashboard-client.tsx, vocabulario-client.tsx, guia-client.tsx, recursos-client.tsx
- **Cambio:** `justify-start` en todos los indicadores de sección
- **Motivo:** Consistencia visual solicitada por el cliente
- **Fecha:** 08 Oct 2025

### Cambio 5: Guía de Uso Interactiva y Dinámica
- **Archivo:** `app/guia/_components/guia-client.tsx`
- **Cambios:**
  - Añadido tutorial interactivo paso a paso
  - Checklist de primeros pasos
  - Quiz de objetivos personalizados
  - Planificador semanal interactivo
  - Gráficos de progreso con Chart.js
  - Videos demostrativos embebidos
  - Tips contextuales animados
  - Tarjetas interactivas con flip
  - Tour guiado de la plataforma
- **Dependencias añadidas:**
  - `chart.js`: Para gráficos
  - `react-chartjs-2`: Wrapper de Chart.js para React
  - `canvas-confetti`: Para celebraciones
- **Estilos:** Añadidos estilos CSS para flip cards en `app/globals.css`
- **Motivo:** Cliente solicitó análisis completo de la app y mejora de la guía
- **Fecha:** 09 Oct 2025

---

## 🐛 ISSUES CONOCIDOS

### Issue 1: Dynamic Server Usage Warning
- **Ubicación:** `/api/tutor/context`
- **Descripción:** Warning en build sobre uso dinámico del servidor
- **Impacto:** Ninguno funcional, solo warning
- **Solución propuesta:** Refactorizar para evitar uso de headers
- **Prioridad:** Baja

### Issue 2: Carga Inicial Lenta de Vocabulario
- **Ubicación:** `/vocabulario`
- **Descripción:** Primera carga de vocabulario es lenta (200+ términos)
- **Impacto:** UX menor
- **Solución propuesta:** Implementar paginación o lazy loading
- **Prioridad:** Media

### Issue 3: Scroll en Chat del Tutor (Móvil)
- **Ubicación:** `/tutor`
- **Descripción:** Auto-scroll no funciona perfectamente en móvil
- **Impacto:** UX menor en móvil
- **Solución propuesta:** Mejorar lógica de scroll
- **Prioridad:** Baja

---

## 💡 IDEAS PARA FUTURO

### Idea 1: Modo Offline
- Implementar Service Workers
- Cache de conversaciones
- Sincronización cuando vuelva online

### Idea 2: Voice Input
- Integrar Speech-to-Text
- Permitir hablar en lugar de escribir
- Evaluación de pronunciación

### Idea 3: Estadísticas Avanzadas
- Dashboard de analíticas detallado
- Gráficos de progreso temporal
- Comparación con otros usuarios (anonimizada)

### Idea 4: Sistema de Amigos
- Agregar amigos
- Competir en rachas
- Ver progreso de amigos
- Chat entre usuarios

### Idea 5: Certificados
- Generar certificados al completar fases
- PDF descargable
- Shareable en LinkedIn

---

## 🔍 DETALLES TÉCNICOS IMPORTANTES

### Prisma Client Generation
```bash
# Siempre ejecutar después de cambios en schema.prisma
yarn prisma generate

# Output está en:
# /home/ubuntu/speaklyplan/nextjs_space/node_modules/.prisma/client
```

### Binary Targets en Prisma
```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]
  output = "/home/ubuntu/speaklyplan/nextjs_space/node_modules/.prisma/client"
}
```
**Nota:** El binary target `linux-musl-arm64-openssl-3.0.x` es necesario para deployment en Abacus AI.

### Configuración de NextAuth
```typescript
// IMPORTANTE: No cambiar NEXTAUTH_SECRET
// Cambiar romperá todas las sesiones activas
NEXTAUTH_SECRET="uZOsEmcOW56hBzgqzJ3Ut0MSaXG6JILQ"

// En producción, debe ser la URL del dominio
NEXTAUTH_URL="https://tu-dominio.com"
```

### API de Abacus AI
```typescript
// Endpoint
https://apps.abacus.ai/v1/chat/completions

// Headers requeridos
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
}

// Modelos disponibles
- gpt-4o-mini (default, usado en el proyecto)
- gpt-4o
- gpt-4-turbo
- claude-3-opus
// ... y más
```

### Límites y Cuotas
- **API de Abacus AI:** Sin límite explícito documentado, pero se recomienda rate limiting del lado del cliente
- **Base de Datos:** PostgreSQL en Abacus AI, sin límites conocidos para este proyecto
- **Build de Next.js:** Sin problemas de tamaño o tiempo

---

## 📊 MÉTRICAS DE DESARROLLO

### Líneas de Código (Aproximado)
- **Total:** ~15,000 líneas
- **TypeScript:** ~12,000 líneas
- **CSS:** ~1,500 líneas
- **Prisma Schema:** ~400 líneas
- **Config files:** ~1,100 líneas

### Archivos por Tipo
- **Componentes React:** ~80 archivos
- **API Routes:** 10 archivos
- **Pages:** 8 archivos
- **Utilidades:** 10 archivos
- **Servicios de IA:** 5 archivos

### Dependencias
- **Dependencies:** 81 paquetes
- **DevDependencies:** 13 paquetes
- **Total node_modules:** ~2,500 paquetes (con transitive deps)

### Tamaño del Build
- **Build total:** ~25 MB
- **Client bundle:** ~500 KB (comprimido)
- **Páginas estáticas:** 5
- **Páginas dinámicas:** 8

---

## 🎯 PRIORIDADES PARA PRÓXIMA CONVERSACIÓN

### Alta Prioridad
1. [ ] Resolver warning de Dynamic Server Usage
2. [ ] Optimizar carga de vocabulario
3. [ ] Implementar tests básicos

### Media Prioridad
4. [ ] Agregar más contextos de conversación al tutor
5. [ ] Mejorar analíticas de sesiones
6. [ ] Agregar export de progreso

### Baja Prioridad
7. [ ] Implementar modo oscuro completo
8. [ ] Agregar más animaciones
9. [ ] Optimizar para SEO

---

## 📝 NOTAS MISCELÁNEAS

### Convenciones de Código
- **Componentes:** PascalCase
- **Funciones:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Archivos de páginas:** kebab-case
- **Archivos de componentes:** PascalCase.tsx

### Estructura de Commits (Sugerida)
```
feat: Agregar nueva funcionalidad
fix: Corregir bug
docs: Actualizar documentación
style: Cambios de estilo (no afectan funcionalidad)
refactor: Refactorización de código
test: Agregar o modificar tests
chore: Tareas de mantenimiento
```

### Branching Strategy (Sugerida)
```
main: Producción
develop: Desarrollo principal
feature/*: Nuevas funcionalidades
fix/*: Corrección de bugs
hotfix/*: Correcciones urgentes en producción
```

### Testing Strategy (Pendiente de Implementación)
- **Unit tests:** Jest + React Testing Library
- **Integration tests:** Playwright
- **E2E tests:** Playwright
- **Coverage target:** 80%

---

## 🔐 CREDENCIALES DE DESARROLLO

### Usuario de Prueba
```
Email: test@speaklyplan.com
Password: Test123!
```

### Base de Datos (PostgreSQL)
```
Host: db-f7dfd0c44.db002.hosteddb.reai.io
Port: 5432
Database: f7dfd0c44
User: role_f7dfd0c44
Password: bmSuoaocSJKxYSqWigBD5ZpRJfieebf7
```

### API Keys
```
ABACUSAI_API_KEY: 6d20e7d7b5b14d3a80cac4a202928078
NEXTAUTH_SECRET: uZOsEmcOW56hBzgqzJ3Ut0MSaXG6JILQ
```

**⚠️ ADVERTENCIA:** Estas credenciales son para desarrollo. En un escenario de producción real, deben rotarse y manejarse de forma más segura.

---

## 🚀 DEPLOYMENT

### Proceso de Deploy en Abacus AI
1. Build locally: `yarn build`
2. Verificar que no hay errores
3. Commit y push a repositorio
4. Abacus AI detecta cambios automáticamente
5. Build y deploy automático

### Variables de Entorno en Producción
```bash
DATABASE_URL=<mismo valor que desarrollo>
NEXTAUTH_SECRET=<mismo valor que desarrollo>
NEXTAUTH_URL=<URL de producción>
ABACUSAI_API_KEY=<mismo valor que desarrollo>
```

### Rollback
```bash
# En caso de problemas, usar restore checkpoint
# Ver ARQUITECTURA_TECNICA.md sección de comandos
```

---

## 📚 RECURSOS DE REFERENCIA

### Documentación Consultada
- Next.js 14 App Router
- Prisma ORM
- NextAuth.js v4
- Tailwind CSS v3
- Shadcn/ui
- Radix UI
- Framer Motion
- Chart.js
- Canvas Confetti

### APIs Consultadas
- Abacus AI Chat Completions
- OpenAI Chat Completions (para referencia)

### Diseño y UX
- Referencia: Duolingo (gamificación)
- Referencia: Notion (UI/UX)
- Referencia: Linear (diseño moderno)

---

**FIN DE NOTAS INTERNAS**

**Última actualización:** 09 de Octubre de 2025
