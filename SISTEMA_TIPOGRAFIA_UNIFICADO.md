
# 🎨 Sistema de Tipografía Unificado - SpeaklyPlan

## 📋 Análisis Actual

### Problemas Identificados:
- ❌ Uso de tamaños fijos muy pequeños (`text-[10px]`)
- ❌ Inconsistencia entre vistas
- ❌ Falta de jerarquía visual clara
- ❌ Algunos textos difíciles de leer en móviles

## 🎯 Sistema Propuesto

### Escala Tipográfica (Mobile-First)

```
Título Principal (H1):     text-2xl sm:text-3xl lg:text-4xl (24px → 30px → 36px)
Título Sección (H2):       text-xl sm:text-2xl lg:text-3xl   (20px → 24px → 30px)
Subtítulo (H3):            text-lg sm:text-xl lg:text-2xl    (18px → 20px → 24px)
Título Card (H4):          text-base sm:text-lg              (16px → 18px)
Cuerpo Grande:             text-base sm:text-lg              (16px → 18px)
Cuerpo Normal:             text-sm sm:text-base              (14px → 16px)
Cuerpo Pequeño:            text-xs sm:text-sm                (12px → 14px)
Caption/Metadata:          text-xs                           (12px)
```

### Aplicación por Vista:

#### 1. **Dashboard**
- Título "¡Empieza aquí!": `text-xl sm:text-2xl`
- Títulos de cards: `text-base sm:text-lg`
- Descripciones: `text-sm sm:text-base`
- Metadatos: `text-xs sm:text-sm`

#### 2. **Tutor AI**
- Mensajes del tutor: `text-sm sm:text-base`
- Mensajes del usuario: `text-sm sm:text-base`
- Análisis y feedback: `text-xs sm:text-sm`
- Badges: `text-xs`

#### 3. **Vocabulario**
- Término principal: `text-lg sm:text-xl`
- Definiciones: `text-sm sm:text-base`
- Ejemplos: `text-xs sm:text-sm`
- Estadísticas: `text-xs sm:text-sm`

#### 4. **Práctica 1 a 1**
- Títulos de sesión: `text-base sm:text-lg`
- Información de usuario: `text-sm sm:text-base`
- Metadatos: `text-xs sm:text-sm`

#### 5. **Guía**
- Títulos de semana: `text-lg sm:text-xl`
- Títulos de actividad: `text-base sm:text-lg`
- Descripciones: `text-sm sm:text-base`
- Duración/metadata: `text-xs sm:text-sm`

#### 6. **Recursos**
- Títulos de recursos: `text-base sm:text-lg`
- Descripciones: `text-sm sm:text-base`
- Tags: `text-xs`

#### 7. **Perfil**
- Nombre de usuario: `text-xl sm:text-2xl`
- Secciones: `text-lg sm:text-xl`
- Información: `text-sm sm:text-base`
- Labels: `text-xs sm:text-sm`

## 🎨 Pesos de Fuente

```
Ultra Bold:    font-extrabold  (800)
Bold:          font-bold       (700)
Semibold:      font-semibold   (600)
Medium:        font-medium     (500)
Regular:       font-normal     (400)
Light:         font-light      (300)
```

### Uso Recomendado:
- **Títulos principales**: `font-bold` o `font-extrabold`
- **Subtítulos**: `font-semibold` o `font-bold`
- **Cuerpo**: `font-normal` o `font-medium`
- **Metadatos**: `font-normal` o `font-medium`

## 📱 Responsive

Todos los tamaños usan breakpoints:
- **Base (móvil)**: Sin prefijo
- **Small (640px+)**: `sm:`
- **Medium (768px+)**: `md:`
- **Large (1024px+)**: `lg:`

## ✅ Beneficios

1. ✨ **Legibilidad mejorada** en todos los dispositivos
2. 🎯 **Jerarquía visual clara** y consistente
3. 📱 **Responsive** y adaptable
4. 🚀 **Moderna** y profesional
5. ♿ **Accesible** para todos los usuarios

---
*Documento creado: Octubre 2025*
