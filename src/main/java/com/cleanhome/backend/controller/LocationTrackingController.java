package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.LocationTrackingResponseDTO;
import com.cleanhome.backend.dto.LocationUpdateRequestDTO;
import com.cleanhome.backend.service.LocationTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tracking")
@Tag(name = "Tracking GPS", description = "API de seguimiento GPS en tiempo real")
@SecurityRequirement(name = "bearerAuth")
public class LocationTrackingController {

    private final LocationTrackingService locationTrackingService;

    public LocationTrackingController(LocationTrackingService locationTrackingService) {
        this.locationTrackingService = locationTrackingService;
    }

    @PostMapping("/booking/{bookingId}/update")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(summary = "Actualizar ubicación", description = "Actualiza la ubicación actual del proveedor")
    public ResponseEntity<LocationTrackingResponseDTO> updateLocation(
            @PathVariable Long bookingId,
            @Valid @RequestBody LocationUpdateRequestDTO request,
            Authentication authentication) {
        Long providerId = getProviderIdFromAuth(authentication);
        LocationTrackingResponseDTO response = locationTrackingService.updateLocation(bookingId, providerId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/booking/{bookingId}/current")
    @Operation(summary = "Ubicación actual", description = "Obtiene la ubicación actual del proveedor")
    public ResponseEntity<LocationTrackingResponseDTO> getCurrentLocation(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        LocationTrackingResponseDTO location = locationTrackingService.getCurrentLocation(bookingId, userId);
        if (location == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(location);
    }

    @GetMapping("/booking/{bookingId}/history")
    @Operation(summary = "Historial de ubicaciones", description = "Obtiene el historial de ubicaciones")
    public ResponseEntity<List<LocationTrackingResponseDTO>> getLocationHistory(
            @PathVariable Long bookingId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<LocationTrackingResponseDTO> history = locationTrackingService.getLocationHistory(
                bookingId, userId, startTime, endTime);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/booking/{bookingId}/start")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(summary = "Iniciar seguimiento", description = "Inicia el seguimiento GPS para una reserva")
    public ResponseEntity<Map<String, String>> startTracking(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long providerId = getProviderIdFromAuth(authentication);
        locationTrackingService.startTracking(bookingId, providerId);
        return ResponseEntity.ok(Map.of("message", "Seguimiento iniciado correctamente"));
    }

    @PostMapping("/booking/{bookingId}/stop")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    @Operation(summary = "Detener seguimiento", description = "Detiene el seguimiento GPS")
    public ResponseEntity<Map<String, String>> stopTracking(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long providerId = getProviderIdFromAuth(authentication);
        locationTrackingService.stopTracking(bookingId, providerId);
        return ResponseEntity.ok(Map.of("message", "Seguimiento detenido correctamente"));
    }

    @GetMapping("/booking/{bookingId}/distance")
    @Operation(summary = "Calcular distancia", description = "Calcula la distancia en km desde la ubicación actual")
    public ResponseEntity<Map<String, Double>> calculateDistance(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        Double distance = locationTrackingService.calculateDistance(bookingId, userId);
        if (distance == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(Map.of("distanceKm", distance));
    }

    @GetMapping("/booking/{bookingId}/eta")
    @Operation(summary = "Calcular ETA", description = "Calcula el tiempo estimado de llegada en minutos")
    public ResponseEntity<Map<String, Integer>> calculateETA(
            @PathVariable Long bookingId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        Integer eta = locationTrackingService.calculateETA(bookingId, userId);
        if (eta == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(Map.of("estimatedMinutes", eta));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }

    private Long getProviderIdFromAuth(Authentication authentication) {
        // Aquí deberías obtener el ServiceProvider ID del usuario
        // Por simplicidad, asumimos que coincide con el user ID
        return Long.parseLong(authentication.getName());
    }
}
