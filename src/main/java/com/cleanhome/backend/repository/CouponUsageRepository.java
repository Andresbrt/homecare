package com.cleanhome.backend.repository;

import com.cleanhome.backend.model.CouponUsage;
import com.cleanhome.backend.model.Coupon;
import com.cleanhome.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {
    
    List<CouponUsage> findByCouponOrderByUsedAtDesc(Coupon coupon);
    
    List<CouponUsage> findByUserOrderByUsedAtDesc(User user);
    
    Long countByCouponAndUser(Coupon coupon, User user);
    
    boolean existsByCouponAndUser(Coupon coupon, User user);
}
