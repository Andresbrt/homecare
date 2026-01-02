package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.CouponRequestDTO;
import com.cleanhome.backend.dto.CouponResponseDTO;
import com.cleanhome.backend.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@Tag(name = "Cupones", description = "API de gestión de cupones y promociones")
@SecurityRequirement(name = "bearerAuth")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear cupón", description = "Crea un nuevo cupón de descuento (solo admin)")
    public ResponseEntity<CouponResponseDTO> createCoupon(@Valid @RequestBody CouponRequestDTO request) {
        CouponResponseDTO response = couponService.createCoupon(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate/{code}")
    @Operation(summary = "Validar cupón", description = "Valida si un cupón es aplicable")
    public ResponseEntity<CouponResponseDTO> validateCoupon(
            @PathVariable String code,
            @RequestParam Long serviceId,
            @RequestParam BigDecimal amount,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        CouponResponseDTO response = couponService.validateCoupon(code, userId, serviceId, amount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/apply/{code}")
    @Operation(summary = "Aplicar cupón", description = "Aplica un cupón a una reserva")
    public ResponseEntity<Map<String, BigDecimal>> applyCoupon(
            @PathVariable String code,
            @RequestParam Long bookingId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        BigDecimal discount = couponService.applyCoupon(code, userId, bookingId);
        return ResponseEntity.ok(Map.of("discount", discount));
    }

    @GetMapping("/active")
    @Operation(summary = "Cupones activos", description = "Obtiene todos los cupones activos disponibles")
    public ResponseEntity<List<CouponResponseDTO>> getActiveCoupons() {
        List<CouponResponseDTO> coupons = couponService.getAllActiveCoupons();
        return ResponseEntity.ok(coupons);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Todos los cupones", description = "Obtiene todos los cupones (solo admin)")
    public ResponseEntity<List<CouponResponseDTO>> getAllCoupons() {
        List<CouponResponseDTO> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(coupons);
    }

    @PutMapping("/{couponId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar cupón", description = "Actualiza un cupón existente (solo admin)")
    public ResponseEntity<CouponResponseDTO> updateCoupon(
            @PathVariable Long couponId,
            @Valid @RequestBody CouponRequestDTO request) {
        CouponResponseDTO response = couponService.updateCoupon(couponId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{couponId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Desactivar cupón", description = "Desactiva un cupón (solo admin)")
    public ResponseEntity<Void> deactivateCoupon(@PathVariable Long couponId) {
        couponService.deactivateCoupon(couponId);
        return ResponseEntity.ok().build();
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
