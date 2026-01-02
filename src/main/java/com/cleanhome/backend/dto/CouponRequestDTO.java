package com.cleanhome.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CouponRequestDTO {
    
    @NotBlank(message = "El código es requerido")
    @Size(min = 3, max = 50, message = "El código debe tener entre 3 y 50 caracteres")
    private String code;
    
    @NotBlank(message = "La descripción es requerida")
    @Size(max = 200, message = "La descripción no puede exceder 200 caracteres")
    private String description;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "El descuento debe ser mayor a 0")
    private BigDecimal discountAmount;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "El porcentaje debe ser mayor a 0")
    @DecimalMax(value = "100.0", message = "El porcentaje no puede ser mayor a 100")
    private BigDecimal discountPercentage;
    
    private BigDecimal minPurchaseAmount;
    
    private BigDecimal maxDiscountAmount;
    
    @NotNull(message = "La fecha de inicio es requerida")
    private LocalDate validFrom;
    
    @NotNull(message = "La fecha de fin es requerida")
    private LocalDate validUntil;
    
    @NotNull(message = "Los usos máximos son requeridos")
    @Min(value = 1, message = "Debe permitir al menos 1 uso")
    private Integer maxUsages;
    
    @NotNull(message = "Los usos por usuario son requeridos")
    @Min(value = 1, message = "Debe permitir al menos 1 uso por usuario")
    private Integer maxUsagesPerUser;
    
    private Boolean isActive = true;
    
    private Boolean isFirstTimeOnly = false;
    
    private Long applicableServiceId;

    public CouponRequestDTO() {
    }

    public CouponRequestDTO(String code, String description, BigDecimal discountAmount, BigDecimal discountPercentage,
                            BigDecimal minPurchaseAmount, BigDecimal maxDiscountAmount, LocalDate validFrom,
                            LocalDate validUntil, Integer maxUsages, Integer maxUsagesPerUser, Boolean isActive,
                            Boolean isFirstTimeOnly, Long applicableServiceId) {
        this.code = code;
        this.description = description;
        this.discountAmount = discountAmount;
        this.discountPercentage = discountPercentage;
        this.minPurchaseAmount = minPurchaseAmount;
        this.maxDiscountAmount = maxDiscountAmount;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.maxUsages = maxUsages;
        this.maxUsagesPerUser = maxUsagesPerUser;
        this.isActive = isActive;
        this.isFirstTimeOnly = isFirstTimeOnly;
        this.applicableServiceId = applicableServiceId;
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
}
