package com.cleanhome.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PaymentStartRequest {
    @NotNull
    private Long bookingId;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal amount;

    private String currency = "COP";
    private String email;
    private String reference;
    // "CREDIT_CARD", "PSE" etc.
    private String paymentMethod;

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
