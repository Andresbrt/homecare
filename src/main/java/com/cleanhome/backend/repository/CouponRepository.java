package com.cleanhome.backend.repository;

import com.cleanhome.backend.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    Optional<Coupon> findByCode(String code);
    
    @Query("SELECT c FROM Coupon c WHERE c.isActive = true AND c.validFrom <= :date AND c.validUntil >= :date AND c.currentUsages < c.maxUsages")
    List<Coupon> findActiveCoupons(LocalDate date);
    
    List<Coupon> findByIsActiveTrueOrderByValidUntilDesc();
    
    @Query("SELECT c FROM Coupon c WHERE c.code = :code AND c.isActive = true AND c.validFrom <= :date AND c.validUntil >= :date AND c.currentUsages < c.maxUsages")
    Optional<Coupon> findValidCoupon(String code, LocalDate date);
}
