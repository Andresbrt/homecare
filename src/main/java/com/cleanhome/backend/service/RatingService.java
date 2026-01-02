package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.ProviderRatingStatsDTO;
import com.cleanhome.backend.dto.RatingRequestDTO;
import com.cleanhome.backend.dto.RatingResponseDTO;
import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.Rating;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.BookingStatus;
import com.cleanhome.backend.enums.UserRole;
import com.cleanhome.backend.repository.BookingRepository;
import com.cleanhome.backend.repository.RatingRepository;
import com.cleanhome.backend.repository.ServiceProviderRepository;
import com.cleanhome.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RatingService {
    
    private final RatingRepository ratingRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    
    public RatingService(RatingRepository ratingRepository, 
                        BookingRepository bookingRepository,
                        UserRepository userRepository,
                        ServiceProviderRepository serviceProviderRepository) {
        this.ratingRepository = ratingRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceProviderRepository = serviceProviderRepository;
    }
    
    /**
     * Crea una nueva calificación para un servicio completado
     */
    public RatingResponseDTO createRating(RatingRequestDTO request, String userEmail) {
        // Validar que el booking existe y está completado
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        // Validar que el usuario que califica es el cliente de la reserva
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!booking.getCustomer().getId().equals(user.getId())) {
            throw new RuntimeException("Solo el cliente de la reserva puede calificarla");
        }
        
        // Validar que el servicio está completado
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Solo se pueden calificar servicios completados");
        }
        
        // Validar que no existe una calificación previa para esta reserva
        if (booking.getRatings() != null && !booking.getRatings().isEmpty()) {
            throw new RuntimeException("Esta reserva ya ha sido calificada");
        }
        
        // Obtener el proveedor del servicio
        ServiceProvider provider = booking.getService().getServiceProvider();
        
        // Crear la calificación
        Rating rating = new Rating();
        rating.setRating(request.getRating());
        rating.setComment(request.getComment());
        rating.setIsAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false);
        rating.setBooking(booking);
        rating.setUser(user);
        rating.setServiceProvider(provider);
        
        Rating savedRating = ratingRepository.save(rating);
        
        return new RatingResponseDTO(savedRating);
    }
    
    /**
     * Obtiene todas las calificaciones de un proveedor
     */
    @Transactional(readOnly = true)
    public List<RatingResponseDTO> getProviderRatings(Long providerId) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        List<Rating> ratings = ratingRepository.findByServiceProviderOrderByCreatedAtDesc(provider);
        
        return ratings.stream()
                .map(RatingResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene estadísticas completas de calificaciones de un proveedor
     */
    @Transactional(readOnly = true)
    public ProviderRatingStatsDTO getProviderStats(Long providerId) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        BigDecimal avgRating = ratingRepository.findAverageRatingByServiceProvider(provider);
        if (avgRating != null) {
            avgRating = avgRating.setScale(2, RoundingMode.HALF_UP);
        } else {
            avgRating = BigDecimal.ZERO;
        }
        
        Long totalRatings = ratingRepository.countByServiceProvider(provider);
        
        List<Rating> recentRatings = ratingRepository.findByServiceProviderOrderByCreatedAtDesc(provider)
                .stream()
                .limit(10)
                .collect(Collectors.toList());
        
        List<RatingResponseDTO> recentRatingsDTO = recentRatings.stream()
                .map(RatingResponseDTO::new)
                .collect(Collectors.toList());
        
        ProviderRatingStatsDTO stats = new ProviderRatingStatsDTO(
                provider.getId(),
                provider.getBusinessName(),
                avgRating,
                totalRatings,
                recentRatingsDTO
        );
        
        // Calcular distribución de calificaciones
        stats.setDistribution(calculateDistribution(provider));
        
        return stats;
    }
    
    /**
     * Calcula la distribución de calificaciones (cuántas de cada estrella)
     */
    private ProviderRatingStatsDTO.RatingDistributionDTO calculateDistribution(ServiceProvider provider) {
        List<Rating> allRatings = ratingRepository.findByServiceProvider(provider);
        
        long fiveStars = allRatings.stream().filter(r -> r.getRating().compareTo(new BigDecimal("4.5")) >= 0).count();
        long fourStars = allRatings.stream().filter(r -> r.getRating().compareTo(new BigDecimal("3.5")) >= 0 
                                                       && r.getRating().compareTo(new BigDecimal("4.5")) < 0).count();
        long threeStars = allRatings.stream().filter(r -> r.getRating().compareTo(new BigDecimal("2.5")) >= 0 
                                                        && r.getRating().compareTo(new BigDecimal("3.5")) < 0).count();
        long twoStars = allRatings.stream().filter(r -> r.getRating().compareTo(new BigDecimal("1.5")) >= 0 
                                                     && r.getRating().compareTo(new BigDecimal("2.5")) < 0).count();
        long oneStar = allRatings.stream().filter(r -> r.getRating().compareTo(new BigDecimal("1.5")) < 0).count();
        
        return new ProviderRatingStatsDTO.RatingDistributionDTO(
                fiveStars, fourStars, threeStars, twoStars, oneStar
        );
    }
    
    /**
     * Obtiene las calificaciones hechas por un usuario
     */
    @Transactional(readOnly = true)
    public List<RatingResponseDTO> getUserRatings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<Rating> ratings = ratingRepository.findByUser(user);
        
        return ratings.stream()
                .map(RatingResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Actualiza una calificación existente
     */
    public RatingResponseDTO updateRating(Long ratingId, RatingRequestDTO request, String userEmail) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Calificación no encontrada"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar que el usuario es el dueño de la calificación
        if (!rating.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No tienes permiso para editar esta calificación");
        }
        
        // Actualizar campos
        rating.setRating(request.getRating());
        rating.setComment(request.getComment());
        if (request.getIsAnonymous() != null) {
            rating.setIsAnonymous(request.getIsAnonymous());
        }
        
        Rating updatedRating = ratingRepository.save(rating);
        
        return new RatingResponseDTO(updatedRating);
    }
    
    /**
     * Elimina una calificación (solo admin o el usuario que la creó)
     */
    public void deleteRating(Long ratingId, String userEmail) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Calificación no encontrada"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar permisos
        if (!rating.getUser().getId().equals(user.getId()) &&
            user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("No tienes permiso para eliminar esta calificación");
        }
        
        ratingRepository.delete(rating);
    }
}
