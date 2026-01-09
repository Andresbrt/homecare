# Integración de Chat en Aplicación Mobile

## 📋 Cambios Necesarios en Archivos Existentes

### 1. MainTabs.js - Agregar Tab de Chat

**Ubicación:** `mobile/src/navigation/MainTabs.js`

```javascript
import ChatListScreen from '../screens/ChatListScreen';

// Agregar dentro de <Tab.Navigator>:
<Tab.Screen
  name="Chat"
  component={ChatListScreen}
  options={{
    tabBarLabel: 'Mensajes',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="chatbubbles" size={size} color={color} />
    ),
    headerShown: false,
  }}
/>
```

### 2. App.js - Agregar ChatProvider

**Ubicación:** `mobile/App.js`

```javascript
import { ChatProvider } from './src/context/ChatContext';

// Envolver el contenido de la app:
export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        {/* Resto de la app */}
      </ChatProvider>
    </AuthProvider>
  );
}
```

### 3. package.json - Instalar Dependencias

**Ejecutar:**
```bash
cd mobile
npm install socket.io-client@4.5.4
npm install date-fns
```

**Verificar en package.json:**
```json
{
  "dependencies": {
    "socket.io-client": "^4.5.4",
    "date-fns": "^2.30.0",
    "expo-secure-store": "^12.3.1",
    ...
  }
}
```

### 4. Navigation.js - Agregar Rutas de Chat

**Ubicación:** `mobile/src/navigation/Navigation.js` o similar

```javascript
// Dentro del Stack.Navigator:
<Stack.Screen 
  name="ChatDetail" 
  component={ChatDetailScreen}
  options={{
    headerShown: false,
  }}
/>

<Stack.Screen 
  name="NewChat" 
  component={NewChatScreen}
  options={{
    presentation: 'modal',
    headerShown: false,
  }}
/>
```

### 5. AuthContext.js - Exportar getUserIdFromPrincipal

**Ubicación:** `mobile/src/context/AuthContext.js`

**Agregar método helper:**
```javascript
export const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.userId || decoded.sub;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};
```

---

## 🎨 Aplicar Tema de Colores

### Colores Integrados

Todos los componentes ya usan la paleta profesional:

| Componente | Color Primario | Color Secundario |
|-----------|----------------|-----------------|
| ChatHeader | Azul Marino (#001B38) | Turquesa (#49C0BC) |
| ChatBubble (mío) | Azul Petróleo (#0E4D68) | Blanco (#FFFFFF) |
| ChatBubble (otro) | Gris Claro (#F5F5F5) | Gris Oscuro (#424242) |
| MessageInput | Azul Petróleo | Turquesa |
| TypingIndicator | Turquesa | - |
| ChatListScreen | Azul Marino | Turquesa |

### Personalización Adicional (Opcional)

Para cambiar colores globalmente:

1. Editar `mobile/src/theme/colors.js`
2. Cambiar valores HEX
3. Los componentes se actualizan automáticamente

---

## 🚀 Verificación

### 1. Compilación
```bash
cd mobile
npm run start
# O
expo start
```

### 2. Testing en Expo
- Presionar `i` para iOS simulator
- Presionar `a` para Android emulator

### 3. Verificar Conexión WebSocket

Abrir consola de desarrollo y verificar:
```
[ChatService] Conectando a http://localhost:8080/ws...
[ChatService] Conectado ✓ ID: ...
```

### 4. Probar Endpoint Backend

```bash
# En otra terminal
cd homecare
mvn spring-boot:run

# En terminal 3
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/chat/conversations
```

---

## 📱 Archivos Creados en Esta Sesión

### Tema (3 archivos)
- ✅ `mobile/src/theme/colors.js` - Paleta de colores
- ✅ `mobile/src/theme/typography.js` - Tipografía
- ✅ `mobile/src/theme/index.js` - Exportador del tema

### Componentes (4 archivos)
- ✅ `mobile/src/components/ChatBubble.js` - Burbuja de mensaje
- ✅ `mobile/src/components/MessageInput.js` - Input de mensajes
- ✅ `mobile/src/components/TypingIndicator.js` - Indicador escribiendo
- ✅ `mobile/src/components/ChatHeader.js` - Header de chat

### Pantallas (2 archivos)
- ✅ `mobile/src/screens/ChatListScreen.js` - Lista de chats
- ✅ `mobile/src/screens/ChatDetailScreen.js` - Detalle de chat

**Total:** 9 archivos nuevos + actualizaciones en existentes

---

## 🔗 Próximos Pasos

1. **Crear NewChatScreen** - Para iniciar nuevas conversaciones
2. **Crear UserPresence component** - Para mostrar online/offline
3. **Integrar notificaciones push** - Con expo-notifications
4. **Testing E2E** - Probar flujo completo
5. **Optimizaciones** - Caché, sincronización offline
6. **Deploy** - Play Store/App Store

---

## ⚠️ Notas Importantes

1. **JWT Token** - Se obtiene automáticamente de SecureStore
2. **Socket.io** - Se conecta automáticamente con ChatProvider
3. **Base de datos** - Persiste en PostgreSQL automáticamente
4. **Timestamps** - Se manejan con date-fns + locale español
5. **Imágenes** - Usa avatares del usuario (pueden ser null)
6. **Offline** - Buffer de mensajes pendientes (implementado en ChatService)

---

## 🐛 Troubleshooting

### "WebSocket connection failed"
- ✅ Verificar backend en `http://localhost:8080`
- ✅ Verificar token JWT válido
- ✅ Verificar CORS en WebSocketConfig

### "Mensajes no aparecen"
- ✅ Verificar que ChatProvider envuelve la app
- ✅ Verificar listeners en ChatService
- ✅ Revisar console logs de [ChatService]

### "Imágenes no cargan"
- ✅ Verificar URLs de avatares son válidas
- ✅ Verificar permisos en Android/iOS
- ✅ Usar fallback (avatar placeholder)

---

