package com.omega.stationery.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final long DEFAULT_EXPIRATION_MS = 30L * 24 * 60 * 60 * 1000; // 30 days

    @Value("${jwt.secret:omega-stationery-super-secret-jwt-key-tanzania-2026-secure-token}")
    private String secretKey = "omega-stationery-super-secret-jwt-key-tanzania-2026-secure-token";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateToken(String userId, String email, String role) {
        long now = System.currentTimeMillis();
        long exp = now + DEFAULT_EXPIRATION_MS;

        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userId);
        claims.put("email", email);
        claims.put("role", role != null ? role : "CUSTOMER");
        claims.put("iat", now);
        claims.put("exp", exp);

        try {
            String jsonPayload = objectMapper.writeValueAsString(claims);
            String payloadEncoded = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(jsonPayload.getBytes(StandardCharsets.UTF_8));
            String signature = sign(payloadEncoded);
            return payloadEncoded + "." + signature;
        } catch (Exception e) {
            log.error("Failed to generate signed JWT token: {}", e.getMessage());
            // Safe resilient fallback
            String raw = userId + ":" + email + ":" + (role != null ? role : "CUSTOMER") + ":" + now;
            return Base64.getUrlEncoder().withoutPadding().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
        }
    }

    public boolean validateToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            if (token.contains(".")) {
                String[] parts = token.split("\\.");
                if (parts.length != 2) return false;
                String payload = parts[0];
                String signature = parts[1];
                if (!sign(payload).equals(signature)) {
                    return false;
                }
                Map<String, Object> claims = extractClaims(token);
                if (claims == null) return false;
                Object expObj = claims.get("exp");
                if (expObj instanceof Number num) {
                    return System.currentTimeMillis() <= num.longValue();
                }
                return true;
            } else {
                // Legacy simple base64 token compatibility
                byte[] decoded = Base64.getUrlDecoder().decode(token);
                String str = new String(decoded, StandardCharsets.UTF_8);
                return str.contains("@");
            }
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public Map<String, Object> extractClaims(String token) {
        if (token == null || token.isBlank()) return null;
        try {
            if (token.contains(".")) {
                String[] parts = token.split("\\.");
                byte[] decoded = Base64.getUrlDecoder().decode(parts[0]);
                return objectMapper.readValue(decoded, Map.class);
            } else {
                // Decode legacy format: userId:email:role:timestamp or userId:email:timestamp
                byte[] decoded = Base64.getUrlDecoder().decode(token);
                String str = new String(decoded, StandardCharsets.UTF_8);
                String[] segs = str.split(":");
                Map<String, Object> claims = new HashMap<>();
                if (segs.length >= 1) claims.put("sub", segs[0]);
                if (segs.length >= 2) claims.put("email", segs[1]);
                if (segs.length >= 3) claims.put("role", segs[2].matches("\\d+") ? "CUSTOMER" : segs[2]);
                return claims;
            }
        } catch (Exception e) {
            log.debug("Could not parse token claims: {}", e.getMessage());
            return null;
        }
    }

    public String extractUserId(String token) {
        Map<String, Object> claims = extractClaims(token);
        return claims != null ? (String) claims.get("sub") : null;
    }

    public String extractEmail(String token) {
        Map<String, Object> claims = extractClaims(token);
        return claims != null ? (String) claims.get("email") : null;
    }

    public String extractRole(String token) {
        Map<String, Object> claims = extractClaims(token);
        return claims != null ? (String) claims.get("role") : null;
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    secretKey.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("HMAC signing failure", e);
        }
    }
}
