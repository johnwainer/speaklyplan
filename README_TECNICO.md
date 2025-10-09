
# SpeaklyPlan - Documentación Técnica

## 📖 Resumen

**SpeaklyPlan** es una plataforma educativa web para aprender inglés profesional en 6 meses, diseñada específicamente para CTOs y profesionales de tecnología. Combina un plan estructurado de aprendizaje con un tutor de IA conversacional, sistema de gamificación, y seguimiento detallado de progreso.

---

## 🎯 Características Principales

- ✅ **Plan Estructurado de 26 Semanas** - Aprendizaje progresivo desde nivel A1 hasta B2
- ✅ **Tutor de IA Conversacional** - Practica inglés con corrección en tiempo real
- ✅ **Sistema de Gamificación** - Puntos, niveles, logros y rachas para motivación
- ✅ **Vocabulario con Repetición Espaciada** - Algoritmo SM-2 para retención óptima
- ✅ **Recursos Educativos Curados** - 50+ recursos externos recomendados
- ✅ **Analíticas Detalladas** - Seguimiento de progreso y áreas de mejora
- ✅ **Guía Interactiva** - Tutorial completo con tips y mejores prácticas

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐    │
│  │Dashboard │  │  Tutor   │  │Vocabulario│  │Recursos │    │
│  │  Page    │  │   IA     │  │   Page   │  │  Page   │    │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Shadcn/ui + Radix UI Components              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ API Calls (fetch)
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                   API ROUTES (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐    │
│  │  /auth   │  │ /tutor   │  │/progress │  │/vocabulary│   │
│  │  [...    │  │  /chat   │  │          │  │/progress │   │
│  │nextauth] │  │  /history│  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘    │
│                                                              │
└──────┬────────────────┬──────────────────┬──────────────────┘
       │                │                  │
       │                │                  │
       ▼                ▼                  ▼
┌──────────────┐ ┌─────────────┐   ┌─────────────────┐
│   NextAuth   │ │ Prisma ORM  │   │  Abacus AI API  │
│   (JWT)      │ │             │   │  (GPT-4o-mini)  │
└──────────────┘ └──────┬──────┘   └─────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  PostgreSQL   │
                │   Database    │
                └───────────────┘
```

---

## 📁 Estructura del Proyecto

```
/home/ubuntu/speaklyplan/nextjs_space/
│
├── app/                        # App Router (Next.js 14)
│   ├── api/                    # API Routes
│   │   ├── auth/              # Autenticación
│   │   ├── tutor/             # Endpoints del tutor IA
│   │   ├── progress/          # Progreso de actividades
│   │   └── vocabulary/        # Vocabulario
│   │
│   ├── auth/                   # Páginas de autenticación
│   │   ├── login/
│   │   └── register/
│   │
│   ├── dashboard/              # Panel principal
│   ├── tutor/                  # Tutor de IA
│   ├── vocabulario/            # Sistema de vocabulario
│   ├── guia/                   # Guía de uso
│   ├── recursos/               # Recursos educativos
│   │
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Landing page
│   └── globals.css             # Estilos globales
│
├── components/                 # Componentes reutilizables
│   ├── gamification/          # Componentes de gamificación
│   ├── ui/                    # Shadcn/ui components (50+)
│   └── theme-provider.tsx
│
├── lib/                        # Utilidades y servicios
│   ├── ai/                    # Servicios de IA
│   │   ├── tutor-service.ts
│   │   ├── gamification-service.ts
│   │   ├── prompts.ts
│   │   ├── spaced-repetition.ts
│   │   └── analytics-service.ts
│   │
│   ├── auth.ts                # Configuración NextAuth
│   ├── db.ts                  # Cliente Prisma
│   ├── types.ts               # Tipos TypeScript
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma          # Schema de base de datos
│
├── .env                        # Variables de entorno
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Base de Datos

### Modelos Principales

1. **User** - Información del usuario + gamificación
2. **ChatConversation** - Conversaciones con el tutor
3. **ChatMessage** - Mensajes individuales
4. **LearningContext** - Perfil de aprendizaje del usuario
5. **VocabularyCard** - Tarjetas de vocabulario (SM-2)
6. **PlanWeek** - Semanas del plan de estudios
7. **PlanActivity** - Actividades diarias
8. **UserProgress** - Progreso del usuario
9. **Achievement** - Definición de logros
10. **UserAchievement** - Logros desbloqueados

### Diagrama de Relaciones

```
User
 ├── ChatConversation → ChatMessage
 ├── LearningContext
 ├── VocabularyCard
 ├── UserProgress → PlanActivity → PlanWeek → PlanPhase
 ├── UserVocabularyProgress → VocabularyTerm → VocabularyCategory
 ├── UserAchievement → Achievement
 ├── CommonMistake
 ├── PracticeSession
 └── SessionAnalytics
```

---

## 🤖 Sistema de IA

### Tutor Conversacional

**Proveedor:** Abacus AI (compatible con OpenAI)  
**Modelo:** GPT-4o-mini  
**Temperatura:** 0.7  
**Max Tokens:** 300

**Características:**
- Adaptación al nivel CEFR (A1-C2)
- Corrección gramatical en tiempo real
- Traducción para principiantes (A1-A2)
- 5 contextos: casual, meeting, interview, email, grammar
- Detección de vocabulario usado
- Análisis de errores comunes

### Prompts Inteligentes

```typescript
// Prompt del Sistema
getTutorSystemPrompt(learningContext)
// Define personalidad, nivel, y comportamiento

// Prompt Contextual
getContextualPrompt(context, vocabulary)
// Ajusta conversación según contexto seleccionado

// Análisis de Gramática
getGrammarAnalysisPrompt(text, level)
// Detecta y explica errores gramaticales

// Traducción
getTranslationPrompt(text)
// Traduce al español
```

### Flujo de Conversación

```
1. Usuario envía mensaje
2. Se guarda en DB (ChatMessage)
3. Se obtiene LearningContext del usuario
4. Se construyen prompts (system + contextual)
5. Se llama a Abacus AI API
6. Se analiza gramática (si nivel A1-B1)
7. Se traduce respuesta (si nivel A1-A2)
8. Se guarda respuesta del tutor
9. Se actualizan métricas y errores comunes
10. Se otorgan puntos y verifica logros
```

---

## 🎮 Sistema de Gamificación

### Puntos

```typescript
const POINTS = {
  MESSAGE_SENT: 5,
  SESSION_COMPLETED: 20,
  PERFECT_GRAMMAR: 50,
  NEW_WORD_LEARNED: 10,
  VOCABULARY_REVIEWED: 5,
  DAILY_GOAL_ACHIEVED: 30,
}
```

### Niveles

```typescript
// Fórmula: level = floor(sqrt(points / 100)) + 1
function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

// Ejemplos:
// 0 pts → Nivel 1
// 100 pts → Nivel 2
// 400 pts → Nivel 3
// 900 pts → Nivel 4
// 1,600 pts → Nivel 5
```

### Logros

**Categorías:**
- 🔥 Rachas (3, 7, 30 días)
- 💬 Mensajes (10, 100, 500)
- 🎯 Sesiones (5, 25, 100)
- ✅ Gramática perfecta
- 📖 Vocabulario (50, 200 palabras)

**Total:** 12 logros únicos

---

## 🔐 Autenticación

**Sistema:** NextAuth.js v4  
**Estrategia:** JWT  
**Proveedor:** CredentialsProvider (email/password)  
**Hashing:** bcrypt (10 rounds)

### Protección de Rutas

```typescript
// Servidor
const session = await getServerSession(authOptions);
if (!session) redirect('/auth/login');

// Cliente
const { data: session, status } = useSession() || {};
if (status === 'unauthenticated') redirect('/auth/login');
```

---

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/[...nextauth]` - Login/Logout
- `POST /api/signup` - Registro

### Tutor IA
- `POST /api/tutor/chat` - Enviar mensaje
- `GET /api/tutor/chat?conversationId={id}` - Obtener conversación
- `GET /api/tutor/history` - Historial
- `GET /api/tutor/context` - Contexto de aprendizaje
- `GET /api/tutor/analytics` - Analíticas
- `POST /api/tutor/gamification` - Actualizar gamificación
- `GET /api/tutor/vocabulary-cards` - Tarjetas de vocabulario
- `PUT /api/tutor/vocabulary-cards/{id}` - Revisar tarjeta

### Progreso
- `GET /api/progress` - Obtener progreso
- `POST /api/progress` - Marcar actividad completada

### Vocabulario
- `GET /api/vocabulary/progress` - Progreso de vocabulario
- `POST /api/vocabulary/progress` - Marcar palabra aprendida

---

## 🚀 Comandos

### Desarrollo

```bash
# Instalar dependencias
yarn install

# Modo desarrollo
yarn dev

# Build para producción
yarn build

# Iniciar producción
yarn start
```

### Base de Datos

```bash
# Generar cliente Prisma
yarn prisma generate

# Crear migración
yarn prisma migrate dev --name nombre_migracion

# Aplicar migraciones
yarn prisma migrate deploy

# Abrir Prisma Studio
yarn prisma studio

# Reset database (CUIDADO)
yarn prisma migrate reset

# Seed database
yarn prisma db seed
```

---

## 🌐 Variables de Entorno

```bash
# .env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
ABACUSAI_API_KEY="..."
```

**⚠️ IMPORTANTE:** NO modificar DATABASE_URL ni NEXTAUTH_SECRET sin coordinación con el equipo.

---

## 📚 Stack Tecnológico

### Frontend
- Next.js 14.2.28 (App Router)
- React 18.2.0
- TypeScript 5.2.2
- Tailwind CSS 3.3.3
- Shadcn/ui + Radix UI
- Framer Motion 10.18.0
- Zustand 5.0.3
- React Query 5.0.0

### Backend
- Next.js API Routes
- Prisma ORM 6.7.0
- PostgreSQL
- NextAuth.js 4.24.11
- bcryptjs 2.4.3

### IA y Analíticas
- Abacus AI API
- GPT-4o-mini
- Chart.js 4.4.9
- Canvas Confetti 1.9.3

---

## 🧪 Testing (Pendiente)

```bash
# Run tests
yarn test

# Run tests en modo watch
yarn test:watch

# Coverage
yarn test:coverage
```

---

## 📄 Documentación Completa

Para más detalles técnicos, consultar:

1. **ARQUITECTURA_TECNICA.md** - Arquitectura completa del sistema
2. **DESARROLLO_RAPIDO.md** - Guía rápida de desarrollo
3. **DATOS_SEMILLA.md** - Estructura de datos y seeds
4. **.internal/NOTAS_DESARROLLO.md** - Notas internas (privado)

---

## 🤝 Contribución

### Branching
```
main: Producción
develop: Desarrollo
feature/*: Nuevas funcionalidades
fix/*: Corrección de bugs
```

### Commits
```
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Documentación
style: Estilos
refactor: Refactorización
test: Tests
chore: Mantenimiento
```

---

## 📞 Soporte

**Proyecto:** SpeaklyPlan  
**Versión:** 1.0  
**Ubicación:** `/home/ubuntu/speaklyplan/`  
**Última actualización:** 09 de Octubre de 2025

---

## ⚖️ Licencia

Proyecto propietario - Todos los derechos reservados

---

**FIN DEL README TÉCNICO**
