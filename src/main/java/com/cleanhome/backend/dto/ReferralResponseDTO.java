package com.cleanhome.backend.dto;

import com.cleanhome.backend.model.ReferralStatus;

import java.time.LocalDateTime;

public class ReferralResponseDTO {
    
    private Long id;
    private String referralCode;
    private ReferralStatus status;
    private String referredUserName;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public ReferralResponseDTO() {
    }

    public ReferralResponseDTO(Long id, String referralCode, ReferralStatus status, String referredUserName,
                               LocalDateTime createdAt, LocalDateTime completedAt) {
        this.id = id;
        this.referralCode = referralCode;
        this.status = status;
        this.referredUserName = referredUserName;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReferralCode() {
        return referralCode;
    }

    public void setReferralCode(String referralCode) {
        this.referralCode = referralCode;
    }

    public ReferralStatus getStatus() {
        return status;
    }

    public void setStatus(ReferralStatus status) {
        this.status = status;
    }

    public String getReferredUserName() {
        return referredUserName;
    }

    public void setReferredUserName(String referredUserName) {
        this.referredUserName = referredUserName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
