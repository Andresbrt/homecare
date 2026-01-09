package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entidad que representa un mensaje dentro de una sala de chat
 */
@Entity
@Table(name = "chat_messages", indexes = {
    @Index(name = "idx_chat_room", columnList = "chat_room_id"),
    @Index(name = "idx_sender", columnList = "sender_id"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @Column(name = "message_text", columnDefinition = "TEXT", nullable = false)
    private String messageText;
    
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    /**
     * Constructor simplificado
     */
    public ChatMessage(ChatRoom chatRoom, User sender, String messageText) {
        this.chatRoom = chatRoom;
        this.sender = sender;
        this.messageText = messageText;
        this.isRead = false;
    }
}
