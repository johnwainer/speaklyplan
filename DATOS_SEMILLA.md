
# DATOS DE SEMILLA (SEEDS) - SPEAKLYPLAN

## 📊 ESTRUCTURA DE DATOS INICIAL

Este documento contiene los datos de semilla que se deben cargar en la base de datos para que la aplicación funcione correctamente.

---

## 1. PLAN DE 6 MESES (26 SEMANAS)

### Estructura del Plan

El plan está dividido en **4 fases principales**:

1. **Fase 1: Fundamentos (Semanas 1-6)**
2. **Fase 2: Consolidación (Semanas 7-13)**
3. **Fase 3: Desarrollo Profesional (Semanas 14-20)**
4. **Fase 4: Maestría y Fluidez (Semanas 21-26)**

### Formato de Semana

Cada semana contiene:
- **Número de semana:** 1-26
- **Mes:** 1-6
- **Objetivo:** Descripción del objetivo semanal
- **Actividades diarias:** 7 actividades (Lunes a Domingo)

### Formato de Actividad

Cada actividad contiene:
- **Día:** "lunes", "martes", "miércoles", etc.
- **Título:** Nombre corto de la actividad
- **Descripción:** Descripción detallada de qué hacer
- **Duración:** Minutos estimados
- **Categoría:** "vocabulario", "speaking", "listening", "grammar", "reading", "writing", "review"

### Ejemplo de Semana (Semana 1)

```json
{
  "number": 1,
  "month": 1,
  "phase": "Fase 1: Fundamentos",
  "objective": "Introducción al inglés profesional y vocabulario básico de tecnología",
  "activities": [
    {
      "day": "lunes",
      "dayNumber": 1,
      "title": "Alfabeto y pronunciación básica",
      "description": "Repasar el alfabeto en inglés y practicar la pronunciación de letras comunes en tecnología (API, UI, UX, etc.)",
      "duration": 30,
      "category": "speaking"
    },
    {
      "day": "martes",
      "dayNumber": 2,
      "title": "Vocabulario: Tecnología básica",
      "description": "Aprender 10 palabras clave: computer, software, hardware, program, code, bug, data, network, server, user",
      "duration": 30,
      "category": "vocabulario"
    },
    // ... más actividades
  ]
}
```

**NOTA:** El plan completo de 26 semanas con todas las actividades se debe generar o importar desde un archivo de datos. Por razones de espacio, aquí solo se muestra el formato.

---

## 2. CATEGORÍAS DE VOCABULARIO

### Estructura

```json
[
  {
    "name": "Comunicación Profesional",
    "icon": "💼",
    "description": "Vocabulario para comunicación efectiva en entornos profesionales"
  },
  {
    "name": "Tecnología y Software",
    "icon": "💻",
    "description": "Términos técnicos relacionados con desarrollo de software"
  },
  {
    "name": "Reuniones y Presentaciones",
    "icon": "📊",
    "description": "Expresiones útiles para reuniones y presentaciones"
  },
  {
    "name": "Gestión de Proyectos",
    "icon": "📋",
    "description": "Vocabulario para gestión y coordinación de proyectos"
  },
  {
    "name": "Liderazgo y Gestión",
    "icon": "👥",
    "description": "Términos relacionados con liderazgo de equipos"
  },
  {
    "name": "Finanzas y Negocios",
    "icon": "💰",
    "description": "Vocabulario para discusiones financieras y de negocios"
  },
  {
    "name": "Networking y Eventos",
    "icon": "🤝",
    "description": "Expresiones para networking y eventos profesionales"
  },
  {
    "name": "Email y Comunicación Escrita",
    "icon": "📧",
    "description": "Frases y vocabulario para emails profesionales"
  }
]
```

---

## 3. TÉRMINOS DE VOCABULARIO

### Formato

```json
{
  "categoryId": "category_id",
  "term": "palabra en inglés",
  "pronunciation": "pronunciación fonética",
  "translation": "traducción al español",
  "example": "ejemplo de uso en contexto",
  "difficulty": "beginner" | "intermediate" | "advanced"
}
```

### Ejemplos por Categoría

#### Comunicación Profesional (20 términos)

```json
[
  {
    "term": "meeting",
    "pronunciation": "/ˈmiːtɪŋ/",
    "translation": "reunión",
    "example": "Let's schedule a meeting for next week",
    "difficulty": "beginner"
  },
  {
    "term": "deadline",
    "pronunciation": "/ˈdedlaɪn/",
    "translation": "fecha límite",
    "example": "We need to meet the deadline by Friday",
    "difficulty": "beginner"
  },
  {
    "term": "follow up",
    "pronunciation": "/ˈfɑːloʊ ʌp/",
    "translation": "hacer seguimiento",
    "example": "I'll follow up with you tomorrow",
    "difficulty": "intermediate"
  },
  {
    "term": "stakeholder",
    "pronunciation": "/ˈsteɪkhoʊldər/",
    "translation": "parte interesada",
    "example": "We need to inform all stakeholders about the changes",
    "difficulty": "advanced"
  }
  // ... más términos
]
```

#### Tecnología y Software (30 términos)

```json
[
  {
    "term": "bug",
    "pronunciation": "/bʌɡ/",
    "translation": "error, fallo",
    "example": "We found a bug in the production code",
    "difficulty": "beginner"
  },
  {
    "term": "deploy",
    "pronunciation": "/dɪˈplɔɪ/",
    "translation": "desplegar, implementar",
    "example": "We will deploy the new version tomorrow",
    "difficulty": "intermediate"
  },
  {
    "term": "scalability",
    "pronunciation": "/ˌskeɪləˈbɪləti/",
    "translation": "escalabilidad",
    "example": "We need to improve the scalability of our system",
    "difficulty": "advanced"
  }
  // ... más términos
]
```

**Total de vocabulario:** ~200-300 términos distribuidos en 8 categorías

---

## 4. CATEGORÍAS DE RECURSOS

### Estructura

```json
[
  {
    "name": "Cursos Online",
    "description": "Cursos estructurados para aprender inglés"
  },
  {
    "name": "Podcasts",
    "description": "Podcasts en inglés para mejorar listening"
  },
  {
    "name": "Canales de YouTube",
    "description": "Canales educativos de YouTube"
  },
  {
    "name": "Apps Móviles",
    "description": "Aplicaciones para practicar en el móvil"
  },
  {
    "name": "Libros y eBooks",
    "description": "Libros recomendados para aprender inglés"
  },
  {
    "name": "Sitios Web",
    "description": "Sitios web útiles para practicar"
  },
  {
    "name": "Comunidades",
    "description": "Comunidades online para practicar inglés"
  },
  {
    "name": "Herramientas",
    "description": "Herramientas útiles para aprender inglés"
  }
]
```

---

## 5. RECURSOS EDUCATIVOS

### Formato

```json
{
  "categoryId": "category_id",
  "name": "Nombre del recurso",
  "description": "Descripción breve del recurso",
  "url": "https://url-del-recurso.com",
  "platform": "Web" | "iOS" | "Android" | "All",
  "rating": 1-5,
  "isFree": true | false
}
```

### Ejemplos por Categoría

#### Cursos Online

```json
[
  {
    "name": "Duolingo English",
    "description": "Curso gamificado de inglés desde cero",
    "url": "https://www.duolingo.com/course/en/es",
    "platform": "All",
    "rating": 5,
    "isFree": true
  },
  {
    "name": "Coursera - Business English",
    "description": "Curso de inglés para negocios",
    "url": "https://www.coursera.org/specializations/business-english",
    "platform": "Web",
    "rating": 5,
    "isFree": false
  }
]
```

#### Podcasts

```json
[
  {
    "name": "All Ears English",
    "description": "Podcast diario sobre inglés estadounidense",
    "url": "https://www.allearsenglish.com/",
    "platform": "All",
    "rating": 5,
    "isFree": true
  },
  {
    "name": "Business English Pod",
    "description": "Podcast especializado en inglés de negocios",
    "url": "https://www.businessenglishpod.com/",
    "platform": "All",
    "rating": 5,
    "isFree": true
  }
]
```

#### Canales de YouTube

```json
[
  {
    "name": "English with Lucy",
    "description": "Lecciones de inglés británico con enfoque en pronunciación",
    "url": "https://www.youtube.com/@EnglishwithLucy",
    "platform": "Web",
    "rating": 5,
    "isFree": true
  },
  {
    "name": "Learn English with TV Series",
    "description": "Aprende inglés con escenas de series populares",
    "url": "https://www.youtube.com/@LearnEnglishWithTVSeries",
    "platform": "Web",
    "rating": 5,
    "isFree": true
  }
]
```

**Total de recursos:** ~50-100 recursos curados

---

## 6. LOGROS (ACHIEVEMENTS)

Los logros se definen en código en `lib/ai/gamification-service.ts` y se crean automáticamente en la base de datos cuando se detectan.

### Definición

```typescript
const ACHIEVEMENTS = [
  // Rachas
  {
    code: 'STREAK_3',
    name: '🔥 En Racha',
    description: '3 días consecutivos practicando',
    category: 'streak',
    threshold: 3,
    points: 50,
    icon: '🔥',
  },
  {
    code: 'STREAK_7',
    name: '🔥 Una Semana Completa',
    description: '7 días consecutivos practicando',
    category: 'streak',
    threshold: 7,
    points: 150,
    icon: '🔥',
  },
  // ... más logros
];
```

---

## 7. USUARIO DE PRUEBA

Para testing, crear un usuario de prueba:

```json
{
  "email": "test@speaklyplan.com",
  "password": "Test123!",
  "name": "Usuario de Prueba",
  "role": "user",
  "points": 500,
  "level": 3,
  "currentStreak": 7,
  "bestStreak": 10
}
```

---

## 8. SCRIPT DE SEED

### Ubicación del Script

El script de seed debe estar en: `prisma/seed.ts`

### Comandos para Ejecutar Seeds

```bash
# Ejecutar seeds
yarn prisma db seed

# Reset database y ejecutar seeds
yarn prisma migrate reset
```

### Estructura del Script de Seed

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Crear fases del plan
  console.log('Creating plan phases...');
  // ...

  // 2. Crear semanas del plan
  console.log('Creating plan weeks...');
  // ...

  // 3. Crear actividades
  console.log('Creating activities...');
  // ...

  // 4. Crear categorías de vocabulario
  console.log('Creating vocabulary categories...');
  // ...

  // 5. Crear términos de vocabulario
  console.log('Creating vocabulary terms...');
  // ...

  // 6. Crear categorías de recursos
  console.log('Creating resource categories...');
  // ...

  // 7. Crear recursos
  console.log('Creating resources...');
  // ...

  // 8. Crear usuario de prueba
  console.log('Creating test user...');
  const hashedPassword = await bcrypt.hash('Test123!', 10);
  await prisma.user.upsert({
    where: { email: 'test@speaklyplan.com' },
    update: {},
    create: {
      email: 'test@speaklyplan.com',
      password: hashedPassword,
      name: 'Usuario de Prueba',
      role: 'user',
      points: 500,
      level: 3,
      currentStreak: 7,
      bestStreak: 10
    }
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 9. VERIFICACIÓN DE DATOS

### Verificar que los datos fueron creados correctamente

```bash
# Abrir Prisma Studio
yarn prisma studio

# Verificar en la GUI:
# - PlanPhase: 4 registros
# - PlanWeek: 26 registros
# - PlanActivity: 182 registros (26 semanas × 7 días)
# - VocabularyCategory: 8 registros
# - VocabularyTerm: 200-300 registros
# - ResourceCategory: 8 registros
# - Resource: 50-100 registros
# - User: al menos 1 (usuario de prueba)
```

### Query SQL para Verificar

```sql
-- Contar registros en cada tabla
SELECT 'PlanPhase' as table_name, COUNT(*) as count FROM "PlanPhase"
UNION ALL
SELECT 'PlanWeek', COUNT(*) FROM "PlanWeek"
UNION ALL
SELECT 'PlanActivity', COUNT(*) FROM "PlanActivity"
UNION ALL
SELECT 'VocabularyCategory', COUNT(*) FROM "VocabularyCategory"
UNION ALL
SELECT 'VocabularyTerm', COUNT(*) FROM "VocabularyTerm"
UNION ALL
SELECT 'ResourceCategory', COUNT(*) FROM "ResourceCategory"
UNION ALL
SELECT 'Resource', COUNT(*) FROM "Resource"
UNION ALL
SELECT 'User', COUNT(*) FROM "User";
```

---

## 10. ACTUALIZACIÓN DE DATOS

### Agregar Nuevos Términos de Vocabulario

```typescript
// En prisma/seed.ts o en una migración
await prisma.vocabularyTerm.createMany({
  data: [
    {
      categoryId: 'tech_category_id',
      term: 'nuevo término',
      pronunciation: '/pronunciación/',
      translation: 'traducción',
      example: 'ejemplo de uso',
      difficulty: 'intermediate'
    },
    // ... más términos
  ]
});
```

### Agregar Nuevos Recursos

```typescript
await prisma.resource.createMany({
  data: [
    {
      categoryId: 'courses_category_id',
      name: 'Nuevo Curso',
      description: 'Descripción del curso',
      url: 'https://url.com',
      platform: 'Web',
      rating: 5,
      isFree: true
    },
    // ... más recursos
  ]
});
```

### Modificar Plan de Estudios

```typescript
// Actualizar objetivo de una semana
await prisma.planWeek.update({
  where: { number: 5 },
  data: {
    objective: 'Nuevo objetivo de la semana 5'
  }
});

// Actualizar una actividad
await prisma.planActivity.update({
  where: { id: 'activity_id' },
  data: {
    title: 'Nuevo título',
    description: 'Nueva descripción',
    duration: 45
  }
});
```

---

**NOTA IMPORTANTE:** Este documento describe la estructura de los datos de semilla. El script completo de seed con todos los datos debe ser generado o importado desde archivos JSON/CSV para facilitar el mantenimiento.

**Última actualización:** 09 de Octubre de 2025
