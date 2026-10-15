# ===================================================================
# Stage 1: Build the Spring Boot application using Maven & Java 21
# ===================================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source files and build production jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ===================================================================
# Stage 2: Ultra-lightweight Production Runtime
# ===================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create unprivileged system user for cloud security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled executable fat jar from builder stage
COPY --from=builder /build/target/omega-stationery-backend-1.0.0.jar app.jar

# Set ownership to unprivileged user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose default HTTP port (Render overrides with $PORT dynamically)
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

# Health check to ensure zero-downtime restarts
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-8080}/api/health || exit 1

# Launch Spring Boot with optimized JVM memory settings for Render Free/Starter tiers
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
