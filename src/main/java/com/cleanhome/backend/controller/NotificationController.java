package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.NotificationRequestDTO;
import com.cleanhome.backend.dto.NotificationResponseDTO;
import com.cleanhome.backend.service.NotificationService;
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
@RequestMapping("/notifications")
@Tag(name = "Notifications", description = "Gestión de notificaciones push y en la app")
public class NotificationController {
    
    private final NotificationService notificationService;
    
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    /**
     * Obtiene todas las notificaciones del usuario autenticado
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Obtener notificaciones",
        description = "Lista todas las notificaciones del usuario autenticado",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<List<NotificationResponseDTO>> getNotifications(Principal principal) {
        List<NotificationResponseDTO> notifications = notificationService.getUserNotifications(principal.getName());
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Obtiene solo las notificaciones no leídas
     */
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Obtener notificaciones no leídas",
        description = "Lista solo las notificaciones que no han sido leídas",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(Principal principal) {
        List<NotificationResponseDTO> notifications = notificationService.getUnreadNotifications(principal.getName());
        return ResponseEntity.ok(notifications);
    }
    
    /**
     * Cuenta las notificaciones no leídas (para badge)
     */
    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Contar no leídas",
        description = "Retorna el número de notificaciones sin leer (para mostrar badge)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<UnreadCountResponse> countUnreadNotifications(Principal principal) {
        Long count = notificationService.countUnreadNotifications(principal.getName());
        return ResponseEntity.ok(new UnreadCountResponse(count));
    }
    
    /**
     * Marca una notificación como leída
     */
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Marcar como leída",
        description = "Marca una notificación específica como leída",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId, Principal principal) {
        try {
            notificationService.markAsRead(notificationId, principal.getName());
            return ResponseEntity.ok(new SuccessResponse("Notificación marcada como leída"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Marca todas las notificaciones como leídas
     */
    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Marcar todas como leídas",
        description = "Marca todas las notificaciones del usuario como leídas",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
        return ResponseEntity.ok(new SuccessResponse("Todas las notificaciones marcadas como leídas"));
    }
    
    /**
     * Elimina una notificación
     */
    @DeleteMapping("/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Eliminar notificación",
        description = "Elimina una notificación del historial",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId, Principal principal) {
        try {
            notificationService.deleteNotification(notificationId, principal.getName());
            return ResponseEntity.ok(new SuccessResponse("Notificación eliminada"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Crea una notificación (solo para testing o admin)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Crear notificación (Admin)",
        description = "Permite a un admin crear notificaciones para usuarios",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public ResponseEntity<?> createNotification(@Valid @RequestBody NotificationRequestDTO request,
                                               Principal principal) {
        try {
            String targetEmail = request.getTargetUserEmail() != null ? 
                               request.getTargetUserEmail() : principal.getName();
            NotificationResponseDTO notification = notificationService.createNotification(request, targetEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(notification);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Response DTOs
    private record ErrorResponse(String message) {}
    private record SuccessResponse(String message) {}
    private record UnreadCountResponse(Long count) {}
}
