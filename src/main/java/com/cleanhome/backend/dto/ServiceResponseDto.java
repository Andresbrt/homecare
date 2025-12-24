package com.cleanhome.backend.dto;

import com.cleanhome.backend.enums.ServiceType;

import java.math.BigDecimal;

public class ServiceResponseDto {
    
    private Long id;
    private String name;
    private String description;
    private ServiceType serviceType;
    private BigDecimal basePrice;
    private Integer estimatedDurationHours;
    private Boolean isActive;
    private ServiceProviderResponseDto serviceProvider;
    
    // Constructors
    public ServiceResponseDto() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public ServiceType getServiceType() {
        return serviceType;
    }
    
    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }
    
    public BigDecimal getBasePrice() {
        return basePrice;
    }
    
    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }
    
    public Integer getEstimatedDurationHours() {
        return estimatedDurationHours;
    }
    
    public void setEstimatedDurationHours(Integer estimatedDurationHours) {
        this.estimatedDurationHours = estimatedDurationHours;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public ServiceProviderResponseDto getServiceProvider() {
        return serviceProvider;
    }
    
    public void setServiceProvider(ServiceProviderResponseDto serviceProvider) {
        this.serviceProvider = serviceProvider;
    }
}