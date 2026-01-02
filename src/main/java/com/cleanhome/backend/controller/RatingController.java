package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.ProviderRatingStatsDTO;
import com.cleanhome.backend.dto.RatingRequestDTO;
import com.cleanhome.backend.dto.RatingResponseDTO;
import com.cleanhome.backend.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/ratings")
@Tag(name = "Ratings", description = "Gestión de calificaciones y reseñas")
public class RatingController {
    
    private final RatingService ratingService;
    
    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }
    
    /**
     * Crea una nueva calificación para un servicio completado
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Crear calificación",
        description = "Permite a un cliente calificar un servicio completado",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> createRating(@Valid @RequestBody RatingRequestDTO request, 
                                         Principal principal) {
        try {
            RatingResponseDTO rating = ratingService.createRating(request, principal.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(rating);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Obtiene todas las calificaciones de un proveedor específico
     */
    @GetMapping("/provider/{providerId}")
    @Operation(
        summary = "Listar calificaciones de proveedor",
        description = "Obtiene todas las calificaciones de un proveedor ordenadas por fecha"
    )
    public ResponseEntity<List<RatingResponseDTO>> getProviderRatings(@PathVariable Long providerId) {
        List<RatingResponseDTO> ratings = ratingService.getProviderRatings(providerId);
        return ResponseEntity.ok(ratings);
    }
    
    /**
     * Obtiene estadísticas completas de calificaciones de un proveedor
     */
    @GetMapping("/provider/{providerId}/stats")
    @Operation(
        summary = "Estadísticas de calificaciones",
        description = "Obtiene promedio, total y distribución de calificaciones de un proveedor"
    )
    public ResponseEntity<ProviderRatingStatsDTO> getProviderStats(@PathVariable Long providerId) {
        ProviderRatingStatsDTO stats = ratingService.getProviderStats(providerId);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Obtiene todas las calificaciones hechas por el usuario autenticado
     */
    @GetMapping("/my-ratings")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Mis calificaciones",
        description = "Obtiene todas las calificaciones realizadas por el usuario autenticado",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<List<RatingResponseDTO>> getMyRatings(Principal principal) {
        List<RatingResponseDTO> ratings = ratingService.getUserRatings(principal.getName());
        return ResponseEntity.ok(ratings);
    }
    
    /**
     * Actualiza una calificación existente
     */
    @PutMapping("/{ratingId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Actualizar calificación",
        description = "Permite al usuario modificar su propia calificación",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> updateRating(@PathVariable Long ratingId,
                                         @Valid @RequestBody RatingRequestDTO request,
                                         Principal principal) {
        try {
            RatingResponseDTO rating = ratingService.updateRating(ratingId, request, principal.getName());
            return ResponseEntity.ok(rating);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Elimina una calificación
     */
    @DeleteMapping("/{ratingId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Eliminar calificación",
        description = "Permite eliminar una calificación (solo el autor o admin)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> deleteRating(@PathVariable Long ratingId, Principal principal) {
        try {
            ratingService.deleteRating(ratingId, principal.getName());
            return ResponseEntity.ok(new SuccessResponse("Calificación eliminada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Response DTOs
    private record ErrorResponse(String message) {}
    private record SuccessResponse(String message) {}
}
