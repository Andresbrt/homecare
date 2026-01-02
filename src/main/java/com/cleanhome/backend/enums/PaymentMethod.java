package com.cleanhome.backend.enums;

public enum PaymentMethod {
    CREDIT_CARD("Tarjeta de Crédito"),
    DEBIT_CARD("Tarjeta de Débito"),
    CASH("Efectivo"),
    PAYPAL("PayPal"),
    BANK_TRANSFER("Transferencia Bancaria"),
    WALLET("Billetera Digital"),
    NEQUI("Nequi"),
    DAVIPLATA("Daviplata"),
    PSE("PSE"),
    MERCADO_PAGO("Mercado Pago");
    
    private final String displayName;
    
    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
