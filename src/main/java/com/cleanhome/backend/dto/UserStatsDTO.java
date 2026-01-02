package com.cleanhome.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UserStatsDTO {
    
    private Long userId;
    private String fullName;
    private String email;
    private LocalDateTime memberSince;
    
    // Booking stats
    private Integer totalBookings;
    private Integer completedBookings;
    private Integer cancelledBookings;
    private Integer activeBookings;
    
    // Rating stats
    private Integer ratingsGiven;
    
    // Financial stats
    private BigDecimal totalSpent;
    
    // Engagement stats
    private Integer favoritesCount;
    private Integer referralsCount;
    
    // Loyalty stats
    private Integer loyaltyPoints;
    private Integer totalPointsEarned;

    public UserStatsDTO() {
    }

    public UserStatsDTO(Long userId, String fullName, String email, LocalDateTime memberSince,
                        Integer totalBookings, Integer completedBookings, Integer cancelledBookings, Integer activeBookings,
                        Integer ratingsGiven, BigDecimal totalSpent, Integer favoritesCount, Integer referralsCount,
                        Integer loyaltyPoints, Integer totalPointsEarned) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.memberSince = memberSince;
        this.totalBookings = totalBookings;
        this.completedBookings = completedBookings;
        this.cancelledBookings = cancelledBookings;
        this.activeBookings = activeBookings;
        this.ratingsGiven = ratingsGiven;
        this.totalSpent = totalSpent;
        this.favoritesCount = favoritesCount;
        this.referralsCount = referralsCount;
        this.loyaltyPoints = loyaltyPoints;
        this.totalPointsEarned = totalPointsEarned;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getMemberSince() {
        return memberSince;
    }

    public void setMemberSince(LocalDateTime memberSince) {
        this.memberSince = memberSince;
    }

    public Integer getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Integer getCompletedBookings() {
        return completedBookings;
    }

    public void setCompletedBookings(Integer completedBookings) {
        this.completedBookings = completedBookings;
    }

    public Integer getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(Integer cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public Integer getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(Integer activeBookings) {
        this.activeBookings = activeBookings;
    }

    public Integer getRatingsGiven() {
        return ratingsGiven;
    }

    public void setRatingsGiven(Integer ratingsGiven) {
        this.ratingsGiven = ratingsGiven;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(BigDecimal totalSpent) {
        this.totalSpent = totalSpent;
    }

    public Integer getFavoritesCount() {
        return favoritesCount;
    }

    public void setFavoritesCount(Integer favoritesCount) {
        this.favoritesCount = favoritesCount;
    }

    public Integer getReferralsCount() {
        return referralsCount;
    }

    public void setReferralsCount(Integer referralsCount) {
        this.referralsCount = referralsCount;
    }

    public Integer getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(Integer loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public Integer getTotalPointsEarned() {
        return totalPointsEarned;
    }

    public void setTotalPointsEarned(Integer totalPointsEarned) {
        this.totalPointsEarned = totalPointsEarned;
    }
}
