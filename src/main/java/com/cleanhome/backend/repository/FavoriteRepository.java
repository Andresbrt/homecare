package com.cleanhome.backend.repository;

import com.cleanhome.backend.model.Favorite;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<Favorite> findByUserAndServiceProvider(User user, ServiceProvider serviceProvider);
    
    boolean existsByUserAndServiceProvider(User user, ServiceProvider serviceProvider);
    
    Long countByServiceProvider(ServiceProvider serviceProvider);
    
        Long countByUser(User user);
}
