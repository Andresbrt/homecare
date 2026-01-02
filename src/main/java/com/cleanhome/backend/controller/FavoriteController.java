package com.cleanhome.backend.controller;

import com.cleanhome.backend.entity.ServiceProvider;
import com.cleanhome.backend.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@Tag(name = "Favoritos", description = "API de gestión de proveedores favoritos")
@SecurityRequirement(name = "bearerAuth")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/{providerId}")
    @Operation(summary = "Agregar favorito", description = "Agrega un proveedor a favoritos")
    public ResponseEntity<Map<String, String>> addFavorite(
            @PathVariable Long providerId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        favoriteService.addFavorite(userId, providerId);
        return ResponseEntity.ok(Map.of("message", "Proveedor agregado a favoritos"));
    }

    @DeleteMapping("/{providerId}")
    @Operation(summary = "Eliminar favorito", description = "Elimina un proveedor de favoritos")
    public ResponseEntity<Map<String, String>> removeFavorite(
            @PathVariable Long providerId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        favoriteService.removeFavorite(userId, providerId);
        return ResponseEntity.ok(Map.of("message", "Proveedor eliminado de favoritos"));
    }

    @GetMapping
    @Operation(summary = "Mis favoritos", description = "Obtiene la lista de proveedores favoritos")
    public ResponseEntity<List<ServiceProvider>> getMyFavorites(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<ServiceProvider> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/check/{providerId}")
    @Operation(summary = "Verificar favorito", description = "Verifica si un proveedor está en favoritos")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @PathVariable Long providerId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        boolean isFavorite = favoriteService.isFavorite(userId, providerId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
