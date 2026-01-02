package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.UserStatsDTO;
import com.cleanhome.backend.service.UserStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/stats")
@Tag(name = "Estadísticas de Usuario", description = "API de estadísticas personales del usuario")
@SecurityRequirement(name = "bearerAuth")
public class UserStatsController {

    private final UserStatsService userStatsService;

    public UserStatsController(UserStatsService userStatsService) {
        this.userStatsService = userStatsService;
    }

    @GetMapping("/me")
    @Operation(summary = "Mis estadísticas", description = "Obtiene las estadísticas del usuario actual")
    public ResponseEntity<UserStatsDTO> getMyStats(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        UserStatsDTO stats = userStatsService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Estadísticas de usuario", description = "Obtiene las estadísticas de un usuario específico")
    public ResponseEntity<UserStatsDTO> getUserStats(@PathVariable Long userId) {
        UserStatsDTO stats = userStatsService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
