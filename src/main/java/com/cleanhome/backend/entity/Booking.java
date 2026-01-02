package com.cleanhome.backend.entity;

import com.cleanhome.backend.enums.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {
    
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Future(message = "La fecha de inicio debe ser en el futuro")
    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;
    
    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;
    
    @Column(name = "estimated_duration_hours")
    private Integer estimatedDurationHours;
    
    @Column(name = "actual_duration_hours")
    private Integer actualDurationHours;
    
    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;
    
    @Column(name = "customer_notes", columnDefinition = "TEXT")
    private String customerNotes;
    
    @Column(name = "provider_notes", columnDefinition = "TEXT")
    private String providerNotes;
    
    // Address Information
    @Column(name = "service_address", nullable = false)
    private String serviceAddress;
    
    @Column(name = "service_city", nullable = false)
    private String serviceCity;
    
    @Column(name = "service_state", nullable = false)
    private String serviceState;
    
    @Column(name = "service_postal_code", nullable = false)
    private String servicePostalCode;
    
    @Column(name = "service_latitude")
    private Double serviceLatitude;
    
    @Column(name = "service_longitude")
    private Double serviceLongitude;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_provider_id")
    private ServiceProvider serviceProvider;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();
    
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Rating> ratings = new ArrayList<>();
    
    // Constructors
    public Booking() {}
    
    public Booking(User customer, Service service, LocalDateTime startDateTime, String serviceAddress, 
                   String serviceCity, String serviceState, String servicePostalCode) {
        this.customer = customer;
        this.service = service;
        this.startDateTime = startDateTime;
        this.serviceAddress = serviceAddress;
        this.serviceCity = serviceCity;
        this.serviceState = serviceState;
        this.servicePostalCode = servicePostalCode;
    }
    
    // Getters and Setters
    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }
    
    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }
    
    public LocalDateTime getEndDateTime() {
        return endDateTime;
    }
    
    public void setEndDateTime(LocalDateTime endDateTime) {
        this.endDateTime = endDateTime;
    }
    
    public Integer getEstimatedDurationHours() {
        return estimatedDurationHours;
    }
    
    public void setEstimatedDurationHours(Integer estimatedDurationHours) {
        this.estimatedDurationHours = estimatedDurationHours;
    }
    
    public Integer getActualDurationHours() {
        return actualDurationHours;
    }
    
    public void setActualDurationHours(Integer actualDurationHours) {
        this.actualDurationHours = actualDurationHours;
    }
    
    public BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getSpecialInstructions() {
        return specialInstructions;
    }
    
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
    
    public String getCustomerNotes() {
        return customerNotes;
    }
    
    public void setCustomerNotes(String customerNotes) {
        this.customerNotes = customerNotes;
    }
    
    public String getProviderNotes() {
        return providerNotes;
    }
    
    public void setProviderNotes(String providerNotes) {
        this.providerNotes = providerNotes;
    }
    
    public String getServiceAddress() {
        return serviceAddress;
    }
    
    public void setServiceAddress(String serviceAddress) {
        this.serviceAddress = serviceAddress;
    }
    
    public String getServiceCity() {
        return serviceCity;
    }
    
    public void setServiceCity(String serviceCity) {
        this.serviceCity = serviceCity;
    }
    
    public String getServiceState() {
        return serviceState;
    }
    
    public void setServiceState(String serviceState) {
        this.serviceState = serviceState;
    }
    
    public String getServicePostalCode() {
        return servicePostalCode;
    }
    
    public void setServicePostalCode(String servicePostalCode) {
        this.servicePostalCode = servicePostalCode;
    }
    
    public Double getServiceLatitude() {
        return serviceLatitude;
    }
    
    public void setServiceLatitude(Double serviceLatitude) {
        this.serviceLatitude = serviceLatitude;
    }
    
    public Double getServiceLongitude() {
        return serviceLongitude;
    }
    
    public void setServiceLongitude(Double serviceLongitude) {
        this.serviceLongitude = serviceLongitude;
    }
    
    public User getCustomer() {
        return customer;
    }
    
    public void setCustomer(User customer) {
        this.customer = customer;
    }
    
    public ServiceProvider getServiceProvider() {
        return serviceProvider;
    }
    
    public void setServiceProvider(ServiceProvider serviceProvider) {
        this.serviceProvider = serviceProvider;
    }
    
    public Service getService() {
        return service;
    }
    
    public void setService(Service service) {
        this.service = service;
    }
    
    public List<Payment> getPayments() {
        return payments;
    }
    
    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
    
    public List<Rating> getRatings() {
        return ratings;
    }
    
    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }
    
    // Utility methods
    public String getFullServiceAddress() {
        return serviceAddress + ", " + serviceCity + ", " + serviceState + " " + servicePostalCode;
    }
    
    public boolean isCompleted() {
        return status == BookingStatus.COMPLETED;
    }
    
    public boolean isCancelled() {
        return status == BookingStatus.CANCELLED;
    }
    
    public boolean isInProgress() {
        return status == BookingStatus.IN_PROGRESS;
    }
}