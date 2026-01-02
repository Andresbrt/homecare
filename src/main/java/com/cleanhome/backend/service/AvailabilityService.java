package com.cleanhome.backend.service;

import com.cleanhome.backend.dto.*;
import com.cleanhome.backend.entity.ProviderAvailability;
import com.cleanhome.backend.entity.ProviderBlockedDate;
import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.repository.ProviderAvailabilityRepository;
import com.cleanhome.backend.repository.ProviderBlockedDateRepository;
import com.cleanhome.backend.repository.ServiceProviderRepository;
import com.cleanhome.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AvailabilityService {
    
    private final ProviderAvailabilityRepository availabilityRepository;
    private final ProviderBlockedDateRepository blockedDateRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final UserRepository userRepository;
    
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
    
    public AvailabilityService(ProviderAvailabilityRepository availabilityRepository,
                              ProviderBlockedDateRepository blockedDateRepository,
                              ServiceProviderRepository serviceProviderRepository,
                              UserRepository userRepository) {
        this.availabilityRepository = availabilityRepository;
        this.blockedDateRepository = blockedDateRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.userRepository = userRepository;
    }
    
    /**
     * Crea o actualiza la disponibilidad para un día de la semana
     */
    public AvailabilityResponseDTO setAvailability(AvailabilityRequestDTO request, String userEmail) {
        ServiceProvider provider = getProviderByUserEmail(userEmail);
        
        // Buscar si ya existe disponibilidad para ese día
        ProviderAvailability availability = availabilityRepository
                .findByServiceProviderAndDayOfWeek(provider, request.getDayOfWeek())
                .orElse(new ProviderAvailability());
        
        availability.setServiceProvider(provider);
        availability.setDayOfWeek(request.getDayOfWeek());
        availability.setStartTime(LocalTime.parse(request.getStartTime(), timeFormatter));
        availability.setEndTime(LocalTime.parse(request.getEndTime(), timeFormatter));
        availability.setIsAvailable(request.getIsAvailable());
        availability.setMaxBookingsPerDay(request.getMaxBookingsPerDay());
        
        ProviderAvailability saved = availabilityRepository.save(availability);
        
        return new AvailabilityResponseDTO(saved);
    }
    
    /**
     * Obtiene toda la disponibilidad de un proveedor
     */
    @Transactional(readOnly = true)
    public List<AvailabilityResponseDTO> getProviderAvailability(String userEmail) {
        ServiceProvider provider = getProviderByUserEmail(userEmail);
        
        List<ProviderAvailability> availabilities = availabilityRepository
                .findByServiceProvider(provider);
        
        return availabilities.stream()
                .map(AvailabilityResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene disponibilidad pública de un proveedor (para clientes)
     */
    @Transactional(readOnly = true)
    public List<AvailabilityResponseDTO> getPublicProviderAvailability(Long providerId) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        List<ProviderAvailability> availabilities = availabilityRepository
                .findByServiceProviderAndIsAvailable(provider, true);
        
        return availabilities.stream()
                .map(AvailabilityResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Elimina una disponibilidad específica
     */
    public void deleteAvailability(Long availabilityId, String userEmail) {
        ServiceProvider provider = getProviderByUserEmail(userEmail);
        
        ProviderAvailability availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Disponibilidad no encontrada"));
        
        // Validar que pertenece al proveedor
        if (!availability.getServiceProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("No tienes permiso para eliminar esta disponibilidad");
        }
        
        availabilityRepository.delete(availability);
    }
    
    /**
     * Bloquea una fecha específica
     */
    public BlockedDateResponseDTO blockDate(BlockedDateRequestDTO request, String userEmail) {
        ServiceProvider provider = getProviderByUserEmail(userEmail);
        
        LocalDate date = LocalDate.parse(request.getBlockedDate());
        
        // Validar que la fecha no esté ya bloqueada
        if (blockedDateRepository.existsByServiceProviderAndBlockedDate(provider, date)) {
            throw new RuntimeException("Esta fecha ya está bloqueada");
        }
        
        // Validar que la fecha sea futura
        if (date.isBefore(LocalDate.now())) {
            throw new RuntimeException("No se pueden bloquear fechas pasadas");
        }
        
        ProviderBlockedDate blockedDate = new ProviderBlockedDate();
        blockedDate.setServiceProvider(provider);
        blockedDate.setBlockedDate(date);
        blockedDate.setReason(request.getReason());
        blockedDate.setIsFullDay(request.getIsFullDay());
        
        ProviderBlockedDate saved = blockedDateRepository.save(blockedDate);
        
        return new BlockedDateResponseDTO(saved);
    }
    
    /**
     * Obtiene todas las fechas bloqueadas de un proveedor
     */
    @Transactional(readOnly = true)
    public List<BlockedDateResponseDTO> getBlockedDates(String userEmail) {
        ServiceProvider provider = getProviderByUserEmail(userEmail);
        
        List<ProviderBlockedDate> blockedDates = blockedDateRepository
                .findFutureBlockedDates(provider, LocalDate.now());
        
        return blockedDates.stream()
                .map(BlockedDateResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene fechas bloqueadas públicas (para clientes)
     */
    @Transactional(readOnly = true)
    public List<BlockedDateResponseDTO> getPublicBlockedDates(Long providerId) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        List<ProviderBlockedDate> blockedDates = blockedDateRepository
                .findFutureBlockedDates(provider, LocalDate.now());
        
        return blockedDates.stream()
                .map(BlockedDateResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Desbloquea una fecha
     */
    public void unblockDate(Long blockedDateId, String userEmail) {
        ServiceProvider provider = getProviderByUserEmail(userEmail);
        
        ProviderBlockedDate blockedDate = blockedDateRepository.findById(blockedDateId)
                .orElseThrow(() -> new RuntimeException("Fecha bloqueada no encontrada"));
        
        // Validar permisos
        if (!blockedDate.getServiceProvider().getId().equals(provider.getId())) {
            throw new RuntimeException("No tienes permiso para desbloquear esta fecha");
        }
        
        blockedDateRepository.delete(blockedDate);
    }
    
    /**
     * Verifica si un proveedor está disponible en una fecha y hora específica
     */
    @Transactional(readOnly = true)
    public boolean isProviderAvailable(Long providerId, LocalDate date, LocalTime time) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        // Verificar si la fecha está bloqueada
        if (blockedDateRepository.existsByServiceProviderAndBlockedDate(provider, date)) {
            return false;
        }
        
        // Verificar disponibilidad del día de la semana
        String dayOfWeek = date.getDayOfWeek().toString();
        return availabilityRepository.findAvailableByProviderAndDay(provider, dayOfWeek)
                .map(availability -> {
                    // Verificar que la hora esté dentro del rango
                    return !time.isBefore(availability.getStartTime()) && 
                           !time.isAfter(availability.getEndTime());
                })
                .orElse(false);
    }
    
    /**
     * Obtiene el proveedor asociado al usuario
     */
    private ServiceProvider getProviderByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (user.getServiceProvider() == null) {
            throw new RuntimeException("El usuario no es un proveedor de servicios");
        }
        
        return user.getServiceProvider();
    }
}
