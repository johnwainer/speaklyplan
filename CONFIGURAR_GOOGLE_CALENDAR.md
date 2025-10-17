
# 🔧 Guía de Configuración de Google Calendar

## Error 400: Configuración Requerida

El error 400 que estás experimentando se debe a que las credenciales de Google OAuth no están configuradas. Aquí te explico cómo solucionarlo paso a paso.

## 📋 Pasos para Configurar Google OAuth

### 1. Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el menú desplegable del proyecto (arriba a la izquierda)
3. Clic en "Nuevo Proyecto"
4. Ingresa un nombre: **SpeaklyPlan** (o el que prefieras)
5. Haz clic en "Crear"
6. Espera a que se cree el proyecto (unos segundos)
7. Selecciona el nuevo proyecto desde el menú desplegable

### 2. Habilitar la API de Google Calendar

1. En el menú lateral, ve a **APIs y servicios** > **Biblioteca**
2. Busca "Google Calendar API"
3. Haz clic en "Google Calendar API"
4. Haz clic en el botón **"HABILITAR"**
5. Espera unos segundos a que se habilite

### 3. Configurar la Pantalla de Consentimiento OAuth

1. En el menú lateral, ve a **APIs y servicios** > **Pantalla de consentimiento de OAuth**
2. Selecciona **"Externo"** (a menos que tengas Google Workspace)
3. Haz clic en **"Crear"**

#### Información de la Aplicación:
- **Nombre de la aplicación:** SpeaklyPlan
- **Correo electrónico de asistencia al usuario:** [Tu correo electrónico]
- **Logotipo de la aplicación:** (Opcional)

#### Información de Contacto del Desarrollador:
- **Direcciones de correo electrónico:** [Tu correo electrónico]

4. Haz clic en **"Guardar y continuar"**

#### Ámbitos (Scopes):
5. Haz clic en **"Añadir o quitar ámbitos"**
6. Busca y selecciona:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
7. Haz clic en **"Actualizar"**
8. Haz clic en **"Guardar y continuar"**

#### Usuarios de Prueba:
9. Haz clic en **"Añadir usuarios"**
10. Agrega tu correo electrónico (alejandrozapata.9806@gmail.com)
11. Agrega cualquier otro correo de usuarios que quieras que prueben
12. Haz clic en **"Añadir"**
13. Haz clic en **"Guardar y continuar"**

14. Revisa el resumen y haz clic en **"Volver al panel"**

### 4. Crear Credenciales OAuth 2.0

1. En el menú lateral, ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **"+ CREAR CREDENCIALES"**
3. Selecciona **"ID de cliente de OAuth 2.0"**

#### Configuración del Cliente OAuth:
- **Tipo de aplicación:** Aplicación web
- **Nombre:** SpeaklyPlan Web Client

#### URIs de Redirección Autorizados:
Agrega las siguientes URLs (haz clic en "+ AGREGAR URI" para cada una):

**Para desarrollo local:**
```
http://localhost:3000/api/google/callback
```

**Para producción (cuando despliegues):**
```
https://speaklyplan.abacusai.app/api/google/callback
```

4. Haz clic en **"CREAR"**

### 5. Copiar las Credenciales

Después de crear el cliente OAuth, verás una ventana emergente con:
- **ID de cliente:** Algo como `123456789-abcdefg.apps.googleusercontent.com`
- **Secreto del cliente:** Algo como `GOCSPX-abc123xyz789`

**¡IMPORTANTE!** Copia estos valores, los necesitarás en el siguiente paso.

### 6. Configurar las Variables de Entorno

Necesitas actualizar el archivo `.env` con las credenciales que acabas de obtener.

Envíame las credenciales y yo las configuraré por ti, o si prefieres, puedes editarlas manualmente:

```env
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
```

**Para producción, también actualiza:**
```env
GOOGLE_REDIRECT_URI=https://speaklyplan.abacusai.app/api/google/callback
```

## ✅ Verificación

Una vez configuradas las credenciales:

1. Reinicia el servidor de desarrollo
2. Ve a la sección **Prácticas 1 a 1** en tu app
3. Haz clic en **"Conectar con Google"**
4. Deberías ver la pantalla de consentimiento de Google
5. Autoriza la aplicación
6. Serás redirigido de vuelta a tu app con la conexión exitosa

## 🔒 Seguridad

- **NUNCA** compartas tus credenciales públicamente
- **NUNCA** las subas a GitHub sin usar `.gitignore`
- Estas credenciales son solo para tu uso personal

## 🚀 Cuando despliegues a producción

Recuerda:
1. Agregar la URL de producción en las URIs de redirección autorizadas en Google Cloud Console
2. Actualizar `GOOGLE_REDIRECT_URI` en las variables de entorno de producción
3. Las credenciales son las mismas para desarrollo y producción

## 📞 ¿Necesitas ayuda?

Si tienes problemas o preguntas durante el proceso:
1. Copia el mensaje de error exacto
2. Menciona en qué paso estás
3. Te ayudaré a resolverlo

---

**Nota:** Este proceso solo necesitas hacerlo una vez. Una vez configurado, funcionará para todos los usuarios de tu aplicación.
