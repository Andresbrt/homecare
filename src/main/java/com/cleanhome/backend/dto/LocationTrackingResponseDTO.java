package com.cleanhome.backend.dto;

import java.time.LocalDateTime;

public class LocationTrackingResponseDTO {
    
    private Long id;
    private Long bookingId;
    private Long serviceProviderId;
    private Double latitude;
    private Double longitude;
    private Double accuracy;
    private Double speed;
    private Double heading;
    private LocalDateTime timestamp;
    private Boolean isCurrent;

    public LocationTrackingResponseDTO() {
    }

    public LocationTrackingResponseDTO(Long id, Long bookingId, Long serviceProviderId, Double latitude, Double longitude,
                                       Double accuracy, Double speed, Double heading, LocalDateTime timestamp, Boolean isCurrent) {
        this.id = id;
        this.bookingId = bookingId;
        this.serviceProviderId = serviceProviderId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracy = accuracy;
        this.speed = speed;
        this.heading = heading;
        this.timestamp = timestamp;
        this.isCurrent = isCurrent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getServiceProviderId() {
        return serviceProviderId;
    }

    public void setServiceProviderId(Long serviceProviderId) {
        this.serviceProviderId = serviceProviderId;
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
