package com.aurum.crm.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * "login" accepts either a customer email OR the special admin login code (ADMIN123).
 */
public record LoginRequest(
        @NotBlank(message = "Login is required") String login,
        @NotBlank(message = "Password is required") String password
) {}
