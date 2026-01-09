package com.cleanhome.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuración de WebSocket para comunicación en tiempo real
 */
@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    /**
     * Configurar el broker de mensajes
     * 
     * - "/user" - destinatarios privados por usuario
     * - "/topic" - broadcasts públicos
     * - "/queue" - colas privadas
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        log.info("Configurando MessageBroker para WebSocket");
        
        config.enableSimpleBroker("/user", "/topic", "/queue")
            .setHeartbeatValue(new long[]{25000, 25000});
        
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
        
        log.info("MessageBroker configurado correctamente");
    }
    
    /**
     * Registrar endpoints STOMP
     * 
     * /ws - endpoint principal para WebSocket
     * Permite conexiones desde el frontend
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        log.info("Registrando STOMP endpoints");
        
        registry.addEndpoint("/ws")
            .setAllowedOrigins(
                "http://localhost:3000",           // React Web
                "http://localhost:8083",           // Expo Mobile
                "http://localhost:19000",          // Expo DevApp
                "http://localhost:19001",          // Expo DevApp (alt)
                "http://192.168.1.100:8083",       // Red local
                "exp://127.0.0.1:19000"            // Expo local
            )
            .withSockJS();
        
        registry.addEndpoint("/ws")
            .setAllowedOrigins(
                "http://localhost:3000",
                "http://localhost:8083",
                "http://localhost:19000",
                "http://localhost:19001",
                "http://192.168.1.100:8083",
                "exp://127.0.0.1:19000"
            );
        
        log.info("STOMP endpoints registrados en /ws");
    }
}
