package com.aurum.crm.dto.response;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String productCode,
        String name,
        String description,
        String imageUrl,
        Long categoryId,
        String categoryName,
        Long brandId,
        String brandName,
        String size,
        String color,
        BigDecimal purchasePrice,
        BigDecimal sellingPrice,
        Integer quantity,
        String barcode,
        String status,
        boolean featured,
        boolean newArrival,
        boolean bestSeller
) {}
