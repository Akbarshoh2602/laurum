package com.aurum.crm.controller;

import com.aurum.crm.dto.request.LoginRequest;
import com.aurum.crm.dto.request.RegisterRequest;
import com.aurum.crm.dto.response.ApiResponse;
import com.aurum.crm.dto.response.AuthResponse;
import com.aurum.crm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.ok("Registration successful", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok("Login successful", authService.login(request));
    }
}
