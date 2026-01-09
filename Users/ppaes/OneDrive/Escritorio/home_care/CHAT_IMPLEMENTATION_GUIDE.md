# 💬 Guía de Implementación: Chat en Tiempo Real

Este documento proporciona una guía paso a paso para implementar el sistema de chat en tiempo real con WebSockets.

**Prioridad**: 🔴 Alta  
**Estimación**: 2-3 semanas  
**Estado**: 🔄 Por empezar

---

## 📋 Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Arquitectura](#arquitectura)
3. [Backend - Paso a Paso](#backend---paso-a-paso)
4. [Frontend Mobile - Paso a Paso](#frontend-mobile---paso-a-paso)
5. [Pruebas](#pruebas)
6. [Despliegue](#despliegue)

---

## 📋 Requisitos

### Dependencias a Agregar

**Backend (pom.xml)**:
```xml
<!-- WebSocket -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- Stomp (Simple Text Oriented Messaging Protocol) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>

<!-- JSON -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

**Frontend Mobile (package.json)**:
```json
{
  "dependencies": {
    "react-native-socket.io": "^2.0.0",
    "socket.io-client": "^4.5.4"
  }
}
```

---

## 🏗️ Arquitectura

### Componentes del Sistema

```
┌─────────────────────────────────────────┐
│         Client (React Native)           │
│    - Socket.io client listener          │
│    - ChatScreen component               │
│    - ChatService (socket connection)    │
└──────────────┬──────────────────────────┘
               │ WebSocket
┌──────────────▼──────────────────────────┐
│         Server (Spring Boot)            │
│    - WebSocketConfig                    │
│    - ChatController                     │
│    - ChatService                        │
│    - Message Broadcasting               │
└──────────────┬──────────────────────────┘
               │ JDBC
┌──────────────▼──────────────────────────┐
│    Database (PostgreSQL)                │
│    - ChatMessage table                  │
│    - ChatRoom table                     │
└─────────────────────────────────────────┘
```

### Flujo de Mensajes

```
1. Usuario escribe mensaje en Cliente
2. Cliente envía vía WebSocket a Servidor
3. Servidor recibe en ChatController
4. Guarda en BD y broadcast a todos en la room
5. Todos los clientes reciben en tiempo real
6. UI se actualiza automáticamente
```

---

## 🔧 Backend - Paso a Paso

### Paso 1: Crear Entidades (Modelos de Base de Datos)

**Archivo**: `src/main/java/com/cleanhome/backend/entity/ChatRoom.java`

```java
package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Data
@NoArgsConstructor
public class ChatRoom extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;
    
    @Column(name = "last_message")
    private String lastMessage;
    
    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChatMessage> messages;
    
    // Constructor útil
    public ChatRoom(User customer, User provider) {
        this.customer = customer;
        this.provider = provider;
        this.isActive = true;
    }
}
```

**Archivo**: `src/main/java/com/cleanhome/backend/entity/ChatMessage.java`

```java
package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
public class ChatMessage extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;
    
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @Column(name = "message_text", columnDefinition = "TEXT")
    private String messageText;
    
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    // Constructor
    public ChatMessage(ChatRoom chatRoom, User sender, String messageText) {
        this.chatRoom = chatRoom;
        this.sender = sender;
        this.messageText = messageText;
        this.isRead = false;
    }
}
```

### Paso 2: Crear DTOs (Data Transfer Objects)

**Archivo**: `src/main/java/com/cleanhome/backend/dto/ChatMessageDto.java`

```java
package com.cleanhome.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    
    private Long id;
    
    private Long chatRoomId;
    
    private Long senderId;
    
    private String senderName;
    
    private String messageText;
    
    private LocalDateTime sentAt;
    
    private Boolean isRead;
    
    @JsonProperty("timestamp")
    private LocalDateTime timestamp;
}
```

**Archivo**: `src/main/java/com/cleanhome/backend/dto/ChatRoomDto.java`

```java
package com.cleanhome.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    
    private Long id;
    
    private Long customerId;
    
    private String customerName;
    
    private Long providerId;
    
    private String providerName;
    
    private String lastMessage;
    
    private LocalDateTime lastMessageTime;
    
    private List<ChatMessageDto> messages;
    
    private Boolean unreadCount;
}
```

### Paso 3: Crear Repositorios

**Archivo**: `src/main/java/com/cleanhome/backend/repository/ChatRoomRepository.java`

```java
package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.ChatRoom;
import com.cleanhome.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    // Buscar chat room entre dos usuarios
    @Query("SELECT cr FROM ChatRoom cr WHERE " +
           "(cr.customer = :user1 AND cr.provider = :user2) OR " +
           "(cr.customer = :user2 AND cr.provider = :user1)")
    Optional<ChatRoom> findByUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    // Obtener todas las conversaciones de un usuario
    @Query("SELECT cr FROM ChatRoom cr WHERE " +
           "(cr.customer = :user OR cr.provider = :user) AND cr.isActive = true " +
           "ORDER BY cr.lastMessageTime DESC")
    List<ChatRoom> findByUserOrderByLastMessageTimeDesc(@Param("user") User user);
    
    // Contar mensajes no leídos
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE " +
           "m.chatRoom = :chatRoom AND m.sender != :currentUser AND m.isRead = false")
    Long countUnreadMessages(@Param("chatRoom") ChatRoom chatRoom, 
                            @Param("currentUser") User currentUser);
}
```

**Archivo**: `src/main/java/com/cleanhome/backend/repository/ChatMessageRepository.java`

```java
package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.ChatMessage;
import com.cleanhome.backend.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Obtener mensajes de una conversación (paginados)
    Page<ChatMessage> findByChatRoomOrderByCreatedAtAsc(
        ChatRoom chatRoom, Pageable pageable);
    
    // Obtener últimos N mensajes
    @Query("SELECT m FROM ChatMessage m WHERE m.chatRoom = :chatRoom " +
           "ORDER BY m.createdAt DESC LIMIT :limit")
    List<ChatMessage> findLastMessages(@Param("chatRoom") ChatRoom chatRoom,
                                       @Param("limit") int limit);
    
    // Marcar como leídos
    @Query("UPDATE ChatMessage m SET m.isRead = true, m.readAt = NOW() " +
           "WHERE m.chatRoom = :chatRoom AND m.isRead = false AND m.sender != :user")
    void markAsRead(@Param("chatRoom") ChatRoom chatRoom, @Param("user") User user);
}
```

### Paso 4: Crear Service

**Archivo**: `src/main/java/com/cleanhome/backend/service/ChatService.java`

```java
package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.ChatMessageDto;
import com.cleanhome.backend.dto.ChatRoomDto;
import com.cleanhome.backend.entity.ChatMessage;
import com.cleanhome.backend.entity.ChatRoom;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.repository.ChatMessageRepository;
import com.cleanhome.backend.repository.ChatRoomRepository;
import com.cleanhome.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    
    /**
     * Obtener o crear una sala de chat entre dos usuarios
     */
    public ChatRoom getOrCreateChatRoom(Long customerId, Long providerId) {
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        User provider = userRepository.findById(providerId)
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        return chatRoomRepository.findByUsers(customer, provider)
            .orElseGet(() -> {
                ChatRoom newRoom = new ChatRoom(customer, provider);
                return chatRoomRepository.save(newRoom);
            });
    }
    
    /**
     * Enviar un nuevo mensaje
     */
    public ChatMessageDto sendMessage(Long chatRoomId, Long senderId, String messageText) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));
        
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar que el sender está en la room
        if (!isUserInChatRoom(sender, chatRoom)) {
            throw new RuntimeException("Usuario no autorizado para este chat");
        }
        
        // Crear mensaje
        ChatMessage message = new ChatMessage(chatRoom, sender, messageText);
        message = chatMessageRepository.save(message);
        
        // Actualizar último mensaje de la room
        chatRoom.setLastMessage(messageText);
        chatRoom.setLastMessageTime(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);
        
        log.info("Mensaje enviado: {} en sala {}", message.getId(), chatRoomId);
        
        return modelMapper.map(message, ChatMessageDto.class);
    }
    
    /**
     * Obtener historial de mensajes
     */
    public List<ChatMessageDto> getMessages(Long chatRoomId, int page, int size) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));
        
        Pageable pageable = PageRequest.of(page, size);
        return chatMessageRepository.findByChatRoomOrderByCreatedAtAsc(chatRoom, pageable)
            .stream()
            .map(msg -> modelMapper.map(msg, ChatMessageDto.class))
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener conversaciones del usuario
     */
    public List<ChatRoomDto> getUserConversations(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return chatRoomRepository.findByUserOrderByLastMessageTimeDesc(user)
            .stream()
            .map(room -> convertToDto(room, user))
            .collect(Collectors.toList());
    }
    
    /**
     * Marcar mensajes como leídos
     */
    public void markMessagesAsRead(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Sala de chat no encontrada"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Aquí iría la lógica para marcar como leídos
        // chatMessageRepository.markAsRead(chatRoom, user);
    }
    
    // Métodos auxiliares
    
    private boolean isUserInChatRoom(User user, ChatRoom chatRoom) {
        return user.equals(chatRoom.getCustomer()) || user.equals(chatRoom.getProvider());
    }
    
    private ChatRoomDto convertToDto(ChatRoom room, User currentUser) {
        ChatRoomDto dto = new ChatRoomDto();
        dto.setId(room.getId());
        
        User otherUser = room.getCustomer().equals(currentUser) ? room.getProvider() : room.getCustomer();
        
        dto.setCustomerId(room.getCustomer().getId());
        dto.setCustomerName(room.getCustomer().getName());
        dto.setProviderId(room.getProvider().getId());
        dto.setProviderName(room.getProvider().getName());
        dto.setLastMessage(room.getLastMessage());
        dto.setLastMessageTime(room.getLastMessageTime());
        
        return dto;
    }
}
```

### Paso 5: Configurar WebSocket

**Archivo**: `src/main/java/com/cleanhome/backend/config/WebSocketConfig.java`

```java
package com.cleanhome.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Habilitar simple message broker
        config.enableSimpleBroker("/topic", "/queue");
        
        // Prefijo para mensajes enviados por clientes
        config.setApplicationDestinationPrefixes("/app");
        
        // Prefijo para respuestas
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint para conexión WebSocket
        registry.addEndpoint("/ws/chat")
            .setAllowedOrigins("*")
            .withSockJS();
        
        // Sin SockJS (WebSocket puro)
        registry.addEndpoint("/ws/chat-native")
            .setAllowedOrigins("*");
    }
}
```

### Paso 6: Crear Controller WebSocket

**Archivo**: `src/main/java/com/cleanhome/backend/controller/ChatController.java`

```java
package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.ChatMessageDto;
import com.cleanhome.backend.dto.ChatRoomDto;
import com.cleanhome.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    
    /**
     * Endpoint REST: Obtener conversaciones del usuario
     */
    @GetMapping("/api/chat/conversations")
    public ResponseEntity<List<ChatRoomDto>> getUserConversations(
            @RequestHeader("Authorization") String token) {
        Long userId = extractUserIdFromToken(token);
        List<ChatRoomDto> conversations = chatService.getUserConversations(userId);
        return ResponseEntity.ok(conversations);
    }
    
    /**
     * Endpoint REST: Obtener historial de mensajes
     */
    @GetMapping("/api/chat/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        List<ChatMessageDto> messages = chatService.getMessages(roomId, page, size);
        return ResponseEntity.ok(messages);
    }
    
    /**
     * WebSocket: Recibir mensaje y broadcast
     * Cliente envía a: /app/chat.sendMessage
     */
    @MessageMapping("/chat.sendMessage/{roomId}")
    @SendTo("/topic/chat.{roomId}")
    public ChatMessageDto sendMessage(
            @DestinationVariable Long roomId,
            @Payload Map<String, Object> payload) {
        
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        String messageText = payload.get("message").toString();
        
        log.info("Mensaje recibido en room {}: {}", roomId, messageText);
        
        ChatMessageDto message = chatService.sendMessage(roomId, senderId, messageText);
        
        return message;
    }
    
    /**
     * WebSocket: Usuario conectado
     */
    @MessageMapping("/chat.addUser/{roomId}")
    @SendTo("/topic/chat.{roomId}")
    public Map<String, Object> addUser(
            @DestinationVariable Long roomId,
            @Payload Map<String, Object> payload) {
        
        Long userId = Long.valueOf(payload.get("userId").toString());
        String userName = payload.get("userName").toString();
        
        log.info("Usuario {} conectado a room {}", userId, roomId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("type", "JOIN");
        response.put("userId", userId);
        response.put("userName", userName);
        response.put("message", userName + " se ha unido al chat");
        
        return response;
    }
    
    // Método auxiliar (implementar según tu JWT)
    private Long extractUserIdFromToken(String token) {
        // Implementar extracción del user ID del token JWT
        return null;
    }
}
```

---

## 📱 Frontend Mobile - Paso a Paso

### Paso 1: Instalar Dependencias

```bash
cd mobile
npm install socket.io-client
npm install @react-navigation/bottom-tabs
```

### Paso 2: Crear Chat Service

**Archivo**: `mobile/src/services/chatService.js`

```javascript
import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(serverUrl, userId) {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverUrl, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket'],
          query: {
            userId: userId,
          },
        });

        this.socket.on('connect', () => {
          console.log('Conectado al servidor de chat');
          this.connected = true;
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('Desconectado del servidor de chat');
          this.connected = false;
        });

        this.socket.on('error', (error) => {
          console.error('Error en socket:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  sendMessage(roomId, userId, message) {
    if (this.socket && this.connected) {
      this.socket.emit('message', {
        roomId,
        userId,
        message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('message', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('userJoined', callback);
    }
  }

  offMessage() {
    if (this.socket) {
      this.socket.off('message');
    }
  }

  joinRoom(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('joinRoom', roomId);
    }
  }

  leaveRoom(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('leaveRoom', roomId);
    }
  }
}

export default new ChatService();
```

### Paso 3: Crear Pantalla de Chat

**Archivo**: `mobile/src/screens/ChatScreen.js`

```javascript
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import GradientBackground from '../components/GradientBackground';
import ModernButton from '../components/ModernButton';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const ChatScreen = ({ route, navigation }) => {
  const { roomId, userName, providerId } = route.params || {};
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: userName,
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });

    initChat();

    return () => {
      chatService.leaveRoom(roomId);
      chatService.offMessage();
    };
  }, []);

  const initChat = async () => {
    try {
      setLoading(true);
      
      // Conectar al servidor si no está conectado
      if (!chatService.connected) {
        await chatService.connect(
          'http://localhost:8080',
          user.id
        );
      }

      // Unirse a la sala
      chatService.joinRoom(roomId);

      // Escuchar mensajes
      chatService.onMessage((message) => {
        setMessages(prev => [...prev, message]);
      });

      // Escuchar usuarios que se unen
      chatService.onUserJoined((data) => {
        setMessages(prev => [...prev, {
          type: 'JOIN',
          message: data.message,
          timestamp: new Date(),
        }]);
      });

      setLoading(false);
    } catch (error) {
      console.error('Error inicializando chat:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    setSending(true);
    
    // Agregar mensaje optimista
    const optimisticMessage = {
      id: Date.now(),
      userId: user.id,
      senderName: user.name,
      messageText: inputText,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setInputText('');

    try {
      chatService.sendMessage(roomId, user.id, inputText);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      // Remover mensaje optimista en caso de error
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.userId === user.id;

    if (item.type === 'JOIN') {
      return (
        <View style={styles.joinNotification}>
          <Text style={styles.joinText}>{item.message}</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwnMessage
              ? styles.ownBubble
              : styles.otherBubble,
          ]}
        >
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownText : styles.otherText,
          ]}>
            {item.messageText}
          </Text>
          <Text style={[
            styles.timestamp,
            isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
          ]}>
            {new Date(item.sentAt).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="chat-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>
                Inicia una conversación
              </Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!sending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <MaterialCommunityIcons
                name="send"
                size={20}
                color={colors.white}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flexGrow: 1,
    padding: 12,
  },
  messageContainer: {
    marginVertical: 4,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ownBubble: {
    backgroundColor: colors.primary,
  },
  otherBubble: {
    backgroundColor: colors.backgroundLight,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  ownText: {
    color: colors.white,
  },
  otherText: {
    color: colors.textDark,
  },
  timestamp: {
    fontSize: 11,
  },
  ownTimestamp: {
    color: colors.white + '80',
  },
  otherTimestamp: {
    color: colors.textSecondary,
  },
  joinNotification: {
    alignItems: 'center',
    marginVertical: 8,
  },
  joinText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: colors.white + '20',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 8,
    color: colors.textDark,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 16,
  },
});

export default ChatScreen;
```

---

## 🧪 Pruebas

### Backend

```bash
# Ejecutar tests
cd homecare
mvn clean test

# Tests específicos de Chat
mvn test -Dtest=ChatServiceTest
```

### Frontend Mobile

```bash
# Pruebas
cd mobile
npm test

# O en Expo
npm run test
```

### Pruebas Manuales

1. **Conectar dos clientes**
   - Abrir app en dos dispositivos
   - Ir a chat con el mismo usuario
   - Enviar mensajes

2. **Verificar WebSocket**
   - Abrir DevTools de browser
   - Ir a Network → WS
   - Ver conexión `/ws/chat-native`

3. **Verificar Persistence**
   - Recargar la app
   - Los mensajes deben aparecer

---

## 🚀 Despliegue

### Producción

```bash
# Backend
export SPRING_PROFILES_ACTIVE=prod
mvn clean package -DskipTests
docker build -t homecare-backend:latest .
docker push your-registry/homecare-backend:latest

# Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📞 Referencia Rápida

| Acción | Comando |
|--------|---------|
| Iniciar servidor | `mvn spring-boot:run` |
| Conectar cliente | `chatService.connect(url, userId)` |
| Enviar mensaje | `chatService.sendMessage(roomId, userId, msg)` |
| Escuchar | `chatService.onMessage(callback)` |
| Ver logs WebSocket | DevTools → Network → WS |

---

**Próximo paso**: Implementar notificaciones push para nuevos mensajes

Última actualización: 8 de enero de 2026
