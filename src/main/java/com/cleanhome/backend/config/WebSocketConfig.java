package com.cleanhome.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import java.util.logging.Logger;

/**
 * Configuración de WebSocket para comunicación en tiempo real
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger log = Logger.getLogger(WebSocketConfig.class.getName());
    
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
        
        String[] allowedOrigins = new String[]{
            "http://localhost:3000",           // React Web
            "http://localhost:8083",           // Expo Mobile
            "http://localhost:19000",          // Expo DevApp
            "http://localhost:19001",          // Expo DevApp (alt)
            "http://192.168.1.100:8083",       // Red local
            "exp://127.0.0.1:19000"            // Expo local
        };
        
        registry.addEndpoint("/ws")
            .setAllowedOrigins(allowedOrigins)
            .withSockJS();
        
        registry.addEndpoint("/ws")
            .setAllowedOrigins(allowedOrigins);
        
        log.info("STOMP endpoints registrados en /ws");
    }
}
