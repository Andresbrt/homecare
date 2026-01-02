package com.cleanhome.backend.dto;

import jakarta.validation.constraints.NotNull;

public class LocationUpdateRequestDTO {
    
    @NotNull(message = "La latitud es requerida")
    private Double latitude;
    
    @NotNull(message = "La longitud es requerida")
    private Double longitude;
    
    private Double accuracy;
    private Double speed;
    private Double heading;

    public LocationUpdateRequestDTO() {
    }

    public LocationUpdateRequestDTO(Double latitude, Double longitude, Double accuracy, Double speed, Double heading) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracy = accuracy;
        this.speed = speed;
        this.heading = heading;
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
}
