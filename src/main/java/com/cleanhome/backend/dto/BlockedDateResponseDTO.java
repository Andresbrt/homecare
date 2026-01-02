package com.cleanhome.backend.dto;

import com.cleanhome.backend.entity.ProviderBlockedDate;

public class BlockedDateResponseDTO {
    
    private Long id;
    private String blockedDate;
    private String reason;
    private Boolean isFullDay;
    
    public BlockedDateResponseDTO() {}
    
    public BlockedDateResponseDTO(ProviderBlockedDate blockedDate) {
        this.id = blockedDate.getId();
        this.blockedDate = blockedDate.getBlockedDate().toString();
        this.reason = blockedDate.getReason();
        this.isFullDay = blockedDate.getIsFullDay();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
