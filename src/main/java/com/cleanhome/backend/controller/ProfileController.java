package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.UserResponseDto;
import com.cleanhome.backend.dto.UserRegistrationDto;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.enums.UserRole;
import com.cleanhome.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDto> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userService.findByEmail(email)
            .orElseGet(() -> autoProvisionDevUser(email));

        return ResponseEntity.ok(userService.getUserById(user.getId()));
    }

    @PutMapping("/role")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDto> updateRole(@RequestBody Map<String, String> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userService.findByEmail(email)
            .orElseGet(() -> autoProvisionDevUser(email));

        String roleStr = payload.get("role");
        if (roleStr == null || roleStr.isBlank()) {
            throw new RuntimeException("Rol no especificado");
        }
        
        UserRole newRole;
        try {
            newRole = UserRole.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rol inválido: " + roleStr);
        }
        
        // No permitir cambio a ADMIN sin permiso especial
        if (newRole == UserRole.ADMIN && user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("No se puede cambiar a rol ADMIN");
        }
        
        UserResponseDto updated = userService.updateUserRole(user.getId(), newRole);
        return ResponseEntity.ok(updated);
    }

    private User autoProvisionDevUser(String email) {
        UserRegistrationDto dto = new UserRegistrationDto();
        dto.setEmail(email);
        dto.setFirstName("Acceso");
        dto.setLastName("Rápido");
        dto.setPassword("dev-password");
        dto.setRole(UserRole.CUSTOMER);
        userService.createUser(dto);
        return userService.findByEmail(email).orElseThrow();
    }
}
