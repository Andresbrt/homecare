package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "provider_blocked_dates")
public class ProviderBlockedDate extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_provider_id", nullable = false)
    @NotNull
    private ServiceProvider serviceProvider;
    
    @NotNull
    @Column(name = "blocked_date", nullable = false)
    private LocalDate blockedDate;
    
    @Column(name = "reason")
    private String reason;
    
    @Column(name = "is_full_day")
    private Boolean isFullDay = true;
    
    // Constructors
    public ProviderBlockedDate() {}
    
    public ProviderBlockedDate(ServiceProvider serviceProvider, LocalDate blockedDate, String reason) {
        this.serviceProvider = serviceProvider;
        this.blockedDate = blockedDate;
        this.reason = reason;
    }
    
    // Getters and Setters
    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }
    
    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }
    
    public LocalDate getBlockedDate() {
        return blockedDate;
    }
    
    public void setBlockedDate(LocalDate blockedDate) {
        this.blockedDate = blockedDate;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public Boolean getIsFullDay() {
        return isFullDay;
    }
    
    public void setIsFullDay(Boolean isFullDay) {
        this.isFullDay = isFullDay;
    }
}
