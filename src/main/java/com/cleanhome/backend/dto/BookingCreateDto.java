package com.cleanhome.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class BookingCreateDto {
    
    @NotNull(message = "El ID del servicio es obligatorio")
    private Long serviceId;
    
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Future(message = "La fecha de inicio debe ser en el futuro")
    private LocalDateTime startDateTime;
    
    private Integer estimatedDurationHours;
    
    private String specialInstructions;
    
    @NotBlank(message = "La dirección del servicio es obligatoria")
    private String serviceAddress;
    
    @NotBlank(message = "La ciudad es obligatoria")
    private String serviceCity;
    
    @NotBlank(message = "El estado es obligatorio")
    private String serviceState;
    
    @NotBlank(message = "El código postal es obligatorio")
    private String servicePostalCode;
    
    private Double serviceLatitude;
    private Double serviceLongitude;
    
    // Constructors
    public BookingCreateDto() {}
    
    // Getters and Setters
    public Long getServiceId() {
        return serviceId;
    }
    
    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
    
    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }
    
    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }
    
    public Integer getEstimatedDurationHours() {
        return estimatedDurationHours;
    }
    
    public void setEstimatedDurationHours(Integer estimatedDurationHours) {
        this.estimatedDurationHours = estimatedDurationHours;
    }
    
    public String getSpecialInstructions() {
        return specialInstructions;
    }
    
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
    
    public String getServiceAddress() {
        return serviceAddress;
    }
    
    public void setServiceAddress(String serviceAddress) {
        this.serviceAddress = serviceAddress;
    }
    
    public String getServiceCity() {
        return serviceCity;
    }
    
    public void setServiceCity(String serviceCity) {
        this.serviceCity = serviceCity;
    }
    
    public String getServiceState() {
        return serviceState;
    }
    
    public void setServiceState(String serviceState) {
        this.serviceState = serviceState;
    }
    
    public String getServicePostalCode() {
        return servicePostalCode;
    }
    
    public void setServicePostalCode(String servicePostalCode) {
        this.servicePostalCode = servicePostalCode;
    }
    
    public Double getServiceLatitude() {
        return serviceLatitude;
    }
    
    public void setServiceLatitude(Double serviceLatitude) {
        this.serviceLatitude = serviceLatitude;
    }
    
    public Double getServiceLongitude() {
        return serviceLongitude;
    }
    
    public void setServiceLongitude(Double serviceLongitude) {
        this.serviceLongitude = serviceLongitude;
    }
}