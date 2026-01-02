package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.*;
import com.cleanhome.backend.entity.User;
import com.cleanhome.backend.security.JwtUtils;
import com.cleanhome.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication", description = "Endpoints para autenticación y registro de usuarios")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve un token JWT")
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            User user = userService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            UserResponseDto userResponse = userService.getUserById(user.getId());
            
            return ResponseEntity.ok(new JwtResponseDto(jwt, userResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Credenciales inválidas"));
        }
    }
    
    @Operation(summary = "Registrar usuario", description = "Registra un nuevo usuario en el sistema")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationDto signUpRequest) {
        try {
            if (userService.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: El email ya está en uso"));
            }
            
            userService.createUser(signUpRequest);
            
            return ResponseEntity.ok(new MessageResponse("Usuario registrado exitosamente. Por favor verifica tu email."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Verificar email", description = "Verifica el email del usuario usando el token enviado")
    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
        try {
            userService.verifyUser(token);
            return ResponseEntity.ok(new MessageResponse("Email verificado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Token de verificación inválido"));
        }
    }
    
    @Operation(summary = "Solicitar restablecimiento de contraseña", description = "Envía un email con token para restablecer contraseña")
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordRequest) {
        try {
            userService.generatePasswordResetToken(forgotPasswordRequest.getEmail());
            return ResponseEntity.ok(new MessageResponse("Se ha enviado un email con las instrucciones para restablecer tu contraseña"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Restablecer contraseña", description = "Restablece la contraseña usando el token de restablecimiento")
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDto resetPasswordRequest) {
        try {
            userService.resetPassword(resetPasswordRequest.getToken(), resetPasswordRequest.getNewPassword());
            return ResponseEntity.ok(new MessageResponse("Contraseña restablecida exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Cambiar rol de usuario", description = "Actualiza el rol de un usuario autenticado")
    @PutMapping("/update-role/{userId}")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateRoleDto updateRoleDto) {
        try {
            UserResponseDto updatedUser = userService.updateUserRole(userId, updateRoleDto.getRole());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Registrar token push", description = "Registra el Expo push token del usuario para notificaciones")
    @PostMapping("/register-push-token")
    public ResponseEntity<?> registerPushToken(
            @RequestBody PushTokenDto pushTokenDto,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                        .body(new MessageResponse("Usuario no autenticado"));
            }
            
            String userEmail = authentication.getName();
            userService.updateExpoPushToken(userEmail, pushTokenDto.getToken());
            return ResponseEntity.ok(new MessageResponse("Token push registrado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    // Response DTOs
    public static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
    
    public static class PushTokenDto {
        private String token;
        
        public String getToken() {
            return token;
        }
        
        public void setToken(String token) {
            this.token = token;
        }
    }
}