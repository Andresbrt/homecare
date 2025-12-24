# CleanHome Mobile (React Native)

Experiencia móvil premium para la plataforma CleanHome. Construida sobre **Expo + React Native**, optimizada para dispositivos iOS y Android con un onboarding/login altamente visual.

## 🚀 Características destacadas

- Pantalla de login con animaciones sutiles y fondo degradado dinámico.
- Integración lista para consumir el backend Spring Boot (`/api/auth/login`).
- Diseño pensado para pantallas móviles: tipografía, espaciados y controles táctiles.
- Componentes reutilizables (`GradientBackground`, tema de colores centralizado).
- Estructura preparada para escalar (próximos screens y navegación).

## 📦 Prerrequisitos

| Herramienta | Versión recomendada |
|-------------|---------------------|
| Node.js     | >= 18 LTS           |
| npm / yarn  | npm >= 9 ó yarn >= 1.22 |
| Expo CLI    | `npm install -g expo-cli` |
| Expo Go     | App móvil para testing (iOS/Android) |

> 💡 Si prefieres no instalar el CLI global, puedes usar `npx expo` en todos los comandos.

## 🛠️ Configuración inicial

1. **Entrar al proyecto móvil**
   ```bash
   cd mobile
   ```

2. **Inicializar un proyecto Expo** (si aún no lo creaste)
   ```bash
   npx expo init cleanhome-mobile --template blank
   # o usa "expo prebuild" si prefieres un workflow bare React Native
   ```

3. **Copiar los archivos provistos**
   - Reemplaza `App.js` por el archivo `mobile/App.js` de este repositorio.
   - Copia la carpeta `src/` dentro del nuevo proyecto Expo.

4. **Instalar dependencias sugeridas**
   ```bash
   npm install expo-linear-gradient
   npm install expo-status-bar
   npm install @react-native-async-storage/async-storage
   ```
   (Opcional) Para navegación y futuras pantallas:
   ```bash
   npm install @react-navigation/native @react-navigation/native-stack
   npx expo install react-native-screens react-native-safe-area-context
   ```

5. **Configurar la URL del backend**
   - En `src/screens/LoginScreen.js` actualiza `API_BASE_URL` con la IP local de tu backend.
   - Ejemplo: `http://192.168.1.25:8080/api` (usa la IP de tu PC dentro de la misma red).

## ▶️ Ejecutar en modo desarrollo

```bash
npm start
# o
npx expo start
```

Luego:
- Escanea el QR con la app **Expo Go** (Android) o la cámara (iOS).
- Para emuladores: presiona `a` (Android) o `i` (iOS) sobre la terminal de Expo.

## 🧪 Probando el flujo de login
1. Asegúrate de que el backend Spring Boot esté ejecutándose y accesible desde la misma red.
2. Registra un usuario (vía web o Postman) en `/api/auth/register`.
3. Inicia sesión desde la app móvil con ese usuario.
4. Comprueba que obtienes el token JWT en la respuesta.
5. Extiende el flujo guardando el token en `AsyncStorage` y navegando a tu dashboard.

## 🧩 Estructura del código móvil

```
mobile/
├── App.js                     # Punto de entrada, carga LoginScreen
├── README.md                  # Esta guía
└── src/
    ├── components/
    │   └── GradientBackground.js
    ├── screens/
    │   └── LoginScreen.js     # Pantalla de login animada
    └── theme/
        └── colors.js          # Paleta centralizada
```

## 🧱 Próximos pasos recomendados

1. **Sistema de navegación**: integrar React Navigation con un stack (AuthStack/AppStack).
2. **Persistencia**: almacenar el token JWT con `AsyncStorage` y restaurar sesión.
3. **Integración completa**: añadir endpoints para registro, olvido de contraseña y dashboard.
4. **UI Kit**: crear componentes reutilizables (botones, inputs, tarjetas) para mantener consistencia.
5. **Branding**: incorporar assets oficiales (logo SVG, ilustraciones, iconografía personal).

## 🛡️ Buenas prácticas sugeridas

- Usa `.env` (con `expo-env` o librerías similares) para variables sensibles (URLs, claves).
- Valida inputs en el cliente y en el servidor.
- Maneja los estados de carga/errores con feedback claro para el usuario.
- Testea en múltiples resoluciones y dispositivos (real y emuladores).

---

¿Listo para llevar CleanHome al bolsillo de tus usuarios? ✨🧽 Construye la experiencia móvil sobre esta base y sigue iterando con nuevas pantallas y funcionalidades.
