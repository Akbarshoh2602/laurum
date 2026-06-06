package com.aurum.crm.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull(message = "Product id is required") Long productId,
        @NotNull @Min(value = 1, message = "Quantity must be at least 1") Integer quantity
) {}
