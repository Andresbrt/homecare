package com.cleanhome.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SendMessageRequestDTO {
    
    @NotNull(message = "El ID de la reserva es requerido")
    private Long bookingId;
    
    @NotBlank(message = "El mensaje no puede estar vacío")
    private String message;
    
    private String messageType = "TEXT"; // TEXT, IMAGE, SYSTEM, LOCATION
    
    private String attachmentUrl;

    public SendMessageRequestDTO() {
    }

    public SendMessageRequestDTO(Long bookingId, String message, String messageType, String attachmentUrl) {
        this.bookingId = bookingId;
        this.message = message;
        this.messageType = messageType;
        this.attachmentUrl = attachmentUrl;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(String attachmentUrl) {
        this.attachmentUrl = attachmentUrl;
    }
}
