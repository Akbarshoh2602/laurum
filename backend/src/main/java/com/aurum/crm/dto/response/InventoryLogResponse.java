package com.aurum.crm.dto.response;

import java.time.LocalDateTime;

public record InventoryLogResponse(
        Long id,
        Long productId,
        String productName,
        Integer previousQuantity,
        Integer addedQuantity,
        Integer removedQuantity,
        Integer currentQuantity,
        String performedBy,
        String note,
        LocalDateTime createdAt
) {}
