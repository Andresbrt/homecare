package com.cleanhome.backend.model;

public enum TransactionStatus {
    PENDING,      // Pendiente
    PROCESSING,   // Procesando
    COMPLETED,    // Completado
    FAILED,       // Fallido
    REFUNDED,     // Reembolsado
    CANCELLED     // Cancelado
}
