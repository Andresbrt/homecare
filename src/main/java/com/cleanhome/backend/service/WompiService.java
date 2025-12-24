package com.cleanhome.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class WompiService {

    private final WebClient webClient;

    @Value("${wompi.public-key}")
    private String publicKey;

    @Value("${wompi.private-key}")
    private String privateKey;

    @Value("${wompi.api-base}")
    private String apiBase;

    public WompiService(
            @Value("${wompi.api-base}") String apiBase
    ) {
        this.webClient = WebClient.builder()
                .baseUrl(apiBase)
                .build();
    }

    /**
     * Crea un intento de pago usando el Checkout Redirect de Wompi (tarjetas/PSE).
     * Devuelve la URL de redirección (redirect_url) para abrir en WebView.
     */
    public Map<String, Object> createCheckout(BigDecimal amount, String currency, String customerEmail, String reference) {
        Map<String, Object> request = new HashMap<>();
        request.put("amount_in_cents", amount.multiply(BigDecimal.valueOf(100)).longValue());
        request.put("currency", currency); // "COP"
        request.put("customer_email", customerEmail);
        request.put("reference", reference);

        Map<String, String> acceptanceToken = getAcceptanceToken();
        request.put("acceptance_token", acceptanceToken.get("token"));

        return webClient.post()
                .uri("/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + privateKey)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    /**
     * Obtiene el token de aceptación (terms & conditions) requerido por Wompi.
     */
    public Map<String, String> getAcceptanceToken() {
        Map<String, Object> response = webClient.get()
                .uri("/merchants/" + publicKey)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        Map<String, Object> data = (Map<String, Object>) response.get("data");
        Map<String, Object> presignedAcceptance = (Map<String, Object>) data.get("presigned_acceptance");
        String token = (String) presignedAcceptance.get("acceptance_token");

        Map<String, String> result = new HashMap<>();
        result.put("token", token);
        return result;
    }

    /**
     * Consulta el estado de una transacción por ID en Wompi.
     */
    public Map<String, Object> getTransaction(String id) {
        return webClient.get()
                .uri("/transactions/" + id)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
