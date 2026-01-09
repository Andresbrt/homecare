package com.cleanhome.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para salas de chat
 */
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

    // Constructors
    public ChatRoomDto() {
    }

    public ChatRoomDto(Long id, Long customerId, String customerName, String customerAvatar,
                       Long providerId, String providerName, String providerAvatar,
                       String lastMessage, LocalDateTime lastMessageTime, Long unreadCount) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerAvatar = customerAvatar;
        this.providerId = providerId;
        this.providerName = providerName;
        this.providerAvatar = providerAvatar;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.unreadCount = unreadCount;
    }

    public ChatRoomDto(Long id, Long customerId, String customerName, String customerAvatar,
                       Long providerId, String providerName, String providerAvatar,
                       String lastMessage, LocalDateTime lastMessageTime, Long unreadCount,
                       List<ChatMessageDto> messages) {
        this(id, customerId, customerName, customerAvatar, providerId, providerName,
             providerAvatar, lastMessage, lastMessageTime, unreadCount);
        this.messages = messages;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerAvatar() {
        return customerAvatar;
    }

    public Long getProviderId() {
        return providerId;
    }

    public String getProviderName() {
        return providerName;
    }

    public String getProviderAvatar() {
        return providerAvatar;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public Long getUnreadCount() {
        return unreadCount;
    }

    public List<ChatMessageDto> getMessages() {
        return messages;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setCustomerAvatar(String customerAvatar) {
        this.customerAvatar = customerAvatar;
    }

    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public void setProviderAvatar(String providerAvatar) {
        this.providerAvatar = providerAvatar;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public void setUnreadCount(Long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public void setMessages(List<ChatMessageDto> messages) {
        this.messages = messages;
    }
}
