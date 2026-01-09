package com.cleanhome.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Principal;

/**
 * Proveedor de utilidades JWT
 */
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret:homecare-secret-key-2024}")
    private String jwtSecret;

    /**
     * Obtener ID del usuario desde el Principal
     */
    public Long getUserIdFromPrincipal(Principal principal) {
        try {
            if (principal == null) {
                throw new RuntimeException("Principal no válido");
            }

            String token = principal.getName();
            if (token == null || token.isEmpty()) {
                throw new RuntimeException("Token no encontrado");
            }

            // Decodificar JWT
            Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

            // Buscar userId en claims
            Object userId = claims.get("userId");
            if (userId != null) {
                return Long.parseLong(userId.toString());
            }

            // Fallback a subject (si es un número)
            String subject = claims.getSubject();
            try {
                return Long.parseLong(subject);
            } catch (NumberFormatException e) {
                log.warn("Subject no es numérico: {}", subject);
                return null;
            }
        } catch (SignatureException e) {
            log.error("Firma JWT inválida", e);
            throw new RuntimeException("Token JWT inválido");
        } catch (Exception e) {
            log.error("Error extrayendo userId del principal", e);
            throw new RuntimeException("Error procesando token: " + e.getMessage());
        }
    }

    /**
     * Obtener email del usuario desde el Principal
     */
    public String getUserEmailFromPrincipal(Principal principal) {
        try {
            if (principal == null) {
                throw new RuntimeException("Principal no válido");
            }

            String token = principal.getName();
            Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

            Object email = claims.get("email");
            if (email != null) {
                return email.toString();
            }

            return claims.getSubject();
        } catch (Exception e) {
            log.error("Error extrayendo email del principal", e);
            throw new RuntimeException("Error procesando token");
        }
    }

    /**
     * Obtener claim personalizado
     */
    public Object getClaim(Principal principal, String claimName) {
        try {
            if (principal == null) {
                throw new RuntimeException("Principal no válido");
            }

            String token = principal.getName();
            Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

            return claims.get(claimName);
        } catch (Exception e) {
            log.error("Error extrayendo claim {}", claimName, e);
            return null;
        }
    }
}
