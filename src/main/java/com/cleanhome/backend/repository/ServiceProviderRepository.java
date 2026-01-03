package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    
    Optional<ServiceProvider> findByUser(User user);
    
    List<ServiceProvider> findByIsVerifiedTrue();
    
       List<ServiceProvider> findByIsAvailableTrue();
    
    @Query("SELECT sp FROM ServiceProvider sp WHERE sp.isAvailable = true AND sp.isVerified = true " +
           "ORDER BY sp.ratingAverage DESC")
    List<ServiceProvider> findTopProviders();
    
    @Query("SELECT sp FROM ServiceProvider sp WHERE sp.isAvailable = true AND " +
           "(LOWER(sp.businessName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(sp.description) LIKE LOWER(CONCAT('%', :keyword, '%')))"
    )
    List<ServiceProvider> searchByKeyword(@Param("keyword") String keyword);
    
       Page<ServiceProvider> findByIsAvailableTrue(Pageable pageable);
    
    @Query("SELECT sp FROM ServiceProvider sp WHERE " +
           "(LOWER(sp.businessName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(sp.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ServiceProvider> findBySearchQuery(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT sp FROM ServiceProvider sp JOIN sp.services s WHERE s.id = :serviceId")
    Page<ServiceProvider> findByServiceId(@Param("serviceId") Long serviceId, Pageable pageable);
    
    @Query("SELECT sp FROM ServiceProvider sp JOIN sp.services s WHERE s.id = :serviceId AND " +
           "(LOWER(sp.businessName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(sp.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ServiceProvider> findByServiceIdAndSearchQuery(@Param("serviceId") Long serviceId, 
                                                         @Param("query") String query, 
                                                         Pageable pageable);

       Long countByIsAvailableTrue();
}
