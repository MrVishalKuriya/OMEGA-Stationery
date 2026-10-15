package com.omega.stationery.config;

import com.omega.stationery.middleware.JwtAuthInterceptor;
import com.omega.stationery.middleware.RequestLoggingInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Enterprise Web MVC Configuration.
 * Registers middleware interceptors for request logging, execution timing,
 * and JWT authentication/authorization across all /api/** routes.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final RequestLoggingInterceptor requestLoggingInterceptor;
    private final JwtAuthInterceptor jwtAuthInterceptor;

    public WebMvcConfig(RequestLoggingInterceptor requestLoggingInterceptor, JwtAuthInterceptor jwtAuthInterceptor) {
        this.requestLoggingInterceptor = requestLoggingInterceptor;
        this.jwtAuthInterceptor = jwtAuthInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 1. Performance and request diagnostics middleware
        registry.addInterceptor(requestLoggingInterceptor)
                .addPathPatterns("/api/**");

        // 2. JWT authentication and route guard middleware
        registry.addInterceptor(jwtAuthInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/health",
                        "/api/auth/login",
                        "/api/auth/register",
                        "/api/products",
                        "/api/products/**"
                );
    }
}
