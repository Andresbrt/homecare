package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.Rating;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    List<Rating> findByServiceProvider(ServiceProvider serviceProvider);
    
    List<Rating> findByUser(User user);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.serviceProvider = :provider")
    BigDecimal findAverageRatingByServiceProvider(@Param("provider") ServiceProvider provider);
    
    @Query("SELECT r FROM Rating r WHERE r.serviceProvider = :provider ORDER BY r.createdAt DESC")
    List<Rating> findByServiceProviderOrderByCreatedAtDesc(@Param("provider") ServiceProvider provider);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.serviceProvider = :provider")
    Long countByServiceProvider(@Param("provider") ServiceProvider provider);
}
