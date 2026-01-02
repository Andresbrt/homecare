package com.cleanhome.backend.repository;

import com.cleanhome.backend.entity.ProviderBlockedDate;
import com.cleanhome.backend.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProviderBlockedDateRepository extends JpaRepository<ProviderBlockedDate, Long> {
    
    List<ProviderBlockedDate> findByServiceProvider(ServiceProvider serviceProvider);
    
    List<ProviderBlockedDate> findByServiceProviderAndBlockedDateBetween(
        ServiceProvider serviceProvider, LocalDate startDate, LocalDate endDate
    );
    
    @Query("SELECT pbd FROM ProviderBlockedDate pbd WHERE pbd.serviceProvider = :provider AND pbd.blockedDate >= :startDate")
    List<ProviderBlockedDate> findFutureBlockedDates(@Param("provider") ServiceProvider provider, @Param("startDate") LocalDate startDate);
    
    boolean existsByServiceProviderAndBlockedDate(ServiceProvider serviceProvider, LocalDate blockedDate);
}
