package com.cleanhome.backend.dto;

public class PaymentStartResponse {
    private Long paymentId;
    private String externalPaymentId; // wompi transaction id
    private String redirectUrl;
    private String reference;

    public PaymentStartResponse() {}

    public PaymentStartResponse(Long paymentId, String externalPaymentId, String redirectUrl, String reference) {
        this.paymentId = paymentId;
        this.externalPaymentId = externalPaymentId;
        this.redirectUrl = redirectUrl;
        this.reference = reference;
    }

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public String getExternalPaymentId() { return externalPaymentId; }
    public void setExternalPaymentId(String externalPaymentId) { this.externalPaymentId = externalPaymentId; }

    public String getRedirectUrl() { return redirectUrl; }
    public void setRedirectUrl(String redirectUrl) { this.redirectUrl = redirectUrl; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
}
