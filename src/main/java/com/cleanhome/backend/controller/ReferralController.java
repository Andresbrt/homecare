package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.ReferralResponseDTO;
import com.cleanhome.backend.service.ReferralService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/referrals")
@Tag(name = "Referencias", description = "API de programa de referidos")
@SecurityRequirement(name = "bearerAuth")
public class ReferralController {

    private final ReferralService referralService;

    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    @GetMapping("/my-code")
    @Operation(summary = "Mi código de referido", description = "Genera o recupera el código de referido del usuario")
    public ResponseEntity<Map<String, String>> getMyReferralCode(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        String code = referralService.generateReferralCode(userId);
        return ResponseEntity.ok(Map.of("referralCode", code));
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar referido", description = "Registra un nuevo usuario usando código de referido")
    public ResponseEntity<Map<String, String>> registerReferral(
            @RequestParam String referralCode,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        referralService.registerReferral(referralCode, userId);
        return ResponseEntity.ok(Map.of("message", "Referido registrado exitosamente"));
    }

    @GetMapping("/my-referrals")
    @Operation(summary = "Mis referidos", description = "Obtiene la lista de usuarios referidos")
    public ResponseEntity<List<ReferralResponseDTO>> getMyReferrals(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<ReferralResponseDTO> referrals = referralService.getUserReferrals(userId);
        return ResponseEntity.ok(referrals);
    }

    @GetMapping("/stats")
    @Operation(summary = "Estadísticas de referidos", description = "Obtiene estadísticas del programa de referidos")
    public ResponseEntity<Map<String, Object>> getReferralStats(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        Long completedCount = referralService.countCompletedReferrals(userId);
        return ResponseEntity.ok(Map.of(
                "completedReferrals", completedCount,
                "pointsEarned", completedCount * 100 // 100 puntos por referido
        ));
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
