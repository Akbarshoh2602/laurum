package com.aurum.crm.dto.request;

import jakarta.validation.constraints.NotNull;

public record StockAdjustRequest(
        @NotNull(message = "Product id is required") Long productId,
        /** Positive to add stock, negative to remove. */
        @NotNull(message = "Change amount is required") Integer change,
        String note
) {}
