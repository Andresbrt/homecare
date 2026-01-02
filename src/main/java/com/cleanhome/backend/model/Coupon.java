package com.cleanhome.backend.model;

import com.cleanhome.backend.entity.Service;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "coupons")
public class Coupon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String code;
    
    @Column(nullable = false, length = 200)
    private String description;
    
    @Column(nullable = false)
    private BigDecimal discountAmount; // Descuento fijo
    
    @Column
    private BigDecimal discountPercentage; // Descuento porcentual
    
    @Column
    private BigDecimal minPurchaseAmount; // Compra mínima requerida
    
    @Column
    private BigDecimal maxDiscountAmount; // Descuento máximo aplicable
    
    @Column(nullable = false)
    private LocalDate validFrom;
    
    @Column(nullable = false)
    private LocalDate validUntil;
    
    @Column(nullable = false)
    private Integer maxUsages; // Usos máximos totales
    
    @Column(nullable = false)
    private Integer currentUsages = 0;
    
    @Column(nullable = false)
    private Integer maxUsagesPerUser = 1;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean isFirstTimeOnly = false; // Solo para nuevos usuarios
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicable_service_id")
    private Service applicableService; // Servicio específico (null = todos)
    
    public Boolean isValid() {
        LocalDate now = LocalDate.now();
        return isActive && 
               currentUsages < maxUsages && 
               !now.isBefore(validFrom) && 
               !now.isAfter(validUntil);
    }
    
    public BigDecimal calculateDiscount(BigDecimal amount) {
        if (!isValid() || amount.compareTo(minPurchaseAmount == null ? BigDecimal.ZERO : minPurchaseAmount) < 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal discount = BigDecimal.ZERO;
        
        if (discountAmount != null) {
            discount = discountAmount;
        } else if (discountPercentage != null) {
            discount = amount.multiply(discountPercentage).divide(BigDecimal.valueOf(100));
        }
        
        // Aplicar descuento máximo si está definido
        if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
            discount = maxDiscountAmount;
        }
        
        // No puede ser mayor al monto total
        if (discount.compareTo(amount) > 0) {
            discount = amount;
        }
        
        return discount;
    }

    public Coupon() {
    }

    public Coupon(Long id, String code, String description, BigDecimal discountAmount, BigDecimal discountPercentage,
                  BigDecimal minPurchaseAmount, BigDecimal maxDiscountAmount, LocalDate validFrom, LocalDate validUntil,
                  Integer maxUsages, Integer currentUsages, Integer maxUsagesPerUser, Boolean isActive,
                  Boolean isFirstTimeOnly, Service applicableService) {
        this.id = id;
        this.code = code;
        this.description = description;
        this.discountAmount = discountAmount;
        this.discountPercentage = discountPercentage;
        this.minPurchaseAmount = minPurchaseAmount;
        this.maxDiscountAmount = maxDiscountAmount;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.maxUsages = maxUsages;
        this.currentUsages = currentUsages;
        this.maxUsagesPerUser = maxUsagesPerUser;
        this.isActive = isActive;
        this.isFirstTimeOnly = isFirstTimeOnly;
        this.applicableService = applicableService;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public BigDecimal getMinPurchaseAmount() {
        return minPurchaseAmount;
    }

    public void setMinPurchaseAmount(BigDecimal minPurchaseAmount) {
        this.minPurchaseAmount = minPurchaseAmount;
    }

    public BigDecimal getMaxDiscountAmount() {
        return maxDiscountAmount;
    }

    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) {
        this.maxDiscountAmount = maxDiscountAmount;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public Integer getMaxUsages() {
        return maxUsages;
    }

    public void setMaxUsages(Integer maxUsages) {
        this.maxUsages = maxUsages;
    }

    public Integer getCurrentUsages() {
        return currentUsages;
    }

    public void setCurrentUsages(Integer currentUsages) {
        this.currentUsages = currentUsages;
    }

    public Integer getMaxUsagesPerUser() {
        return maxUsagesPerUser;
    }

    public void setMaxUsagesPerUser(Integer maxUsagesPerUser) {
        this.maxUsagesPerUser = maxUsagesPerUser;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsFirstTimeOnly() {
        return isFirstTimeOnly;
    }

    public void setIsFirstTimeOnly(Boolean isFirstTimeOnly) {
        this.isFirstTimeOnly = isFirstTimeOnly;
    }

    public Service getApplicableService() {
        return applicableService;
    }

    public void setApplicableService(Service applicableService) {
        this.applicableService = applicableService;
    }
}
