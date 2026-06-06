package com.aurum.crm.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank(message = "Full name is required") String fullName,
        @NotBlank(message = "Phone number is required") String phone,
        @NotBlank(message = "Delivery address is required") String deliveryAddress
) {}
