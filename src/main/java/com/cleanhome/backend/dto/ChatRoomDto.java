package com.cleanhome.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para salas de chat
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    
    private Long id;
    
    private Long customerId;
    
    private String customerName;
    
    private String customerAvatar;
    
    private Long providerId;
    
    private String providerName;
    
    private String providerAvatar;
    
    private String lastMessage;
    
    private LocalDateTime lastMessageTime;
    
    private Long unreadCount;
    
    private List<ChatMessageDto> messages;
}
