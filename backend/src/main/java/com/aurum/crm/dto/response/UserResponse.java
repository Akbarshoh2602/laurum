package com.aurum.crm.dto.response;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        String role,
        boolean active,
        LocalDateTime createdAt
) {}
