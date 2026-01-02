package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.AdminUserDTO;
import com.cleanhome.backend.dto.UserUpdateDTO;
import com.cleanhome.backend.enums.UserRole;
import com.cleanhome.backend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administración", description = "API de administración de usuarios y sistema")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "Listar usuarios", description = "Obtiene lista paginada de todos los usuarios")
    public ResponseEntity<Page<AdminUserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<AdminUserDTO> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/role/{role}")
    @Operation(summary = "Listar usuarios por rol", description = "Obtiene usuarios filtrados por rol")
        public ResponseEntity<Page<AdminUserDTO>> getUsersByRole(
            @PathVariable UserRole role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AdminUserDTO> users = adminService.getUsersByRole(role, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Detalle de usuario", description = "Obtiene información detallada de un usuario")
    public ResponseEntity<AdminUserDTO> getUserById(@PathVariable Long userId) {
        AdminUserDTO user = adminService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza información de un usuario")
    public ResponseEntity<AdminUserDTO> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserUpdateDTO dto) {
        AdminUserDTO updated = adminService.updateUser(userId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Desactivar usuario", description = "Desactiva un usuario (soft delete)")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "Usuario desactivado exitosamente"));
    }

    @PostMapping("/users/{userId}/activate")
    @Operation(summary = "Activar usuario", description = "Activa un usuario previamente desactivado")
    public ResponseEntity<Map<String, String>> activateUser(@PathVariable Long userId) {
        adminService.activateUser(userId);
        return ResponseEntity.ok(Map.of("message", "Usuario activado exitosamente"));
    }

    @PutMapping("/users/{userId}/role")
    @Operation(summary = "Cambiar rol", description = "Cambia el rol de un usuario")
    public ResponseEntity<Map<String, String>> changeUserRole(
            @PathVariable Long userId,
            @RequestParam UserRole role) {
        adminService.changeUserRole(userId, role);
        return ResponseEntity.ok(Map.of("message", "Rol actualizado exitosamente"));
    }
}
