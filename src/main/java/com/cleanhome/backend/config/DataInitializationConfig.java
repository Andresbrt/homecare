package com.cleanhome.backend.config;

import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.Service;
import com.cleanhome.backend.enums.UserRole;
import com.cleanhome.backend.enums.ServiceType;
import com.cleanhome.backend.repository.UserRepository;
import com.cleanhome.backend.repository.ServiceProviderRepository;
import com.cleanhome.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializationConfig {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Create dev user if it doesn't exist
            // Usuario dev
            User devUser = userRepository.findByEmail("test@viclean.com").orElseGet(() -> {
                User u = new User();
                u.setEmail("test@viclean.com");
                u.setPassword(passwordEncoder.encode("Secret123"));
                u.setFirstName("Test");
                u.setLastName("User");
                u.setPhoneNumber("+573005551234");
                u.setRole(UserRole.CUSTOMER);
                u.setIsActive(true);
                u.setIsVerified(true);
                return userRepository.save(u);
            });
            System.out.println("✓ Dev user ready: test@viclean.com / Secret123");

            // Proveedor demo vinculado al usuario dev (si no existe)
            ServiceProvider provider = serviceProviderRepository.findByUser(devUser).orElseGet(() -> {
                ServiceProvider sp = new ServiceProvider(devUser);
                sp.setBusinessName("Proveedor Demo");
                sp.setDescription("Servicios de limpieza general y profunda para pruebas.");
                sp.setYearsExperience(3);
                sp.setIsVerified(true);
                sp.setIsAvailable(true);
                sp.setServiceRadius(new java.math.BigDecimal("15.0"));
                sp.setHourlyRate(new java.math.BigDecimal("25.00"));
                sp.setServicesOffered(java.util.Set.of(ServiceType.BASIC_CLEANING, ServiceType.DEEP_CLEANING));
                return serviceProviderRepository.save(sp);
            });
            System.out.println("✓ Proveedor demo listo (user: test@viclean.com)");

            // Servicio demo (idempotente) para que el smoke test siempre tenga 1 servicio activo
            if (serviceRepository.findByIsActiveTrue().isEmpty()) {
                Service svc = new Service();
                svc.setName("Limpieza Básica Demo");
                svc.setDescription("Servicio demo para flujo de reservas/pagos");
                svc.setServiceType(ServiceType.BASIC_CLEANING);
                svc.setBasePrice(new java.math.BigDecimal("80000"));
                svc.setEstimatedDurationHours(2);
                svc.setServiceProvider(provider);
                svc.setIsActive(true);
                serviceRepository.save(svc);
                System.out.println("✓ Servicio demo creado (BASIC_CLEANING)");
            }
        };
    }
}
