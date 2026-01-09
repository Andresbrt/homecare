package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad que representa una sala de chat entre dos usuarios
 * (cliente y proveedor de servicios)
 */
@Entity
@Table(name = "chat_rooms", indexes = {
    @Index(name = "idx_customer", columnList = "customer_id"),
    @Index(name = "idx_provider", columnList = "provider_id")
})
public class ChatRoom extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;
    
    @Column(name = "last_message", columnDefinition = "TEXT")
    private String lastMessage;
    
    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChatMessage> messages;

    // Constructors
    public ChatRoom() {
    }

    public ChatRoom(User customer, User provider) {
        this.customer = customer;
        this.provider = provider;
        this.isActive = true;
    }

    public ChatRoom(Long id, User customer, User provider, String lastMessage, 
                    LocalDateTime lastMessageTime, Boolean isActive, List<ChatMessage> messages) {
        this.id = id;
        this.customer = customer;
        this.provider = provider;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.isActive = isActive;
        this.messages = messages;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public User getCustomer() {
        return customer;
    }

    public User getProvider() {
        return provider;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public List<ChatMessage> getMessages() {
        return messages;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public void setProvider(User provider) {
        this.provider = provider;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
}
