# 📱 Guía Completa para Publicar viclean en Play Store

## ✅ SÍ, puedes publicar sin Android Studio usando Expo

Esta guía te llevará paso a paso desde tu código actual hasta la publicación en Google Play Store.

---

## 📋 REQUISITOS PREVIOS

### 1. Cuenta de Desarrollador de Google Play
- Costo: $25 USD (pago único, de por vida)
- Registro: https://play.google.com/console/signup
- Proceso de verificación: 1-2 días

### 2. Instalaciones Necesarias
```bash
# Instalar Expo CLI globalmente
npm install -g eas-cli

# Iniciar sesión en Expo
eas login

# O crear cuenta nueva
eas register
```

---

## 🚀 PROCESO DE PUBLICACIÓN

### PASO 1: Preparar la Aplicación

#### 1.1 Actualizar información en `app.json`
Ya está configurado con:
- ✅ Nombre: "viclean"
- ✅ Package: "com.andresrico.vicleanmobile"
- ✅ Versión: 1.0.0
- ✅ Permisos: Ubicación, Cámara, Almacenamiento

#### 1.2 Verificar que tengas todos los assets
```
mobile/assets/
  ├── icon.png           (1024x1024px - Ícono de la app)
  ├── adaptive-icon.png  (1024x1024px - Ícono adaptativo Android)
  ├── splash-icon.png    (2048x2048px - Pantalla de inicio)
  └── favicon.png        (48x48px - Para web)
```

**Si no tienes los assets**, puedes crearlos temporalmente:
```bash
# Navega a la carpeta mobile
cd mobile

# Crea íconos básicos (reemplaza con diseños profesionales después)
# Puedes usar herramientas online como:
# - https://appicon.co/
# - https://makeappicon.com/
```

---

### PASO 2: Configurar EAS Build

#### 2.1 Inicializar EAS en tu proyecto
```bash
cd c:\Users\ANDRES\OneDrive\Desktop\andres rico\mobile

# Configurar EAS Build (ya creamos eas.json)
eas build:configure
```

#### 2.2 Crear cuenta y obtener Project ID
```bash
# Esto te dará un Project ID
eas init

# Actualiza app.json con el projectId que te den
```

---

### PASO 3: Compilar el APK/AAB

#### 3.1 Build de Prueba (APK)
```bash
# Compilar APK para pruebas
eas build --platform android --profile preview

# Esto tomará 10-20 minutos
# Te dará un link para descargar el APK
```

#### 3.2 Build de Producción (AAB para Play Store)
```bash
# Compilar AAB para publicación
eas build --platform android --profile production

# Expo generará automáticamente las firmas necesarias
```

**Importante**: 
- ✅ La primera vez, EAS te preguntará si quieres que genere un keystore automáticamente
- ✅ **Di que SÍ** - Expo manejará todo esto por ti
- ✅ Guarda el keystore que te generen (para actualizaciones futuras)

---

### PASO 4: Preparar Material para Play Store

#### 4.1 Screenshots Requeridos
Necesitas capturas de pantalla:
- **Mínimo**: 2 screenshots
- **Recomendado**: 8 screenshots
- **Tamaño**: 1080x1920px o similar (16:9 ratio)
- **Formato**: JPG o PNG

**Pantallas sugeridas para capturar**:
1. LoginScreen - Pantalla de inicio
2. CustomerHomeScreen - Pantalla principal
3. ServiceCatalogScreen - Catálogo de servicios
4. ServiceDetailScreen - Detalle de servicio
5. ScheduleServiceScreen - Agendar servicio
6. TrackingScreen - Seguimiento en tiempo real
7. ChatScreen - Chat con proveedor
8. UserProfileScreen - Perfil de usuario

#### 4.2 Gráficos de Funciones
- **Feature Graphic**: 1024x500px (obligatorio)
- **App Icon**: Ya lo tienes en `icon.png`

#### 4.3 Descripción de la App

**Título (máx. 50 caracteres)**:
```
viclean - Limpieza a Domicilio
```

**Descripción corta (máx. 80 caracteres)**:
```
Servicios de limpieza profesional bajo demanda. Rápido, fácil y confiable.
```

**Descripción completa (máx. 4000 caracteres)**:
```
🧽 viclean - Tu Solución Inteligente de Limpieza a Domicilio

¿Necesitas ayuda con la limpieza de tu hogar? viclean conecta clientes con profesionales verificados de limpieza en tu área.

✨ CARACTERÍSTICAS PRINCIPALES:

🔍 Encuentra Profesionales Verificados
• Amplio catálogo de servicios de limpieza
• Perfiles detallados con calificaciones y reseñas
• Proveedores verificados y confiables

📅 Reserva Fácil y Rápida
• Agenda servicios en minutos
• Selecciona fecha y hora conveniente
• Pagos seguros integrados

📍 Seguimiento en Tiempo Real
• Rastrea a tu profesional en el mapa
• Comunicación directa por chat
• Notificaciones del estado del servicio

💎 Servicios Disponibles:
• Limpieza profunda completa
• Limpieza express (1 hora)
• Limpieza de oficinas
• Limpieza post-construcción
• Limpieza de ventanas
• Lavado de alfombras y tapicería
• Organización de espacios

🎯 BENEFICIOS:

Para Clientes:
✅ Profesionales verificados y confiables
✅ Precios transparentes y competitivos
✅ Programa de lealtad y descuentos
✅ Soporte 24/7
✅ Garantía de satisfacción

Para Profesionales:
✅ Obtén más clientes fácilmente
✅ Gestiona tu calendario
✅ Pagos seguros y puntuales
✅ Panel de análisis de desempeño

🔒 SEGURIDAD:
• Verificación de identidad de todos los proveedores
• Pagos seguros con encriptación
• Sistema de calificaciones bidireccional
• Soporte al cliente disponible siempre

📱 DESCARGA VICLEAN HOY
Únete a miles de usuarios satisfechos que ya disfrutan de hogares limpios y ordenados sin complicaciones.

¿Eres profesional de la limpieza? Postúlate directamente desde la app y comienza a recibir solicitudes.
```

---

### PASO 5: Crear Listado en Play Console

#### 5.1 Acceder a Google Play Console
1. Ve a: https://play.google.com/console
2. Clic en "Crear aplicación"
3. Completa:
   - Nombre: viclean
   - Idioma predeterminado: Español (Latinoamérica)
   - Tipo: App
   - Gratis/Pago: Gratis

#### 5.2 Configurar Ficha de Play Store
En el menú lateral, completa cada sección:

**a) Ficha de Play Store principal**:
- Título de la app
- Descripción corta
- Descripción completa
- Ícono de la app (512x512px)
- Gráfico destacado (1024x500px)
- Capturas de pantalla

**b) Configuración de la app**:
- Categoría: "Estilo de vida" o "Productividad"
- Información de contacto (email, sitio web)
- Política de privacidad (URL)

**c) Clasificación de contenido**:
- Completar cuestionario
- Para CleanHome: probablemente "PEGI 3" o "Apto para todos"

**d) Público objetivo y contenido**:
- Edad objetivo: 18+
- Declarar si tiene anuncios: No (por ahora)

---

### PASO 6: Subir el Build

#### 6.1 Crear Release de Producción
```bash
# Opción 1: Upload manual del AAB
# Descarga el .aab que generó EAS Build
# Ve a Play Console > Producción > Crear nueva versión
# Sube el archivo .aab

# Opción 2: Submit automático con EAS
eas submit --platform android --profile production
```

#### 6.2 Configurar la versión
- Nombre de la versión: "1.0.0 - Lanzamiento inicial"
- Notas de la versión (qué hay de nuevo):
```
🎉 Lanzamiento inicial de viclean

✨ Características incluidas:
• Búsqueda y reserva de servicios de limpieza
• Seguimiento en tiempo real
• Chat con proveedores
• Sistema de calificaciones
• Programa de lealtad
• Múltiples métodos de pago

¡Gracias por descargar viclean!
```

---

### PASO 7: Pruebas Internas/Cerradas (Recomendado)

Antes de publicar para todos:

```bash
# En Play Console:
# 1. Ir a "Pruebas" > "Prueba interna"
# 2. Crear nueva versión
# 3. Agregar tu email y algunos testers
# 4. Subir el AAB
# 5. Publicar en prueba interna

# Esto te permite probar la app desde Play Store
# sin que esté disponible públicamente
```

---

### PASO 8: Publicación Final

#### 8.1 Revisar todo
- ✅ Ficha de Play Store completa
- ✅ Screenshots subidos
- ✅ Clasificación de contenido
- ✅ Política de privacidad
- ✅ AAB subido
- ✅ Configuración de precios

#### 8.2 Enviar a revisión
1. En Play Console > Producción
2. Clic en "Enviar versión para revisión"
3. Google revisará tu app (1-7 días)
4. Recibirás un email cuando sea aprobada

#### 8.3 ¡Publicar!
Una vez aprobada:
- Tu app estará en Play Store
- Los usuarios podrán buscarla y descargarla
- Usualmente tarda 2-4 horas en aparecer en búsquedas

---

## 🔄 ACTUALIZACIONES FUTURAS

Para actualizar tu app:

```bash
# 1. Actualizar versión en app.json
# "version": "1.0.1"
# "android.versionCode": 2

# 2. Compilar nueva versión
eas build --platform android --profile production

# 3. Subir a Play Console
eas submit --platform android --profile production

# 4. Publicar actualización
```

---

## 📝 COMANDOS RÁPIDOS RESUMIDOS

```bash
# Configuración inicial (solo una vez)
cd mobile
npm install -g eas-cli
eas login
eas init
eas build:configure

# Build de prueba
eas build --platform android --profile preview

# Build de producción
eas build --platform android --profile production

# Submit automático a Play Store
eas submit --platform android --profile production
```

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### API Keys y Seguridad
**IMPORTANTE**: Tu Google Maps API Key está expuesta en `app.json`. Antes de publicar:

1. **Restringir la API Key**:
   - Ve a Google Cloud Console
   - Restringe la key solo a tu package: `com.andresrico.vicleanmobile`
   - Restringe a APIs específicas: Maps SDK for Android

2. **Variables de entorno**:
   - Considera mover API keys a variables de entorno
   - Usa `expo-constants` para acceder a ellas

### Backend
- ✅ Asegúrate que tu backend esté en un servidor accesible
- ✅ Cambia `http://192.168.0.10:8080` por tu URL de producción
- ✅ Usa HTTPS para todas las peticiones

### Política de Privacidad
Google requiere una política de privacidad. Puedes usar generadores como:
- https://www.privacypolicygenerator.info/
- https://app-privacy-policy-generator.firebaseapp.com/

---

## 🎯 CHECKLIST FINAL

Antes de publicar, verifica:

- [ ] Cuenta de Google Play Developer activa ($25)
- [ ] app.json configurado correctamente
- [ ] Assets (iconos, splash screen) creados
- [ ] EAS CLI instalado y configurado
- [ ] Build exitoso (AAB generado)
- [ ] Screenshots de la app capturados
- [ ] Descripción de la app escrita
- [ ] Política de privacidad publicada
- [ ] API Keys restringidas y seguras
- [ ] Backend en producción (HTTPS)
- [ ] App probada en modo preview
- [ ] Ficha de Play Store completa
- [ ] Clasificación de contenido completada

---

## 💡 TIPS PROFESIONALES

1. **Versiones de prueba primero**: Siempre usa "Prueba interna" antes de producción

2. **ASO (App Store Optimization)**: 
   - Usa palabras clave en el título
   - Screenshots atractivos y descriptivos
   - Video preview (opcional pero recomendado)

3. **Monitoreo**:
   - Configura Google Analytics en tu app
   - Usa Crashlytics para detectar errores
   - Revisa reseñas y responde rápido

4. **Marketing**:
   - Prepara materiales promocionales
   - Crea landing page
   - Comparte en redes sociales

---

## 🆘 PROBLEMAS COMUNES

### "Build failed"
```bash
# Verifica que todas las dependencias estén instaladas
cd mobile
npm install

# Limpia caché
npx expo start --clear
```

### "Keystore issues"
- Expo maneja esto automáticamente
- Si tienes problemas, usa: `eas credentials`

### "App rejected"
- Lee el email de Google cuidadosamente
- Usualmente es por política de privacidad o permisos
- Corrige y vuelve a enviar

---

## 📞 RECURSOS ÚTILES

- **Expo Docs**: https://docs.expo.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Play Console**: https://play.google.com/console/
- **Expo Status**: https://status.expo.dev/
- **Forum Expo**: https://forums.expo.dev/

---

## ✅ CONCLUSIÓN

**NO necesitas Android Studio** para publicar tu app. Expo maneja todo el proceso de compilación en la nube, generación de firmas, y puede incluso enviar automáticamente a Play Store.

**Tiempo estimado del proceso completo**: 
- Primera vez: 4-6 horas (incluyendo registro y aprendizaje)
- Actualizaciones: 30-60 minutos

**Costo total**:
- Cuenta Google Play Developer: $25 USD (único pago)
- Expo EAS: Gratis para primeros builds, luego desde $29/mes (o compila localmente gratis)

¡Buena suerte con tu publicación! 🚀
