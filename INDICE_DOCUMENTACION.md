
# 📚 ÍNDICE MAESTRO DE DOCUMENTACIÓN - SPEAKLYPLAN

## 🎯 Propósito de este Documento

Este es el punto de entrada para toda la documentación técnica de SpeaklyPlan. Aquí encontrarás un resumen de cada documento disponible y cuándo consultarlo.

---

## 📖 Documentos Disponibles

### 1. README_TECNICO.md
**📄 Propósito:** Vista general técnica del proyecto  
**👥 Audiencia:** Desarrolladores nuevos en el proyecto  
**⏱️ Tiempo de lectura:** 15 minutos  
**🔍 Cuándo leer:**
- Primer contacto con el proyecto
- Necesitas entender la arquitectura general
- Quieres ver el stack tecnológico
- Necesitas diagrama de arquitectura

**Contenido:**
- Resumen del proyecto
- Características principales
- Diagrama de arquitectura
- Estructura del proyecto
- Stack tecnológico
- Comandos básicos
- Variables de entorno

---

### 2. ARQUITECTURA_TECNICA.md
**📄 Propósito:** Documentación completa y exhaustiva del sistema  
**👥 Audiencia:** Desarrolladores que necesitan detalles profundos  
**⏱️ Tiempo de lectura:** 60-90 minutos  
**🔍 Cuándo leer:**
- Necesitas información detallada sobre cualquier módulo
- Vas a hacer cambios significativos
- Necesitas entender el flujo completo de datos
- Estás debuggeando un problema complejo
- Vas a continuar el desarrollo en otra conversación

**Contenido:**
- Arquitectura de base de datos (schema completo)
- Estructura del proyecto (cada archivo explicado)
- Sistema de autenticación (detalles completos)
- Módulos principales (Dashboard, Tutor IA, Vocabulario, etc.)
- Sistema de IA (prompts, servicios, flujos)
- API endpoints (todos documentados)
- Sistema de gamificación (fórmulas, logros)
- Componentes UI (guía de uso)
- Flujos de usuario completos
- Errores comunes y cómo evitarlos
- Roadmap y TODOs

---

### 3. DESARROLLO_RAPIDO.md
**📄 Propósito:** Guía práctica para desarrollo día a día  
**👥 Audiencia:** Desarrolladores activos en el proyecto  
**⏱️ Tiempo de lectura:** 20 minutos (referencia rápida)  
**🔍 Cuándo leer:**
- Necesitas hacer una tarea específica
- Quieres plantillas de código
- Necesitas comandos frecuentes
- Estás debuggeando
- Necesitas snippets útiles

**Contenido:**
- Comandos esenciales
- Archivos críticos (qué modificar y qué no)
- Tareas comunes (con código de ejemplo)
  - Agregar nueva página
  - Agregar API endpoint
  - Agregar modelo a DB
  - Agregar componente UI
- Debugging (herramientas y técnicas)
- Estilos y temas (colores, gradientes, animaciones)
- Testing manual (checklist)
- Métricas y analíticas (queries SQL)
- Problemas comunes y soluciones
- Snippets útiles

---

### 4. DATOS_SEMILLA.md
**📄 Propósito:** Estructura de datos iniciales y seeds  
**👥 Audiencia:** Desarrolladores trabajando con datos  
**⏱️ Tiempo de lectura:** 30 minutos  
**🔍 Cuándo leer:**
- Necesitas entender la estructura de datos
- Vas a crear o modificar seeds
- Necesitas agregar contenido al sistema
- Estás reseteando la base de datos

**Contenido:**
- Plan de 6 meses (estructura de 26 semanas)
- Categorías de vocabulario
- Términos de vocabulario (ejemplos)
- Categorías de recursos
- Recursos educativos (ejemplos)
- Logros del sistema
- Usuario de prueba
- Script de seed
- Verificación de datos
- Actualización de datos

---

### 5. .internal/NOTAS_DESARROLLO.md
**📄 Propósito:** Notas internas NO expuestas al cliente  
**👥 Audiencia:** Equipo de desarrollo interno  
**⏱️ Tiempo de lectura:** 20 minutos  
**🔍 Cuándo leer:**
- Eres el próximo desarrollador continuando el proyecto
- Necesitas contexto de decisiones tomadas
- Quieres ver el historial de cambios
- Necesitas credenciales de desarrollo

**Contenido:**
- Estado actual del proyecto
- Funcionalidades completadas
- Cambios recientes (con fechas)
- Issues conocidos
- Ideas para futuro
- Detalles técnicos importantes
- Métricas de desarrollo
- Prioridades para próxima conversación
- Notas misceláneas
- Credenciales de desarrollo
- Proceso de deployment

⚠️ **IMPORTANTE:** Este archivo está en `.internal/` y NO debe compartirse con clientes.

---

### 6. CHANGELOG.md
**📄 Propósito:** Historial de cambios del proyecto  
**👥 Audiencia:** Todo el equipo y stakeholders  
**⏱️ Tiempo de lectura:** 10 minutos  
**🔍 Cuándo leer:**
- Quieres ver qué cambió en cada versión
- Necesitas comunicar cambios a stakeholders
- Estás planeando próximos releases

**Contenido:**
- Versión actual (1.0.0)
- Cambios por categoría:
  - Agregado
  - Cambiado
  - Corregido
  - Optimizado
  - Documentación
- Próximas versiones planificadas

---

### 7. SISTEMA_RESTABLECER_CONTRASEÑA.md 🆕
**📄 Propósito:** Documentación completa del sistema de restablecimiento de contraseña  
**👥 Audiencia:** Desarrolladores, administradores, equipo de seguridad  
**⏱️ Tiempo de lectura:** 45 minutos  
**🔍 Cuándo leer:**
- Necesitas entender el sistema de recuperación de contraseñas
- Vas a configurar el servicio de email en producción
- Estás debuggeando problemas de restablecimiento
- Quieres implementar mejoras de seguridad
- Necesitas documentación para auditoría de seguridad

**Contenido:**
- Características principales del sistema
- Arquitectura técnica completa
- Archivos y servicios creados
- APIs de restablecimiento (forgot-password, reset-password)
- Servicio de email (desarrollo y producción)
- Páginas de UI (solicitar y restablecer)
- Flujo completo del usuario (paso a paso)
- Consideraciones de seguridad
- Configuración de proveedores de email (SendGrid, Resend, SMTP)
- Testing manual y automatizado
- Base de datos y modelos
- Recomendaciones de mejoras futuras
- FAQ para usuarios

---

### 8. GUIA_RAPIDA_RESTABLECER.md 🆕
**📄 Propósito:** Guía práctica y rápida del sistema de restablecimiento  
**👥 Audiencia:** Todos (usuarios finales y desarrolladores)  
**⏱️ Tiempo de lectura:** 10 minutos  
**🔍 Cuándo leer:**
- Un usuario necesita restablecer su contraseña
- Necesitas instrucciones rápidas de uso
- Quieres probar el sistema rápidamente
- Necesitas configurar email en producción (resumen)
- Buscas solución a problemas comunes

**Contenido:**
- Instrucciones para usuarios (paso a paso)
- Guía rápida para desarrolladores
- APIs disponibles (ejemplos de uso)
- Testing rápido con curl
- Configuración de email (resumen)
- Checklist de seguridad
- Troubleshooting común
- Páginas disponibles
- Flujo visual del proceso
- Enlaces a documentación completa

---

## 🗺️ Guía de Uso Según Escenario

### 📍 Escenario 1: Soy nuevo en el proyecto
**Ruta recomendada:**
1. `README_TECNICO.md` (15 min) - Para visión general
2. `DESARROLLO_RAPIDO.md` (20 min) - Para empezar a trabajar
3. `ARQUITECTURA_TECNICA.md` (60 min) - Para profundizar

### 📍 Escenario 2: Necesito agregar una funcionalidad
**Ruta recomendada:**
1. `ARQUITECTURA_TECNICA.md` - Sección del módulo relevante
2. `DESARROLLO_RAPIDO.md` - Plantillas de código
3. `.internal/NOTAS_DESARROLLO.md` - Verificar TODOs relacionados

### 📍 Escenario 3: Tengo un bug o error
**Ruta recomendada:**
1. `DESARROLLO_RAPIDO.md` - Sección "Problemas Comunes"
2. `ARQUITECTURA_TECNICA.md` - Sección "Errores Comunes a Evitar"
3. `.internal/NOTAS_DESARROLLO.md` - Sección "Issues Conocidos"

### 📍 Escenario 4: Necesito trabajar con datos
**Ruta recomendada:**
1. `DATOS_SEMILLA.md` - Estructura de datos
2. `ARQUITECTURA_TECNICA.md` - Sección "Arquitectura de Base de Datos"
3. `DESARROLLO_RAPIDO.md` - Comandos de Prisma

### 📍 Escenario 5: Voy a continuar el desarrollo en otra conversación
**Ruta recomendada:**
1. `ARQUITECTURA_TECNICA.md` - Completo
2. `.internal/NOTAS_DESARROLLO.md` - Completo
3. `DESARROLLO_RAPIDO.md` - Referencia rápida

### 📍 Escenario 6: Necesito explicar el proyecto a alguien
**Ruta recomendada:**
1. `README_TECNICO.md` - Para overview técnico
2. `CHANGELOG.md` - Para mostrar progreso
3. `ARQUITECTURA_TECNICA.md` - Para detalles específicos

### 📍 Escenario 7: Usuario olvidó su contraseña 🆕
**Ruta recomendada:**
1. `GUIA_RAPIDA_RESTABLECER.md` - Sección "Para Usuarios"
2. Seguir los pasos indicados
3. Si hay problemas: Sección "Troubleshooting"

### 📍 Escenario 8: Configurar email en producción 🆕
**Ruta recomendada:**
1. `SISTEMA_RESTABLECER_CONTRASEÑA.md` - Sección "Servicio de Email"
2. `GUIA_RAPIDA_RESTABLECER.md` - Sección "Configuración de Email"
3. Elegir proveedor y configurar variables de entorno

### 📍 Escenario 9: Auditar seguridad del sistema 🆕
**Ruta recomendada:**
1. `SISTEMA_RESTABLECER_CONTRASEÑA.md` - Sección "Consideraciones de Seguridad"
2. `ARQUITECTURA_TECNICA.md` - Sección "Sistema de Autenticación"
3. Revisar código de APIs en `/app/api/auth/`

---

## 📂 Ubicación de Archivos

```
/home/ubuntu/speaklyplan/
│
├── README_TECNICO.md                    # ✅ Público
├── ARQUITECTURA_TECNICA.md              # ✅ Público
├── DESARROLLO_RAPIDO.md                 # ✅ Público
├── DATOS_SEMILLA.md                     # ✅ Público
├── CHANGELOG.md                         # ✅ Público
├── SISTEMA_RESTABLECER_CONTRASEÑA.md    # ✅ Público 🆕
├── GUIA_RAPIDA_RESTABLECER.md           # ✅ Público 🆕
├── INDICE_DOCUMENTACION.md              # ✅ Público (este archivo)
│
├── .internal/                           # ⚠️ PRIVADO - NO COMPARTIR
│   └── NOTAS_DESARROLLO.md              # ⚠️ Uso interno solamente
│
└── nextjs_space/                        # Código fuente
    └── ...
```

---

## 🔄 Mantenimiento de Documentación

### Cuándo Actualizar

**Actualizar inmediatamente:**
- ✅ Cambios en arquitectura
- ✅ Nuevas funcionalidades importantes
- ✅ Cambios en API endpoints
- ✅ Cambios en schema de DB
- ✅ Nuevas dependencias

**Actualizar al final del sprint:**
- 📝 Cambios menores en UI
- 📝 Mejoras de rendimiento
- 📝 Correcciones de bugs
- 📝 Refactorizaciones

**Actualizar en releases:**
- 📋 CHANGELOG.md
- 📋 Roadmap
- 📋 TODOs completados

### Qué Documento Actualizar

| Cambio | Documento(s) a Actualizar |
|--------|---------------------------|
| Nueva funcionalidad mayor | ARQUITECTURA_TECNICA.md + CHANGELOG.md |
| Nueva página/componente | ARQUITECTURA_TECNICA.md + DESARROLLO_RAPIDO.md |
| Cambio en DB | ARQUITECTURA_TECNICA.md + DATOS_SEMILLA.md |
| Nuevo endpoint | ARQUITECTURA_TECNICA.md + DESARROLLO_RAPIDO.md |
| Bug fix | CHANGELOG.md |
| Cambio en proceso | DESARROLLO_RAPIDO.md |
| Decisión técnica | .internal/NOTAS_DESARROLLO.md |
| Nuevo TODO | .internal/NOTAS_DESARROLLO.md |
| Release | CHANGELOG.md + README_TECNICO.md |

---

## 🎓 Glosario de Términos

### Términos Técnicos
- **SRS:** Spaced Repetition System (Sistema de Repetición Espaciada)
- **SM-2:** SuperMemo 2 Algorithm (Algoritmo de repetición espaciada)
- **CEFR:** Common European Framework of Reference (Marco Común Europeo de Referencia)
- **JWT:** JSON Web Token
- **ORM:** Object-Relational Mapping
- **SSR:** Server-Side Rendering

### Términos del Proyecto
- **Racha (Streak):** Días consecutivos de actividad
- **Logro (Achievement):** Recompensa por alcanzar un hito
- **Contexto:** Tipo de conversación en el tutor (casual, meeting, etc.)
- **Fase:** Agrupación de semanas del plan (4 fases en total)
- **Actividad:** Tarea diaria del plan de estudios

---

## 📞 Preguntas Frecuentes

### ¿Qué documento leo primero?
**R:** Empieza con `README_TECNICO.md` para una visión general.

### ¿Dónde está la documentación del código?
**R:** En `ARQUITECTURA_TECNICA.md` sección "Estructura del Proyecto".

### ¿Cómo agrego una nueva funcionalidad?
**R:** Ver `DESARROLLO_RAPIDO.md` sección "Tareas Comunes".

### ¿Dónde están las credenciales?
**R:** En `.internal/NOTAS_DESARROLLO.md` sección "Credenciales de Desarrollo".

### ¿Cómo reseteo la base de datos?
**R:** Ver `DESARROLLO_RAPIDO.md` sección "Base de Datos" y `DATOS_SEMILLA.md`.

### ¿Qué archivos NO debo modificar?
**R:** Ver `DESARROLLO_RAPIDO.md` sección "Archivos Críticos".

### ¿Dónde reporto un bug?
**R:** Actualiza `.internal/NOTAS_DESARROLLO.md` sección "Issues Conocidos".

### ¿Cómo contribuyo al proyecto?
**R:** Ver `README_TECNICO.md` sección "Contribución".

---

## ✅ Checklist de Documentación

Use este checklist al iniciar una nueva conversación de desarrollo:

```
[ ] He leído README_TECNICO.md
[ ] He revisado ARQUITECTURA_TECNICA.md (al menos las secciones relevantes)
[ ] He consultado DESARROLLO_RAPIDO.md para tareas comunes
[ ] He verificado .internal/NOTAS_DESARROLLO.md para contexto
[ ] Conozco la ubicación del proyecto: /home/ubuntu/speaklyplan/
[ ] Sé cómo correr el proyecto: yarn dev
[ ] Tengo acceso a las variables de entorno en .env
[ ] Sé cómo acceder a la base de datos: yarn prisma studio
[ ] He revisado los issues conocidos
[ ] Entiendo el sistema de gamificación
[ ] Conozco el flujo del tutor de IA
```

---

## 🚀 Inicio Rápido (5 minutos)

Si tienes prisa y necesitas empezar YA:

```bash
# 1. Navegar al proyecto
cd /home/ubuntu/speaklyplan/nextjs_space

# 2. Instalar dependencias (si es necesario)
yarn install

# 3. Iniciar desarrollo
yarn dev

# 4. Abrir en navegador
# http://localhost:3000

# 5. Login con usuario de prueba
# Email: test@speaklyplan.com
# Password: Test123!
```

Luego, lee `README_TECNICO.md` mientras se carga el proyecto.

---

## 📊 Estadísticas de Documentación

**Total de documentos:** 9 (8 públicos + 1 privado)  
**Páginas totales:** ~320 páginas  
**Tiempo de lectura total:** ~235 minutos (4 horas)  
**Última actualización:** 09 de Octubre de 2025

**Cobertura:**
- ✅ Arquitectura: 100%
- ✅ API Endpoints: 100%
- ✅ Base de Datos: 100%
- ✅ Componentes UI: 100%
- ✅ Sistema de IA: 100%
- ✅ Gamificación: 100%
- ✅ Flujos de Usuario: 100%
- ⚠️ Tests: Pendiente
- ⚠️ Deployment: Básico

---

## 🔄 Actualizaciones Futuras

Esta documentación será actualizada cuando:
- Se agreguen nuevas funcionalidades
- Se modifique la arquitectura
- Se descubran nuevos bugs
- Se completen TODOs
- Se lance una nueva versión

**Responsable de actualización:** El desarrollador que realiza el cambio

---

## 📧 Contacto

Para preguntas sobre la documentación:
- Revisar este índice primero
- Consultar el documento específico
- Verificar `.internal/NOTAS_DESARROLLO.md` para contexto adicional

---

**Última actualización:** 09 de Octubre de 2025  
**Versión del índice:** 1.0  
**Documentos indexados:** 7

---

**FIN DEL ÍNDICE MAESTRO**
