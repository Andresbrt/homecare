package com.cleanhome.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

/**
 * DTO para mensajes de chat
 */
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

    public ChatMessageDto() {
    }

    public ChatMessageDto(Long id, Long chatRoomId, Long senderId, String senderName, 
                         String senderAvatar, String messageText, LocalDateTime sentAt, 
                         Boolean isRead, LocalDateTime timestamp) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderAvatar = senderAvatar;
        this.messageText = messageText;
        this.sentAt = sentAt;
        this.isRead = isRead;
        this.timestamp = timestamp;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getChatRoomId() {
        return chatRoomId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getSenderAvatar() {
        return senderAvatar;
    }

    public String getMessageText() {
        return messageText;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setChatRoomId(Long chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public void setSenderAvatar(String senderAvatar) {
        this.senderAvatar = senderAvatar;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
