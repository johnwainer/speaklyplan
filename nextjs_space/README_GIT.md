
# 🎓 SpeaklyPlan

**Plataforma de aprendizaje de inglés personalizada con IA para CTOs y profesionales de tecnología**

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![License](https://img.shields.io/badge/License-Private-red)

## 📖 Descripción

SpeaklyPlan es una aplicación web diseñada para ayudar a profesionales de tecnología (CTOs, desarrolladores, etc.) a mejorar su inglés de manera personalizada e interactiva. La aplicación incluye:

- **🤖 Tutor IA**: Conversaciones personalizadas con inteligencia artificial
- **📚 Plan de Estudio Estructurado**: 24 semanas de contenido organizado
- **📝 Sistema de Vocabulario**: Seguimiento y práctica de términos técnicos
- **🎯 Gamificación**: Sistema de puntos, niveles y logros
- **📊 Análisis de Progreso**: Gráficas y estadísticas detalladas
- **👤 Gestión de Perfil**: Personalización completa de la experiencia
- **👨‍💼 Panel de Administración**: Gestión de usuarios y contenido

## 🚀 Características Principales

### Para Estudiantes

- **Tutor IA Conversacional**: Practica conversaciones en diferentes contextos (casual, reuniones, entrevistas, emails)
- **Retroalimentación Instantánea**: Corrección gramatical y sugerencias en tiempo real
- **Vocabulario Técnico**: Enfocado en tecnología y negocios
- **Repaso Espaciado**: Sistema inteligente de revisión de vocabulario
- **Seguimiento de Progreso**: Visualiza tu avance semana a semana
- **Logros y Medallas**: Sistema de gamificación motivador
- **Práctica de Pronunciación**: Ejercicios de audio (próximamente)

### Para Administradores

- **Dashboard Completo**: Vista general de todos los usuarios
- **Gestión de Usuarios**: Crear, editar y eliminar usuarios
- **Estadísticas Detalladas**: Métricas de uso y progreso
- **Exportación de Datos**: Informes en múltiples formatos
- **Historial de Actividades**: Seguimiento de acciones de usuarios

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **Almacenamiento**: AWS S3
- **Inteligencia Artificial**: Abacus AI
- **UI**: TailwindCSS + shadcn/ui
- **Gestión de Estado**: React Context + Zustand
- **Gráficas**: Recharts + React-Chartjs-2

## 📦 Instalación Local

### Requisitos Previos

- Node.js 18.x o superior
- PostgreSQL 14.x o superior
- Yarn
- Cuenta de AWS S3
- API Key de Abacus AI

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd speaklyplan
   ```

2. **Instalar dependencias**
   ```bash
   yarn install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales
   ```

4. **Configurar la base de datos**
   ```bash
   # Crear la base de datos
   createdb speaklyplan
   
   # Ejecutar migraciones
   yarn prisma generate
   yarn prisma migrate dev
   
   # Poblar con datos de ejemplo (opcional)
   yarn tsx scripts/seed.ts
   ```

5. **Iniciar en desarrollo**
   ```bash
   yarn dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

## 🌐 Despliegue en Producción

Consulta la [Guía de Despliegue](./DEPLOYMENT_GUIDE.md) para instrucciones detalladas sobre cómo desplegar en tu servidor.

### Resumen Rápido

```bash
# Construir
yarn build

# Iniciar
yarn start

# O usar PM2
pm2 start yarn --name speaklyplan -- start
```

## 📁 Estructura del Proyecto

```
speaklyplan/
├── app/                    # Aplicación Next.js (App Router)
│   ├── api/               # Endpoints de la API
│   ├── auth/              # Páginas de autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── tutor/             # Tutor IA
│   ├── vocabulario/       # Gestión de vocabulario
│   ├── guia/              # Guía de uso
│   ├── recursos/          # Recursos adicionales
│   ├── perfil/            # Perfil de usuario
│   └── admin/             # Panel de administración
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI (shadcn/ui)
│   ├── gamification/     # Sistema de gamificación
│   └── admin/            # Componentes de admin
├── lib/                   # Utilidades y servicios
│   ├── ai/               # Servicios de IA
│   ├── db.ts             # Configuración de Prisma
│   ├── auth.ts           # Configuración de NextAuth
│   ├── s3.ts             # Configuración de S3
│   └── utils.ts          # Funciones auxiliares
├── prisma/               # Esquema de base de datos
├── scripts/              # Scripts de mantenimiento
├── public/               # Archivos estáticos
└── types/                # Definiciones de TypeScript
```

## 🔑 Variables de Entorno

Consulta `.env.example` para ver todas las variables necesarias:

- `DATABASE_URL`: URL de conexión a PostgreSQL
- `NEXTAUTH_URL`: URL de la aplicación
- `NEXTAUTH_SECRET`: Secret para NextAuth
- `AWS_*`: Credenciales de AWS S3
- `ABACUSAI_API_KEY`: API Key de Abacus AI

## 📊 Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema
- **LearningContext**: Contexto de aprendizaje personalizado
- **Conversation**: Conversaciones con el tutor IA
- **Message**: Mensajes individuales
- **VocabularyProgress**: Progreso de vocabulario
- **GrammarMistake**: Errores gramaticales registrados
- **UserProgress**: Progreso general del usuario
- **Achievement**: Logros desbloqueados
- **Note**: Notas personales

### Exportar e Importar Datos

```bash
# Exportar datos
node scripts/export-simple.js

# Importar datos
node scripts/import-db.js
```

## 🔐 Autenticación y Roles

### Roles de Usuario

- **USER**: Usuario estándar
- **ADMIN**: Administrador con acceso completo

### Crear un Administrador

```bash
yarn tsx scripts/make-admin.ts
```

## 🎮 Gamificación

El sistema incluye:

- **Puntos de Experiencia (XP)**: Gana XP por completar actividades
- **Niveles**: Progresa de nivel 1 a 50+
- **Logros**: Desbloquea medallas especiales
- **Rachas**: Mantén tu racha diaria de estudio
- **Misiones Diarias**: Objetivos diarios para ganar XP extra

## 🧪 Testing

```bash
# Ejecutar tests (próximamente)
yarn test

# Test de cobertura (próximamente)
yarn test:coverage
```

## 📝 Scripts Útiles

```bash
# Desarrollo
yarn dev                    # Iniciar en desarrollo
yarn build                  # Construir para producción
yarn start                  # Iniciar en producción

# Base de Datos
yarn prisma studio          # Abrir Prisma Studio
yarn prisma generate        # Generar cliente de Prisma
yarn prisma migrate dev     # Crear migración

# Mantenimiento
node scripts/export-simple.js    # Exportar base de datos
node scripts/import-db.js        # Importar base de datos
yarn tsx scripts/make-admin.ts   # Crear administrador
```

## 🔄 Actualizaciones

```bash
# En tu servidor
git pull
yarn install
yarn build
pm2 restart speaklyplan  # Si usas PM2
```

## 🐛 Resolución de Problemas

### La aplicación no inicia

1. Verifica que PostgreSQL esté corriendo
2. Verifica las variables de entorno en `.env`
3. Ejecuta `yarn prisma generate`

### Error de conexión a la base de datos

1. Verifica `DATABASE_URL` en `.env`
2. Verifica que la base de datos exista
3. Verifica permisos del usuario

### Error con AWS S3

1. Verifica las credenciales de AWS
2. Verifica los permisos del bucket
3. Verifica que el bucket exista en la región correcta

## 📚 Documentación Adicional

- [Guía de Despliegue](./DEPLOYMENT_GUIDE.md)
- [Arquitectura Técnica](./ARQUITECTURA_TECNICA.md)
- [Guía de Desarrollo Rápido](./DESARROLLO_RAPIDO.md)
- [Datos de Semilla](./DATOS_SEMILLA.md)

## 🤝 Contribuir

Este es un proyecto privado. Si necesitas hacer cambios:

1. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
2. Haz tus cambios
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

## 📄 Licencia

Este proyecto es privado y propietario. Todos los derechos reservados.

## 📞 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ para mejorar el inglés de profesionales de tecnología**
