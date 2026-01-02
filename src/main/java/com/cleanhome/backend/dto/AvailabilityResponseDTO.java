package com.cleanhome.backend.dto;

import com.cleanhome.backend.entity.ProviderAvailability;

public class AvailabilityResponseDTO {
    
    private Long id;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private Boolean isAvailable;
    private Integer maxBookingsPerDay;
    
    public AvailabilityResponseDTO() {}
    
    public AvailabilityResponseDTO(ProviderAvailability availability) {
        this.id = availability.getId();
        this.dayOfWeek = availability.getDayOfWeek();
        this.startTime = availability.getStartTime().toString();
        this.endTime = availability.getEndTime().toString();
        this.isAvailable = availability.getIsAvailable();
        this.maxBookingsPerDay = availability.getMaxBookingsPerDay();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDayOfWeek() {
        return dayOfWeek;
    }
    
    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
    
    public String getStartTime() {
        return startTime;
    }
    
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }
    
    public String getEndTime() {
        return endTime;
    }
    
    public void setEndTime(String endTime) {
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
