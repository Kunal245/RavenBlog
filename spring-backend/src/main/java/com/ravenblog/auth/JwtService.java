package com.ravenblog.auth;

import com.ravenblog.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
public class JwtService {

    private final SecretKey signingKey;

    public JwtService(JwtProperties jwtProperties) {
        byte[] secret = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        if (secret.length < 32) {
            throw new IllegalStateException("JWT_SECRET (or SECRET) must be at least 32 bytes for HS256");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret);
    }

    /** Emits the same minimal HS256 payload shape as the current Hono backend: { id: userId }. */
    public String createToken(String userId) {
        return Jwts.builder()
                .claim("id", userId)
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public Optional<String> extractUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Optional.ofNullable(claims.get("id", String.class));
        } catch (RuntimeException exception) {
            return Optional.empty();
        }
    }
}
