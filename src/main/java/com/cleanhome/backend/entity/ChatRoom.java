package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
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
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    
    /**
     * Constructor simplificado
     */
    public ChatRoom(User customer, User provider) {
        this.customer = customer;
        this.provider = provider;
        this.isActive = true;
    }
}
