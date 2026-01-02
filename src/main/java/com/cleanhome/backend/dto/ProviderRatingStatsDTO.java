package com.cleanhome.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProviderRatingStatsDTO {
    
    private Long providerId;
    private String providerName;
    private BigDecimal averageRating;
    private Long totalRatings;
    private List<RatingResponseDTO> recentRatings;
    private RatingDistributionDTO distribution;
    
    // Constructor
    public ProviderRatingStatsDTO() {}
    
    public ProviderRatingStatsDTO(Long providerId, String providerName, BigDecimal averageRating, 
                                 Long totalRatings, List<RatingResponseDTO> recentRatings) {
        this.providerId = providerId;
        this.providerName = providerName;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
        this.recentRatings = recentRatings;
    }
    
    // Getters and Setters
    public Long getProviderId() {
        return providerId;
    }
    
    public void setProviderId(Long providerId) {
        this.providerId = providerId;
    }
    
    public String getProviderName() {
        return providerName;
    }
    
    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }
    
    public BigDecimal getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }
    
    public Long getTotalRatings() {
        return totalRatings;
    }
    
    public void setTotalRatings(Long totalRatings) {
        this.totalRatings = totalRatings;
    }
    
    public List<RatingResponseDTO> getRecentRatings() {
        return recentRatings;
    }
    
    public void setRecentRatings(List<RatingResponseDTO> recentRatings) {
        this.recentRatings = recentRatings;
    }
    
    public RatingDistributionDTO getDistribution() {
        return distribution;
    }
    
    public void setDistribution(RatingDistributionDTO distribution) {
        this.distribution = distribution;
    }
    
    // Inner class for rating distribution
    public static class RatingDistributionDTO {
        private Long fiveStars;
        private Long fourStars;
        private Long threeStars;
        private Long twoStars;
        private Long oneStar;
        
        public RatingDistributionDTO() {}
        
        public RatingDistributionDTO(Long fiveStars, Long fourStars, Long threeStars, 
                                    Long twoStars, Long oneStar) {
            this.fiveStars = fiveStars;
            this.fourStars = fourStars;
            this.threeStars = threeStars;
            this.twoStars = twoStars;
            this.oneStar = oneStar;
        }
        
        // Getters and Setters
        public Long getFiveStars() { return fiveStars; }
        public void setFiveStars(Long fiveStars) { this.fiveStars = fiveStars; }
        
        public Long getFourStars() { return fourStars; }
        public void setFourStars(Long fourStars) { this.fourStars = fourStars; }
        
        public Long getThreeStars() { return threeStars; }
        public void setThreeStars(Long threeStars) { this.threeStars = threeStars; }
        
        public Long getTwoStars() { return twoStars; }
        public void setTwoStars(Long twoStars) { this.twoStars = twoStars; }
        
        public Long getOneStar() { return oneStar; }
        public void setOneStar(Long oneStar) { this.oneStar = oneStar; }
    }
}
