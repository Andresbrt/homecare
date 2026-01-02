package com.cleanhome.backend.dto;

import com.cleanhome.backend.enums.ServiceType;

import java.math.BigDecimal;
import java.util.Set;

public class ServiceProviderResponseDto {
    
    private Long id;
    private String businessName;
    private String description;
    private Integer yearsExperience;
    private Boolean isVerified;
    private Boolean isAvailable;
    private BigDecimal serviceRadius;
    private BigDecimal hourlyRate;
    private BigDecimal ratingAverage;
    private Integer totalRatings;
    private Integer totalBookings;
    private Set<ServiceType> servicesOffered;
    private UserResponseDto user;
    
    // Constructors
    public ServiceProviderResponseDto() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBusinessName() {
        return businessName;
    }
    
    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getYearsExperience() {
        return yearsExperience;
    }
    
    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public BigDecimal getServiceRadius() {
        return serviceRadius;
    }
    
    public void setServiceRadius(BigDecimal serviceRadius) {
        this.serviceRadius = serviceRadius;
    }
    
    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }
    
    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
    
    public BigDecimal getRatingAverage() {
        return ratingAverage;
    }
    
    public void setRatingAverage(BigDecimal ratingAverage) {
        this.ratingAverage = ratingAverage;
    }
    
    public Integer getTotalRatings() {
        return totalRatings;
    }
    
    public void setTotalRatings(Integer totalRatings) {
        this.totalRatings = totalRatings;
    }
    
    public Integer getTotalBookings() {
        return totalBookings;
    }
    
    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
    }
    
    public Set<ServiceType> getServicesOffered() {
        return servicesOffered;
    }
    
    public void setServicesOffered(Set<ServiceType> servicesOffered) {
        this.servicesOffered = servicesOffered;
    }
    
    public UserResponseDto getUser() {
        return user;
    }
    
    public void setUser(UserResponseDto user) {
        this.user = user;
    }
}