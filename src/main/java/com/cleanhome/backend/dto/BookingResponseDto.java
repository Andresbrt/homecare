package com.cleanhome.backend.dto;

import com.cleanhome.backend.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponseDto {
    
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Integer estimatedDurationHours;
    private Integer actualDurationHours;
    private BookingStatus status;
    private BigDecimal totalAmount;
    private String specialInstructions;
    private String customerNotes;
    private String providerNotes;
    private String serviceAddress;
    private String serviceCity;
    private String serviceState;
    private String servicePostalCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Customer and Service Provider info
    private UserResponseDto customer;
    private ServiceProviderResponseDto serviceProvider;
    private ServiceResponseDto service;
    
    // Constructors
    public BookingResponseDto() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }
    
    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }
    
    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }
    
    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }
    
    public Integer getEstimatedDurationHours() {
        return estimatedDurationHours;
    }
    
    public void setEstimatedDurationHours(Integer estimatedDurationHours) {
        this.estimatedDurationHours = estimatedDurationHours;
    }
    
    public Integer getActualDurationHours() {
        return actualDurationHours;
    }
    
    public void setActualDurationHours(Integer actualDurationHours) {
        this.actualDurationHours = actualDurationHours;
    }
    
    public BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getSpecialInstructions() {
        return specialInstructions;
    }
    
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
    
    public String getCustomerNotes() {
        return customerNotes;
    }
    
    public void setCustomerNotes(String customerNotes) {
        this.customerNotes = customerNotes;
    }
    
    public String getProviderNotes() {
        return providerNotes;
    }
    
    public void setProviderNotes(String providerNotes) {
        this.providerNotes = providerNotes;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public UserResponseDto getCustomer() {
        return customer;
    }
    
    public void setCustomer(UserResponseDto customer) {
        this.customer = customer;
    }
    
    public ServiceProviderResponseDto getServiceProvider() {
        return serviceProvider;
    }
    
    public void setServiceProvider(ServiceProviderResponseDto serviceProvider) {
        this.serviceProvider = serviceProvider;
    }
    
    public ServiceResponseDto getService() {
        return service;
    }
    
    public void setService(ServiceResponseDto service) {
        this.service = service;
    }
    
    // Utility methods
    public String getFullServiceAddress() {
        return serviceAddress + ", " + serviceCity + ", " + serviceState + " " + servicePostalCode;
    }
}