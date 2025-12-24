package com.cleanhome.backend.entity;

import com.cleanhome.backend.enums.ServiceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.math.RoundingMode;
import java.util.Set;

@Entity
@Table(name = "service_providers")
public class ServiceProvider extends BaseEntity {
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "business_name")
    private String businessName;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "years_experience")
    private Integer yearsExperience;
    
    @Column(name = "is_verified")
    private Boolean isVerified = false;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @DecimalMin(value = "0.0", message = "El radio de servicio debe ser positivo")
    @DecimalMax(value = "100.0", message = "El radio de servicio no puede exceder 100 km")
    @Column(name = "service_radius", precision = 5, scale = 2)
    private BigDecimal serviceRadius;
    
    @DecimalMin(value = "0.0", message = "La tarifa por hora debe ser positiva")
    @DecimalMax(value = "1000.0", message = "La tarifa por hora no puede exceder $1000")
    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;
    
    @Column(name = "rating_average", precision = 3, scale = 2)
    private BigDecimal ratingAverage = BigDecimal.ZERO;
    
    @Column(name = "total_ratings")
    private Integer totalRatings = 0;
    
    @Column(name = "total_bookings")
    private Integer totalBookings = 0;
    
    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "provider_services", joinColumns = @JoinColumn(name = "provider_id"))
    @Column(name = "service_type")
    private Set<ServiceType> servicesOffered;
    
    @Column(name = "license_number")
    private String licenseNumber;
    
    @Column(name = "insurance_number")
    private String insuranceNumber;
    
    @Column(name = "bank_account_number")
    private String bankAccountNumber;
    
    // Relationships
    @OneToMany(mappedBy = "serviceProvider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Booking> providerBookings = new ArrayList<>();
    
    @OneToMany(mappedBy = "serviceProvider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Rating> ratingsReceived = new ArrayList<>();
    
    @OneToMany(mappedBy = "serviceProvider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Service> services = new ArrayList<>();
    
    // Constructors
    public ServiceProvider() {}
    
    public ServiceProvider(User user) {
        this.user = user;
    }
    
    // Getters and Setters
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
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
    
    public Integer getYearsExperience() {
        return yearsExperience;
    }
    
    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public BigDecimal getServiceRadius() {
        return serviceRadius;
    }
    
    public void setServiceRadius(BigDecimal serviceRadius) {
        this.serviceRadius = serviceRadius;
    }
    
    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }
    
    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
    
    public BigDecimal getRatingAverage() {
        return ratingAverage;
    }
    
    public void setRatingAverage(BigDecimal ratingAverage) {
        this.ratingAverage = ratingAverage;
    }
    
    public Integer getTotalRatings() {
        return totalRatings;
    }
    
    public void setTotalRatings(Integer totalRatings) {
        this.totalRatings = totalRatings;
    }
    
    public Integer getTotalBookings() {
        return totalBookings;
    }
    
    public void setTotalBookings(Integer totalBookings) {
        this.totalBookings = totalBookings;
    }
    
    public Set<ServiceType> getServicesOffered() {
        return servicesOffered;
    }
    
    public void setServicesOffered(Set<ServiceType> servicesOffered) {
        this.servicesOffered = servicesOffered;
    }
    
    public String getLicenseNumber() {
        return licenseNumber;
    }
    
    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }
    
    public String getInsuranceNumber() {
        return insuranceNumber;
    }
    
    public void setInsuranceNumber(String insuranceNumber) {
        this.insuranceNumber = insuranceNumber;
    }
    
    public String getBankAccountNumber() {
        return bankAccountNumber;
    }
    
    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }
    
    public List<Booking> getProviderBookings() {
        return providerBookings;
    }
    
    public void setProviderBookings(List<Booking> providerBookings) {
        this.providerBookings = providerBookings;
    }
    
    public List<Rating> getRatingsReceived() {
        return ratingsReceived;
    }
    
    public void setRatingsReceived(List<Rating> ratingsReceived) {
        this.ratingsReceived = ratingsReceived;
    }
    
    public List<Service> getServices() {
        return services;
    }
    
    public void setServices(List<Service> services) {
        this.services = services;
    }
    
    // Utility methods
    public void updateRating(BigDecimal newRating) {
        if (this.totalRatings == 0) {
            this.ratingAverage = newRating;
            this.totalRatings = 1;
        } else {
            BigDecimal totalScore = this.ratingAverage.multiply(BigDecimal.valueOf(this.totalRatings));
            totalScore = totalScore.add(newRating);
            this.totalRatings++;
            this.ratingAverage = totalScore.divide(BigDecimal.valueOf(this.totalRatings), 2, RoundingMode.HALF_UP);
        }
    }
    
    public void incrementBookingCount() {
        this.totalBookings++;
    }
}