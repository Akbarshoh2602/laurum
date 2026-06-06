package com.aurum.crm.dto.request;

public record UpdateProfileRequest(
        String firstName,
        String lastName,
        String phone,
        String address,
        String newPassword
) {}
