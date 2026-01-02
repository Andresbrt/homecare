package com.cleanhome.backend.dto;

import com.cleanhome.backend.enums.PaymentMethod;
import com.cleanhome.backend.model.TransactionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponseDTO {
    
    private Long id;
    private Long paymentId;
    private Long bookingId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private TransactionStatus status;
    private String transactionId;
    private String description;
    private String errorMessage;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;

    public TransactionResponseDTO() {
    }

    public TransactionResponseDTO(Long id, Long paymentId, Long bookingId, BigDecimal amount, PaymentMethod paymentMethod,
                                  TransactionStatus status, String transactionId, String description, String errorMessage,
                                  LocalDateTime processedAt, LocalDateTime createdAt) {
        this.id = id;
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.transactionId = transactionId;
        this.description = description;
        this.errorMessage = errorMessage;
        this.processedAt = processedAt;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
