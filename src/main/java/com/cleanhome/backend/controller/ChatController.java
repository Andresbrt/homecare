package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.ApiResponse;
import com.cleanhome.backend.dto.ChatMessageDto;
import com.cleanhome.backend.dto.ChatRoomDto;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.service.ChatService;
import com.cleanhome.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.security.Principal;
import java.util.List;

/**
 * Controlador para manejar operaciones de chat
 * - Endpoints REST para obtener conversaciones y historial
 * - Handlers WebSocket para mensajes en tiempo real
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    
    // ==================== ENDPOINTS REST ====================
    
    /**
     * GET /api/chat/conversations - Obtener conversaciones del usuario
     * 
     * @return Lista de salas de chat con último mensaje
     */
    @GetMapping("/conversations")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ChatRoomDto>>> getUserConversations(
            Principal principal) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromPrincipal(principal);
            List<ChatRoomDto> conversations = chatService.getUserConversations(userId);
            
            return ResponseEntity.ok(ApiResponse.success(
                conversations,
                "Conversaciones obtenidas correctamente"
            ));
        } catch (Exception e) {
            log.error("Error obteniendo conversaciones", e);
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Error obteniendo conversaciones: " + e.getMessage())
            );
        }
    }
    
    /**
     * GET /api/chat/rooms/{roomId}/messages - Obtener historial de mensajes
     * 
     * @param roomId ID de la sala de chat
     * @param page Número de página (default: 0)
     * @param size Tamaño de página (default: 20)
     * @return Lista paginada de mensajes
     */
    @GetMapping("/rooms/{roomId}/messages")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getMessages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Principal principal) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromPrincipal(principal);
            List<ChatMessageDto> messages = chatService.getMessages(roomId, page, size);
            
            log.info("Recuperados {} mensajes de sala {} para usuario {}", 
                     messages.size(), roomId, userId);
            
            return ResponseEntity.ok(ApiResponse.success(
                messages,
                "Mensajes obtenidos correctamente"
            ));
        } catch (Exception e) {
            log.error("Error obteniendo mensajes de sala {}", roomId, e);
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Error obteniendo mensajes: " + e.getMessage())
            );
        }
    }
    
    /**
     * POST /api/chat/rooms - Crear o obtener sala de chat
     * 
     * @param request Contiene customerId y providerId
     * @return La sala de chat creada o existente
     */
    @PostMapping("/rooms")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ChatRoomDto>> createOrGetChatRoom(
            @RequestBody ChatRoomRequest request,
            Principal principal) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromPrincipal(principal);
            Long customerId = request.getCustomerId();
            Long providerId = request.getProviderId();
            
            var room = chatService.getOrCreateChatRoom(customerId, providerId);
            ChatRoomDto dto = new ChatRoomDto();
            dto.setId(room.getId());
            dto.setCustomerId(room.getCustomer().getId());
            dto.setProviderId(room.getProvider().getId());
            dto.setLastMessage(room.getLastMessage());
            dto.setLastMessageTime(room.getLastMessageTime());
            
            return ResponseEntity.ok(ApiResponse.success(
                dto,
                "Sala de chat obtenida/creada correctamente"
            ));
        } catch (Exception e) {
            log.error("Error creando/obteniendo sala de chat", e);
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Error: " + e.getMessage())
            );
        }
    }
    
    /**
     * PUT /api/chat/rooms/{roomId}/read - Marcar mensajes como leídos
     * 
     * @param roomId ID de la sala
     */
    @PutMapping("/rooms/{roomId}/read")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long roomId,
            Principal principal) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromPrincipal(principal);
            chatService.markMessagesAsRead(roomId, userId);
            
            return ResponseEntity.ok(ApiResponse.success(
                null,
                "Mensajes marcados como leídos"
            ));
        } catch (Exception e) {
            log.error("Error marcando mensajes como leídos", e);
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Error: " + e.getMessage())
            );
        }
    }
    
    /**
     * GET /api/chat/rooms/{roomId}/unread-count - Obtener número de no leídos
     * 
     * @param roomId ID de la sala
     * @return Número de mensajes no leídos
     */
    @GetMapping("/rooms/{roomId}/unread-count")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @PathVariable Long roomId) {
        try {
            Long unreadCount = chatService.getUnreadCount(roomId);
            return ResponseEntity.ok(ApiResponse.success(
                unreadCount,
                "Conteo de no leídos obtenido"
            ));
        } catch (Exception e) {
            log.error("Error obteniendo conteo de no leídos", e);
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Error: " + e.getMessage())
            );
        }
    }
    
    // ==================== WEBSOCKET MESSAGE HANDLERS ====================
    
    /**
     * STOMP: /app/chat/send
     * Enviar un mensaje a través de WebSocket
     * 
     * El cliente envía:
     * {
     *   "chatRoomId": 1,
     *   "senderId": 123,
     *   "messageText": "Hola"
     * }
     * 
     * Se distribuye a:
     * /topic/chat/room/{chatRoomId} - todos en la sala
     * /user/{senderId}/queue/notifications - notificaciones al receptor
     */
    @MessageMapping("/chat/send")
    @SendTo("/topic/chat")
    public ChatMessageDto handleChatMessage(
            @Payload SendMessageRequest request,
            SimpMessageHeaderAccessor headerAccessor) {
        try {
            String sessionId = headerAccessor.getSessionId();
            log.info("Mensaje recibido en WebSocket [session: {}]", sessionId);
            
            ChatMessageDto message = chatService.sendMessage(
                request.getChatRoomId(),
                request.getSenderId(),
                request.getMessageText()
            );
            
            // Notificar al receptor sobre el nuevo mensaje
            messagingTemplate.convertAndSendToUser(
                String.valueOf(getOtherUserId(request.getChatRoomId(), request.getSenderId())),
                "/queue/messages",
                message
            );
            
            return message;
        } catch (Exception e) {
            log.error("Error en handleChatMessage", e);
            return null;
        }
    }
    
    /**
     * STOMP: /app/chat/typing
     * Notificar que está escribiendo (write presence)
     */
    @MessageMapping("/chat/typing")
    @SendTo("/topic/typing")
    public TypingNotification handleTypingNotification(
            @Payload TypingNotification notification,
            SimpMessageHeaderAccessor headerAccessor) {
        log.info("Usuario {} escribiendo en sala {}", 
                 notification.getUserId(), notification.getChatRoomId());
        
        return TypingNotification.builder()
            .chatRoomId(notification.getChatRoomId())
            .userId(notification.getUserId())
            .userName(notification.getUserName())
            .isTyping(notification.isTyping())
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    /**
     * STOMP: /app/chat/read
     * Notificar que se ha leído un mensaje
     */
    @MessageMapping("/chat/read")
    public void handleReadNotification(
            @Payload ReadNotification notification) {
        log.info("Mensaje {} marcado como leído por usuario {}", 
                 notification.getMessageId(), notification.getUserId());
        
        messagingTemplate.convertAndSend(
            "/topic/chat/room/" + notification.getChatRoomId(),
            notification
        );
    }
    
    /**
     * STOMP: /app/chat/subscribe
     * Notificar que un usuario se conectó
     */
    @MessageMapping("/chat/subscribe")
    public void handleSubscribe(
            @Payload SubscribeRequest request,
            SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        log.info("Usuario {} subscribido a sala {} [session: {}]", 
                 request.getUserId(), request.getChatRoomId(), sessionId);
        
        messagingTemplate.convertAndSend(
            "/topic/chat/room/" + request.getChatRoomId(),
            UserPresence.builder()
                .chatRoomId(request.getChatRoomId())
                .userId(request.getUserId())
                .userName(request.getUserName())
                .isOnline(true)
                .timestamp(System.currentTimeMillis())
                .build()
        );
    }
    
    // ==================== HELPER METHODS ====================
    
    private Long getOtherUserId(Long chatRoomId, Long currentUserId) {
        // TODO: Implementar obtención del otro usuario de la sala
        return currentUserId + 1; // placeholder
    }
    
    // ==================== DTOs ====================
    
    @lombok.Data
    public static class ChatRoomRequest {
        private Long customerId;
        private Long providerId;
    }
    
    @lombok.Data
    @lombok.Builder
    public static class SendMessageRequest {
        private Long chatRoomId;
        private Long senderId;
        private String messageText;
    }
    
    @lombok.Data
    @lombok.Builder
    public static class TypingNotification {
        private Long chatRoomId;
        private Long userId;
        private String userName;
        private boolean isTyping;
        private long timestamp;
    }
    
    @lombok.Data
    @lombok.Builder
    public static class ReadNotification {
        private Long chatRoomId;
        private Long messageId;
        private Long userId;
        private long timestamp;
    }
    
    @lombok.Data
    @lombok.Builder
    public static class SubscribeRequest {
        private Long chatRoomId;
        private Long userId;
        private String userName;
    }
    
    @lombok.Data
    @lombok.Builder
    public static class UserPresence {
        private Long chatRoomId;
        private Long userId;
        private String userName;
        private boolean isOnline;
        private long timestamp;
    }
}
