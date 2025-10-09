
# 🔐 Credenciales de Acceso - Panel de Administración

## Información de Acceso

### Usuario Administrador

- **Email**: `admin@speaklyplan.com`
- **Contraseña**: `Admin123!`
- **URL de acceso**: `/admin`

## Instrucciones de Acceso

### 1. Iniciar Sesión

1. Ve a la página de login: `/auth/login`
2. Ingresa las credenciales del administrador:
   - Email: `admin@speaklyplan.com`
   - Contraseña: `Admin123!`
3. **Automáticamente serás redirigido al panel de administración** (`/admin`)

### 2. Acceso Directo

Si intentas acceder directamente a `/admin`:
- Si **no has iniciado sesión**: serás redirigido a `/auth/login`
- Si **has iniciado sesión como usuario normal**: serás redirigido a `/auth/login`
- Si **has iniciado sesión como admin**: accederás al panel de administración

## Funcionalidades del Panel

Una vez dentro del panel de administración, tendrás acceso a:

### 📊 Dashboard Principal
- Estadísticas generales del sistema
- Total de usuarios registrados
- Usuarios activos hoy
- Total de sesiones de práctica
- Total de conversaciones

### 👥 Gestión de Usuarios
- Lista completa de usuarios
- Filtros por rol (todos, usuarios, admins)
- Búsqueda por nombre o email
- Detalles individuales de cada usuario
- Historial de actividad

### 📈 Analytics
- Gráficos de actividad por día
- Gráficos de progreso por semana
- Métricas de uso del sistema

### 🔄 Actividades Recientes
- Log de todas las actividades del sistema
- Filtros por tipo de actividad
- Exportación de datos

### 💾 Exportación de Datos
- Exportar todos los usuarios (CSV/JSON)
- Exportar actividades recientes (CSV/JSON)
- Exportar estadísticas completas

## Seguridad

### Protección de Rutas

El panel de administración está protegido por:

1. **Middleware de Next.js**: Verifica que el usuario tenga rol "admin"
2. **Layout de Admin**: Doble verificación del rol en el servidor
3. **APIs protegidas**: Todas las APIs de admin verifican el rol

### Cambiar Contraseña del Admin

Para cambiar la contraseña del administrador:

```bash
cd /home/ubuntu/speaklyplan/nextjs_space
yarn tsx scripts/create-admin.ts
```

Esto te permitirá crear un nuevo admin o actualizar las credenciales del existente.

## Resolución de Problemas

### Problema: "Me redirige al dashboard en lugar del panel admin"

**Solución**: Este problema ya está resuelto. Asegúrate de:
1. Cerrar todas las sesiones activas (logout)
2. Iniciar sesión nuevamente con las credenciales de admin
3. Serás redirigido automáticamente a `/admin`

### Problema: "No puedo acceder al panel admin"

Verifica que:
1. Estás usando el email correcto: `admin@speaklyplan.com`
2. Estás usando la contraseña correcta: `Admin123!`
3. El usuario tiene el rol "admin" en la base de datos

Para verificar el rol del usuario en la base de datos:

```bash
cd /home/ubuntu/speaklyplan/nextjs_space
yarn tsx scripts/check-admin.ts
```

### Problema: "Aparece un error 401 o 403"

Esto significa que el usuario no tiene permisos de administrador. Verifica:
1. Que has iniciado sesión con las credenciales correctas
2. Que el usuario tiene rol "admin" en la base de datos
3. Que la sesión no ha expirado

## Notas Técnicas

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/auth/login`
2. NextAuth verifica las credenciales en la base de datos
3. Si son correctas, crea una sesión JWT con el rol del usuario
4. El sistema verifica el rol y redirige:
   - `role === 'admin'` → Redirige a `/admin`
   - `role === 'user'` → Redirige a `/dashboard`

### Verificación de Rol

La verificación del rol se realiza en múltiples niveles:

1. **Middleware** (`middleware.ts`): Primera línea de defensa
2. **Layout del Admin** (`app/admin/layout.tsx`): Verificación en servidor
3. **APIs de Admin** (`app/api/admin/*`): Verificación en cada endpoint

## Crear Nuevos Administradores

Si necesitas crear más usuarios administradores:

1. Accede al panel de administración como admin
2. O ejecuta el script de creación:

```bash
cd /home/ubuntu/speaklyplan/nextjs_space
yarn tsx scripts/create-admin.ts
```

3. Ingresa los datos del nuevo administrador cuando se te solicite

---

**Última actualización**: 9 de octubre de 2025  
**Versión**: 1.1 - Corrección de redirección al dashboard
