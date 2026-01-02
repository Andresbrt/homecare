-- ==========================================
-- CleanHome Production Optimizations - MySQL
-- Índices adicionales para queries frecuentes
-- ==========================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Service providers indexes
CREATE INDEX idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX idx_service_providers_is_available ON service_providers(is_available);
CREATE INDEX idx_service_providers_is_verified ON service_providers(is_verified);
CREATE INDEX idx_service_providers_rating ON service_providers(rating_average DESC);

-- Services indexes
CREATE INDEX idx_services_provider_id ON services(service_provider_id);
CREATE INDEX idx_services_type ON services(service_type);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_price ON services(base_price);

-- Bookings indexes
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_provider_id ON bookings(service_provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_date ON bookings(start_date_time DESC);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Composite index for booking queries
CREATE INDEX idx_bookings_customer_status ON bookings(customer_id, status);
CREATE INDEX idx_bookings_provider_status ON bookings(service_provider_id, status);
CREATE INDEX idx_bookings_date_status ON bookings(start_date_time DESC, status);

-- Payments indexes
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_external_id ON payments(external_payment_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_customer_status ON payments(customer_id, status, created_at DESC);

-- Ratings indexes
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_provider_id ON ratings(service_provider_id);
CREATE INDEX idx_ratings_booking_id ON ratings(booking_id);
CREATE INDEX idx_ratings_rating ON ratings(rating DESC);
CREATE INDEX idx_ratings_created_at ON ratings(created_at DESC);
CREATE INDEX idx_ratings_provider_rating ON ratings(service_provider_id, rating DESC);

-- Provider services indexes
CREATE INDEX idx_provider_services_provider ON provider_services(provider_id);
CREATE INDEX idx_provider_services_type ON provider_services(service_type);

-- Full-text search for catalog and providers
ALTER TABLE services ADD FULLTEXT INDEX ft_services_search (name, description);
ALTER TABLE service_providers ADD FULLTEXT INDEX ft_providers_search (business_name, description);
