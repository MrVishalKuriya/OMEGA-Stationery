package com.omega.stationery.middleware;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omega.stationery.model.ApiResponse;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Enterprise Rate Limiting Middleware Filter.
 * Protects authentication and critical endpoints against brute-force attacks and abuse.
 */
@Component
@Order(2)
public class RateLimitFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);
    private static final int MAX_REQUESTS_PER_MINUTE = 120;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, ClientWindow> clientBuckets = new ConcurrentHashMap<>();

    private static class ClientWindow {
        long windowStartMs;
        AtomicInteger counter;

        ClientWindow(long start) {
            this.windowStartMs = start;
            this.counter = new AtomicInteger(1);
        }
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String uri = request.getRequestURI();

        // Only rate limit authentication endpoints to avoid blocking catalog browsing
        if (uri.startsWith("/api/auth/")) {
            String clientIp = getClientIp(request);
            long now = System.currentTimeMillis();

            ClientWindow window = clientBuckets.compute(clientIp, (key, existing) -> {
                if (existing == null || (now - existing.windowStartMs) > 60_000) {
                    return new ClientWindow(now);
                }
                existing.counter.incrementAndGet();
                return existing;
            });

            if (window.counter.get() > MAX_REQUESTS_PER_MINUTE) {
                log.warn("🚨 Rate limit exceeded for IP {} on URI {}", clientIp, uri);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setHeader("Retry-After", "60");

                ApiResponse<String> err = ApiResponse.error("Rate limit exceeded. Please wait 60 seconds before retrying.");
                response.getWriter().write(objectMapper.writeValueAsString(err));
                return;
            }
        }

        chain.doFilter(servletRequest, servletResponse);

        // Periodically prune stale bucket entries
        if (clientBuckets.size() > 500) {
            long now = System.currentTimeMillis();
            clientBuckets.entrySet().removeIf(entry -> (now - entry.getValue().windowStartMs) > 120_000);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
