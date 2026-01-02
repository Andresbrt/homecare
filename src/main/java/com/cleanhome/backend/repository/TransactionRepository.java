package com.cleanhome.backend.repository;

import com.cleanhome.backend.model.Transaction;
import com.cleanhome.backend.model.TransactionStatus;
import com.cleanhome.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByPaymentOrderByCreatedAtDesc(Payment payment);
    
    List<Transaction> findByStatusOrderByCreatedAtDesc(TransactionStatus status);
    
    Optional<Transaction> findByTransactionId(String transactionId);
    
    @Query("SELECT t FROM Transaction t WHERE t.payment.booking.customer.id = :userId ORDER BY t.createdAt DESC")
    List<Transaction> findByUserId(Long userId);
    
    @Query("SELECT t FROM Transaction t WHERE t.createdAt >= :startDate AND t.createdAt <= :endDate ORDER BY t.createdAt DESC")
    List<Transaction> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.status = :status AND t.createdAt >= :startDate")
    List<Transaction> findPendingTransactionsAfter(TransactionStatus status, LocalDateTime startDate);
}
