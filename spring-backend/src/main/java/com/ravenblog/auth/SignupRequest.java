package com.ravenblog.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Field names deliberately match the existing React client and Hono API. */
public record SignupRequest(
        @NotBlank @Email String username,
        @NotBlank @Size(min = 6) String password,
        String name
) {
}
