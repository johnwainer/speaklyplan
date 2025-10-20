
# 🎓 SpeaklyPlan - Plataforma Inteligente de Aprendizaje de Inglés

![Next.js](https://img.shields.io/badge/Next.js-14.2.28-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.7.0-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)
![License](https://img.shields.io/badge/license-MIT-green)

SpeaklyPlan es una plataforma moderna e inteligente para el aprendizaje de inglés, que combina IA conversacional, gamificación, prácticas 1-on-1 y seguimiento personalizado del progreso.

---

## 📑 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [Variables de Entorno](#-variables-de-entorno)
- [Comandos Disponibles](#-comandos-disponibles)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [Usuarios de Prueba](#-usuarios-de-prueba)
- [Solución de Problemas](#-solución-de-problemas)

---

## ✨ Características Principales

### 🤖 **Tutor AI Conversacional**
- Conversaciones fluidas en tiempo real con IA
- Reconocimiento de voz y síntesis de habla
- Análisis inteligente de pronunciación y gramática
- Sugerencias contextuales personalizadas
- Historial completo de sesiones

### 📊 **Dashboard Inteligente**
- Seguimiento detallado del progreso
- Gráficos interactivos de aprendizaje
- Sistema de logros y niveles
- Estadísticas semanales y mensuales
- Recomendaciones personalizadas

### 👥 **Prácticas 1-on-1**
- Sistema de invitaciones entre usuarios
- Programación de sesiones de práctica
- Notificaciones en tiempo real
- Historial de prácticas realizadas
- Gestión de conexiones

### 📚 **Vocabulario Inteligente**
- Tarjetas de vocabulario interactivas
- Sistema de repetición espaciada
- Seguimiento de progreso por palabra
- Filtros y búsqueda avanzada
- Revisión personalizada

### 🎯 **Sistema de Gamificación**
- Puntos por cada actividad
- Niveles y rangos
- Logros desbloqueables
- Rachas diarias
- Tablas de clasificación

### 👤 **Gestión de Perfil**
- Edición completa de datos personales
- Subida de foto de perfil (AWS S3)
- Configuración de preferencias
- Gestión de contraseña
- Historial de actividad

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14.2.28** - Framework React con SSR
- **TypeScript 5.2.2** - Tipado estático
- **Tailwind CSS 3.3.3** - Estilos utility-first
- **Radix UI** - Componentes accesibles
- **Framer Motion** - Animaciones
- **React Hook Form** - Gestión de formularios
- **Zustand** - Estado global

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **NextAuth.js 4.24.11** - Autenticación
- **Prisma 6.7.0** - ORM
- **PostgreSQL** - Base de datos relacional
- **bcryptjs** - Encriptación de contraseñas

### Servicios Externos
- **Abacus AI** - Motor de IA conversacional
- **AWS S3** - Almacenamiento de imágenes
- **Web Speech API** - Reconocimiento y síntesis de voz

---

## 📋 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** 18.x o superior
- **npm** o **yarn** (recomendado)
- **PostgreSQL** 15 o superior
- **Git** para control de versiones

### Servicios Externos (Opcionales)
- Cuenta de **Abacus AI** (para el tutor IA)
- Cuenta de **AWS** (para almacenamiento de imágenes)

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/johnwainer/speaklyplan.git
cd speaklyplan/nextjs_space
```

### 2. Instalar Dependencias

```bash
# Con yarn (recomendado)
yarn install

# Con npm
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales (ver sección [Variables de Entorno](#-variables-de-entorno)).

---

## 🗄️ Configuración de Base de Datos

### 1. Crear Base de Datos PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE speaklyplan;

# Crear usuario (opcional)
CREATE USER speaklyplan_user WITH PASSWORD 'tu_contraseña_segura';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE speaklyplan TO speaklyplan_user;

# Salir
\q
```

### 2. Configurar DATABASE_URL

En tu archivo `.env`:

```env
DATABASE_URL="postgresql://speaklyplan_user:tu_contraseña_segura@localhost:5432/speaklyplan?connect_timeout=15"
```

### 3. Ejecutar Migraciones

```bash
# Generar el cliente de Prisma
yarn prisma generate

# Ejecutar migraciones
yarn prisma migrate deploy

# O crear una migración nueva (desarrollo)
yarn prisma migrate dev
```

### 4. Cargar Datos de Prueba (Seed)

El proyecto incluye un script de seed que crea:
- 3 usuarios de prueba (1 admin + 2 usuarios normales)
- Vocabulario base
- Datos de progreso de ejemplo
- Sesiones de prueba

```bash
# Ejecutar seed
yarn prisma db seed
```

**Usuarios creados:**

| Email | Password | Rol |
|-------|----------|-----|
| admin@speaklyplan.com | admin123 | Admin |
| alejandrozapata.9806@gmail.com | 12345 | Usuario |
| user@speaklyplan.com | user123 | Usuario |

### 5. Verificar la Base de Datos

```bash
# Abrir Prisma Studio (GUI para ver datos)
yarn prisma studio
```

Esto abrirá una interfaz web en `http://localhost:5555` donde puedes ver y editar datos.

---

## 🔐 Variables de Entorno

Configura las siguientes variables en tu archivo `.env`:

### Base de Datos (REQUERIDO)

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/speaklyplan?connect_timeout=15"
```

### Autenticación (REQUERIDO)

```env
# URL de tu aplicación
NEXTAUTH_URL="http://localhost:3000"  # Desarrollo
# NEXTAUTH_URL="https://tudominio.com"  # Producción

# Secret para JWT (genera uno con: openssl rand -base64 32)
NEXTAUTH_SECRET="tu_secret_aleatorio_muy_largo_y_seguro"
```

Para generar un NEXTAUTH_SECRET seguro:

```bash
openssl rand -base64 32
```

### AWS S3 - Almacenamiento de Imágenes (OPCIONAL)

```env
AWS_ACCESS_KEY_ID="tu_access_key_id"
AWS_SECRET_ACCESS_KEY="tu_secret_access_key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="tu-bucket-name"
AWS_FOLDER_PREFIX="speaklyplan/"
```

**Nota:** Si no configuras AWS S3, la aplicación funcionará pero sin subida de imágenes de perfil.

### Abacus AI - Tutor IA (OPCIONAL)

```env
ABACUSAI_API_KEY="tu_api_key_de_abacus"
```

**Nota:** Si no configuras Abacus AI, el tutor IA no funcionará pero el resto de la app sí.

---

## 📜 Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
yarn dev

# La app estará disponible en http://localhost:3000
```

### Build y Producción

```bash
# Construir para producción
yarn build

# Iniciar servidor de producción
yarn start
```

### Base de Datos

```bash
# Generar cliente de Prisma
yarn prisma generate

# Ejecutar migraciones
yarn prisma migrate deploy

# Crear nueva migración (desarrollo)
yarn prisma migrate dev --name nombre_de_migracion

# Cargar datos de prueba
yarn prisma db seed

# Abrir Prisma Studio
yarn prisma studio

# Resetear base de datos (¡CUIDADO! Borra todos los datos)
yarn prisma migrate reset
```

### Scripts Personalizados

```bash
# Crear usuario administrador
yarn ts-node scripts/create-admin.ts

# Verificar usuario administrador
yarn ts-node scripts/check-admin.ts

# Hacer admin a un usuario existente
yarn ts-node scripts/make-admin.ts

# Exportar base de datos
yarn ts-node scripts/export-db.ts

# Importar base de datos
yarn ts-node scripts/import-db.ts
```

### Linting

```bash
# Verificar código
yarn lint

# Corregir automáticamente
yarn lint --fix
```

---

## 🌐 Despliegue

### Despliegue en Vercel (Recomendado)

1. **Push a GitHub** (ya hecho)

```bash
git push origin master
```

2. **Importar en Vercel**

- Ve a [vercel.com](https://vercel.com)
- Importa tu repositorio de GitHub
- Vercel detectará automáticamente Next.js

3. **Configurar Variables de Entorno**

En Vercel, ve a Settings > Environment Variables y agrega:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=tu_secret
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BUCKET_NAME=...
AWS_FOLDER_PREFIX=speaklyplan/
ABACUSAI_API_KEY=...
```

4. **Configurar Base de Datos**

Opciones:
- **Vercel Postgres** (recomendado)
- **Supabase** (gratis hasta cierto límite)
- **Railway** (fácil de configurar)
- **AWS RDS** (más robusto)

5. **Ejecutar Migraciones**

Después del primer despliegue:

```bash
# Desde tu local, apuntando a producción
DATABASE_URL="tu_url_produccion" yarn prisma migrate deploy
DATABASE_URL="tu_url_produccion" yarn prisma db seed
```

6. **Deploy**

Vercel desplegará automáticamente en cada push a master.

### Despliegue Manual (VPS/Servidor)

```bash
# 1. Clonar repositorio
git clone https://github.com/johnwainer/speaklyplan.git
cd speaklyplan/nextjs_space

# 2. Instalar dependencias
yarn install

# 3. Configurar .env
cp .env.example .env
nano .env  # Editar variables

# 4. Setup base de datos
yarn prisma generate
yarn prisma migrate deploy
yarn prisma db seed

# 5. Build
yarn build

# 6. Iniciar con PM2 (gestor de procesos)
pm2 start yarn --name "speaklyplan" -- start
pm2 save
pm2 startup

# 7. Configurar Nginx (proxy reverso)
# Ver archivo de configuración más abajo
```

**Nginx config (`/etc/nginx/sites-available/speaklyplan`):**

```nginx
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📂 Estructura del Proyecto

```
speaklyplan/nextjs_space/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── admin/               # Endpoints de administración
│   │   ├── auth/                # Autenticación (NextAuth)
│   │   ├── practice/            # Sistema de prácticas 1-on-1
│   │   ├── profile/             # Gestión de perfil
│   │   ├── tutor/               # Tutor IA
│   │   └── vocabulary/          # Vocabulario
│   ├── admin/                   # Panel de administración
│   ├── auth/                    # Páginas de autenticación
│   ├── dashboard/               # Dashboard principal
│   ├── guia/                    # Guía de uso
│   ├── one-on-one/              # Prácticas 1-on-1
│   ├── perfil/                  # Perfil de usuario
│   ├── practice/                # Sistema de prácticas (legacy)
│   ├── recursos/                # Recursos de aprendizaje
│   ├── tutor/                   # Tutor IA
│   ├── vocabulario/             # Vocabulario
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página de inicio
├── components/                   # Componentes reutilizables
│   ├── app-header.tsx           # Header unificado
│   ├── practice/                # Componentes de prácticas
│   └── ui/                      # Componentes UI base
├── hooks/                        # Custom React Hooks
├── lib/                          # Utilidades y configuración
│   ├── db/                      # Funciones de base de datos
│   ├── db.ts                    # Cliente de Prisma
│   ├── types.ts                 # Tipos TypeScript
│   └── utils.ts                 # Funciones auxiliares
├── prisma/                       # Configuración de Prisma
│   ├── migrations/              # Migraciones de BD
│   └── schema.prisma            # Schema de base de datos
├── public/                       # Archivos estáticos
├── scripts/                      # Scripts de utilidad
│   ├── create-admin.ts          # Crear usuario admin
│   ├── seed.ts                  # Datos de prueba
│   └── ...
├── .env                          # Variables de entorno (no commiteado)
├── .env.example                  # Ejemplo de variables
├── .gitignore                    # Archivos ignorados por git
├── next.config.js                # Configuración de Next.js
├── package.json                  # Dependencias
├── tailwind.config.ts            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
└── README.md                     # Este archivo
```

---

## 🎯 Funcionalidades Detalladas

### 1. Sistema de Autenticación

- Login con email y contraseña
- Registro de nuevos usuarios
- Recuperación de contraseña
- Sesiones seguras con NextAuth.js
- Roles de usuario (Admin/Usuario)

### 2. Dashboard

- Progreso semanal y mensual
- Gráficos de evolución
- Logros y niveles
- Acceso rápido a funcionalidades
- Recomendaciones personalizadas

### 3. Tutor AI

- **Modo de conversación fluida** (único modo)
- Reconocimiento de voz en tiempo real
- Síntesis de voz natural
- Análisis de pronunciación
- Sugerencias de gramática
- Historial de conversaciones
- Sistema de gamificación integrado

### 4. Prácticas 1-on-1

- Enviar invitaciones a otros usuarios
- Aceptar/rechazar invitaciones
- Programar sesiones de práctica
- Notificaciones en tiempo real
- Historial de sesiones
- Gestión de conexiones

### 5. Vocabulario

- Tarjetas interactivas
- Sistema de repetición espaciada
- Filtros por nivel y categoría
- Búsqueda avanzada
- Seguimiento de progreso por palabra

### 6. Perfil

- Edición de datos personales
- Subida de foto de perfil
- Cambio de contraseña
- Configuración de preferencias
- Historial de actividad

### 7. Panel de Administración

- Gestión de usuarios
- Estadísticas globales
- Exportación de datos
- Creación de usuarios
- Asignación de roles

---

## 👥 Usuarios de Prueba

Después de ejecutar el seed (`yarn prisma db seed`), tendrás estos usuarios:

### Usuario Administrador

```
Email: admin@speaklyplan.com
Password: admin123
Rol: Admin
```

Acceso completo al panel de administración en `/admin`

### Usuario de Prueba 1

```
Email: alejandrozapata.9806@gmail.com
Password: 12345
Rol: Usuario
```

Usuario con datos de progreso de ejemplo.

### Usuario de Prueba 2

```
Email: user@speaklyplan.com
Password: user123
Rol: Usuario
```

Usuario básico para pruebas.

---

## 🔧 Solución de Problemas

### Error de conexión a base de datos

**Problema:** `Error: P1001: Can't reach database server`

**Solución:**
1. Verifica que PostgreSQL esté corriendo: `sudo service postgresql status`
2. Verifica la URL de conexión en `.env`
3. Asegúrate de que el usuario tenga permisos

### Error de migraciones

**Problema:** `Prisma Migrate couldn't find the migrations`

**Solución:**
```bash
# Resetear y volver a migrar
yarn prisma migrate reset
yarn prisma migrate deploy
yarn prisma db seed
```

### Error de tipos TypeScript

**Problema:** `Cannot find module '@/lib/...'`

**Solución:**
```bash
# Regenerar cliente de Prisma
yarn prisma generate

# Reiniciar TypeScript server en tu editor
```

### Error de autenticación

**Problema:** `NextAuth: NEXTAUTH_SECRET is not defined`

**Solución:**
1. Genera un secret: `openssl rand -base64 32`
2. Agrégalo a `.env`: `NEXTAUTH_SECRET="tu_secret"`
3. Reinicia el servidor

### Puerto 3000 en uso

**Problema:** `Port 3000 is already in use`

**Solución:**
```bash
# Matar el proceso
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
PORT=3001 yarn dev
```

### Imágenes de perfil no se suben

**Problema:** Las imágenes no se guardan

**Solución:**
1. Verifica las credenciales de AWS en `.env`
2. Asegúrate de que el bucket existe y tiene permisos
3. Verifica la política CORS del bucket

### Tutor IA no responde

**Problema:** El tutor no genera respuestas

**Solución:**
1. Verifica que `ABACUSAI_API_KEY` esté configurado en `.env`
2. Verifica que la API key sea válida
3. Revisa los logs de la consola del navegador

---

## 📝 Scripts de Utilidad

### Crear Usuario Administrador Manualmente

```bash
yarn ts-node scripts/create-admin.ts
```

Te pedirá:
- Email
- Password
- Nombre completo

### Verificar Estado de Administrador

```bash
yarn ts-node scripts/check-admin.ts
```

### Convertir Usuario en Admin

```bash
yarn ts-node scripts/make-admin.ts
```

Requiere el email del usuario.

### Exportar Datos

```bash
yarn ts-node scripts/export-db.ts
```

Genera `database_export.json` con todos los datos.

### Importar Datos

```bash
yarn ts-node scripts/import-db.ts
```

Importa desde `database_export.json`.

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 📞 Soporte

Si tienes problemas o preguntas:

- 📧 Email: johnwainer@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/johnwainer/speaklyplan/issues)
- 📖 Docs: Ver archivos `.md` en la raíz del proyecto

---

## 🎉 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework principal
- [Prisma](https://www.prisma.io/) - ORM
- [NextAuth.js](https://next-auth.js.org/) - Autenticación
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [Radix UI](https://www.radix-ui.com/) - Componentes
- [Abacus AI](https://abacus.ai/) - Motor de IA

---

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] Integración con Google Calendar para prácticas
- [ ] App móvil nativa (React Native)
- [ ] Sistema de mensajería en tiempo real
- [ ] Certificados de finalización
- [ ] Marketplace de recursos
- [ ] Integración con más servicios de IA
- [ ] Modo offline
- [ ] Tests automatizados
- [ ] CI/CD con GitHub Actions

---

**Hecho con ❤️ por el equipo de SpeaklyPlan**

---

## 📊 Estado del Proyecto

- ✅ MVP Completo
- ✅ En Producción: [speaklyplan.abacusai.app](https://speaklyplan.abacusai.app)
- ✅ Tests: Pendiente de implementación
- ✅ Documentación: Completa
- ✅ CI/CD: Pendiente de configuración

---

**Última actualización:** 20 de octubre de 2025  
**Versión:** 1.0.0
