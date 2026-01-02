package com.cleanhome.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AvailabilityRequestDTO {
    
    @NotBlank(message = "El día de la semana es obligatorio")
    private String dayOfWeek; // MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    
    @NotBlank(message = "La hora de inicio es obligatoria")
    private String startTime; // HH:mm format
    
    @NotBlank(message = "La hora de fin es obligatoria")
    private String endTime; // HH:mm format
    
    private Boolean isAvailable = true;
    
    private Integer maxBookingsPerDay;
    
    // Constructors
    public AvailabilityRequestDTO() {}
    
    public AvailabilityRequestDTO(String dayOfWeek, String startTime, String endTime) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    
    // Getters and Setters
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
