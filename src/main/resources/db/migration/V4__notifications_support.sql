-- Migration V4: Agregar soporte para notificaciones push y tabla de notificaciones

-- Agregar campo expo_push_token a users para notificaciones push
ALTER TABLE users ADD COLUMN expo_push_token VARCHAR(255);

-- Crear tabla de notificaciones
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    data TEXT COMMENT 'JSON data for navigation',
    push_sent BOOLEAN DEFAULT FALSE,
    push_token VARCHAR(255) COMMENT 'Expo push token of recipient',
    user_id BIGINT NOT NULL,
    related_booking_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_user_notifications (user_id, created_at DESC),
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_related_booking (related_booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear índice para mejorar consultas de notificaciones no leídas
CREATE INDEX idx_notifications_user_read_created ON notifications(user_id, is_read, created_at DESC);
