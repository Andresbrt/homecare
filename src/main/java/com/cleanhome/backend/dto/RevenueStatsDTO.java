package com.cleanhome.backend.dto;

import java.math.BigDecimal;

public class RevenueStatsDTO {
    
    private BigDecimal totalRevenue;
    private BigDecimal averageBookingValue;
    private Long totalBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    private BigDecimal cancellationRate;

    public RevenueStatsDTO() {
    }

    public RevenueStatsDTO(BigDecimal totalRevenue, BigDecimal averageBookingValue, Long totalBookings,
                           Long completedBookings, Long cancelledBookings, BigDecimal cancellationRate) {
        this.totalRevenue = totalRevenue;
        this.averageBookingValue = averageBookingValue;
        this.totalBookings = totalBookings;
        this.completedBookings = completedBookings;
        this.cancelledBookings = cancelledBookings;
        this.cancellationRate = cancellationRate;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getAverageBookingValue() {
        return averageBookingValue;
    }

    public void setAverageBookingValue(BigDecimal averageBookingValue) {
        this.averageBookingValue = averageBookingValue;
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

    public Long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(Long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public BigDecimal getCancellationRate() {
        return cancellationRate;
    }

    public void setCancellationRate(BigDecimal cancellationRate) {
        this.cancellationRate = cancellationRate;
    }
}
