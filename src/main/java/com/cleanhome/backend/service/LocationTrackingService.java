package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.LocationTrackingResponseDTO;
import com.cleanhome.backend.dto.LocationUpdateRequestDTO;
import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.LocationTracking;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.NotificationType;
import com.cleanhome.backend.exception.ResourceNotFoundException;
import com.cleanhome.backend.repository.BookingRepository;
import com.cleanhome.backend.repository.LocationTrackingRepository;
import com.cleanhome.backend.repository.ServiceProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationTrackingService {

    private final LocationTrackingRepository locationTrackingRepository;
    private final BookingRepository bookingRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final NotificationService notificationService;

    public LocationTrackingService(LocationTrackingRepository locationTrackingRepository,
                                   BookingRepository bookingRepository,
                                   ServiceProviderRepository serviceProviderRepository,
                                   NotificationService notificationService) {
        this.locationTrackingRepository = locationTrackingRepository;
        this.bookingRepository = bookingRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public LocationTrackingResponseDTO updateLocation(Long bookingId, Long providerId, LocationUpdateRequestDTO request) {
        // Validar que la reserva existe y pertenece al proveedor
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));

        if (!booking.getServiceProvider().getId().equals(providerId)) {
            throw new IllegalStateException("Esta reserva no pertenece a este proveedor");
        }

        // Marcar todas las ubicaciones anteriores como no actuales
        locationTrackingRepository.markAllAsNotCurrent(booking);

        // Crear nueva ubicación
        LocationTracking tracking = new LocationTracking();
        tracking.setBooking(booking);
        tracking.setServiceProvider(provider);
        tracking.setLatitude(request.getLatitude());
        tracking.setLongitude(request.getLongitude());
        tracking.setAccuracy(request.getAccuracy());
        tracking.setSpeed(request.getSpeed());
        tracking.setHeading(request.getHeading());
        tracking.setTimestamp(LocalDateTime.now());
        tracking.setIsCurrent(true);

        LocationTracking savedTracking = locationTrackingRepository.save(tracking);

        // Notificar al cliente si está cerca (opcional)
        notifyIfNearby(booking, request.getLatitude(), request.getLongitude());

        return mapToResponseDTO(savedTracking);
    }

    @Transactional(readOnly = true)
    public LocationTrackingResponseDTO getCurrentLocation(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        // Validar que el usuario tenga acceso
        if (!hasAccessToBooking(booking, userId)) {
            throw new IllegalStateException("No tienes acceso a esta información");
        }

        LocationTracking currentLocation = locationTrackingRepository
                .findCurrentLocationByBooking(booking)
                .orElse(null);

        return currentLocation != null ? mapToResponseDTO(currentLocation) : null;
    }

    @Transactional(readOnly = true)
    public List<LocationTrackingResponseDTO> getLocationHistory(Long bookingId, Long userId, 
                                                                 LocalDateTime startTime, 
                                                                 LocalDateTime endTime) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        if (!hasAccessToBooking(booking, userId)) {
            throw new IllegalStateException("No tienes acceso a esta información");
        }

        List<LocationTracking> history;
        if (startTime != null && endTime != null) {
            history = locationTrackingRepository
                    .findByBookingAndTimestampBetweenOrderByTimestampAsc(booking, startTime, endTime);
        } else {
            history = locationTrackingRepository
                    .findByBookingOrderByTimestampDesc(booking);
        }

        return history.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void startTracking(Long bookingId, Long providerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        if (!booking.getServiceProvider().getId().equals(providerId)) {
            throw new IllegalStateException("Esta reserva no pertenece a este proveedor");
        }

        // Enviar notificación al cliente
        try {
            notificationService.createNotification(
                    booking.getCustomer().getId(),
                    "Seguimiento iniciado",
                    "El proveedor ha iniciado el seguimiento. Puedes ver su ubicación en tiempo real.",
                    NotificationType.TRACKING_STARTED,
                    booking.getId()
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public void stopTracking(Long bookingId, Long providerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"));

        if (!booking.getServiceProvider().getId().equals(providerId)) {
            throw new IllegalStateException("Esta reserva no pertenece a este proveedor");
        }

        // Marcar todas las ubicaciones como no actuales
        locationTrackingRepository.markAllAsNotCurrent(booking);

        // Enviar notificación al cliente
        try {
            notificationService.createNotification(
                    booking.getCustomer().getId(),
                    "Seguimiento finalizado",
                    "El seguimiento ha terminado.",
                    NotificationType.TRACKING_STOPPED,
                    booking.getId()
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional(readOnly = true)
    public Double calculateDistance(Long bookingId, Long userId) {
        LocationTracking current = locationTrackingRepository
                .findCurrentLocationByBooking(
                        bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"))
                )
                .orElse(null);

        if (current == null) {
            return null;
        }

        Booking booking = current.getBooking();
        
        // Calcular distancia usando fórmula de Haversine
        double lat1 = current.getLatitude();
        double lon1 = current.getLongitude();
        double lat2 = booking.getServiceLatitude();
        double lon2 = booking.getServiceLongitude();

        return calculateHaversineDistance(lat1, lon1, lat2, lon2);
    }

    @Transactional(readOnly = true)
    public Integer calculateETA(Long bookingId, Long userId) {
        Double distance = calculateDistance(bookingId, userId);
        if (distance == null) {
            return null;
        }

        // Obtener velocidad actual
        LocationTracking current = locationTrackingRepository
                .findCurrentLocationByBooking(
                        bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada"))
                )
                .orElse(null);

        if (current == null || current.getSpeed() == null || current.getSpeed() == 0) {
            // Asumir velocidad promedio de 30 km/h en ciudad
            return (int) ((distance / 30.0) * 60); // Convertir a minutos
        }

        // Velocidad está en m/s, convertir a km/h
        double speedKmh = current.getSpeed() * 3.6;
        return (int) ((distance / speedKmh) * 60); // Convertir a minutos
    }

    private void notifyIfNearby(Booking booking, Double latitude, Double longitude) {
        double distance = calculateHaversineDistance(
            latitude, longitude,
            booking.getServiceLatitude(), booking.getServiceLongitude()
        );

        // Si está a menos de 500 metros
        if (distance < 0.5) {
            try {
                notificationService.createNotification(
                        booking.getCustomer().getId(),
                        "Proveedor cerca",
                        "El proveedor está a menos de 500 metros de distancia.",
                        NotificationType.PROVIDER_NEARBY,
                        booking.getId()
                );
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radio de la Tierra en km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private boolean hasAccessToBooking(Booking booking, Long userId) {
        return booking.getCustomer().getId().equals(userId) ||
               booking.getServiceProvider().getUser().getId().equals(userId);
    }

    private LocationTrackingResponseDTO mapToResponseDTO(LocationTracking tracking) {
        LocationTrackingResponseDTO dto = new LocationTrackingResponseDTO();
        dto.setId(tracking.getId());
        dto.setBookingId(tracking.getBooking().getId());
        dto.setServiceProviderId(tracking.getServiceProvider().getId());
        dto.setLatitude(tracking.getLatitude());
        dto.setLongitude(tracking.getLongitude());
        dto.setAccuracy(tracking.getAccuracy());
        dto.setSpeed(tracking.getSpeed());
        dto.setHeading(tracking.getHeading());
        dto.setTimestamp(tracking.getTimestamp());
        dto.setIsCurrent(tracking.getIsCurrent());
        return dto;
    }
}
