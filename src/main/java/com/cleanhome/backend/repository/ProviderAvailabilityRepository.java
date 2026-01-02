package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.ProviderAvailability;
import com.cleanhome.backend.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderAvailabilityRepository extends JpaRepository<ProviderAvailability, Long> {
    
    List<ProviderAvailability> findByServiceProvider(ServiceProvider serviceProvider);
    
    List<ProviderAvailability> findByServiceProviderAndIsAvailable(ServiceProvider serviceProvider, Boolean isAvailable);
    
    Optional<ProviderAvailability> findByServiceProviderAndDayOfWeek(ServiceProvider serviceProvider, String dayOfWeek);
    
    @Query("SELECT pa FROM ProviderAvailability pa WHERE pa.serviceProvider = :provider AND pa.dayOfWeek = :day AND pa.isAvailable = true")
    Optional<ProviderAvailability> findAvailableByProviderAndDay(@Param("provider") ServiceProvider provider, @Param("day") String day);
}
