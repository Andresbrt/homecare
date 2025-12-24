# 🔐 Configuración de Google OAuth para viclean

## SHA-1 del Keystore de Producción

**Fingerprint SHA-1 (obtenido de EAS):**
```
DD:D4:8A:72:FF:0F:4A:91:6A:5B:3B:61:67:7F:CA:70:81:5C:8B:32
```

**Fingerprint SHA-256:**
```
F7:95:F0:20:3B:C6:D2:FA:1F:F6:DC:E2:1E:A8:FB:37:E0:FC:EE:E7:A4:B9:54:1C:D1:3E:55:2A:1B:CB:2A:D8
```

---

## 📋 Pasos para Configurar Google Cloud OAuth

### 1. Crear/Acceder a Proyecto en Google Cloud Console

1. Ve a: https://console.cloud.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombre sugerido: `viclean-mobile`

### 2. Habilitar APIs Necesarias

1. En el menú lateral: **APIs y servicios** > **Biblioteca**
2. Busca y habilita:
   - **Google Maps SDK for Android**
   - **Google+ API** (para autenticación)
   - **People API** (para información de perfil)

### 3. Configurar Pantalla de Consentimiento OAuth

1. Ve a: **APIs y servicios** > **Pantalla de consentimiento de OAuth**
2. Selecciona: **Externo** (para permitir cualquier cuenta de Google)
3. Completa la información:
   - **Nombre de la aplicación:** viclean
   - **Correo de soporte:** tu-email@gmail.com
   - **Logo de la aplicación:** (opcional, sube el icon.png)
   - **Dominios autorizados:** (deja vacío por ahora)
   - **Correo del desarrollador:** tu-email@gmail.com

4. **Scopes (alcances):**
   - Agregar: `userinfo.email`
   - Agregar: `userinfo.profile`
   - Agregar: `openid`

5. Guarda y continúa hasta finalizar

### 4. Crear Credenciales OAuth

#### A. Credencial Android (REQUERIDA)

1. Ve a: **APIs y servicios** > **Credenciales**
2. Clic en: **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**
3. Tipo de aplicación: **Android**
4. Completa:
   - **Nombre:** viclean Android
   - **Nombre del paquete:** `com.andresrico.vicleanmobile`
   - **Huella digital del certificado SHA-1:** `DD:D4:8A:72:FF:0F:4A:91:6A:5B:3B:61:67:7F:CA:70:81:5C:8B:32`
5. Clic en **CREAR**
6. **Copia el Client ID** que se genera (formato: `XXXXXX.apps.googleusercontent.com`)

#### B. Credencial Web (para Expo Auth Proxy)

1. Clic en: **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**
2. Tipo de aplicación: **Aplicación web**
3. Completa:
   - **Nombre:** viclean Web (Expo)
   - **Orígenes de JavaScript autorizados:**
     - `https://auth.expo.io`
   - **URIs de redireccionamiento autorizados:**
     - `https://auth.expo.io/@berduras2341/viclean`
     - `http://localhost:19006` (para desarrollo web local)
4. Clic en **CREAR**
5. **Copia el Client ID Web**

#### C. Credencial iOS (cuando tengas build iOS)

1. Clic en: **+ CREAR CREDENCIALES** > **ID de cliente de OAuth**
2. Tipo de aplicación: **iOS**
3. Completa:
   - **Nombre:** viclean iOS
   - **ID del paquete:** `com.andresrico.vicleanmobile` (o el que uses para iOS)
4. Clic en **CREAR**
5. **Copia el Client ID iOS**

---

## 🔑 Actualizar Variables de Entorno

### Opción 1: Archivo .env local (para desarrollo)

Edita `mobile/.env` y agrega:

```bash
GOOGLE_MAPS_API_KEY=tu_api_key_actual
GOOGLE_ANDROID_CLIENT_ID=XXXXXX-android.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=XXXXXX-ios.apps.googleusercontent.com
GOOGLE_WEB_CLIENT_ID=XXXXXX-web.apps.googleusercontent.com
GOOGLE_EXPO_CLIENT_ID=XXXXXX-web.apps.googleusercontent.com
```

**Nota:** `GOOGLE_EXPO_CLIENT_ID` normalmente usa el mismo valor que `GOOGLE_WEB_CLIENT_ID`.

### Opción 2: EAS Secrets (para builds en la nube)

```powershell
# Navega a la carpeta mobile
cd "c:\Users\ANDRES\OneDrive\Desktop\andres rico\mobile"

# Configura cada secreto
eas secret:create --scope project --name GOOGLE_ANDROID_CLIENT_ID --value "XXXXXX-android.apps.googleusercontent.com"
eas secret:create --scope project --name GOOGLE_IOS_CLIENT_ID --value "XXXXXX-ios.apps.googleusercontent.com"
eas secret:create --scope project --name GOOGLE_WEB_CLIENT_ID --value "XXXXXX-web.apps.googleusercontent.com"
eas secret:create --scope project --name GOOGLE_EXPO_CLIENT_ID --value "XXXXXX-web.apps.googleusercontent.com"

# Listar secretos para verificar
eas secret:list
```

---

## 🧪 Probar la Autenticación

### 1. Instalar el APK en un dispositivo Android

```powershell
# Descarga el APK desde:
# https://expo.dev/accounts/berduras2341/projects/viclean/builds/bd3afb6d-b15b-4870-a342-ec7823c914e9

# Instala en tu dispositivo Android físico o emulador
```

### 2. Probar el Login con Google

1. Abre la app viclean
2. En la pantalla de Login, toca el botón **Google**
3. Deberías ver:
   - La pantalla de consentimiento de Google
   - Lista de cuentas disponibles
   - Permisos solicitados (email, perfil)
4. Selecciona una cuenta y autoriza
5. Si todo está correcto, deberías iniciar sesión exitosamente

### 3. Posibles Errores y Soluciones

#### Error 400: invalid_client
**Causa:** Package name o SHA-1 no coinciden
**Solución:** 
- Verifica que el package sea exactamente: `com.andresrico.vicleanmobile`
- Verifica que el SHA-1 sea: `DD:D4:8A:72:FF:0F:4A:91:6A:5B:3B:61:67:7F:CA:70:81:5C:8B:32`

#### Error: disallowed_useragent
**Causa:** Falta configurar Web Client ID
**Solución:** Asegúrate de haber creado la credencial Web y agregarla a las variables

#### No se abre el navegador / No redirige
**Causa:** Falta `expo-web-browser`
**Solución:** Ya está instalado y configurado en tu proyecto

---

## 📱 Verificar Configuración Actual

### Verificar variables de entorno:

```powershell
cd "c:\Users\ANDRES\OneDrive\Desktop\andres rico\mobile"
Get-Content .env
```

### Verificar secretos en EAS:

```powershell
eas secret:list
```

---

## 🔐 Restringir Google Maps API Key

**IMPORTANTE:** Antes de publicar en producción:

1. Ve a: https://console.cloud.google.com/google/maps-apis/credentials
2. Selecciona tu API Key
3. En **Restricciones de la aplicación:**
   - Selecciona: **Aplicaciones de Android**
   - Agrega restricción:
     - **Nombre del paquete:** `com.andresrico.vicleanmobile`
     - **Huella digital del certificado SHA-1:** `DD:D4:8A:72:FF:0F:4A:91:6A:5B:3B:61:67:7F:CA:70:81:5C:8B:32`
4. En **Restricciones de API:**
   - Selecciona: **Restringir clave**
   - Selecciona solo: **Maps SDK for Android**
5. Guarda los cambios

---

## ✅ Checklist de Configuración OAuth

- [ ] Proyecto creado en Google Cloud Console
- [ ] APIs habilitadas (Maps, Google+, People)
- [ ] Pantalla de consentimiento OAuth configurada
- [ ] Credencial Android creada con SHA-1 correcto
- [ ] Credencial Web creada para Expo
- [ ] Client IDs copiados
- [ ] Variables de entorno actualizadas (.env o EAS Secrets)
- [ ] APK instalado en dispositivo de prueba
- [ ] Login con Google probado exitosamente
- [ ] Google Maps API Key restringida

---

## 🔗 Enlaces Útiles

- **Google Cloud Console:** https://console.cloud.google.com/
- **Expo Auth Session Docs:** https://docs.expo.dev/guides/authentication/
- **Google OAuth Docs:** https://developers.google.com/identity/protocols/oauth2
- **EAS Secrets:** https://docs.expo.dev/build-reference/variables/

---

## 📝 Notas Importantes

1. **Desarrollo vs Producción:**
   - Para desarrollo local (Expo Go), usa `expoClientId`
   - Para APK/AAB de producción, usa `androidClientId`
   - El SHA-1 del debug keystore es diferente al de producción

2. **Actualizaciones:**
   - Si regeneras el keystore, deberás actualizar el SHA-1 en Google Cloud
   - Cada nuevo proyecto EAS tiene su propio keystore

3. **Seguridad:**
   - **NUNCA** subas `credentials.json` o `.env` al repositorio
   - Usa EAS Secrets para builds de producción
   - Restringe todas las API keys antes de publicar

---

¡Listo! Con esta configuración, el login con Google debería funcionar perfectamente en tu app viclean. 🚀
