package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.PaymentCreateDto;
import com.cleanhome.backend.dto.PaymentResponseDto;
import com.cleanhome.backend.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Payments", description = "Endpoints para gestión de pagos")
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @Operation(summary = "Procesar un nuevo pago")
    @PostMapping
    public ResponseEntity<?> processPayment(@Valid @RequestBody PaymentCreateDto paymentDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();
            
            PaymentResponseDto payment = paymentService.processPayment(paymentDto, currentUserEmail);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error al procesar el pago: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Obtener pagos del usuario autenticado")
    @GetMapping("/my-payments")
    public ResponseEntity<List<PaymentResponseDto>> getMyPayments() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        List<PaymentResponseDto> payments = paymentService.getPaymentsByUser(currentUserEmail);
        return ResponseEntity.ok(payments);
    }
    
    @Operation(summary = "Obtener pago por ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            PaymentResponseDto payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Obtener pagos por reserva")
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PaymentResponseDto>> getPaymentsByBooking(@PathVariable Long bookingId) {
        List<PaymentResponseDto> payments = paymentService.getPaymentsByBooking(bookingId);
        return ResponseEntity.ok(payments);
    }
    
    @Operation(summary = "Reembolsar un pago")
    @PostMapping("/{id}/refund")
    public ResponseEntity<?> refundPayment(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Reembolso solicitado por el cliente") String reason) {
        try {
            PaymentResponseDto payment = paymentService.refundPayment(id, reason);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Error al procesar reembolso: " + e.getMessage()));
        }
    }
    
    // Response DTOs
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
