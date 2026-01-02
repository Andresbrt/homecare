package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {
    
    @NotNull
    @Column(nullable = false)
    private String title;
    
    @NotNull
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Column(name = "notification_type")
    @Enumerated(EnumType.STRING)
    private NotificationType type = NotificationType.INFO;
    
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @Column(name = "data", columnDefinition = "TEXT")
    private String data; // JSON data para navegación específica
    
    @Column(name = "push_sent")
    private Boolean pushSent = false;
    
    @Column(name = "push_token")
    private String pushToken; // Expo push token del destinatario
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Usuario destinatario
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_booking_id")
    private Booking relatedBooking; // Reserva relacionada (opcional)
    
    // Constructors
    public Notification() {}
    
    public Notification(String title, String message, User user) {
        this.title = title;
        this.message = message;
        this.user = user;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public NotificationType getType() {
        return type;
    }
    
    public void setType(NotificationType type) {
        this.type = type;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public String getData() {
        return data;
    }
    
    public void setData(String data) {
        this.data = data;
    }
    
    public Boolean getPushSent() {
        return pushSent;
    }
    
    public void setPushSent(Boolean pushSent) {
        this.pushSent = pushSent;
    }
    
    public String getPushToken() {
        return pushToken;
    }
    
    public void setPushToken(String pushToken) {
        this.pushToken = pushToken;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Booking getRelatedBooking() {
        return relatedBooking;
    }
    
    public void setRelatedBooking(Booking relatedBooking) {
        this.relatedBooking = relatedBooking;
    }
}
