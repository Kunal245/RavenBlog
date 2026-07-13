package com.ravenblog.auth;

import com.ravenblog.user.User;
import com.ravenblog.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public String signup(SignupRequest request) {
        if (userRepository.findByEmail(request.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User();
        user.setEmail(request.username());
        user.setName(request.name());
        user.setPassword(passwordEncoder.encode(request.password()));

        try {
            return jwtService.createToken(userRepository.saveAndFlush(user).getId());
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
    }

    @Transactional
    public String signin(SigninRequest request) {
        User user = userRepository.findByEmail(request.username())
                .orElseThrow(() -> invalidCredentials());

        if (!passwordMatchesAndMigrateIfNecessary(request.password(), user)) {
            throw invalidCredentials();
        }

        return jwtService.createToken(user.getId());
    }

    private boolean passwordMatchesAndMigrateIfNecessary(String rawPassword, User user) {
        String storedPassword = user.getPassword();
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        // Existing Node.js users have plaintext passwords. Upgrade only after a successful login.
        boolean matches = MessageDigest.isEqual(
                rawPassword.getBytes(StandardCharsets.UTF_8),
                storedPassword.getBytes(StandardCharsets.UTF_8)
        );
        if (matches) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }
        return matches;
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(HttpStatus.FORBIDDEN, "Wrong creds");
    }
}
