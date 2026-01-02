package com.cleanhome.backend.dto;

import com.cleanhome.backend.entity.Notification;
import com.cleanhome.backend.entity.NotificationType;
import java.time.LocalDateTime;

public class NotificationResponseDTO {
    
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private String data;
    private Long relatedBookingId;
    private LocalDateTime createdAt;
    
    public NotificationResponseDTO() {}
    
    public NotificationResponseDTO(Notification notification) {
        this.id = notification.getId();
        this.title = notification.getTitle();
        this.message = notification.getMessage();
        this.type = notification.getType();
        this.isRead = notification.getIsRead();
        this.data = notification.getData();
        this.relatedBookingId = notification.getRelatedBooking() != null ? 
                               notification.getRelatedBooking().getId() : null;
        this.createdAt = notification.getCreatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public Long getRelatedBookingId() {
        return relatedBookingId;
    }
    
    public void setRelatedBookingId(Long relatedBookingId) {
        this.relatedBookingId = relatedBookingId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
