package com.cleanhome.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class BlockedDateRequestDTO {
    
    @NotBlank(message = "La fecha es obligatoria")
    private String blockedDate; // YYYY-MM-DD format
    
    private String reason;
    
    private Boolean isFullDay = true;
    
    // Constructors
    public BlockedDateRequestDTO() {}
    
    public BlockedDateRequestDTO(String blockedDate, String reason) {
        this.blockedDate = blockedDate;
        this.reason = reason;
    }
    
    // Getters and Setters
    public String getBlockedDate() {
        return blockedDate;
    }
    
    public void setBlockedDate(String blockedDate) {
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
