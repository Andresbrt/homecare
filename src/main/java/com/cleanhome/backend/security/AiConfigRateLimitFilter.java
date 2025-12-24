package com.cleanhome.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ConditionalOnProperty(value = "ai.rate-limit.enabled", havingValue = "true")
public class AiConfigRateLimitFilter extends OncePerRequestFilter {

    private final int maxRequests;
    private final long windowSeconds;

    private static final class WindowCounter {
        final long windowStart;
        final int count;

        WindowCounter(long windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }

    private final Map<String, WindowCounter> counters = new ConcurrentHashMap<>();

    public AiConfigRateLimitFilter(
            @Value("${ai.rate-limit.max-requests:20}") int maxRequests,
            @Value("${ai.rate-limit.window-seconds:60}") long windowSeconds
    ) {
        this.maxRequests = maxRequests;
        this.windowSeconds = windowSeconds;
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        return !(HttpMethod.PUT.matches(request.getMethod()) && request.getRequestURI().equals("/api/config/ai"));
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String key = resolveClientKey(request);
        long currentWindow = Instant.now().getEpochSecond() / windowSeconds;

        WindowCounter updated = counters.compute(key, (k, counter) -> {
            if (counter == null || counter.windowStart != currentWindow) {
                return new WindowCounter(currentWindow, 1);
            }
            return new WindowCounter(counter.windowStart, counter.count + 1);
        });

        if (updated.count > maxRequests) {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"error\":\"rate_limit_exceeded\",\"message\":\"Rate limit exceeded\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String resolveClientKey(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
        if (header != null && !header.isBlank()) {
            return header.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
