package com.cleanhome.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO para mensajes de chat
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    
    private Long id;
    
    private Long chatRoomId;
    
    private Long senderId;
    
    private String senderName;
    
    private String senderAvatar;
    
    private String messageText;
    
    private LocalDateTime sentAt;
    
    private Boolean isRead;
    
    @JsonProperty("timestamp")
    private LocalDateTime timestamp;
}
