
# Panel de Administración - SpeaklyPlan

## 📋 Descripción

Sistema completo de administración y seguimiento de usuarios para la plataforma SpeaklyPlan. El panel de administración proporciona una interfaz centralizada para gestionar usuarios, monitorear actividad, analizar métricas y configurar el sistema.

## 🔐 Acceso al Panel

### URL de Acceso
```
/admin
```

### Credenciales por Defecto
- **Email**: `admin@speaklyplan.com`
- **Password**: `Admin123!`

⚠️ **IMPORTANTE**: Cambia la contraseña después del primer inicio de sesión por seguridad.

## 🚀 Crear el Usuario Administrador

### Opción 1: Usando el Script (Recomendado)

```bash
cd nextjs_space
npx tsx scripts/create-admin.ts
```

### Opción 2: Con Variables de Entorno Personalizadas

```bash
ADMIN_EMAIL=tu@email.com \
ADMIN_PASSWORD=TuPasswordSeguro \
ADMIN_NAME="Tu Nombre" \
npx tsx scripts/create-admin.ts
```

### Opción 3: Manualmente desde la Base de Datos

Si necesitas crear un administrador directamente en la base de datos:

```sql
-- Primero hashea la contraseña usando bcrypt
-- Luego ejecuta:
UPDATE "User" 
SET role = 'admin' 
WHERE email = 'email@del-usuario.com';
```

## 📊 Funcionalidades del Panel

### 1. Dashboard Principal
- **Estadísticas Generales**
  - Total de usuarios registrados
  - Usuarios activos (últimos 7 días)
  - Total de sesiones de práctica
  - Tasa de completación de actividades
  - Tasa de retención
  - Nuevos usuarios esta semana

- **Visualización en Tiempo Real**
  - Gráficos de progreso
  - Métricas de engagement
  - Estadísticas de uso

### 2. Gestión de Usuarios

#### Listado de Usuarios
- Búsqueda por nombre o email
- Filtros por:
  - Rol (usuario/admin)
  - Estado (activo/inactivo)
- Información visible:
  - Datos de contacto
  - Nivel y puntos
  - Racha actual
  - Progreso de actividades
  - Última actividad

#### Detalle de Usuario
Accede al perfil completo de cada usuario con:

**Información General**
- Avatar y datos personales
- Rol y fecha de registro
- Estadísticas de gamificación

**Pestañas de Detalle**
1. **Progreso**: Actividades completadas del plan
2. **Sesiones**: Historial de práctica con Tutor AI
3. **Vocabulario**: Palabras aprendidas y dominadas
4. **Logros**: Achievements desbloqueados
5. **Analytics**: Métricas detalladas de rendimiento

**Acciones Disponibles**
- Editar rol, puntos y nivel
- Eliminar usuario (con confirmación)
- Ver historial completo de actividad

### 3. Analytics y Reportes

#### Métricas Disponibles
- Progreso general del sistema
- Engagement rate
- Tasa de retención
- Top usuarios más activos
- Distribución de niveles
- Uso de funcionalidades

#### Exportación de Datos
Exporta reportes completos en formato CSV con:
- Información de todos los usuarios
- Estadísticas de progreso
- Métricas de aprendizaje
- Historial de actividad

### 4. Registro de Actividad

Monitor en tiempo real de:
- Actividades completadas
- Sesiones de práctica iniciadas
- Conversaciones con Tutor AI
- Logros desbloqueados
- Cambios en el sistema

Cada entrada incluye:
- Usuario que realizó la acción
- Tipo de actividad
- Timestamp
- Detalles adicionales

### 5. Configuración del Sistema

Herramientas administrativas:
- Configuración general de la plataforma
- Gestión de notificaciones
- Ajustes de gamificación
- Administración de contenido del plan
- Sincronización de base de datos
- Limpieza de datos antiguos
- Restablecimiento del sistema

## 🛡️ Seguridad

### Protección de Rutas
- **Middleware**: Protege todas las rutas `/admin/*`
- **Verificación de Rol**: Solo usuarios con `role: "admin"` pueden acceder
- **Sesión Requerida**: Autenticación obligatoria vía NextAuth

### Autenticación
```typescript
// Las rutas admin verifican automáticamente:
if (!session || session.user.role !== "admin") {
  redirect("/auth/login")
}
```

### Best Practices
1. Cambia la contraseña por defecto inmediatamente
2. Usa contraseñas fuertes (mínimo 12 caracteres)
3. No compartas las credenciales de administrador
4. Revisa regularmente el registro de actividad
5. Exporta backups periódicos de los datos

## 🔧 APIs del Panel

### Endpoints Disponibles

#### GET /api/admin/stats
Obtiene estadísticas generales del sistema.

**Respuesta:**
```json
{
  "totalUsers": 150,
  "activeUsers": 85,
  "totalSessions": 1200,
  "avgSessionDuration": 1800,
  "totalMessages": 5000,
  "completionRate": 68.5,
  "newUsersThisWeek": 12,
  "retentionRate": 56.7
}
```

#### GET /api/admin/users
Lista todos los usuarios con sus estadísticas.

#### GET /api/admin/activities
Registro de actividad reciente del sistema.

#### GET /api/admin/user/[userId]
Detalle completo de un usuario específico.

#### PATCH /api/admin/user/[userId]
Actualiza información de un usuario.

**Body:**
```json
{
  "role": "admin",
  "points": 1000,
  "level": 5
}
```

#### DELETE /api/admin/user/[userId]
Elimina un usuario y todos sus datos asociados.

#### GET /api/admin/export
Exporta todos los datos del sistema en formato CSV.

## 📱 Interfaz de Usuario

### Diseño Responsive
- Optimizado para desktop y tablet
- Navegación intuitiva con tabs
- Búsqueda y filtros en tiempo real
- Scroll areas para grandes volúmenes de datos

### Componentes Principales
1. **Header**: Logo, nombre del admin, botones de acción
2. **Stats Cards**: Tarjetas con métricas clave
3. **Tabs Navigation**: Usuarios, Analytics, Actividad, Sistema
4. **Tables**: Tablas interactivas con paginación
5. **Cards**: Tarjetas de información detallada

### Paleta de Colores
- Azul: Usuarios y principal
- Verde: Usuarios activos
- Púrpura: Sesiones
- Naranja: Completación
- Amarillo: Logros

## 🚨 Solución de Problemas

### No puedo acceder al panel
1. Verifica que el usuario tenga `role: "admin"` en la base de datos
2. Asegúrate de estar autenticado
3. Limpia las cookies y vuelve a iniciar sesión

### Las estadísticas no se cargan
1. Verifica la conexión a la base de datos
2. Revisa los logs del servidor
3. Usa el botón "Actualizar" en el panel

### Error al exportar datos
1. Verifica que tengas usuarios en el sistema
2. Revisa los permisos de escritura
3. Intenta con menos datos o filtra primero

## 📈 Métricas y KPIs

### Usuarios
- **Total Users**: Usuarios registrados
- **Active Users**: Activos en últimos 7 días
- **Retention Rate**: % de usuarios que vuelven

### Engagement
- **Completion Rate**: % de actividades completadas
- **Avg Session Duration**: Tiempo promedio por sesión
- **Messages per User**: Interacción promedio

### Crecimiento
- **New Users**: Registros recientes
- **Growth Rate**: Tasa de crecimiento semanal
- **Churn Rate**: Tasa de abandono

## 🔄 Mantenimiento

### Tareas Regulares
- [ ] Revisar actividad diaria
- [ ] Exportar backup semanal
- [ ] Analizar métricas mensuales
- [ ] Limpiar datos antiguos trimestralmente

### Actualizaciones
- Mantén el sistema actualizado
- Revisa logs de errores
- Monitorea el rendimiento
- Optimiza queries pesadas

## 📞 Soporte

Si encuentras problemas con el panel de administración:

1. Revisa la documentación técnica
2. Consulta los logs del servidor
3. Verifica la configuración de la base de datos
4. Contacta al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025  
**Mantenedor**: Equipo SpeaklyPlan
