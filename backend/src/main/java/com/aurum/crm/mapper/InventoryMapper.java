package com.aurum.crm.mapper;

import com.aurum.crm.dto.response.InventoryLogResponse;
import com.aurum.crm.entity.InventoryLog;

public final class InventoryMapper {
    private InventoryMapper() {}

    public static InventoryLogResponse toResponse(InventoryLog log) {
        return new InventoryLogResponse(
                log.getId(),
                log.getProduct() != null ? log.getProduct().getId() : null,
                log.getProduct() != null ? log.getProduct().getName() : null,
                log.getPreviousQuantity(),
                log.getAddedQuantity(),
                log.getRemovedQuantity(),
                log.getCurrentQuantity(),
                log.getPerformedBy(),
                log.getNote(),
                log.getCreatedAt()
        );
    }
}
