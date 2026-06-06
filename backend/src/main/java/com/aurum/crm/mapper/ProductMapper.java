package com.aurum.crm.mapper;

import com.aurum.crm.dto.response.ProductResponse;
import com.aurum.crm.entity.Product;

public final class ProductMapper {
    private ProductMapper() {}

    public static ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getProductCode(),
                p.getName(),
                p.getDescription(),
                p.getImageUrl(),
                p.getCategory() != null ? p.getCategory().getId() : null,
                p.getCategory() != null ? p.getCategory().getName() : null,
                p.getBrand() != null ? p.getBrand().getId() : null,
                p.getBrand() != null ? p.getBrand().getName() : null,
                p.getSize(),
                p.getColor(),
                p.getPurchasePrice(),
                p.getSellingPrice(),
                p.getQuantity(),
                p.getBarcode(),
                p.getStatus(),
                p.isFeatured(),
                p.isNewArrival(),
                p.isBestSeller()
        );
    }
}
