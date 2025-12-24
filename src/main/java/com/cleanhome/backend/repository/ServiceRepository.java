package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.Service;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.enums.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    List<Service> findByServiceProvider(ServiceProvider serviceProvider);
    
    List<Service> findByServiceType(ServiceType serviceType);
    
    List<Service> findByIsActiveTrue();
    
    @Query("SELECT s FROM Service s WHERE s.isActive = true AND s.basePrice BETWEEN :minPrice AND :maxPrice")
    List<Service> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
        @Query("SELECT s FROM Service s WHERE s.isActive = true AND " +
            "(LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')))"
        )
    List<Service> searchByKeyword(@Param("keyword") String keyword);
}
