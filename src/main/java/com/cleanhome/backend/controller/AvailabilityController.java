package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.*;
import com.cleanhome.backend.service.AvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/availability")
@Tag(name = "Availability", description = "Gestión de disponibilidad de proveedores")
public class AvailabilityController {
    
    private final AvailabilityService availabilityService;
    
    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }
    
    /**
     * Configura la disponibilidad para un día de la semana
     */
    @PostMapping("/schedule")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(
        summary = "Configurar disponibilidad",
        description = "Permite al proveedor configurar su disponibilidad para un día de la semana",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> setAvailability(@Valid @RequestBody AvailabilityRequestDTO request,
                                            Principal principal) {
        try {
            AvailabilityResponseDTO response = availabilityService.setAvailability(request, principal.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Obtiene la disponibilidad del proveedor autenticado
     */
    @GetMapping("/my-schedule")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(
        summary = "Mi horario",
        description = "Obtiene la configuración de disponibilidad del proveedor autenticado",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<List<AvailabilityResponseDTO>> getMyAvailability(Principal principal) {
        List<AvailabilityResponseDTO> availability = availabilityService.getProviderAvailability(principal.getName());
        return ResponseEntity.ok(availability);
    }
    
    /**
     * Obtiene la disponibilidad pública de un proveedor (para clientes)
     */
    @GetMapping("/provider/{providerId}")
    @Operation(
        summary = "Ver disponibilidad de proveedor",
        description = "Obtiene la disponibilidad pública de un proveedor específico"
    )
    public ResponseEntity<List<AvailabilityResponseDTO>> getProviderAvailability(@PathVariable Long providerId) {
        List<AvailabilityResponseDTO> availability = availabilityService.getPublicProviderAvailability(providerId);
        return ResponseEntity.ok(availability);
    }
    
    /**
     * Elimina una configuración de disponibilidad
     */
    @DeleteMapping("/{availabilityId}")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(
        summary = "Eliminar disponibilidad",
        description = "Elimina una configuración de disponibilidad específica",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> deleteAvailability(@PathVariable Long availabilityId, Principal principal) {
        try {
            availabilityService.deleteAvailability(availabilityId, principal.getName());
            return ResponseEntity.ok(new SuccessResponse("Disponibilidad eliminada"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Bloquea una fecha específica
     */
    @PostMapping("/block-date")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(
        summary = "Bloquear fecha",
        description = "Bloquea una fecha específica para no recibir reservas",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> blockDate(@Valid @RequestBody BlockedDateRequestDTO request,
                                      Principal principal) {
        try {
            BlockedDateResponseDTO response = availabilityService.blockDate(request, principal.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Obtiene las fechas bloqueadas del proveedor
     */
    @GetMapping("/blocked-dates")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(
        summary = "Mis fechas bloqueadas",
        description = "Obtiene todas las fechas bloqueadas del proveedor",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<List<BlockedDateResponseDTO>> getMyBlockedDates(Principal principal) {
        List<BlockedDateResponseDTO> blockedDates = availabilityService.getBlockedDates(principal.getName());
        return ResponseEntity.ok(blockedDates);
    }
    
    /**
     * Obtiene fechas bloqueadas públicas de un proveedor
     */
    @GetMapping("/provider/{providerId}/blocked-dates")
    @Operation(
        summary = "Ver fechas bloqueadas",
        description = "Obtiene las fechas no disponibles de un proveedor"
    )
    public ResponseEntity<List<BlockedDateResponseDTO>> getProviderBlockedDates(@PathVariable Long providerId) {
        List<BlockedDateResponseDTO> blockedDates = availabilityService.getPublicBlockedDates(providerId);
        return ResponseEntity.ok(blockedDates);
    }
    
    /**
     * Desbloquea una fecha
     */
    @DeleteMapping("/blocked-dates/{blockedDateId}")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(
        summary = "Desbloquear fecha",
        description = "Elimina el bloqueo de una fecha específica",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> unblockDate(@PathVariable Long blockedDateId, Principal principal) {
        try {
            availabilityService.unblockDate(blockedDateId, principal.getName());
            return ResponseEntity.ok(new SuccessResponse("Fecha desbloqueada"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Verifica si un proveedor está disponible en una fecha y hora
     */
    @GetMapping("/check")
    @Operation(
        summary = "Verificar disponibilidad",
        description = "Verifica si un proveedor está disponible en una fecha y hora específica"
    )
    public ResponseEntity<?> checkAvailability(
            @RequestParam Long providerId,
            @RequestParam String date,
            @RequestParam String time) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            LocalTime localTime = LocalTime.parse(time);
            
            boolean available = availabilityService.isProviderAvailable(providerId, localDate, localTime);
            
            return ResponseEntity.ok(new AvailabilityCheckResponse(available, 
                available ? "Proveedor disponible" : "Proveedor no disponible"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Response DTOs
    private record ErrorResponse(String message) {}
    private record SuccessResponse(String message) {}
    private record AvailabilityCheckResponse(boolean available, String message) {}
}
