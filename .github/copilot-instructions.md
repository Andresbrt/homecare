# CleanHome - Aplicación de Servicios de Limpieza Doméstica

## Descripción del Proyecto
CleanHome es una aplicación similar a Uber/InDrive pero especializada en servicios de limpieza doméstica. Conecta usuarios que necesitan servicios de limpieza con proveedores de servicios profesionales.

## Características Principales
- Sistema de registro y autenticación para usuarios y proveedores
- Reserva de servicios de limpieza con diferentes tipos y precios
- Seguimiento en tiempo real del estado del servicio
- Sistema de pagos integrado
- Sistema de calificaciones y reseñas
- Notificaciones push
- Panel de administración

## Tecnologías Utilizadas
- Backend: Spring Boot 3.2
- Base de Datos: PostgreSQL
- Seguridad: JWT Authentication
- Documentación: Swagger/OpenAPI
- ORM: JPA/Hibernate
- Validación: Bean Validation

## Estructura del Proyecto
- Entidades: User, ServiceProvider, Booking, Service, Payment, Rating
- DTOs para transferencia de datos
- Controladores REST
- Servicios de negocio
- Repositorios JPA
- Configuración de seguridad