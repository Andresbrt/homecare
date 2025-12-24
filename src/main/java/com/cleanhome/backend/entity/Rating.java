package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ratings")
public class Rating extends BaseEntity {
    
    @NotNull(message = "La calificación es obligatoria")
    @DecimalMin(value = "1.0", message = "La calificación mínima es 1")
    @DecimalMax(value = "5.0", message = "La calificación máxima es 5")
    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal rating;
    
    @Size(max = 500, message = "El comentario no puede exceder 500 caracteres")
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // User who gave the rating
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_provider_id", nullable = false)
    private ServiceProvider serviceProvider; // Service provider being rated
    
    // Constructors
    public Rating() {}
    
    public Rating(BigDecimal rating, User user, ServiceProvider serviceProvider, Booking booking) {
        this.rating = rating;
        this.user = user;
        this.serviceProvider = serviceProvider;
        this.booking = booking;
    }
    
    // Getters and Setters
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
    
    public Booking getBooking() {
        return booking;
    }
    
    public void setBooking(Booking booking) {
        this.booking = booking;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }
    
    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }
}