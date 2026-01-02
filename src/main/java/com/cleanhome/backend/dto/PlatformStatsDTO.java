package com.cleanhome.backend.dto;

public class PlatformStatsDTO {
    
    private Long totalUsers;
    private Long totalCustomers;
    private Long totalProviders;
    private Long activeProviders;
    private Long totalBookings;
    private Long completedBookings;
    private Long activeBookings;
    private Long totalServices;
    private Double averageRating;
    private Long totalRatings;

    public PlatformStatsDTO() {
    }

    public PlatformStatsDTO(Long totalUsers, Long totalCustomers, Long totalProviders, Long activeProviders,
                            Long totalBookings, Long completedBookings, Long activeBookings, Long totalServices,
                            Double averageRating, Long totalRatings) {
        this.totalUsers = totalUsers;
        this.totalCustomers = totalCustomers;
        this.totalProviders = totalProviders;
        this.activeProviders = activeProviders;
        this.totalBookings = totalBookings;
        this.completedBookings = completedBookings;
        this.activeBookings = activeBookings;
        this.totalServices = totalServices;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Long getTotalProviders() {
        return totalProviders;
    }

    public void setTotalProviders(Long totalProviders) {
        this.totalProviders = totalProviders;
    }

    public Long getActiveProviders() {
        return activeProviders;
    }

    public void setActiveProviders(Long activeProviders) {
        this.activeProviders = activeProviders;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Long getCompletedBookings() {
        return completedBookings;
    }

    public void setCompletedBookings(Long completedBookings) {
        this.completedBookings = completedBookings;
    }

    public Long getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(Long activeBookings) {
        this.activeBookings = activeBookings;
    }

    public Long getTotalServices() {
        return totalServices;
    }

    public void setTotalServices(Long totalServices) {
        this.totalServices = totalServices;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(Long totalRatings) {
        this.totalRatings = totalRatings;
    }
}
