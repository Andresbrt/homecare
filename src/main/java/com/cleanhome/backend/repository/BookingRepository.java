package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByCustomer(User customer);
    
    List<Booking> findByServiceProvider(ServiceProvider serviceProvider);
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByCustomerAndStatus(User customer, BookingStatus status);
    
    List<Booking> findByServiceProviderAndStatus(ServiceProvider serviceProvider, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.customer = :customer ORDER BY b.startDateTime DESC")
    List<Booking> findByCustomerOrderByStartDateTimeDesc(@Param("customer") User customer);
    
    @Query("SELECT b FROM Booking b WHERE b.serviceProvider = :provider ORDER BY b.startDateTime DESC")
    List<Booking> findByServiceProviderOrderByStartDateTimeDesc(@Param("provider") ServiceProvider provider);
    
    @Query("SELECT b FROM Booking b WHERE b.startDateTime BETWEEN :startDate AND :endDate")
    List<Booking> findBookingsBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
}
