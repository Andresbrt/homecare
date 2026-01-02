package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.PlatformStatsDTO;
import com.cleanhome.backend.dto.RevenueStatsDTO;
import com.cleanhome.backend.enums.BookingStatus;
import com.cleanhome.backend.enums.UserRole;
import com.cleanhome.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final RatingRepository ratingRepository;
    private final PaymentRepository paymentRepository;

        public AnalyticsService(UserRepository userRepository,
                                                        ServiceProviderRepository serviceProviderRepository,
                                                        BookingRepository bookingRepository,
                                                        ServiceRepository serviceRepository,
                                                        RatingRepository ratingRepository,
                                                        PaymentRepository paymentRepository) {
                this.userRepository = userRepository;
                this.serviceProviderRepository = serviceProviderRepository;
                this.bookingRepository = bookingRepository;
                this.serviceRepository = serviceRepository;
                this.ratingRepository = ratingRepository;
                this.paymentRepository = paymentRepository;
        }

    @Transactional(readOnly = true)
    public PlatformStatsDTO getPlatformStats() {
        PlatformStatsDTO stats = new PlatformStatsDTO();

        // Estadísticas de usuarios
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCustomers(userRepository.countByRole(UserRole.CUSTOMER));
        stats.setTotalProviders(serviceProviderRepository.count());
        stats.setActiveProviders(serviceProviderRepository.countByIsAvailableTrue());

        // Estadísticas de reservas
        stats.setTotalBookings(bookingRepository.count());
        stats.setCompletedBookings(bookingRepository.countByStatus(BookingStatus.COMPLETED));
        
        long activeBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED) +
                            bookingRepository.countByStatus(BookingStatus.IN_PROGRESS);
        stats.setActiveBookings(activeBookings);

        // Estadísticas de servicios
        stats.setTotalServices(serviceRepository.count());

        // Estadísticas de calificaciones
        stats.setTotalRatings(ratingRepository.count());
        Double avgRating = ratingRepository.findAverageRating();
        stats.setAverageRating(avgRating != null ? 
                Math.round(avgRating * 100.0) / 100.0 : 0.0);

        return stats;
    }

    @Transactional(readOnly = true)
    public RevenueStatsDTO getRevenueStats(LocalDateTime startDate, LocalDateTime endDate) {
        RevenueStatsDTO stats = new RevenueStatsDTO();

        // Total de reservas en el período
        Long totalBookings = bookingRepository.countByCreatedAtBetween(startDate, endDate);
        stats.setTotalBookings(totalBookings);

        // Reservas completadas
        Long completedBookings = bookingRepository.countByStatusAndCreatedAtBetween(
                BookingStatus.COMPLETED, startDate, endDate);
        stats.setCompletedBookings(completedBookings);

        // Reservas canceladas
        Long cancelledBookings = bookingRepository.countByStatusAndCreatedAtBetween(
                BookingStatus.CANCELLED, startDate, endDate);
        stats.setCancelledBookings(cancelledBookings);

        // Tasa de cancelación
        BigDecimal cancellationRate = totalBookings > 0 ? 
                BigDecimal.valueOf(cancelledBookings * 100.0 / totalBookings)
                        .setScale(2, RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
        stats.setCancellationRate(cancellationRate);

        // Ingresos totales (solo de pagos completados)
        BigDecimal totalRevenue = paymentRepository.sumPaidAmountsBetween(startDate, endDate);
        stats.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        // Valor promedio por reserva
        BigDecimal avgValue = completedBookings > 0 ? 
                stats.getTotalRevenue().divide(BigDecimal.valueOf(completedBookings), 2, RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
        stats.setAverageBookingValue(avgValue);

        return stats;
    }

    @Transactional(readOnly = true)
    public RevenueStatsDTO getProviderRevenueStats(Long providerId, LocalDateTime startDate, LocalDateTime endDate) {
        RevenueStatsDTO stats = new RevenueStatsDTO();

        // Reservas del proveedor
        Long totalBookings = bookingRepository.countByServiceProviderIdAndCreatedAtBetween(
                providerId, startDate, endDate);
        stats.setTotalBookings(totalBookings);

        Long completedBookings = bookingRepository.countByServiceProviderIdAndStatusAndCreatedAtBetween(
                providerId, BookingStatus.COMPLETED, startDate, endDate);
        stats.setCompletedBookings(completedBookings);

        Long cancelledBookings = bookingRepository.countByServiceProviderIdAndStatusAndCreatedAtBetween(
                providerId, BookingStatus.CANCELLED, startDate, endDate);
        stats.setCancelledBookings(cancelledBookings);

        // Tasa de cancelación
        BigDecimal cancellationRate = totalBookings > 0 ? 
                BigDecimal.valueOf(cancelledBookings * 100.0 / totalBookings)
                        .setScale(2, RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
        stats.setCancellationRate(cancellationRate);

        // Ingresos del proveedor
        BigDecimal totalRevenue = paymentRepository.sumPaidAmountsByProviderBetween(
                providerId, startDate, endDate);
        stats.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

        // Valor promedio
        BigDecimal avgValue = completedBookings > 0 ? 
                stats.getTotalRevenue().divide(BigDecimal.valueOf(completedBookings), 2, RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
        stats.setAverageBookingValue(avgValue);

        return stats;
    }
}
