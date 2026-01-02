package com.cleanhome.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class RatingRequestDTO {
    
    @NotNull(message = "El ID de la reserva es obligatorio")
    private Long bookingId;
    
    @NotNull(message = "La calificación es obligatoria")
    @DecimalMin(value = "1.0", message = "La calificación mínima es 1")
    @DecimalMax(value = "5.0", message = "La calificación máxima es 5")
    private BigDecimal rating;
    
    @Size(max = 500, message = "El comentario no puede exceder 500 caracteres")
    private String comment;
    
    private Boolean isAnonymous = false;
    
    // Constructors
    public RatingRequestDTO() {}
    
    public RatingRequestDTO(Long bookingId, BigDecimal rating, String comment, Boolean isAnonymous) {
        this.bookingId = bookingId;
        this.rating = rating;
        this.comment = comment;
        this.isAnonymous = isAnonymous;
    }
    
    // Getters and Setters
    public Long getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
    
    public BigDecimal getRating() {
        return rating;
    }
    
    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public Boolean getIsAnonymous() {
        return isAnonymous;
    }
    
    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }
}
