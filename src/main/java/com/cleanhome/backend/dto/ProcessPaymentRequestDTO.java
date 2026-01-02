package com.cleanhome.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProcessPaymentRequestDTO {
    
    @NotNull(message = "El ID del pago es requerido")
    private Long paymentId;
    
    @NotBlank(message = "El método de pago es requerido")
    private String paymentMethod;
    
    private String transactionId; // ID externo de la pasarela
    
    private String metadata; // Info adicional en JSON
    
    // Datos de tarjeta (encriptados o token)
    private String cardToken;
    private String cardLast4;
    private String cardBrand;
    
    // Datos de PSE/transferencia
    private String bankCode;
    private String accountType;
    
    // Datos de billetera digital
    private String walletEmail;
    private String walletPhone;

    public ProcessPaymentRequestDTO() {
    }

    public ProcessPaymentRequestDTO(Long paymentId, String paymentMethod, String transactionId, String metadata,
                                    String cardToken, String cardLast4, String cardBrand,
                                    String bankCode, String accountType, String walletEmail, String walletPhone) {
        this.paymentId = paymentId;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.metadata = metadata;
        this.cardToken = cardToken;
        this.cardLast4 = cardLast4;
        this.cardBrand = cardBrand;
        this.bankCode = bankCode;
        this.accountType = accountType;
        this.walletEmail = walletEmail;
        this.walletPhone = walletPhone;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public String getCardToken() {
        return cardToken;
    }

    public void setCardToken(String cardToken) {
        this.cardToken = cardToken;
    }

    public String getCardLast4() {
        return cardLast4;
    }

    public void setCardLast4(String cardLast4) {
        this.cardLast4 = cardLast4;
    }

    public String getCardBrand() {
        return cardBrand;
    }

    public void setCardBrand(String cardBrand) {
        this.cardBrand = cardBrand;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getWalletEmail() {
        return walletEmail;
    }

    public void setWalletEmail(String walletEmail) {
        this.walletEmail = walletEmail;
    }

    public String getWalletPhone() {
        return walletPhone;
    }

    public void setWalletPhone(String walletPhone) {
        this.walletPhone = walletPhone;
    }
}
