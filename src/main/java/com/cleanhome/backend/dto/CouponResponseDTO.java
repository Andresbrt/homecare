package com.cleanhome.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CouponResponseDTO {
    
    private Long id;
    private String code;
    private String description;
    private BigDecimal discountAmount;
    private BigDecimal discountPercentage;
    private BigDecimal minPurchaseAmount;
    private BigDecimal maxDiscountAmount;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private Integer maxUsages;
    private Integer currentUsages;
    private Integer maxUsagesPerUser;
    private Boolean isActive;
    private Boolean isFirstTimeOnly;
    private Long applicableServiceId;
    private String applicableServiceName;

    public CouponResponseDTO() {
    }

    public CouponResponseDTO(Long id, String code, String description, BigDecimal discountAmount, BigDecimal discountPercentage,
                             BigDecimal minPurchaseAmount, BigDecimal maxDiscountAmount, LocalDate validFrom,
                             LocalDate validUntil, Integer maxUsages, Integer currentUsages, Integer maxUsagesPerUser,
                             Boolean isActive, Boolean isFirstTimeOnly, Long applicableServiceId, String applicableServiceName) {
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
        this.applicableServiceId = applicableServiceId;
        this.applicableServiceName = applicableServiceName;
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

    public Long getApplicableServiceId() {
        return applicableServiceId;
    }

    public void setApplicableServiceId(Long applicableServiceId) {
        this.applicableServiceId = applicableServiceId;
    }

    public String getApplicableServiceName() {
        return applicableServiceName;
    }

    public void setApplicableServiceName(String applicableServiceName) {
        this.applicableServiceName = applicableServiceName;
    }
}
