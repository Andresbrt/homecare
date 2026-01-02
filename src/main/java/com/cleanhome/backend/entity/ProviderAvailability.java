package com.cleanhome.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

@Entity
@Table(name = "provider_availability")
public class ProviderAvailability extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_provider_id", nullable = false)
    @NotNull
    private ServiceProvider serviceProvider;
    
    @NotNull
    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek; // MONDAY, TUESDAY, etc.
    
    @NotNull
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @NotNull
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @Column(name = "max_bookings_per_day")
    private Integer maxBookingsPerDay;
    
    // Constructors
    public ProviderAvailability() {}
    
    public ProviderAvailability(ServiceProvider serviceProvider, String dayOfWeek, 
                               LocalTime startTime, LocalTime endTime) {
        this.serviceProvider = serviceProvider;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    
    // Getters and Setters
    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }
    
    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }
    
    public String getDayOfWeek() {
        return dayOfWeek;
    }
    
    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
    
    public LocalTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public Integer getMaxBookingsPerDay() {
        return maxBookingsPerDay;
    }
    
    public void setMaxBookingsPerDay(Integer maxBookingsPerDay) {
        this.maxBookingsPerDay = maxBookingsPerDay;
    }
}
