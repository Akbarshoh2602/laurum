package com.aurum.crm.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long id,
        List<CartItemResponse> items,
        BigDecimal grandTotal,
        int totalItems
) {
    public record CartItemResponse(
            Long id,
            Long productId,
            String productName,
            String imageUrl,
            BigDecimal unitPrice,
            Integer quantity,
            Integer availableStock,
            BigDecimal lineTotal
    ) {}
}
