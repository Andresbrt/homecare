package com.cleanhome.backend.entity;

public enum NotificationType {
    INFO,           // Información general
    SUCCESS,        // Operación exitosa
    WARNING,        // Advertencia
    ERROR,          // Error
    BOOKING_CREATED,   // Nueva reserva creada
    BOOKING_CONFIRMED, // Reserva confirmada
    BOOKING_IN_PROGRESS, // Servicio en progreso
    BOOKING_COMPLETED,   // Servicio completado
    BOOKING_CANCELLED,   // Reserva cancelada
    PAYMENT_COMPLETED,   // Pago completado
    PAYMENT_FAILED,      // Pago fallido
    RATING_RECEIVED,     // Nueva calificación recibida
    MESSAGE_RECEIVED,    // Nuevo mensaje
    PROMOTION,           // Promoción o oferta
    NEW_MESSAGE,         // Nuevo mensaje de chat
    TRACKING_STARTED,    // Seguimiento GPS iniciado
    TRACKING_STOPPED,    // Seguimiento GPS detenido
    PROVIDER_NEARBY      // Proveedor cerca del destino
}
