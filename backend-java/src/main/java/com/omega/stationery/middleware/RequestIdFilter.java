package com.omega.stationery.middleware;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Enterprise Request ID Middleware Filter.
 * Attaches a unique correlation ID to every incoming HTTP request and response
 * to facilitate end-to-end tracing across distributed microservices and client consoles.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter implements Filter {

    public static final String REQUEST_ID_HEADER = "X-Request-Id";
    public static final String MDC_KEY = "requestId";

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String requestId = request.getHeader(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isBlank()) {
            requestId = "req-" + UUID.randomUUID().toString().substring(0, 13);
        }

        // Attach to MDC for SLF4J logs
        MDC.put(MDC_KEY, requestId);
        request.setAttribute(MDC_KEY, requestId);

        // Expose in response headers for client console visibility
        response.setHeader(REQUEST_ID_HEADER, requestId);

        try {
            chain.doFilter(servletRequest, servletResponse);
        } finally {
            MDC.remove(MDC_KEY);
        }
    }
}
