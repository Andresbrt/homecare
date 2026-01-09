package com.cleanhome.backend.entity;

import jakarta.persistence.*;
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

    // Constructors
    public ChatMessage() {
    }

    public ChatMessage(ChatRoom chatRoom, User sender, String messageText) {
        this.chatRoom = chatRoom;
        this.sender = sender;
        this.messageText = messageText;
        this.isRead = false;
    }

    public ChatMessage(Long id, ChatRoom chatRoom, User sender, String messageText, Boolean isRead, LocalDateTime readAt) {
        this.id = id;
        this.chatRoom = chatRoom;
        this.sender = sender;
        this.messageText = messageText;
        this.isRead = isRead;
        this.readAt = readAt;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public ChatRoom getChatRoom() {
        return chatRoom;
    }

    public User getSender() {
        return sender;
    }

    public String getMessageText() {
        return messageText;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setChatRoom(ChatRoom chatRoom) {
        this.chatRoom = chatRoom;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
}
