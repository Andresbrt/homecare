package com.cleanhome.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Configuration", description = "Endpoints de configuración pública")
@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Autowired
    private com.cleanhome.backend.service.ConfigService configService;

    @Operation(summary = "Config AI", description = "Obtiene la configuración global de AI")
    @GetMapping("/ai")
    public ResponseEntity<Map<String, Object>> getAiConfig() {
        Map<String, Object> body = new HashMap<>();
        body.put("enabled", configService.isAiEnabled());
        body.put("model", configService.getAiModel());
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "Actualizar Config AI", description = "Actualiza la configuración global de AI (requiere rol admin)")
    @PutMapping("/ai")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateAiConfig(@RequestBody Map<String, Object> request) {
        if (request.containsKey("enabled")) {
            Object v = request.get("enabled");
            boolean enabled = (v instanceof Boolean) ? (Boolean) v : Boolean.parseBoolean(String.valueOf(v));
            configService.setAiEnabled(enabled);
        }
        if (request.containsKey("model")) {
            String model = String.valueOf(request.get("model"));
            if (model != null && !model.isBlank()) {
                configService.setAiModel(model);
            }
        }
        Map<String, Object> body = new HashMap<>();
        body.put("enabled", configService.isAiEnabled());
        body.put("model", configService.getAiModel());
        return ResponseEntity.ok(body);
    }
}
