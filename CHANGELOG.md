
# CHANGELOG - SpeaklyPlan

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2025-10-09

### ✨ Agregado

#### Sistema de Autenticación
- Sistema completo de login/register con NextAuth.js
- Sesiones JWT con estrategia de credentials
- Protección de rutas en servidor y cliente
- Hash de contraseñas con bcrypt
- **Sistema de restablecimiento de contraseña** 🆕
  - Flujo completo de recuperación de contraseña
  - Tokens seguros con expiración de 1 hora
  - Validación y seguridad robusta
  - Emails HTML profesionales
  - UI intuitiva para solicitar y restablecer
  - Servicio de email configurado (desarrollo y producción)
  - Integración lista con SendGrid/Resend/SMTP

#### Dashboard
- Vista general de progreso del usuario
- Calendario semanal con actividades del plan
- Indicadores de racha actual y mejor racha
- Resumen de logros desbloqueados
- Navegación rápida a todas las secciones

#### Tutor de IA
- Chat conversacional con GPT-4o-mini via Abacus AI
- Corrección gramatical en tiempo real
- Traducción automática para niveles A1-A2
- 5 contextos de conversación: casual, meeting, interview, email, grammar
- Historial de conversaciones
- Detección automática de vocabulario usado
- Análisis de errores comunes
- Sistema de puntos por mensaje enviado

#### Sistema de Vocabulario
- 8 categorías de vocabulario profesional
- 200+ términos con pronunciación, traducción y ejemplos
- Sistema de repetición espaciada (algoritmo SM-2)
- Progreso de palabras aprendidas/dominadas
- Filtros por categoría y dificultad
- Tarjetas de vocabulario personalizadas

#### Recursos Educativos
- Curación de 50+ recursos externos
- 8 categorías: Cursos, Podcasts, YouTube, Apps, Libros, Sitios Web, Comunidades, Herramientas
- Filtros por categoría
- Ratings y marcadores de recursos gratuitos/pagos

#### Guía de Uso Interactiva
- Tutorial interactivo paso a paso
- Checklist de primeros pasos
- Quiz de objetivos personalizados
- Planificador semanal interactivo
- Gráficos de progreso con Chart.js
- Videos demostrativos embebidos
- Tips contextuales animados
- Tarjetas interactivas con efecto flip
- Tour guiado de la plataforma
- Celebraciones con confetti

#### Sistema de Gamificación
- Sistema de puntos con múltiples fuentes
- Niveles calculados con fórmula exponencial
- 12 logros en 5 categorías diferentes
- Sistema de rachas (streak tracking)
- Animaciones de celebración
- Modals de level-up y achievement unlocked
- Panel de gamificación integrado

#### Sistema de Analíticas
- Seguimiento de sesiones de práctica
- Métricas de fluidez, precisión y comprensión
- Identificación de áreas fuertes y débiles
- Historial de progreso temporal
- Estadísticas de vocabulario aprendido

#### Componentes UI
- 50+ componentes de Shadcn/ui
- Sistema de diseño consistente con Tailwind CSS
- Animaciones con Framer Motion
- Modo responsive para móviles
- Tema claro optimizado

### 🔧 Cambiado

#### Navegación
- Logo ahora es clickeable y redirige a dashboard en todas las secciones
- Indicadores de sección alineados a la izquierda para consistencia visual
- Header del Tutor AI actualizado con nombre de usuario y botón de logout
- Menú del Tutor AI limpiado para evitar duplicación de opciones

### 🐛 Corregido

#### UI/UX
- Corrección de hidratación en componentes con fechas
- Validación de valores en componentes Select
- Manejo de estados de carga en sesiones
- Auto-scroll en chat del tutor
- Responsive design en todas las secciones

### 🚀 Optimizado

#### Rendimiento
- Lazy loading de componentes pesados
- Optimización de imágenes con Next.js Image
- Caching con React Query
- Queries de base de datos optimizadas

### 📚 Documentación

#### Documentos Agregados
- `ARQUITECTURA_TECNICA.md` - Arquitectura completa del sistema (200+ páginas)
- `README_TECNICO.md` - README técnico con diagramas
- `DESARROLLO_RAPIDO.md` - Guía rápida de desarrollo
- `DATOS_SEMILLA.md` - Estructura de datos y seeds
- `.internal/NOTAS_DESARROLLO.md` - Notas internas de desarrollo
- `CHANGELOG.md` - Este archivo
- **`SISTEMA_RESTABLECER_CONTRASEÑA.md`** - Documentación completa del sistema de restablecimiento 🆕
- **`GUIA_RAPIDA_RESTABLECER.md`** - Guía práctica rápida de uso 🆕
- **`INDICE_DOCUMENTACION.md`** - Actualizado con nueva documentación 🆕

---

## Tipos de Cambios

- **✨ Agregado** - Nuevas funcionalidades
- **🔧 Cambiado** - Cambios en funcionalidades existentes
- **⚠️ Obsoleto** - Funcionalidades que pronto serán removidas
- **🗑️ Removido** - Funcionalidades removidas
- **🐛 Corregido** - Corrección de bugs
- **🔒 Seguridad** - Mejoras de seguridad
- **🚀 Optimizado** - Mejoras de rendimiento
- **📚 Documentación** - Solo cambios en documentación

---

## Próximas Versiones

### [1.1.0] - TBD
- [ ] Implementación de tests (Jest + Playwright)
- [ ] Modo oscuro completo
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Export de progreso (PDF/Excel)

### [1.2.0] - TBD
- [ ] Sistema de amigos y competencia
- [ ] Voice input (Speech-to-Text)
- [ ] Text-to-Speech para pronunciación
- [ ] Estadísticas avanzadas
- [ ] Más contextos de conversación

### [2.0.0] - TBD
- [ ] Modo offline con Service Workers
- [ ] Certificados de completación
- [ ] Multi-idioma (i18n)
- [ ] Integración con calendarios externos
- [ ] Sistema de recompensas avanzado

---

**Última actualización:** 09 de Octubre de 2025
