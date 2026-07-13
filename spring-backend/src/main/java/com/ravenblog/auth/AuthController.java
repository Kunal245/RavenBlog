package com.ravenblog.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(value = "/signup", produces = MediaType.TEXT_PLAIN_VALUE)
    public String signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping(value = "/signin", produces = MediaType.TEXT_PLAIN_VALUE)
    public String signin(@Valid @RequestBody SigninRequest request) {
        return authService.signin(request);
    }
}
