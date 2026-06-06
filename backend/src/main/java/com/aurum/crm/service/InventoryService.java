package com.aurum.crm.service;

import com.aurum.crm.dto.request.StockAdjustRequest;
import com.aurum.crm.dto.response.InventoryLogResponse;
import com.aurum.crm.dto.response.PageResponse;
import com.aurum.crm.dto.response.ProductResponse;
import com.aurum.crm.entity.Product;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InventoryService {
    PageResponse<InventoryLogResponse> listLogs(Pageable pageable);
    InventoryLogResponse adjustStock(StockAdjustRequest request);
    List<ProductResponse> lowStock();

    /** Internal helper: record a stock movement and persist the new product quantity. */
    void recordMovement(Product product, int delta, String performedBy, String note);
}
