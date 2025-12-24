package com.cleanhome.backend.health;

import com.cleanhome.backend.service.ConfigService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class AiConfigHealthIndicator implements HealthIndicator {

    private final ConfigService configService;
    private final boolean rateLimitEnabled;
    private final int maxRequests;
    private final long windowSeconds;

    public AiConfigHealthIndicator(
            ConfigService configService,
            @Value("${ai.rate-limit.enabled:false}") boolean rateLimitEnabled,
            @Value("${ai.rate-limit.max-requests:20}") int maxRequests,
            @Value("${ai.rate-limit.window-seconds:60}") long windowSeconds
    ) {
        this.configService = configService;
        this.rateLimitEnabled = rateLimitEnabled;
        this.maxRequests = maxRequests;
        this.windowSeconds = windowSeconds;
    }

    @Override
    public Health health() {
        return Health.up()
                .withDetail("ai.enabled", configService.isAiEnabled())
                .withDetail("ai.model", configService.getAiModel())
                .withDetail("ai.rateLimit.enabled", rateLimitEnabled)
                .withDetail("ai.rateLimit.maxRequests", maxRequests)
                .withDetail("ai.rateLimit.windowSeconds", windowSeconds)
                .build();
    }
}
