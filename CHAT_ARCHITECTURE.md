# 🏗️ Arquitectura Completa - Chat en Tiempo Real

## Sistema de Chat Homecare

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (MOBILE)                         │
│                      React Native + Expo                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    MainTabs Navigator                    │  │
│  │  (Home | Services | Chat | Profile | Admin)             │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │                  Chat Stack                              │  │
│  │  ┌─────────────────┬──────────────┬────────────────────┐ │  │
│  │  │  ChatListScreen │ ChatDetail   │   NewChatScreen    │ │  │
│  │  │  (Conversac.)   │   (Detalle)  │   (Iniciar chat)   │ │  │
│  │  └─────────────────┴──────────────┴────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │              Componentes UI Profesionales                │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐           │  │
│  │  │ChatHeader│ChatBubble│MessageIn │TypingInd│           │  │
│  │  │(Azul)    │(Petróleo)│(Input)   │(Turquesa)           │  │
│  │  └──────────┴──────────┴──────────┴──────────┘           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │              Context API - State Management              │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         ChatContext                              │   │  │
│  │  │  • conversations: []                             │   │  │
│  │  │  • messages: {}                                  │   │  │
│  │  │  • typingUsers: {}                               │   │  │
│  │  │  • connected: boolean                            │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │                   ChatService                            │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │         WebSocket Connection (Socket.io)        │   │  │
│  │  │  • connect(token, userId)                       │   │  │
│  │  │  • sendMessage(roomId, senderId, text)          │   │  │
│  │  │  • sendTypingNotification(...)                  │   │  │
│  │  │  • messageBuffer (offline support)              │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │         REST API Calls (AsyncStorage)           │   │  │
│  │  │  • getConversations()                           │   │  │
│  │  │  • getMessages(roomId, token)                   │   │  │
│  │  │  • createOrGetChatRoom(customerId, providerId)  │   │  │
│  │  │  • markRoomAsRead(roomId, token)                │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │                     Tema Global                          │  │
│  │  ┌──────────────┬──────────────┬─────────────────┐      │  │
│  │  │Colors (#)    │Typography    │Spacing/Shadows  │      │  │
│  │  │• Marino      │• Primary     │• xs-2xl         │      │  │
│  │  │• Petróleo    │• Secondary   │• sm-lg          │      │  │
│  │  │• Turquesa    │• Caption     │• Shadows 0-lg   │      │  │
│  │  │• Blanco      │• Custom      │                 │      │  │
│  │  └──────────────┴──────────────┴─────────────────┘      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────▼──────────────────────┐
        │  INTERNET - WebSocket + REST API            │
        │  Protocol: Socket.io + HTTP/HTTPS          │
        │  URL: http://localhost:8080/ws             │
        └──────────────────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                       BACKEND (SPRING BOOT)                      │
│                      Java 17 + Spring 3.2.5                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              WebSocket Configuration                   │   │
│  │  /ws - STOMP Endpoint                                  │   │
│  │  └─► SimpleBroker                                      │   │
│  │      ├─ /topic/chat          (broadcast)              │   │
│  │      ├─ /topic/chat/room/{id} (room-specific)         │   │
│  │      ├─ /topic/typing         (typing indicator)      │   │
│  │      └─ /user/{id}/queue/*    (private messages)      │   │
│  └────────────────────────────────────────────────────────┘   │
│                       │                                          │
│  ┌────────────────────▼────────────────────────────────────┐   │
│  │              ChatController                             │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ REST Endpoints                                   │   │   │
│  │  │ • GET  /api/chat/conversations                   │   │   │
│  │  │ • GET  /api/chat/rooms/{id}/messages             │   │   │
│  │  │ • POST /api/chat/rooms                           │   │   │
│  │  │ • PUT  /api/chat/rooms/{id}/read                 │   │   │
│  │  │ • GET  /api/chat/rooms/{id}/unread-count         │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ WebSocket Message Handlers                       │   │   │
│  │  │ • /app/chat/send     (enviar mensaje)            │   │   │
│  │  │ • /app/chat/typing   (notificación escritura)    │   │   │
│  │  │ • /app/chat/read     (marcar leído)              │   │   │
│  │  │ • /app/chat/subscribe (presencia)                │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                       │                                          │
│  ┌────────────────────▼────────────────────────────────────┐   │
│  │              ChatService                               │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ Lógica de Negocio                               │   │   │
│  │  │ • getOrCreateChatRoom(customerId, providerId)   │   │   │
│  │  │ • sendMessage(roomId, senderId, text)           │   │   │
│  │  │ • getMessages(roomId, page, size)               │   │   │
│  │  │ • getUserConversations(userId)                  │   │   │
│  │  │ • markMessagesAsRead(roomId, userId)            │   │   │
│  │  │ • getUnreadCount(roomId)                        │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                       │                                          │
│  ┌────────────────────▼────────────────────────────────────┐   │
│  │              Data Layer                                │   │
│  │  ┌───────────────────┬─────────────────────────────┐   │   │
│  │  │  Repositories     │  DTOs                       │   │   │
│  │  │                   │                             │   │   │
│  │  │• ChatRoom         │• ChatRoomDto                │   │   │
│  │  │  - findByUsers    │  - id, customer, provider   │   │   │
│  │  │  - findByUser     │  - lastMessage, timestamp   │   │   │
│  │  │  - OrderBy...     │  - unreadCount              │   │   │
│  │  │                   │                             │   │   │
│  │  │• ChatMessage      │• ChatMessageDto             │   │   │
│  │  │  - findBy...      │  - id, roomId, senderId     │   │   │
│  │  │  - countUnread    │  - senderName, avatar       │   │   │
│  │  │  - Paging         │  - messageText, sentAt      │   │   │
│  │  │                   │  - isRead                   │   │   │
│  │  └───────────────────┴─────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                       │                                          │
│  ┌────────────────────▼────────────────────────────────────┐   │
│  │              Entity Layer (JPA)                         │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  ChatRoom Entity                                 │   │   │
│  │  │  @Entity @Table                                 │   │   │
│  │  │  • id (PK)                                      │   │   │
│  │  │  • customer (FK → User)    @ManyToOne          │   │   │
│  │  │  • provider (FK → User)    @ManyToOne          │   │   │
│  │  │  • messages                @OneToMany          │   │   │
│  │  │  • lastMessage, lastMessageTime                │   │   │
│  │  │  • isActive, createdAt, updatedAt              │   │   │
│  │  │  @Index en chat_room_id, createdAt             │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  ChatMessage Entity                              │   │   │
│  │  │  @Entity @Table                                 │   │   │
│  │  │  • id (PK)                                      │   │   │
│  │  │  • chatRoom (FK → ChatRoom) @ManyToOne @EAGER   │   │   │
│  │  │  • sender (FK → User)      @ManyToOne @EAGER    │   │   │
│  │  │  • messageText, isRead, readAt                  │   │   │
│  │  │  • createdAt, updatedAt                         │   │   │
│  │  │  @Index en chat_room_id, sender_id, created_at  │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
        ┌───────────────▼────────────────┐
        │    PostgreSQL Database         │
        │                                │
        │ Tables:                        │
        │ • chat_rooms                   │
        │ • chat_messages                │
        │ • users (existente)            │
        │                                │
        │ Índices:                       │
        │ • idx_room_customer_provider   │
        │ • idx_msg_room_created         │
        │ • idx_msg_sender_read          │
        └────────────────────────────────┘
```

---

## 🔄 Flujos de Datos

### 1. Enviar Mensaje

```
Usuario escribe mensaje
        ↓
MessageInput.onSend()
        ↓
ChatService.sendMessage()
        ↓
Socket.io emit: /app/chat/send
        ↓
ChatController.handleChatMessage()
        ↓
ChatService.sendMessage() (backend)
        ↓
ChatMessage.save() en DB
        ↓
ChatRoom.lastMessage update
        ↓
Broadcast: /topic/chat
        ↓
Todos los clientes reciben
        ↓
ChatContext.ADD_MESSAGE
        ↓
FlatList actualiza (inverted)
```

### 2. Cargar Conversaciones

```
ChatListScreen.useEffect()
        ↓
loadConversations()
        ↓
ChatService.getConversations() (REST)
        ↓
AuthContext.getToken()
        ↓
Fetch: GET /api/chat/conversations
        ↓
ChatController.getUserConversations()
        ↓
ChatService.getUserConversations()
        ↓
ChatRoomRepository.findByUserOrderBy...
        ↓
PostgreSQL query
        ↓
ChatRoomDto list
        ↓
JSON response
        ↓
ChatContext.SET_CONVERSATIONS
        ↓
FlatList renderiza
```

### 3. Notificación de Escritura

```
Usuario comienza a escribir
        ↓
MessageInput.onChangeText()
        ↓
onTyping(true)
        ↓
ChatService.sendTypingNotification()
        ↓
Socket.io emit: /app/chat/typing
        ↓
ChatController.handleTypingNotification()
        ↓
Broadcast: /topic/typing
        ↓
Todos reciben
        ↓
ChatContext.SET_TYPING
        ↓
TypingIndicator aparece
        ↓
Usuario para de escribir
        ↓
onTyping(false)
        ↓
Mismo flujo pero isTyping = false
        ↓
TypingIndicator desaparece
```

---

## 📊 Estructura de Datos

### ChatRoom (Entity)
```json
{
  "id": 1,
  "customer": {
    "id": 100,
    "name": "Juan Pérez",
    "profilePicture": "url..."
  },
  "provider": {
    "id": 200,
    "name": "María García",
    "profilePicture": "url..."
  },
  "lastMessage": "Nos vemos mañana",
  "lastMessageTime": "2024-01-08T14:30:00",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-08T14:30:00"
}
```

### ChatMessage (Entity)
```json
{
  "id": 501,
  "chatRoom": { "id": 1 },
  "sender": {
    "id": 200,
    "name": "María García",
    "profilePicture": "url..."
  },
  "messageText": "Nos vemos mañana",
  "isRead": true,
  "readAt": "2024-01-08T14:31:00",
  "createdAt": "2024-01-08T14:30:00",
  "updatedAt": "2024-01-08T14:30:00"
}
```

### ChatMessageDto (API Response)
```json
{
  "id": 501,
  "chatRoomId": 1,
  "senderId": 200,
  "senderName": "María García",
  "senderAvatar": "url...",
  "messageText": "Nos vemos mañana",
  "sentAt": "2024-01-08T14:30:00",
  "timestamp": "2024-01-08T14:30:00",
  "isRead": true
}
```

---

## 🎨 Paleta de Colores Profesional

```
┌─────────────────────────────────────────────────────────────┐
│ Color              │ HEX      │ RGB           │ Uso          │
├─────────────────────────────────────────────────────────────┤
│ Azul Marino        │ #001B38  │ 0, 27, 56     │ Headers      │
│ Azul Petróleo      │ #0E4D68  │ 14, 77, 104   │ Primario     │
│ Turquesa Fresco    │ #49C0BC  │ 73, 192, 188  │ Highlights   │
│ Blanco Puro        │ #FFFFFF  │ 255, 255, 255 │ Fondos       │
│ Gris Claro         │ #F5F5F5  │ 245, 245, 245 │ Alternos     │
│ Gris Medio         │ #BDBDBD  │ 189, 189, 189 │ Bordes       │
│ Gris Oscuro        │ #424242  │ 66, 66, 66    │ Texto sec.   │
│ Verde (Success)    │ #4CAF50  │ 76, 175, 80   │ Éxito        │
│ Rojo (Error)       │ #F44336  │ 244, 67, 54   │ Errores      │
│ Amarillo (Warning) │ #FFC107  │ 255, 193, 7   │ Advertencias │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Componentes UI

### Tema Global
```javascript
theme = {
  colors: { ... },
  typography: { ... },
  spacing: { xs, sm, md, lg, xl },
  borderRadius: { none, sm, md, lg, xl, full },
  shadows: { none, sm, md, lg }
}
```

### Componentes Profesionales
```
ChatHeader
  ├─ Avatar (40x40)
  ├─ Nombre del usuario
  ├─ Status (online/offline)
  ├─ Botón de llamada
  └─ Botón de opciones

ChatBubble (Mío)
  ├─ Color: Azul Petróleo
  ├─ Texto: Blanco
  ├─ Timestamp
  └─ Indicador de leído (✓ / ✓✓)

ChatBubble (Otro)
  ├─ Color: Gris Claro
  ├─ Texto: Gris Oscuro
  ├─ Timestamp
  └─ Sin indicador

MessageInput
  ├─ Input field (gris claro)
  ├─ Botón attach
  └─ Botón send (Azul Petróleo)

TypingIndicator
  ├─ Texto: "{nombre} está escribiendo"
  └─ Puntos animados (Turquesa)
```

---

## 🔐 Seguridad

### Autenticación
- ✅ JWT Token en auth header
- ✅ Token almacenado en SecureStore
- ✅ Validación en cada request
- ✅ Refresh token automático

### Validaciones
- ✅ Usuario debe estar en la sala de chat
- ✅ Mensaje no puede estar vacío
- ✅ Máximo 500 caracteres por mensaje
- ✅ Solo el remitente puede marcar como leído

### CORS
- ✅ localhost:3000 (Web)
- ✅ localhost:8083 (Mobile)
- ✅ 192.168.1.100:8083 (Red local)
- ✅ exp://127.0.0.1:19000 (Expo)

---

## 🚀 Performance

### Optimizaciones Implementadas
1. ✅ Lazy loading en relaciones (FetchType.LAZY)
2. ✅ Índices en columnas frecuentes
3. ✅ Paginación en historial
4. ✅ Message buffer para offline
5. ✅ Avatar lazy loading
6. ✅ FlatList inverted para eficiencia

### Escalabilidad Futura
- Redis para distribución de mensajes
- ElasticSearch para búsqueda
- GraphQL subscription (upgrade)
- Sharding por usuario

---

