package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.ProcessPaymentRequestDTO;
import com.cleanhome.backend.dto.TransactionResponseDTO;
import com.cleanhome.backend.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transacciones", description = "API de gestión de transacciones y pagos")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/process")
    @Operation(summary = "Procesar pago", description = "Procesa un pago y crea una transacción")
    public ResponseEntity<TransactionResponseDTO> processPayment(
            @Valid @RequestBody ProcessPaymentRequestDTO request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        TransactionResponseDTO response = transactionService.processPayment(request, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{transactionId}/refund")
    @Operation(summary = "Reembolsar transacción", description = "Reembolsa una transacción completada")
    public ResponseEntity<TransactionResponseDTO> refundTransaction(
            @PathVariable Long transactionId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        TransactionResponseDTO response = transactionService.refundTransaction(transactionId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-transactions")
    @Operation(summary = "Mis transacciones", description = "Obtiene todas las transacciones del usuario")
    public ResponseEntity<List<TransactionResponseDTO>> getMyTransactions(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        List<TransactionResponseDTO> transactions = transactionService.getUserTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{transactionId}")
    @Operation(summary = "Detalle de transacción", description = "Obtiene el detalle de una transacción")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(
            @PathVariable Long transactionId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        TransactionResponseDTO transaction = transactionService.getTransactionById(transactionId, userId);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/admin/by-date-range")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Transacciones por rango de fechas", description = "Obtiene transacciones filtradas por fechas (solo admin)")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<TransactionResponseDTO> transactions = transactionService.getTransactionsByDateRange(startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        return Long.parseLong(authentication.getName());
    }
}
