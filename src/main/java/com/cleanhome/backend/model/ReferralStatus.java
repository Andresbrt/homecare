package com.cleanhome.backend.model;

public enum ReferralStatus {
    PENDING,      // Pendiente (usuario registrado pero sin primera reserva)
    COMPLETED,    // Completado (usuario hizo su primera reserva)
    EXPIRED       // Expirado
}
