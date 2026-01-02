package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "location_tracking")
public class LocationTracking extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    @NotNull
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_provider_id", nullable = false)
    @NotNull
    private ServiceProvider serviceProvider;
    
    @NotNull
    @Column(nullable = false)
    private Double latitude;
    
    @NotNull
    @Column(nullable = false)
    private Double longitude;
    
    @Column(name = "accuracy")
    private Double accuracy; // en metros
    
    @Column(name = "speed")
    private Double speed; // en m/s
    
    @Column(name = "heading")
    private Double heading; // dirección en grados
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @Column(name = "is_current")
    private Boolean isCurrent = true;
    
    // Constructors
    public LocationTracking() {}
    
    public LocationTracking(Booking booking, ServiceProvider serviceProvider, 
                           Double latitude, Double longitude) {
        this.booking = booking;
        this.serviceProvider = serviceProvider;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Booking getBooking() {
        return booking;
    }
    
    public void setBooking(Booking booking) {
        this.booking = booking;
    }
    
    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }
    
    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public Double getAccuracy() {
        return accuracy;
    }
    
    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }
    
    public Double getSpeed() {
        return speed;
    }
    
    public void setSpeed(Double speed) {
        this.speed = speed;
    }
    
    public Double getHeading() {
        return heading;
    }
    
    public void setHeading(Double heading) {
        this.heading = heading;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public Boolean getIsCurrent() {
        return isCurrent;
    }
    
    public void setIsCurrent(Boolean isCurrent) {
        this.isCurrent = isCurrent;
    }
}
