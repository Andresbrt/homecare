package com.cleanhome.backend.repository;

import com.cleanhome.backend.model.LoyaltyPoints;
import com.cleanhome.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoyaltyPointsRepository extends JpaRepository<LoyaltyPoints, Long> {
    
    Optional<LoyaltyPoints> findByUser(User user);
}
