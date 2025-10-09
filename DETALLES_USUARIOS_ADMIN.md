
# Funcionalidad: Ver Detalles de Usuarios (Admin)

## Descripción
Se ha implementado una funcionalidad completa para que los administradores puedan ver información detallada de cualquier usuario del sistema, incluyendo estadísticas de actividad, progreso, conversaciones, sesiones de práctica y logros desbloqueados.

## Componentes Creados

### 1. API Endpoint
**Archivo:** `/app/api/admin/user-details/[userId]/route.ts`

Este endpoint obtiene toda la información relevante del usuario:
- Información personal (nombre, email, rol, fechas)
- Estadísticas de gamificación (puntos, nivel, rachas)
- Conteos de actividades (progreso, conversaciones, práctica, errores, vocabulario)
- Últimos 10 logros desbloqueados
- Últimas 5 actividades completadas
- Últimas 5 conversaciones
- Últimas 5 sesiones de práctica

**Seguridad:**
- Requiere autenticación de administrador
- Valida que el usuario existe antes de devolver información

### 2. Componente de Diálogo
**Archivo:** `/components/admin/user-details-dialog.tsx`

Un componente modal con pestañas que muestra:

#### Pestaña "General"
- Información personal (nombre, email, rol, verificación)
- Fechas de registro y última actividad
- Métricas de gamificación (nivel, puntos, rachas)

#### Pestaña "Estadísticas"
- Actividades completadas
- Conversaciones con el tutor
- Sesiones de práctica
- Logros desbloqueados
- Progreso en vocabulario
- Tarjetas de vocabulario
- Errores comunes
- Notas creadas
- Tasa de actividad diaria

#### Pestaña "Actividad"
- **Progreso Reciente:** Últimas 5 actividades con puntuación y tiempo
- **Conversaciones Recientes:** Últimas 5 conversaciones con conteo de mensajes
- **Sesiones de Práctica Recientes:** Últimas 5 sesiones con tipo, tema y puntuación

#### Pestaña "Logros"
- Lista de los últimos 10 logros desbloqueados
- Muestra nombre, descripción, icono, puntos y fecha de desbloqueo

### 3. Integración en Dashboard
**Archivo:** `/components/admin/admin-dashboard.tsx`

- Botón "Ver detalles" en cada fila de la tabla de usuarios
- Al hacer clic, se abre el diálogo con toda la información del usuario

## Cómo Usar

### Para Administradores:

1. **Acceder al Panel de Administración**
   - Iniciar sesión con cuenta de administrador
   - Ir a `/admin`

2. **Ver Detalles de un Usuario**
   - En la pestaña "Usuarios", buscar el usuario deseado
   - Hacer clic en el botón "Ver detalles" en la columna de acciones
   - El diálogo se abrirá mostrando toda la información

3. **Navegar por la Información**
   - Usar las pestañas para ver diferentes categorías
   - "General" para información básica y gamificación
   - "Estadísticas" para métricas de uso
   - "Actividad" para ver actividad reciente
   - "Logros" para ver logros desbloqueados

4. **Cerrar el Diálogo**
   - Hacer clic en el botón "Cerrar"
   - O hacer clic fuera del diálogo

## Datos Mostrados

### Información Personal
- Nombre completo
- Dirección de email
- Rol (usuario/administrador)
- Estado de verificación de email
- Fecha de registro
- Días desde el registro
- Última actividad
- Días desde la última actividad

### Gamificación
- Nivel actual
- Puntos totales
- Racha actual (días consecutivos)
- Mejor racha histórica

### Estadísticas de Uso
- Total de actividades completadas
- Total de conversaciones con el tutor
- Total de sesiones de práctica
- Total de logros desbloqueados
- Progreso en vocabulario
- Tarjetas de vocabulario creadas
- Errores comunes registrados
- Notas creadas
- Rachas registradas
- Tasa de actividad (acciones/día)

### Actividad Reciente
- **Actividades:** Título, semana, fecha de completado, puntuación, tiempo invertido
- **Conversaciones:** Título, fecha de inicio, número de mensajes
- **Práctica:** Tipo de sesión, tema, puntuación, fecha, duración

### Logros
- Nombre del logro
- Descripción
- Icono
- Puntos otorgados
- Fecha de desbloqueo

## Métricas Calculadas

El sistema calcula automáticamente:

1. **Días desde el registro:**
   ```
   (Fecha actual - Fecha de registro) / (1000 * 60 * 60 * 24)
   ```

2. **Días desde última actividad:**
   ```
   (Fecha actual - Última actividad) / (1000 * 60 * 60 * 24)
   ```

3. **Tasa de actividad:**
   ```
   (Actividades + Sesiones de práctica) / Días desde registro
   ```

## Formato de Fechas

El componente formatea las fechas de forma legible:
- **Fechas:** "9 de octubre de 2025"
- **Fechas y horas:** "9 oct. 2025, 15:30"

## Manejo de Errores

El sistema maneja los siguientes casos:
- Usuario no encontrado → Mensaje de error
- Error de permisos → Mensaje de no autorizado
- Error de red → Toast de error
- Datos vacíos → Mensajes informativos ("No hay actividades aún")

## Consideraciones de Performance

- Consultas optimizadas con límites (últimos 5/10 elementos)
- Carga bajo demanda (solo al abrir el diálogo)
- Consultas paralelas con `Promise.all()`
- Conteos eficientes usando `count()` de Prisma

## Seguridad

- ✅ Solo administradores pueden acceder
- ✅ Validación de sesión en el servidor
- ✅ Protección de datos sensibles
- ✅ No se exponen contraseñas
- ✅ Validación de existencia del usuario

## Posibles Mejoras Futuras

1. **Exportar datos del usuario** a CSV/PDF
2. **Gráficos de progreso** temporal del usuario
3. **Comparación** con promedios del sistema
4. **Filtros avanzados** en cada pestaña
5. **Edición** de datos del usuario desde el diálogo
6. **Historial de cambios** del usuario
7. **Notificaciones** al usuario desde el admin
8. **Reportes personalizados** por usuario

## Tecnologías Utilizadas

- **React** + **TypeScript** para el componente
- **Next.js API Routes** para el endpoint
- **Prisma ORM** para consultas a la base de datos
- **Shadcn UI** para componentes de interfaz
- **Lucide Icons** para iconografía
- **Tailwind CSS** para estilos

## Estado Actual

✅ **Completado y probado**
- Endpoint API implementado
- Componente de diálogo funcional
- Integración en dashboard de admin
- Pruebas exitosas
- Documentación completa

---

**Fecha de implementación:** 9 de octubre de 2025
**Desarrollador:** Deep Agent
**Versión:** 1.0.0
