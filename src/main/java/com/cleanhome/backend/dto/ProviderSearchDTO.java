package com.cleanhome.backend.dto;

public class ProviderSearchDTO {
    
    private Long id;
    private String businessName;
    private String description;
    private String profilePictureUrl;
    private Double averageRating;
    private Integer totalReviews;
    private Boolean isVerified;
    private Boolean isActive;
    private String userName;
    private Double distance; // En km

    public ProviderSearchDTO() {
    }

    public ProviderSearchDTO(Long id, String businessName, String description, String profilePictureUrl,
                             Double averageRating, Integer totalReviews, Boolean isVerified, Boolean isActive,
                             String userName, Double distance) {
        this.id = id;
        this.businessName = businessName;
        this.description = description;
        this.profilePictureUrl = profilePictureUrl;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.isVerified = isVerified;
        this.isActive = isActive;
        this.userName = userName;
        this.distance = distance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }
}
