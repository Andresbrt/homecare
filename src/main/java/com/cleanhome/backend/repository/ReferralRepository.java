package com.cleanhome.backend.repository;

import com.cleanhome.backend.model.Referral;
import com.cleanhome.backend.model.ReferralStatus;
import com.cleanhome.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, Long> {
    
    Optional<Referral> findByReferralCode(String referralCode);
    
    List<Referral> findByReferrerOrderByCreatedAtDesc(User referrer);
    
    Optional<Referral> findByReferred(User referred);
    
    Long countByReferrerAndStatus(User referrer, ReferralStatus status);
    
        @Query("SELECT COUNT(r) FROM Referral r WHERE r.referrer = :referrer AND r.status = 'COMPLETED'")
        Long countCompletedByReferrer(@Param("referrer") User referrer);
}
