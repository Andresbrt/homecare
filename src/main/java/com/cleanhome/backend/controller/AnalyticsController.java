package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.PlatformStatsDTO;
import com.cleanhome.backend.dto.RevenueStatsDTO;
import com.cleanhome.backend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "API de reportes y estadísticas")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/platform")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Estadísticas de la plataforma", description = "Obtiene estadísticas generales (solo admin)")
    public ResponseEntity<PlatformStatsDTO> getPlatformStats() {
        PlatformStatsDTO stats = analyticsService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Estadísticas de ingresos", description = "Obtiene estadísticas de ingresos por período (solo admin)")
    public ResponseEntity<RevenueStatsDTO> getRevenueStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        RevenueStatsDTO stats = analyticsService.getRevenueStats(startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/provider/{providerId}/revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'SERVICE_PROVIDER')")
    @Operation(summary = "Ingresos del proveedor", description = "Obtiene estadísticas de ingresos de un proveedor")
    public ResponseEntity<RevenueStatsDTO> getProviderRevenueStats(
            @PathVariable Long providerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        RevenueStatsDTO stats = analyticsService.getProviderRevenueStats(providerId, startDate, endDate);
        return ResponseEntity.ok(stats);
    }
}
