package com.cleanhome.backend.dto;

import com.cleanhome.backend.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;

public class NotificationRequestDTO {
    
    @NotBlank(message = "El título es obligatorio")
    private String title;
    
    @NotBlank(message = "El mensaje es obligatorio")
    private String message;
    
    private NotificationType type = NotificationType.INFO;
    
    private String data; // JSON adicional para navegación
    
    private Long relatedBookingId;
    
    private String targetUserEmail; // Para admin: enviar a usuario específico
    
    // Constructors
    public NotificationRequestDTO() {}
    
    public NotificationRequestDTO(String title, String message, NotificationType type) {
        this.title = title;
        this.message = message;
        this.type = type;
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
    
    public String getTargetUserEmail() {
        return targetUserEmail;
    }
    
    public void setTargetUserEmail(String targetUserEmail) {
        this.targetUserEmail = targetUserEmail;
    }
}
