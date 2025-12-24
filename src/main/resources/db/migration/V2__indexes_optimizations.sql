-- ==========================================
-- CleanHome Production Optimizations - MySQL
-- Índices adicionales para queries frecuentes
-- ==========================================

-- Additional composite indexes for complex queries
-- Bookings: búsqueda por fecha y estado
CREATE INDEX idx_bookings_date_status ON bookings(start_date_time DESC, status);

-- Payments: búsqueda por customer y estado para historial
CREATE INDEX idx_payments_customer_status ON payments(customer_id, status, created_at DESC);

-- Ratings: promedio por proveedor
CREATE INDEX idx_ratings_provider_rating ON ratings(service_provider_id, rating DESC);

-- Full-text search indexes para búsquedas de texto
ALTER TABLE services ADD FULLTEXT INDEX ft_services_search (name, description);
ALTER TABLE service_providers ADD FULLTEXT INDEX ft_providers_search (business_name, description);
