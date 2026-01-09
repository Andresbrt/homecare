# Chat en Tiempo Real - Guía de Implementación Mobile

## 📱 Arquitectura Mobile para Chat

### Stack Tecnológico
```
React Native (Expo)
  ├── socket.io-client (WebSocket)
  ├── AsyncStorage (persistencia)
  ├── React Navigation (routing)
  └── State Management (Context/Redux)
```

### Flujo de Conexión
```
1. User abre app → AuthContext verifica token
2. ✅ Token válido → ChatService inicia Socket.io
3. Socket.io conecta a /ws
4. Listeners para eventos de chat
5. Send message → /app/chat/send
6. Receive message → /topic/chat
```

## 🔧 Instalación

```bash
cd mobile
npm install socket.io-client@4.5.4 --save
npm install axios --save  # Si no está instalado
```

**Versión recomendada:** `socket.io-client@4.5.4` (compatible con Spring WebSocket)

## 📁 Estructura de Carpetas

```
mobile/src/
├── services/
│   ├── ChatService.js          # Socket.io + API REST
│   └── api.js                  # (existente)
├── context/
│   ├── ChatContext.js          # Estado global del chat
│   └── AuthContext.js          # (existente)
├── screens/
│   ├── ChatListScreen.js       # Lista de conversaciones
│   ├── ChatDetailScreen.js     # Conversación detallada
│   └── NewChatScreen.js        # Crear nuevo chat
├── components/
│   ├── ChatBubble.js           # Burbuja de mensaje
│   ├── MessageInput.js         # Input para escribir
│   ├── TypingIndicator.js      # Indicador escribiendo...
│   ├── ChatHeader.js           # Header con info
│   └── UserPresence.js         # Online/offline status
└── utils/
    └── chatUtils.js            # Funciones auxiliares
```

## 1️⃣ ChatService.js

### Crear Archivo
```bash
touch mobile/src/services/ChatService.js
```

### Código

```javascript
import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './api';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = {};
    this.messageBuffer = []; // Buffer para mensajes pendientes
  }

  /**
   * Inicializar conexión WebSocket
   * @param {string} token - JWT token
   * @param {number} userId - ID del usuario actual
   */
  async connect(token, userId) {
    if (this.isConnected) {
      console.log('[ChatService] Ya conectado');
      return;
    }

    try {
      // Preparar configuración
      const wsUrl = API_URL.replace('/api', ''); // "http://localhost:8080"
      
      const socketConfig = {
        auth: {
          token: token,
          userId: userId
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        transports: ['websocket'],
        query: {
          userId: userId
        }
      };

      console.log(`[ChatService] Conectando a ${wsUrl}/ws...`);
      
      this.socket = io(`${wsUrl}/ws`, socketConfig);

      // Listeners de conexión
      this.socket.on('connect', () => {
        console.log('[ChatService] Conectado ✓ ID:', this.socket.id);
        this.isConnected = true;
        this.emit('connected');
        
        // Procesar mensajes en buffer
        this._processPendingMessages();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[ChatService] Desconectado:', reason);
        this.isConnected = false;
        this.emit('disconnected', { reason });
      });

      this.socket.on('connect_error', (error) => {
        console.error('[ChatService] Error de conexión:', error.message);
        this.emit('error', { type: 'connection', error });
      });

      // Listeners de chat
      this._setupChatListeners();

    } catch (error) {
      console.error('[ChatService] Error iniciando conexión:', error);
      this.emit('error', { type: 'init', error });
      throw error;
    }
  }

  /**
   * Configurar listeners de chat
   */
  _setupChatListeners() {
    // Nuevo mensaje recibido
    this.socket.on('/topic/chat', (message) => {
      console.log('[ChatService] Mensaje recibido:', message.id);
      this.emit('message_received', message);
    });

    // Notificación de usuario escribiendo
    this.socket.on('/topic/typing', (typing) => {
      console.log(`[ChatService] ${typing.userName} escribiendo...`);
      this.emit('user_typing', typing);
    });

    // Notificación de mensaje leído
    this.socket.on('/topic/chat/read', (notification) => {
      console.log('[ChatService] Mensaje leído:', notification.messageId);
      this.emit('message_read', notification);
    });

    // Presencia de usuario
    this.socket.on('/topic/chat/room/*', (presence) => {
      console.log(`[ChatService] Presencia de ${presence.userName}: ${presence.isOnline ? 'online' : 'offline'}`);
      this.emit('user_presence', presence);
    });

    // Cola de notificaciones privadas
    this.socket.on('/user/queue/messages', (message) => {
      console.log('[ChatService] Notificación privada:', message.id);
      this.emit('notification', message);
    });
  }

  /**
   * Enviar mensaje
   * @param {number} chatRoomId - ID de la sala
   * @param {number} senderId - ID del remitente
   * @param {string} messageText - Texto del mensaje
   */
  sendMessage(chatRoomId, senderId, messageText) {
    if (!messageText.trim()) {
      console.warn('[ChatService] Mensaje vacío');
      return;
    }

    const message = {
      chatRoomId,
      senderId,
      messageText,
      timestamp: new Date().toISOString()
    };

    if (!this.isConnected) {
      console.warn('[ChatService] No conectado, guardando en buffer...');
      this.messageBuffer.push(message);
      return;
    }

    try {
      console.log('[ChatService] Enviando mensaje:', message.id);
      this.socket.emit('/app/chat/send', message);
    } catch (error) {
      console.error('[ChatService] Error enviando mensaje:', error);
      this.messageBuffer.push(message);
    }
  }

  /**
   * Notificar que está escribiendo
   * @param {number} chatRoomId - ID de la sala
   * @param {number} userId - ID del usuario
   * @param {string} userName - Nombre del usuario
   * @param {boolean} isTyping - ¿Escribiendo?
   */
  sendTypingNotification(chatRoomId, userId, userName, isTyping = true) {
    if (!this.isConnected) return;

    try {
      this.socket.emit('/app/chat/typing', {
        chatRoomId,
        userId,
        userName,
        isTyping,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('[ChatService] Error notificando typing:', error);
    }
  }

  /**
   * Marcar mensaje como leído
   * @param {number} chatRoomId - ID de la sala
   * @param {number} messageId - ID del mensaje
   * @param {number} userId - ID del usuario
   */
  markMessageAsRead(chatRoomId, messageId, userId) {
    if (!this.isConnected) return;

    try {
      this.socket.emit('/app/chat/read', {
        chatRoomId,
        messageId,
        userId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('[ChatService] Error marcando como leído:', error);
    }
  }

  /**
   * Subscribirse a una sala de chat
   * @param {number} chatRoomId - ID de la sala
   * @param {number} userId - ID del usuario
   * @param {string} userName - Nombre del usuario
   */
  subscribeToChatRoom(chatRoomId, userId, userName) {
    if (!this.isConnected) return;

    try {
      console.log(`[ChatService] Subscribiendo a sala ${chatRoomId}...`);
      this.socket.emit('/app/chat/subscribe', {
        chatRoomId,
        userId,
        userName,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('[ChatService] Error subscribiendo:', error);
    }
  }

  /**
   * Desuscribirse de una sala
   * @param {number} chatRoomId - ID de la sala
   */
  unsubscribeFromChatRoom(chatRoomId) {
    if (!this.isConnected) return;

    try {
      console.log(`[ChatService] Desuscribiendo de sala ${chatRoomId}...`);
      // Emitir evento de desconexión de la sala
      this.socket.emit('/app/chat/unsubscribe', {
        chatRoomId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('[ChatService] Error desuscribiendo:', error);
    }
  }

  /**
   * Obtener lista de conversaciones (REST API)
   */
  async getConversations(token) {
    try {
      const response = await fetch(`${API_URL}/chat/conversations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('[ChatService] Error obteniendo conversaciones:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de mensajes (REST API)
   */
  async getMessages(chatRoomId, token, page = 0, size = 20) {
    try {
      const response = await fetch(
        `${API_URL}/chat/rooms/${chatRoomId}/messages?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('[ChatService] Error obteniendo mensajes:', error);
      throw error;
    }
  }

  /**
   * Crear o obtener sala de chat (REST API)
   */
  async createOrGetChatRoom(customerId, providerId, token) {
    try {
      const response = await fetch(`${API_URL}/chat/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId,
          providerId
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[ChatService] Error creando sala de chat:', error);
      throw error;
    }
  }

  /**
   * Marcar sala como leída (REST API)
   */
  async markRoomAsRead(chatRoomId, token) {
    try {
      const response = await fetch(
        `${API_URL}/chat/rooms/${chatRoomId}/read`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error('[ChatService] Error marcando sala como leída:', error);
      throw error;
    }
  }

  /**
   * Obtener conteo de no leídos (REST API)
   */
  async getUnreadCount(chatRoomId, token) {
    try {
      const response = await fetch(
        `${API_URL}/chat/rooms/${chatRoomId}/unread-count`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('[ChatService] Error obteniendo conteo:', error);
      throw error;
    }
  }

  /**
   * Procesar mensajes en buffer
   * @private
   */
  _processPendingMessages() {
    while (this.messageBuffer.length > 0) {
      const message = this.messageBuffer.shift();
      console.log('[ChatService] Enviando mensaje de buffer:', message.id);
      this.socket.emit('/app/chat/send', message);
    }
  }

  /**
   * Listener genérico
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remover listener
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Emit local event
   * @private
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Desconectar
   */
  disconnect() {
    if (this.socket) {
      console.log('[ChatService] Desconectando...');
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Obtener estado
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
      pendingMessages: this.messageBuffer.length
    };
  }
}

// Exportar instancia única (Singleton)
export default new ChatService();
```

## 2️⃣ ChatContext.js

### Crear Archivo
```bash
touch mobile/src/context/ChatContext.js
```

### Código

```javascript
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import ChatService from '../services/ChatService';
import * as SecureStore from 'expo-secure-store';

export const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

const initialState = {
  conversations: [],
  currentRoom: null,
  messages: {},
  isLoading: false,
  error: null,
  connected: false,
  typingUsers: {},
  onlineUsers: {},
  unreadCounts: {}
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations]
      };
    
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatRoomId]: [
            ...(state.messages[action.payload.chatRoomId] || []),
            action.payload
          ]
        }
      };
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: action.payload.messages
        }
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload };
    
    case 'SET_TYPING':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.payload.chatRoomId]: action.payload
        }
      };
    
    case 'SET_ONLINE':
      return {
        ...state,
        onlineUsers: {
          ...state.onlineUsers,
          [action.payload.userId]: action.payload.isOnline
        }
      };
    
    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        unreadCounts: {
          ...state.unreadCounts,
          [action.payload.roomId]: action.payload.count
        }
      };
    
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { authContext } = useContext(AuthContext);

  // Inicializar chat service
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const user = JSON.parse(await SecureStore.getItemAsync('userData'));

        if (token && user) {
          await ChatService.connect(token, user.id);
          dispatch({ type: 'SET_CONNECTED', payload: true });

          // Setup listeners
          ChatService.on('message_received', (message) => {
            dispatch({ type: 'ADD_MESSAGE', payload: message });
          });

          ChatService.on('user_typing', (typing) => {
            dispatch({ type: 'SET_TYPING', payload: typing });
          });

          ChatService.on('user_presence', (presence) => {
            dispatch({ type: 'SET_ONLINE', payload: presence });
          });

          ChatService.on('disconnected', () => {
            dispatch({ type: 'SET_CONNECTED', payload: false });
          });
        }
      } catch (error) {
        console.error('Error inicializando chat:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    initializeChat();

    return () => {
      ChatService.disconnect();
    };
  }, []);

  // Cargar conversaciones
  const loadConversations = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = await SecureStore.getItemAsync('userToken');
      const conversations = await ChatService.getConversations(token);
      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Cargar mensajes de una sala
  const loadMessages = useCallback(async (roomId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = await SecureStore.getItemAsync('userToken');
      const messages = await ChatService.getMessages(roomId, token);
      dispatch({ type: 'SET_MESSAGES', payload: { roomId, messages } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Enviar mensaje
  const sendMessage = useCallback(async (chatRoomId, senderId, messageText) => {
    try {
      ChatService.sendMessage(chatRoomId, senderId, messageText);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  // Crear/obtener sala de chat
  const createOrGetChatRoom = useCallback(async (customerId, providerId) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const room = await ChatService.createOrGetChatRoom(customerId, providerId, token);
      dispatch({ type: 'ADD_CONVERSATION', payload: room });
      return room;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const value = {
    state,
    dispatch,
    loadConversations,
    loadMessages,
    sendMessage,
    createOrGetChatRoom,
    ChatService
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
```

## 3️⃣ ChatListScreen.js

```javascript
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useChatContext } from '../context/ChatContext';

export const ChatListScreen = ({ navigation }) => {
  const { state, loadConversations } = useChatContext();

  useEffect(() => {
    loadConversations();
  }, []);

  const renderConversation = ({ item }) => (
    <View style={styles.conversation}>
      {/* Renderizar conversación */}
    </View>
  );

  return (
    <FlatList
      data={state.conversations}
      renderItem={renderConversation}
      keyExtractor={item => item.id.toString()}
      loading={state.isLoading}
    />
  );
};

const styles = StyleSheet.create({
  conversation: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  }
});
```

## 4️⃣ ChatDetailScreen.js

```javascript
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useChatContext } from '../context/ChatContext';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';

export const ChatDetailScreen = ({ route }) => {
  const { roomId } = route.params;
  const { state, loadMessages, sendMessage } = useChatContext();
  const messages = state.messages[roomId] || [];

  useEffect(() => {
    loadMessages(roomId);
  }, [roomId]);

  const handleSendMessage = (text, senderId) => {
    sendMessage(roomId, senderId, text);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatBubble message={item} />}
        keyExtractor={item => item.id.toString()}
        inverted
      />
      <MessageInput onSend={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
```

## ✅ Testing

### Test Endpoints con PowerShell
```powershell
# 1. Crear/obtener sala de chat
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    customerId = 1
    providerId = 2
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/chat/rooms" `
    -Method POST `
    -Headers $headers `
    -Body $body

# 2. Obtener conversaciones
Invoke-WebRequest -Uri "http://localhost:8080/api/chat/conversations" `
    -Method GET `
    -Headers $headers

# 3. Obtener mensajes
Invoke-WebRequest -Uri "http://localhost:8080/api/chat/rooms/1/messages?page=0&size=20" `
    -Method GET `
    -Headers $headers
```

### Test WebSocket
```javascript
// En cualquier navegador con consola
const socket = io('http://localhost:8080/ws', {
  auth: { token: 'your_token', userId: 1 }
});

socket.on('connect', () => {
  console.log('Conectado');
  socket.emit('/app/chat/send', {
    chatRoomId: 1,
    senderId: 1,
    messageText: 'Hola!'
  });
});

socket.on('/topic/chat', (message) => {
  console.log('Mensaje recibido:', message);
});
```

## 🚀 Próximos Pasos

1. ✅ Backend completado (Service, Config, Controller)
2. ✅ Frontend services (ChatService.js, ChatContext.js)
3. ⏳ Componentes UI (ChatBubble, MessageInput, etc.)
4. ⏳ Integración en MainTabs
5. ⏳ Testing E2E
6. ⏳ Deployment

