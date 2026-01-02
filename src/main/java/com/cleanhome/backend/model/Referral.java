package com.cleanhome.backend.model;

import com.cleanhome.backend.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "referrals")
public class Referral {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referrer_id", nullable = false)
    private User referrer; // Usuario que refiere
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referred_id", nullable = false)
    private User referred; // Usuario referido
    
    @Column(unique = true, nullable = false)
    private String referralCode;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReferralStatus status;
    
    @Column
    private LocalDateTime completedAt;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Referral() {
    }

    public Referral(Long id, User referrer, User referred, String referralCode, ReferralStatus status,
                    LocalDateTime completedAt, LocalDateTime createdAt) {
        this.id = id;
        this.referrer = referrer;
        this.referred = referred;
        this.referralCode = referralCode;
        this.status = status;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getReferrer() {
        return referrer;
    }

    public void setReferrer(User referrer) {
        this.referrer = referrer;
    }

    public User getReferred() {
        return referred;
    }

    public void setReferred(User referred) {
        this.referred = referred;
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

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
