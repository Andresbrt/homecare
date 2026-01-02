package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.ChatMessageResponseDTO;
import com.cleanhome.backend.dto.SendMessageRequestDTO;
import com.cleanhome.backend.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "API de mensajería entre clientes y proveedores")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    @Operation(summary = "Enviar mensaje", description = "Envía un mensaje en una conversación de reserva")
    public ResponseEntity<ChatMessageResponseDTO> sendMessage(
            @Valid @RequestBody SendMessageRequestDTO request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        ChatMessageResponseDTO response = chatService.sendMessage(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Obtener conversación", description = "Obtiene todos los mensajes de una reserva")
    public ResponseEntity<List<ChatMessageResponseDTO>> getConversation(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<ChatMessageResponseDTO> messages = chatService.getConversation(bookingId, userId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/booking/{bookingId}/mark-read")
    @Operation(summary = "Marcar como leídos", description = "Marca todos los mensajes de una conversación como leídos")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        chatService.markMessagesAsRead(bookingId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Contar no leídos", description = "Cuenta el total de mensajes no leídos del usuario")
    public ResponseEntity<Map<String, Long>> countUnread(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        Long count = chatService.countUnreadMessages(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @GetMapping("/booking/{bookingId}/unread")
    @Operation(summary = "Mensajes no leídos", description = "Obtiene mensajes no leídos de una reserva")
    public ResponseEntity<List<ChatMessageResponseDTO>> getUnreadMessages(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<ChatMessageResponseDTO> messages = chatService.getUnreadMessages(bookingId, userId);
        return ResponseEntity.ok(messages);
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
