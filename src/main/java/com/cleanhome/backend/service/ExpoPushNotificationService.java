package com.cleanhome.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Servicio para enviar notificaciones push a través de Expo Push Notification API
 */
@Service
public class ExpoPushNotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(ExpoPushNotificationService.class);
    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
    
    @Value("${expo.push.enabled:true}")
    private boolean pushEnabled;
    
    private final RestTemplate restTemplate;
    
    public ExpoPushNotificationService() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Envía una notificación push a un token de Expo
     */
    public boolean sendPushNotification(String expoPushToken, String title, String body, String data) {
        if (!pushEnabled) {
            logger.info("Push notifications disabled. Skipping notification: {}", title);
            return false;
        }
        
        if (expoPushToken == null || expoPushToken.isEmpty()) {
            logger.warn("No push token provided for notification: {}", title);
            return false;
        }
        
        // Validar formato del token
        if (!isValidExpoPushToken(expoPushToken)) {
            logger.warn("Invalid Expo push token format: {}", expoPushToken);
            return false;
        }
        
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("to", expoPushToken);
            notification.put("sound", "default");
            notification.put("title", title);
            notification.put("body", body);
            notification.put("priority", "high");
            
            if (data != null && !data.isEmpty()) {
                notification.put("data", parseJsonData(data));
            }
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(notification, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                EXPO_PUSH_URL,
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("Push notification sent successfully to {}", expoPushToken);
                return true;
            } else {
                logger.error("Failed to send push notification. Status: {}", response.getStatusCode());
                return false;
            }
            
        } catch (Exception e) {
            logger.error("Error sending push notification: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Envía notificaciones a múltiples tokens
     */
    public Map<String, Boolean> sendBatchPushNotifications(List<String> expoPushTokens, 
                                                           String title, String body, String data) {
        Map<String, Boolean> results = new HashMap<>();
        
        for (String token : expoPushTokens) {
            boolean sent = sendPushNotification(token, title, body, data);
            results.put(token, sent);
        }
        
        return results;
    }
    
    /**
     * Valida si el token tiene formato válido de Expo Push Token
     */
    private boolean isValidExpoPushToken(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }
        // Los tokens de Expo empiezan con ExponentPushToken[...] o ExpoPushToken[...]
        return token.startsWith("ExponentPushToken[") || 
               token.startsWith("ExpoPushToken[") ||
               token.matches("^[a-zA-Z0-9_-]{22,}$"); // Token sin formato especial
    }
    
    /**
     * Parsea string JSON a Map
     */
    private Map<String, Object> parseJsonData(String jsonData) {
        try {
            // Simple JSON parsing (puedes usar Jackson o Gson para más complejidad)
            Map<String, Object> dataMap = new HashMap<>();
            
            if (jsonData.startsWith("{") && jsonData.endsWith("}")) {
                String content = jsonData.substring(1, jsonData.length() - 1);
                String[] pairs = content.split(",");
                
                for (String pair : pairs) {
                    String[] keyValue = pair.split(":");
                    if (keyValue.length == 2) {
                        String key = keyValue[0].trim().replace("\"", "");
                        String value = keyValue[1].trim().replace("\"", "");
                        dataMap.put(key, value);
                    }
                }
            }
            
            return dataMap;
        } catch (Exception e) {
            logger.warn("Could not parse JSON data: {}", jsonData);
            return new HashMap<>();
        }
    }
}
