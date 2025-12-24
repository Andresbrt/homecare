package com.cleanhome.backend.controller;

import com.cleanhome.backend.dto.PaymentStartRequest;
import com.cleanhome.backend.dto.PaymentStartResponse;
import com.cleanhome.backend.entity.Payment;
import com.cleanhome.backend.service.PaymentService;
import com.cleanhome.backend.service.WompiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments/wompi")
public class WompiController {

    private final WompiService wompiService;
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    @Value("${wompi.events-secret}")
    private String eventsSecret;

    public WompiController(WompiService wompiService, PaymentService paymentService, ObjectMapper objectMapper) {
        this.wompiService = wompiService;
        this.paymentService = paymentService;
        this.objectMapper = objectMapper;
    }

    /**
     * Crea un checkout de Wompi y devuelve datos para redirigir al usuario (WebView).
     */
    @PostMapping("/checkout")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCheckout(@RequestBody Map<String, Object> payload) {
        BigDecimal amount = new BigDecimal(String.valueOf(payload.getOrDefault("amount", "0")));
        String currency = String.valueOf(payload.getOrDefault("currency", "COP"));
        String email = String.valueOf(payload.getOrDefault("email", "test@example.com"));
        String reference = String.valueOf(payload.getOrDefault("reference", "cleanhome-" + System.currentTimeMillis()));

        Map<String, Object> transaction = wompiService.createCheckout(amount, currency, email, reference);
        return ResponseEntity.ok(transaction);
    }

    /**
     * Inicia el flujo con Wompi creando un Payment PENDING y devolviendo la URL de redirección.
     */
    @PostMapping("/start")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> startPayment(@RequestBody PaymentStartRequest request, Principal principal) {
        String userEmail = principal != null ? principal.getName() : request.getEmail();
        String reference = request.getReference() != null ? request.getReference() : ("cleanhome-" + System.currentTimeMillis());
        // Crear payment PENDING con monto calculado en servidor
        Payment payment = paymentService.createPendingPayment(
                request.getBookingId(),
                userEmail,
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD",
                request.getCurrency(),
                reference
        );

        // Usar SIEMPRE el monto del Payment (definido server-side)
        Map<String, Object> tx = wompiService.createCheckout(payment.getAmount(), payment.getCurrency(), userEmail, reference);
        Map<String, Object> data = (Map<String, Object>) tx.get("data");
        String externalId = data != null ? String.valueOf(data.get("id")) : null;
        String redirectUrl = null;
        if (data != null) {
            Object url = data.get("url");
            if (url == null) url = data.get("payment_link");
            if (url == null) url = data.get("redirect_url");
            redirectUrl = url != null ? String.valueOf(url) : null;
        }

        paymentService.attachExternalInfo(payment.getId(), externalId, redirectUrl);
        PaymentStartResponse res = new PaymentStartResponse(payment.getId(), externalId, redirectUrl, reference);
        return ResponseEntity.ok(res);
    }

    /**
     * Webhook para eventos de Wompi: valida la firma y devuelve acuse de recibo.
     */
    @PostMapping("/webhook")
    public ResponseEntity<?> receiveWebhook(@RequestHeader(name = "X-Event-Signature", required = false) String signature,
                                            @RequestBody String rawBody) {
        if (signature == null || signature.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing signature");
        }
        try {
            // Firma esperada: sha256=HEX(HMAC_SHA256(rawBody, eventsSecret))
            String expected = "sha256=" + hmacSha256Hex(rawBody, eventsSecret);
            if (!expected.equals(signature)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid signature");
            }

            Map<String, Object> event = objectMapper.readValue(rawBody, Map.class);
            Map<String, Object> data = (Map<String, Object>) event.get("data");
            Map<String, Object> tx = data != null ? (Map<String, Object>) data.get("transaction") : null;
            String txId = tx != null ? String.valueOf(tx.get("id")) : null;
            String status = tx != null ? String.valueOf(tx.get("status")) : null;
            if (txId != null && status != null) {
                paymentService.updateStatusByExternalId(txId, status);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("received", true);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook error");
        }
    }

    /**
     * Consulta el estado de una transacción
     */
    @GetMapping("/transactions/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTransaction(@PathVariable String id) {
        Map<String, Object> tx = wompiService.getTransaction(id);
        return ResponseEntity.ok(tx);
    }

    private static String hmacSha256Hex(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(keySpec);
        byte[] hmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : hmac) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    // Se removió extractJsonField: usamos ObjectMapper
}
