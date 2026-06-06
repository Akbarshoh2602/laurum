package com.aurum.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record ProductRequest(
        String productCode,
        @NotBlank(message = "Name is required") String name,
        String description,
        String imageUrl,
        Long categoryId,
        Long brandId,
        String size,
        String color,
        @PositiveOrZero BigDecimal purchasePrice,
        @NotNull(message = "Selling price is required") @PositiveOrZero BigDecimal sellingPrice,
        @NotNull(message = "Quantity is required") @PositiveOrZero Integer quantity,
        String barcode,
        String status,
        Boolean featured,
        Boolean newArrival,
        Boolean bestSeller
) {}
