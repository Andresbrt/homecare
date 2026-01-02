package com.cleanhome.backend.dto;

import com.cleanhome.backend.entity.Rating;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RatingResponseDTO {
    
    private Long id;
    private BigDecimal rating;
    private String comment;
    private Boolean isAnonymous;
    private Long bookingId;
    private String userName;
    private String providerName;
    private LocalDateTime createdAt;
    
    // Constructors
    public RatingResponseDTO() {}
    
    public RatingResponseDTO(Rating rating) {
        this.id = rating.getId();
        this.rating = rating.getRating();
        this.comment = rating.getComment();
        this.isAnonymous = rating.getIsAnonymous();
        this.bookingId = rating.getBooking() != null ? rating.getBooking().getId() : null;
        this.userName = rating.getIsAnonymous() ? "Anónimo" : 
                       (rating.getUser() != null ? rating.getUser().getFullName() : "Usuario");
        this.providerName = rating.getServiceProvider() != null ? 
                           rating.getServiceProvider().getBusinessName() : "Proveedor";
        this.createdAt = rating.getCreatedAt();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
    
    public Long getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
    
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getProviderName() {
        return providerName;
    }
    
    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
