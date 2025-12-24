# viclean Mobile

Aplicación móvil de viclean construida con Expo (React Native) enfocada en la experiencia de clientes que agendan servicios de limpieza y proveedores que gestionan sus servicios.

## Requisitos previos

- Node.js 18 o superior
- Expo CLI (`npm install -g expo-cli`) opcional pero recomendado
- Dispositivo físico con la app Expo Go o emulador Android/iOS configurado
- Backend en funcionamiento y accesible en la misma red local

## Configuración inicial

1. Instala dependencias:
   ```powershell
   cd mobile
   npm install
   ```

2. Define la URL del backend y credenciales OAuth creando un archivo `.env` en la carpeta `mobile`:
   ```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080/api
GOOGLE_ANDROID_CLIENT_ID=tu_id_android.apps.googleusercontent.com
GOOGLE_WEB_CLIENT_ID=tu_id_web.apps.googleusercontent.com
   ```
   Ajusta la IP para que sea alcanzable desde tu dispositivo.

3. Inicia el proyecto en modo desarrollo:
   ```powershell
   npx expo start
   ```

## Estructura destacada

- `App.js`: configura navegación, contexto de autenticación y persistencia del token mediante `AsyncStorage`.
- `src/screens/LoginScreen.js`: formulario de acceso con validaciones básicas, animaciones y consumo del endpoint `/auth/login`.
- `src/screens/HomeScreen.js`: pantalla placeholder para usuarios autenticados con opción de cerrar sesión.
- `src/components/GradientBackground.js`: envoltorio visual reutilizable con degradado.
- `src/theme/colors.js`: paleta centralizada para mantener consistencia visual.

## Persistencia de sesión

El token JWT devuelto por el backend se almacena en `AsyncStorage` (`@cleanhome/token`). Al iniciar la app se verifica si existe para restaurar la sesión. `signOut` limpia los datos locales.

## Autenticación Social

Se utilizan:
- Google: `expo-auth-session/providers/google` con IDs definidos en `.env` y expuestos vía `app.config.js` (`extra.googleAuth`).
- Apple: `expo-apple-authentication` (solo dispositivos/simuladores Apple con cuenta configurada).

Si obtienes `invalid_client` en Google:
1. Confirma que el APK/aplicación se creó después de poner los nuevos Client IDs.
2. Verifica SHA-1 en Google Cloud (Credencial Android) coincide con el fingerprint del keystore EAS.
3. Asegura que los IDs están presentes en build (`expo constants:inspect` dentro de la app para revisar `extra`).

## QA y Pruebas

Archivos:
- `TEST_CHECKLIST.md`: lista completa de pruebas funcionales (navegación, flujos críticos, endpoints).
- `NAVIGATION_AUDIT.md`: auditoría de rutas definidas vs. usadas.
- `test_endpoints.ps1`: script PowerShell para smoke tests del backend.

### Smoke Tests Backend (PowerShell)
```powershell
cd mobile
powershell -ExecutionPolicy Bypass -File .\test_endpoints.ps1 -BaseUrl "http://localhost:8080/api" -Email "test@viclean.com" -Password "Secret123"
```

### Flujo Crítico Manual
1. Login (email o Google) → token persiste.
2. Catálogo → Detalle → Agendar → Confirmar pago → Tracking → Evidencia fotográfica.
3. Ver favoritos y navegar a detalle.
4. Notificación push con `data.screen` redirige correctamente.

### Criterios de Aprobación
- 0 errores de navegación en consola.
- Token persiste tras reinicio.
- Endpoints clave responden 200/201.
- Flujo de servicio completo sin bloqueos.

## Próximos pasos sugeridos

- Completar validaciones de params al navegar (ServiceCatalog, Booking).
- Añadir pruebas unitarias con Jest y E2E con Detox.
- Integrar API real de geolocalización y seguimiento en tiempo real.
- Añadir monitoreo y métricas de rendimiento.
