package com.omega.stationery.middleware;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Performance & Request Logging Middleware Interceptor.
 * Monitors endpoint response times, logs API traffic, and adds diagnostic timing headers.
 */
@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingInterceptor.class);
    private static final String START_TIME_ATTR = "requestStartTime";
    public static final String RESPONSE_TIME_HEADER = "X-Response-Time-Millis";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_TIME_ATTR, System.currentTimeMillis());
        String clientIp = getClientIp(request);
        String queryString = request.getQueryString() != null ? "?" + request.getQueryString() : "";
        log.info("➡️ [API-IN] {} {}{} [IP: {}]", request.getMethod(), request.getRequestURI(), queryString, clientIp);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        Long startTime = (Long) request.getAttribute(START_TIME_ATTR);
        long duration = startTime != null ? (System.currentTimeMillis() - startTime) : 0L;

        response.setHeader(RESPONSE_TIME_HEADER, String.valueOf(duration));

        String requestId = (String) request.getAttribute(RequestIdFilter.MDC_KEY);
        String ridStr = requestId != null ? (" [rid: " + requestId + "]") : "";

        if (ex != null) {
            log.error("⬅️ [API-OUT] {} {} -> {} ({} ms){} - Exception: {}",
                    request.getMethod(), request.getRequestURI(), response.getStatus(), duration, ridStr, ex.getMessage());
        } else {
            log.info("⬅️ [API-OUT] {} {} -> {} ({} ms){}",
                    request.getMethod(), request.getRequestURI(), response.getStatus(), duration, ridStr);
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
