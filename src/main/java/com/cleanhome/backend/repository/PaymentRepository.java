package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.Booking;
import com.cleanhome.backend.entity.Payment;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByCustomer(User customer);
    
    List<Payment> findByBooking(Booking booking);
    
    Optional<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByExternalPaymentId(String externalPaymentId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.customer = :customer ORDER BY p.paymentDate DESC")
    List<Payment> findByCustomerOrderByPaymentDateDesc(@Param("customer") User customer);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.customer = :customer AND p.status = :status")
    BigDecimal sumAmountByCustomerAndStatus(@Param("customer") User customer, @Param("status") PaymentStatus status);
    
        @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.customer = :customer AND p.status = 'COMPLETED'")
        BigDecimal sumPaidAmountsByUser(@Param("customer") User customer);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumPaidAmountsBetween(@Param("startDate") java.time.LocalDateTime startDate,
                                     @Param("endDate") java.time.LocalDateTime endDate);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.booking.serviceProvider.id = :providerId AND p.createdAt BETWEEN :startDate AND :endDate")
    BigDecimal sumPaidAmountsByProviderBetween(@Param("providerId") Long providerId,
                                               @Param("startDate") java.time.LocalDateTime startDate,
                                               @Param("endDate") java.time.LocalDateTime endDate);
}
