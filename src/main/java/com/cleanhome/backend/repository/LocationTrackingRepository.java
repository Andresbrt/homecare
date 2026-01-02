package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.LocationTracking;
import com.cleanhome.backend.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationTrackingRepository extends JpaRepository<LocationTracking, Long> {
    
    Optional<LocationTracking> findTopByBookingAndIsCurrentTrueOrderByCreatedAtDesc(Booking booking);

    List<LocationTracking> findByBookingOrderByCreatedAtDesc(Booking booking);

    List<LocationTracking> findByBookingAndTimestampBetweenOrderByTimestampAsc(Booking booking, java.time.LocalDateTime start, java.time.LocalDateTime end);

    List<LocationTracking> findByBookingOrderByTimestampDesc(Booking booking);
    
    @Query("SELECT lt FROM LocationTracking lt WHERE lt.booking = :booking AND lt.isCurrent = true ORDER BY lt.createdAt DESC")
    Optional<LocationTracking> findCurrentLocationByBooking(@Param("booking") Booking booking);
    
    @Modifying
    @Query("UPDATE LocationTracking lt SET lt.isCurrent = false WHERE lt.booking = :booking AND lt.isCurrent = true")
    void markAllAsNotCurrent(@Param("booking") Booking booking);
    
    List<LocationTracking> findByServiceProviderOrderByCreatedAtDesc(ServiceProvider serviceProvider);
}
